#!/usr/bin/env python3
"""
Win/Loss Analysis Chart Generator
Generates professional PNG charts for embedding in .docx reports.

Dependencies:
    pip install matplotlib numpy --break-system-packages

Usage:
    python generate_charts.py --config charts_config.json --output-dir ./charts

The config JSON should contain chart definitions. See example at bottom of file.
Each chart is saved as a PNG at 300 DPI, sized for embedding in a Word doc.
"""

import json
import sys
import os
import argparse

# matplotlib setup — must happen before importing pyplot
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
from matplotlib.patches import FancyBboxPatch
import numpy as np

# ── Color palette (matches the docx theme) ──────────────────────────────────
NAVY    = "#1B3A5C"
TEAL    = "#2E86AB"
GREEN   = "#4CAF50"
RED     = "#E53935"
ORANGE  = "#FF9800"
GRAY    = "#9E9E9E"
LIGHT   = "#F0F5FA"
WHITE   = "#FFFFFF"

WON_COLOR  = "#4CAF50"   # green
LOST_COLOR = "#E53935"   # red
ACCENT_1   = "#2E86AB"   # teal
ACCENT_2   = "#FF9800"   # orange
ACCENT_3   = "#7E57C2"   # purple
ACCENT_4   = "#26A69A"   # teal-green
ACCENT_5   = "#EF5350"   # light red

PALETTE = [TEAL, NAVY, GREEN, ORANGE, ACCENT_3, ACCENT_4, RED, ACCENT_5, GRAY, "#78909C"]

def setup_style():
    """Apply a clean, modern style to all charts."""
    plt.rcParams.update({
        'font.family': 'sans-serif',
        'font.sans-serif': ['DejaVu Sans', 'Arial', 'Helvetica'],
        'font.size': 11,
        'axes.titlesize': 14,
        'axes.titleweight': 'bold',
        'axes.labelsize': 11,
        'axes.spines.top': False,
        'axes.spines.right': False,
        'axes.edgecolor': '#CCCCCC',
        'axes.facecolor': WHITE,
        'figure.facecolor': WHITE,
        'grid.color': '#E8E8E8',
        'grid.linewidth': 0.5,
        'xtick.color': '#555555',
        'ytick.color': '#555555',
    })


def horizontal_bar(config, output_path):
    """
    Horizontal bar chart — good for categories like industries, job titles, lost reasons.
    config keys: title, labels[], values[], color (optional), subtitle (optional),
                 show_values (bool), value_suffix (str)
    """
    labels = config['labels']
    values = config['values']
    color = config.get('color', TEAL)
    colors = config.get('colors', [color] * len(labels))

    fig, ax = plt.subplots(figsize=(8, max(3, len(labels) * 0.55 + 1.2)))

    y_pos = np.arange(len(labels))
    bars = ax.barh(y_pos, values, color=colors, height=0.6, edgecolor='none', zorder=3)

    ax.set_yticks(y_pos)
    ax.set_yticklabels(labels, fontsize=10)
    ax.invert_yaxis()
    ax.set_xlabel(config.get('xlabel', ''))
    ax.set_title(config['title'], pad=15, loc='left', color=NAVY)
    if config.get('subtitle'):
        ax.text(0, 1.02, config['subtitle'], transform=ax.transAxes,
                fontsize=9, color=GRAY, style='italic')
    ax.grid(axis='x', alpha=0.3, zorder=0)

    suffix = config.get('value_suffix', '')
    if config.get('show_values', True):
        for bar, val in zip(bars, values):
            ax.text(bar.get_width() + max(values)*0.02, bar.get_y() + bar.get_height()/2,
                    f'{val}{suffix}', va='center', fontsize=9, color='#333333')

    ax.set_xlim(0, max(values) * 1.18)
    plt.tight_layout()
    fig.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=WHITE)
    plt.close(fig)
    print(f"  ✓ {output_path}")


