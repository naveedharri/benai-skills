# Detect Hardware

Commands to read the machine's real specs and inventory what is already installed. Run these; do not ask the user for anything you can detect.

## Contents
1. macOS
2. Linux
3. Windows
4. Which number matters
5. Inventory what is installed
6. Check a model's capabilities

## 1. macOS

```bash
# chip, total unified memory, model name
system_profiler SPHardwareDataType | grep -E "Model Name|Chip|Total Number of Cores|Memory"

# exact memory in bytes, when the above is ambiguous
echo $(( $(sysctl -n hw.memsize) / 1024 / 1024 / 1024 )) GB

# GPU and VRAM (discrete cards only; Apple Silicon reports no separate VRAM)
system_profiler SPDisplaysDataType | grep -E "Chipset Model|VRAM|Total Number of Cores"

# free disk on the home volume
df -h ~ | tail -1 | awk '{print "free:", $4}'
```

On Apple Silicon there is no separate VRAM. The unified memory figure is the number that matters, and the GPU shares it with the OS and every open app.

## 2. Linux

```bash
# NVIDIA
nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader

# AMD
rocm-smi --showmeminfo vram 2>/dev/null || lspci | grep -i vga

# system RAM
free -g | awk '/^Mem:/{print "RAM total:", $2"GB  available:", $7"GB"}'

# free disk
df -h ~ | tail -1 | awk '{print "free:", $4}'
```

## 3. Windows

Prefer PowerShell. If the session is inside WSL, `nvidia-smi` usually still works.

```powershell
# GPU name and VRAM in bytes
Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM

# total RAM
(Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB
```

`AdapterRAM` misreports on cards above 4 GB. When an NVIDIA GPU is present, trust `nvidia-smi --query-gpu=memory.total --format=csv,noheader` instead.

## 4. Which number matters

Pick one number and say which you picked:

| Machine | Number that matters |
|---------|--------------------|
| Discrete NVIDIA or AMD GPU | The card's VRAM, not system RAM |
| Apple Silicon | Total unified memory |
| Integrated graphics only | System RAM, and warn that speed will be poor |

Then multiply by 0.75 for the usable budget. Report both figures. The gap is conversation context plus the app, and it is the single thing users get wrong.

## 5. Inventory what is installed

```bash
# which tools exist
for c in ollama lms open-webui docker; do
  printf "%-12s %s\n" "$c" "$(command -v $c || echo 'not installed')"
done

# models already pulled into Ollama (also proves the server is up)
curl -s --max-time 8 http://localhost:11434/api/tags \
  | python3 -c "import sys,json;d=json.load(sys.stdin);[print(f\"  {m['name']:22s} {m['size']/1024/1024:.0f} MB\") for m in d.get('models',[])] or print('  none pulled')" \
  2>/dev/null || echo "  Ollama not running"

# LM Studio's OpenAI-compatible server (off by default)
curl -s -o /dev/null -w "LM Studio :1234 -> HTTP %{http_code}\n" --max-time 5 http://localhost:1234/v1/models

# everything listening, to spot harnesses already running
lsof -nP -iTCP -sTCP:LISTEN 2>/dev/null | awk 'NR>1{split($9,a,":");print "  :"a[length(a)]"  "$1}' | sort -u
```

Report findings plainly. An HTTP `000` on port 1234 means LM Studio's server is off, not that LM Studio is missing.

## 6. Check a model's capabilities

Fitting in memory is not the same as being able to do the job. Before recommending a model for agent or tool use, check it:

```bash
ollama show <model> | sed -n '/Capabilities/,/^$/p'
```

`completion` alone means chat only. Tool calling needs `tools` in that list. Models under roughly 1B parameters usually lack it, and the resulting error reads like a broken connection rather than a missing feature.
