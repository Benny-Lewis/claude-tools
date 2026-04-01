#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- ANSI colors ---
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

// --- OSC 8 hyperlink helpers ---
function link(url, text) {
    return `\x1b]8;;${url}\x07${text}\x1b]8;;\x07`;
}

// --- Caching ---
const CACHE_FILE = (process.env.TMPDIR || process.env.TEMP || '/tmp') + '/claude-statusline-git-cache.json';
const CACHE_TTL = 5; // seconds

function readCache(cwd) {
    try {
        const raw = fs.readFileSync(CACHE_FILE, 'utf8');
        const cache = JSON.parse(raw);
        if (cache.cwd !== cwd) return null;
        if ((Date.now() / 1000) - cache.timestamp > CACHE_TTL) return null;
        return cache;
    } catch {
        return null;
    }
}

function writeCache(data) {
    try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(data));
    } catch {
        // ignore write errors
    }
}

function gitExec(cmd, cwd) {
    return execSync(cmd, {
        cwd,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
}

function getGitInfo(cwd) {
    const cached = readCache(cwd);
    if (cached) {
        return { branch: cached.branch, staged: cached.staged, modified: cached.modified, remoteUrl: cached.remoteUrl };
    }

    try {
        gitExec('git --no-optional-locks rev-parse --git-dir', cwd);
    } catch {
        writeCache({ cwd, branch: '', staged: 0, modified: 0, remoteUrl: '', timestamp: Date.now() / 1000 });
        return null;
    }

    let branch = '', staged = 0, modified = 0, remoteUrl = '';
    try { branch = gitExec('git --no-optional-locks branch --show-current', cwd); } catch {}
    try {
        const out = gitExec('git --no-optional-locks diff --cached --numstat', cwd);
        staged = out ? out.split('\n').filter(Boolean).length : 0;
    } catch {}
    try {
        const out = gitExec('git --no-optional-locks diff --numstat', cwd);
        modified = out ? out.split('\n').filter(Boolean).length : 0;
    } catch {}
    try {
        remoteUrl = gitExec('git --no-optional-locks remote get-url origin', cwd);
        // Convert SSH to HTTPS
        remoteUrl = remoteUrl.replace(/^git@github\.com:/, 'https://github.com/').replace(/\.git$/, '');
    } catch {}

    writeCache({ cwd, branch, staged, modified, remoteUrl, timestamp: Date.now() / 1000 });
    return { branch, staged, modified, remoteUrl };
}

// --- Formatting helpers ---
function shortenPath(fullPath) {
    const homeDir = (process.env.HOME || process.env.USERPROFILE || '').replace(/\\/g, '/');
    let normalized = fullPath.replace(/\\/g, '/');
    if (homeDir && normalized.startsWith(homeDir)) {
        normalized = '~' + normalized.slice(homeDir.length);
    }
    return normalized;
}

function fileUrl(fullPath) {
    const normalized = fullPath.replace(/\\/g, '/');
    // Ensure leading slash for Windows drive paths (C:/... -> /C:/...)
    const prefix = normalized.startsWith('/') ? '' : '/';
    return `file://${prefix}${normalized}`;
}

function formatDuration(ms) {
    const totalSec = Math.floor((ms || 0) / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
}

function buildProgressBar(pct, width) {
    const filled = Math.round(pct * width / 100);
    const empty = width - filled;
    return '\u2588'.repeat(filled) + '\u2591'.repeat(empty);
}

function barColor(pct) {
    if (pct >= 90) return RED;
    if (pct >= 70) return YELLOW;
    return GREEN;
}

// --- Main ---
let input = '';
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
    try {
        const data = JSON.parse(input);

        // Extract core fields
        const model = data.model?.display_name || 'Claude';
        const cwd = data.workspace?.current_dir || data.cwd || '.';
        let pct = data.context_window?.used_percentage;
        if (pct == null && data.context_window?.current_usage) {
            const u = data.context_window.current_usage;
            const used = (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0);
            const size = data.context_window.context_window_size || 200000;
            pct = (used / size) * 100;
        }
        pct = Math.floor(pct || 0);
        // Current turn token usage (cached + uncached)
        const cu = data.context_window?.current_usage || {};
        const currentTokens = (cu.input_tokens || 0) + (cu.cache_creation_input_tokens || 0) + (cu.cache_read_input_tokens || 0) + (cu.output_tokens || 0);
        const windowSize = data.context_window?.context_window_size || 1000000;
        const cost = data.cost?.total_cost_usd ?? 0;
        const durationMs = data.cost?.total_duration_ms || 0;
        const linesAdded = data.cost?.total_lines_added || 0;
        const linesRemoved = data.cost?.total_lines_removed || 0;
        const style = data.output_style?.name || 'default';

        // --- Line 1: Info bar ---
        const shortPath = shortenPath(cwd);
        const dirLink = link(fileUrl(cwd), shortPath);

        let line1 = `${CYAN}[${model}]${RESET} ${dirLink}`;

        const git = getGitInfo(cwd);
        if (git && git.branch) {
            // Branch name, optionally clickable to GitHub
            let branchDisplay = git.branch;
            if (git.remoteUrl && git.remoteUrl.includes('github.com')) {
                const branchUrl = `${git.remoteUrl}/tree/${git.branch}`;
                branchDisplay = link(branchUrl, git.branch);
            }
            line1 += ` ${DIM}|${RESET} ${branchDisplay}`;

            // Staged & modified counts
            if (git.staged > 0) line1 += ` ${GREEN}+${git.staged}${RESET}`;
            if (git.modified > 0) line1 += ` ${YELLOW}~${git.modified}${RESET}`;
        }

        if (style !== 'default') {
            line1 += ` ${DIM}|${RESET} style:${style}`;
        }

        // --- Line 2: Metrics bar ---
        const bar = buildProgressBar(pct, 20);
        const color = barColor(pct);
        const costFmt = `$${cost.toFixed(2)}`;
        const duration = formatDuration(durationMs);

        function formatTokens(n) {
            if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
            if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
            return String(n);
        }
        const tokensFmt = `${formatTokens(currentTokens)} / ${formatTokens(windowSize)}`;

        let line2 = `${color}${bar}${RESET} ${pct}% ${DIM}|${RESET} ${tokensFmt} ${DIM}|${RESET} ${costFmt} ${DIM}|${RESET} ${duration} ${DIM}|${RESET} ${GREEN}+${linesAdded}${RESET}/${RED}-${linesRemoved}${RESET}`;

        console.log(line1);
        console.log(line2);
    } catch (e) {
        console.log('Claude Code');
    }
});
