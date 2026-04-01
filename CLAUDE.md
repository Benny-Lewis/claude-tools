# Claude Code Project Instructions

## What this repo is

A personal monorepo for all Claude Code customizations: skills (plugin), statuslines, and future hooks/agents. The plugin manifest (`plugin.json`) lives at the root so this repo can be installed as a Claude Code plugin for skills.

## Repo layout

- `skills/` — Claude Code slash commands, each in its own directory with a `SKILL.md`
- `statuslines/` — Statusline configs for Claude Code's status bar
  - `ben-custom.js` — Ben's custom statusline (Node.js). Source of truth — the copy in `~/.claude/` is derived from here.
  - `claude-usage-monitor/` — Cloned from [aiedwardyi/claude-usage-monitor](https://github.com/aiedwardyi/claude-usage-monitor) v0.1.2. Gitignored. Re-clone if missing.
  - `switch-statusline.py` — Rewrites `~/.claude/settings.json` statusLine entry to switch between configs.
- `docs/plans/` — Implementation plans for features in progress

## Key conventions

- **Statuslines run from this repo directly.** The `settings.json` statusLine command points into `~/dev/claude-tools/statuslines/`, not into `~/.claude/plugins/`. Edits here take effect on next Claude Code restart.
- **Skills are installed as a plugin.** The plugin system reads from this repo via the marketplace.
- **Third-party tools are gitignored.** Clone them into the appropriate directory; they maintain their own repos.
- **Version bumps in `plugin.json`** when releasing skill changes to the marketplace.

## Adding a new statusline

1. Add the script to `statuslines/`
2. Add a profile entry in `switch-statusline.py` under `PROFILES`
3. Update the README statuslines table

## Adding a new skill

1. Create `skills/<name>/SKILL.md` with the skill definition
2. Add a section to the README under Skills
3. Bump the version in `plugin.json`