def grouped_bar(config, output_path):
    """
    Side-by-side grouped bar chart — good for Won vs Lost comparisons.
    config keys: title, categories[], won_values[], lost_values[], subtitle (optional)
    """
    categories = config['categories']
    won = config['won_values']
    lost = config['lost_values']

    x = np.arange(len(categories))
    width = 0.35

    fig, ax = plt.subplots(figsize=(max(6, len(categories) * 1.2 + 1), 5))

    bars_won = ax.bar(x - width/2, won, width, label='Won', color=WON_COLOR, edgecolor='none', zorder=3)
    bars_lost = ax.bar(x + width/2, lost, width, label='Lost', color=LOST_COLOR, edgecolor='none', zorder=3)

    ax.set_xticks(x)
    ax.set_xticklabels(categories, fontsize=9, rotation=30 if len(categories) > 5 else 0, ha='right' if len(categories) > 5 else 'center')
    ax.set_title(config['title'], pad=15, loc='left', color=NAVY)
    if config.get('subtitle'):
        ax.text(0, 1.02, config['subtitle'], transform=ax.transAxes,
                fontsize=9, color=GRAY, style='italic')
    ax.legend(frameon=False, loc='upper right')
    ax.grid(axis='y', alpha=0.3, zorder=0)

    suffix = config.get('value_suffix', '')
    for bars in [bars_won, bars_lost]:
        for bar in bars:
            h = bar.get_height()
            if h > 0:
                ax.text(bar.get_x() + bar.get_width()/2, h + max(max(won), max(lost))*0.02,
                        f'{int(h)}{suffix}', ha='center', fontsize=8, color='#333333')

    plt.tight_layout()
    fig.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=WHITE)
    plt.close(fig)
    print(f"  ✓ {output_path}")


def donut_chart(config, output_path):
    """
    Donut/pie chart — good for lost reason breakdown, source distribution.
    config keys: title, labels[], values[], subtitle (optional)
    """
    labels = config['labels']
    values = config['values']
    colors = config.get('colors', PALETTE[:len(labels)])

    fig, ax = plt.subplots(figsize=(7, 5))

    wedges, texts, autotexts = ax.pie(
        values, labels=None, colors=colors, autopct='%1.0f%%',
        startangle=90, pctdistance=0.78, wedgeprops=dict(width=0.4, edgecolor=WHITE, linewidth=2)
    )
    for t in autotexts:
        t.set_fontsize(9)
        t.set_color('#333333')

    # Legend on the right
    legend_labels = [f'{l}  ({v})' for l, v in zip(labels, values)]
    ax.legend(wedges, legend_labels, loc='center left', bbox_to_anchor=(1, 0.5),
              frameon=False, fontsize=9)

    ax.set_title(config['title'], pad=15, loc='left', color=NAVY, fontsize=14, fontweight='bold')
    if config.get('subtitle'):
        ax.text(0, 1.05, config['subtitle'], transform=ax.transAxes,
                fontsize=9, color=GRAY, style='italic')

    plt.tight_layout()
    fig.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=WHITE)
    plt.close(fig)
    print(f"  ✓ {output_path}")


def metric_cards(config, output_path):
    """
    Summary metric cards — a row of key stats (like a dashboard header).
    config keys: title, metrics[{label, value, subtitle?, color?}]
    """
    metrics = config['metrics']
    n = len(metrics)

    fig, axes = plt.subplots(1, n, figsize=(n * 2.5, 2.2))
    if n == 1:
        axes = [axes]

    fig.patch.set_facecolor(WHITE)

    for ax, m in zip(axes, metrics):
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.axis('off')

        color = m.get('color', NAVY)
        # Background card
        card = FancyBboxPatch((0.05, 0.05), 0.9, 0.9, boxstyle="round,pad=0.05",
                               facecolor=LIGHT, edgecolor='#D0D5DD', linewidth=1)
        ax.add_patch(card)

        ax.text(0.5, 0.65, str(m['value']), ha='center', va='center',
                fontsize=22, fontweight='bold', color=color)
        ax.text(0.5, 0.32, m['label'], ha='center', va='center',
                fontsize=9, color='#555555')
        if m.get('subtitle'):
            ax.text(0.5, 0.15, m['subtitle'], ha='center', va='center',
                    fontsize=7, color=GRAY, style='italic')

    if config.get('title'):
        fig.suptitle(config['title'], fontsize=13, fontweight='bold', color=NAVY, x=0.02, ha='left', y=1.05)

    plt.tight_layout()
    fig.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=WHITE)
    plt.close(fig)
    print(f"  ✓ {output_path}")


