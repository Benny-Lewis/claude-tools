# claude-tools

Personal Claude Code customizations — skills, statuslines, hooks, and agents.

## Skills

### `/cleanup-notepad`

Triage unsaved Notepad++ tabs. Reads backup files, cross-references against existing project files, and categorizes each as save or delete.

- Reads `session.xml` to identify only currently open tabs
- Checks for duplicates, completed work, temporary pastes, and AI-generated scratch
- Proposes save locations using existing directory structure
- Waits for approval before saving anything

### `/notebooklm`

Create optimized NotebookLM notebooks and audio overviews for any topic. Handles the full pipeline: interviews the user, researches sources, curates the optimal source set, crafts a tailored audio overview prompt, and produces ready-to-use output files.

- Researches and curates 3-5 high-quality sources per notebook
- Produces intelligence briefs (compiled markdown) as the highest-leverage source type
- Writes audio overview prompts with "skip the intro" and balance directives baked in
- Outputs a setup file + intelligence brief, ready to paste into NotebookLM

### `/file`

Open a file's containing folder in the system file manager with the file selected.

```
/file package.json
/file the main config
/file src/components/Header.tsx
```

- Resolves filenames, paths, natural language descriptions, or infers from context
- Cross-platform: Windows Explorer, macOS Finder, Linux xdg-open

## Statuslines

Two interchangeable Claude Code statusline configs, managed by a switcher script.

| Name | What it shows |
|------|---------------|
| `ben` | Git branch (clickable), staged/modified counts, context bar, token counts, session cost, duration, lines +/- |
| `monitor` | 5h/7d API quota usage with progress bars, reset countdown, context bar, tokens, optional pacing |

### Switching

```bash
# Show which statusline is active
python statuslines/switch-statusline.py

# Switch to a specific one
python statuslines/switch-statusline.py ben
python statuslines/switch-statusline.py monitor
```

Restart Claude Code after switching.

### How it works

The switcher updates the `statusLine.command` field in `~/.claude/settings.json` to point at the selected statusline script. Both scripts live in `statuslines/` — your custom one (`ben-custom.js`) is tracked in this repo, and `claude-usage-monitor/` is a cloned third-party tool (gitignored).

## Project structure

```
claude-tools/
├── plugin.json                  # Claude Code plugin manifest
├── skills/
│   ├── cleanup-notepad/         # Notepad++ tab triage
│   ├── file/                    # Open file in system explorer
│   └── notebooklm/              # NotebookLM notebook & audio overview builder
├── statuslines/
│   ├── ben-custom.js            # Custom statusline (git-tracked)
│   ├── claude-usage-monitor/    # Third-party quota monitor (gitignored)
│   └── switch-statusline.py     # Statusline switcher
└── docs/
    └── plans/
```

## Install

As a Claude Code plugin (for skills):

```
/plugin marketplace add Benny-Lewis/claude-tools
/plugin install claude-tools
```

The statuslines are used directly from this repo via the switcher — no separate install step.

## Requirements

- Claude Code CLI with an active subscription
- Python 3.10+ (for statusline switcher and claude-usage-monitor)
- Node.js (for `ben` statusline)
