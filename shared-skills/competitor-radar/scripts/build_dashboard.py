#!/usr/bin/env python3
"""Assemble the Competitor Radar dashboard: template.html + radar_data.js -> index.html.
Usage: python3 build_dashboard.py [skill_dir] [out_path]
Deterministic. No network. The weekly routine only edits radar_data.js, then runs this."""
import sys, os
skill_dir = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(skill_dir, "..", "index.html")
tmpl = open(os.path.join(skill_dir, "assets", "template.html")).read()
data = open(os.path.join(skill_dir, "radar_data.js")).read()
assert "/*__RADAR_DATA__*/" in tmpl, "template missing /*__RADAR_DATA__*/ marker"
html = tmpl.replace("/*__RADAR_DATA__*/", data, 1)
open(out, "w").write(html)
print(f"Wrote {out} ({len(html)} bytes)")
