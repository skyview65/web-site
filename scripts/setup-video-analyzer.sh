#!/usr/bin/env bash
# SessionStart provisioning for the video-analyzer skill.
#
# Ephemeral web/cloud containers start fresh, so this ensures the skill and its
# runtime dependency are present on every session:
#   1. Installs the bundled skill into ~/.claude/skills/video-analyzer (if missing).
#   2. Ensures the `google-genai` Python package imports (installs it — plus cffi /
#      cryptography, which some base images ship mismatched — if it does not).
#   3. Reminds (non-fatally) when GEMINI_API_KEY is unset.
#
# Wired in via .claude/settings.json -> hooks.SessionStart. Idempotent; always exits 0.
set -u

# Resolve the project dir (CLAUDE_PROJECT_DIR is set by Claude Code hooks).
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
SKILLS_DIR="${SKILLS_DIR:-$HOME/.claude/skills}"
SRC="$PROJECT_DIR/scripts/skills-bundle/video-analyzer"
DEST="$SKILLS_DIR/video-analyzer"

# 1. Install the skill if it isn't already present.
if [ ! -f "$DEST/SKILL.md" ] && [ -d "$SRC" ]; then
  mkdir -p "$SKILLS_DIR"
  rm -rf "$DEST"
  cp -a "$SRC" "$DEST"
  echo "[video-analyzer] installed skill -> $DEST" >&2
fi

# 2. Ensure the runtime dependency imports.
if ! python3 -c "import google.genai" >/dev/null 2>&1; then
  echo "[video-analyzer] installing google-genai ..." >&2
  pip install -q google-genai cffi cryptography >/dev/null 2>&1 \
    || pip install -q --break-system-packages google-genai cffi cryptography >/dev/null 2>&1
  python3 -c "import google.genai" >/dev/null 2>&1 \
    && echo "[video-analyzer] google-genai ready" >&2 \
    || echo "[video-analyzer] WARN: could not import google-genai; run /video-analyzer for details" >&2
fi

# 3. Remind about the required API key (never fail the session over it).
if [ -z "${GEMINI_API_KEY:-}" ]; then
  echo "[video-analyzer] note: GEMINI_API_KEY is not set — required before /video-analyzer can call Gemini." >&2
fi

exit 0
