# claude-tools

Personal Claude Code customizations — skills, statuslines, hooks, and agents.

## Skills

### cleanup-notepad

Triage unsaved Notepad++ tabs. Reads backup files, cross-references against existing project files, and categorizes each as save or delete.

```
/cleanup-notepad
```

- Reads `session.xml` to identify only currently open tabs
- Checks for duplicates, completed work, temporary pastes, and AI-generated scratch
- Proposes save locations using existing directory structure
- Waits for approval before saving anything

### file

Open a file's containing folder in the system file manager with the file selected.

```
/file package.json
/file the main config
/file src/components/Header.tsx
/file
```

- Resolves filenames, paths, natural language descriptions, or infers from context
- Cross-platform: Windows Explorer, macOS Finder, Linux xdg-open

## Statuslines

Switchable statusline configs for Claude Code. Use the switcher:

```bash
# Show active statusline
python statuslines/switch-statusline.py

# Switch to Ben's custom statusline (git info, clickable links, cost, lines changed)
python statuslines/switch-statusline.py ben

# Switch to claude-usage-monitor (5h/7d quota tracking, reset countdown)
python statuslines/switch-statusline.py monitor
```

Restart Claude Code after switching.

## Install

Add the marketplace (one-time), then install:

```
/plugin marketplace add Benny-Lewis/claude-tools
/plugin install claude-tools
```
