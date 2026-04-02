#!/usr/bin/env python3
"""Switch between statusline configurations in Claude Code settings.json.

Usage:
    python switch-statusline.py ben       # Switch to Ben's custom statusline
    python switch-statusline.py monitor   # Switch to claude-usage-monitor
    python switch-statusline.py           # Show which is currently active
"""

import json
import sys
from pathlib import Path

SETTINGS = Path.home() / ".claude" / "settings.json"
TOOLS_DIR = Path(__file__).resolve().parent

PROFILES = {
    "ben": {
        "type": "command",
        "command": f"node {TOOLS_DIR / 'ben-custom.js'}",
        "padding": 1,
    },
    "monitor": {
        "type": "command",
        "command": f"python {TOOLS_DIR / 'claude-usage-monitor' / 'statusline.py'}",
        "padding": 1,
    },
}

def detect_active(current):
    """Detect which profile matches the current statusLine config."""
    if not isinstance(current, dict):
        return "unknown"
    cmd = current.get("command", "")
    if "ben-custom" in cmd or "statusline.js" in cmd:
        return "ben"
    if "claude-usage-monitor" in cmd:
        return "monitor"
    return "unknown"

def main():
    settings = json.loads(SETTINGS.read_text(encoding="utf-8"))
    current = settings.get("statusLine", {})
    active = detect_active(current)

    if len(sys.argv) < 2:
        print(f"Active statusline: {active}")
        print(f"Available: {', '.join(PROFILES.keys())}")
        print(f"Usage: python {sys.argv[0]} <name>")
        return

    target = sys.argv[1].lower()
    if target not in PROFILES:
        print(f"Unknown profile '{target}'. Available: {', '.join(PROFILES.keys())}")
        sys.exit(1)

    if target == active:
        print(f"Already using '{target}' statusline.")
        return

    settings["statusLine"] = PROFILES[target]
    SETTINGS.write_text(json.dumps(settings, indent=2) + "\n", encoding="utf-8")
    print(f"Switched: {active} -> {target}")
    print("Restart Claude Code to apply.")

if __name__ == "__main__":
    main()