def stacked_bar(config, output_path):
    """
    Stacked bar chart — good for showing composition (e.g., deal sizes by range).
    config keys: title, categories[], datasets[{label, values[], color}], subtitle (optional)
    """
    categories = config['categories']
    datasets = config['datasets']

    fig, ax = plt.subplots(figsize=(max(6, len(categories) * 1.2 + 1), 5))

    bottom = np.zeros(len(categories))
    for ds in datasets:
        ax.bar(categories, ds['values'], bottom=bottom, label=ds['label'],
               color=ds.get('color', TEAL), edgecolor='none', zorder=3)
        bottom += np.array(ds['values'])

    ax.set_title(config['title'], pad=15, loc='left', color=NAVY)
    if config.get('subtitle'):
        ax.text(0, 1.02, config['subtitle'], transform=ax.transAxes,
                fontsize=9, color=GRAY, style='italic')
    ax.legend(frameon=False, loc='upper right')
    ax.grid(axis='y', alpha=0.3, zorder=0)

    plt.xticks(rotation=30 if len(categories) > 5 else 0,
               ha='right' if len(categories) > 5 else 'center', fontsize=9)
    plt.tight_layout()
    fig.savefig(output_path, dpi=300, bbox_inches='tight', facecolor=WHITE)
    plt.close(fig)
    print(f"  ✓ {output_path}")


# ── Dispatcher ───────────────────────────────────────────────────────────────
CHART_TYPES = {
    'horizontal_bar': horizontal_bar,
    'grouped_bar': grouped_bar,
    'donut': donut_chart,
    'metric_cards': metric_cards,
    'stacked_bar': stacked_bar,
}

def generate_all(config_path, output_dir):
    """Read config JSON and generate all charts."""
    with open(config_path) as f:
        config = json.load(f)

    os.makedirs(output_dir, exist_ok=True)
    setup_style()

    charts = config.get('charts', [])
    print(f"Generating {len(charts)} charts...")

    for chart in charts:
        chart_type = chart['type']
        filename = chart['filename']
        output_path = os.path.join(output_dir, filename)

        if chart_type in CHART_TYPES:
            try:
                CHART_TYPES[chart_type](chart, output_path)
            except Exception as e:
                print(f"  ✗ {filename}: {e}")
        else:
            print(f"  ✗ {filename}: Unknown chart type '{chart_type}'. Available: {list(CHART_TYPES.keys())}")

    print(f"Done! Charts saved to {output_dir}/")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Generate charts for Win/Loss Analysis report')
    parser.add_argument('--config', required=True, help='Path to charts_config.json')
    parser.add_argument('--output-dir', required=True, help='Directory to save chart PNGs')
    args = parser.parse_args()
    generate_all(args.config, args.output_dir)


# ── Example config (for reference) ──────────────────────────────────────────
# Save this as charts_config.json and run:
#   python generate_charts.py --config charts_config.json --output-dir ./charts
#
# {
#   "charts": [
#     {
#       "type": "metric_cards",
#       "filename": "metrics_summary.png",
#       "title": "Key Metrics at a Glance",
#       "metrics": [
#         {"label": "Won Deals", "value": "33", "color": "#4CAF50", "subtitle": "company domains"},
#         {"label": "Lost Deals", "value": "70+", "color": "#E53935", "subtitle": "company domains"},
#         {"label": "Avg Won Deal", "value": "$13.3K", "color": "#1B3A5C"},
#         {"label": "Win Rate", "value": "32%", "color": "#2E86AB"}
#       ]
#     },
#     {
#       "type": "donut",
#       "filename": "lost_reasons.png",
#       "title": "Lost Deal Reasons",
#       "subtitle": "Company-domain leads only",
#       "labels": ["Went Cold", "Budget", "Unqualified", "Competitor", "No Show", "Other"],
#       "values": [30, 12, 10, 8, 6, 4]
#     },
#     {
#       "type": "horizontal_bar",
#       "filename": "industries.png",
#       "title": "Top Industries — Won vs Lost",
#       "labels": ["SEO Agency", "Digital Agency", "E-commerce", "Enterprise", "Tech/SaaS"],
#       "values": [12, 8, 4, 2, 1],
#       "show_values": true
#     },
#     {
#       "type": "grouped_bar",
#       "filename": "geo_distribution.png",
#       "title": "Geographic Distribution",
#       "categories": ["UK", "US", "Australia", "Europe", "Asia", "LATAM"],
#       "won_values": [12, 8, 4, 5, 2, 1],
#       "lost_values": [15, 10, 5, 8, 12, 6]
#     },
#     {
#       "type": "horizontal_bar",
#       "filename": "job_titles.png",
#       "title": "Top Prospect Job Titles (Won Deals)",
#       "labels": ["Agency Owner/Founder", "VP/Director Marketing", "Head of SEO/Content", "Marketing Manager", "CEO"],
#       "values": [14, 7, 5, 4, 3],
#       "color": "#2E86AB"
#     }
#   ]
# }
