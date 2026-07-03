#!/usr/bin/env bash
# Reproducible installer for the Claude skills set (user-level: ~/.claude/skills).
#
# Installs:
#   1. Bundle skills committed in scripts/skills-bundle/ (the 2 uploaded skills
#      + ~22 app "ref-*" cheat-sheets) — these can't be re-fetched from the web.
#   2. Community skill collections cloned fresh from GitHub.
#
# Idempotent: dirs it creates are tagged with a marker and wiped on re-run, so
# re-running refreshes the managed set without touching your own skills.
#
# Usage:  bash scripts/install-skills.sh
# Env:    SKILLS_DIR (default ~/.claude/skills)
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUNDLE="$SCRIPT_DIR/skills-bundle"
SKILLS_DIR="${SKILLS_DIR:-$HOME/.claude/skills}"
MARKER=".managed-by-skills-installer"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$SKILLS_DIR"

installed=0; renamed=0; skipped=0

# Remove only previously-managed skill dirs (preserves your other skills).
while IFS= read -r -d '' m; do rm -rf "$(dirname "$m")"; done \
  < <(find "$SKILLS_DIR" -maxdepth 2 -name "$MARKER" -print0 2>/dev/null)

get_name() { # file -> inline value of name:
  awk '
    /^---[[:space:]]*$/ { d++; next }
    d==1 && /^name:/ { sub(/^name:[[:space:]]*/,""); gsub(/^["'\'' ]+|["'\'' ]+$/,""); print; exit }
    d>=2 { exit }
  ' "$1"
}
has_field() { # file field -> "yes" if key present in frontmatter
  awk -v f="$2" '
    /^---[[:space:]]*$/ { d++; next }
    d==1 && $0 ~ "^"f":" { print "yes"; exit }
    d>=2 { exit }
  ' "$1"
}
sanitize() { echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//'; }

install_skill() { # src_dir tag
  local src="$1" tag="$2" f name base target
  f="$src/SKILL.md"; [ -f "$f" ] || return 0
  name="$(get_name "$f")"
  if [ -z "$name" ] || [ "$(has_field "$f" name)" != yes ] || [ "$(has_field "$f" description)" != yes ]; then
    echo "    skip (invalid frontmatter): ${src#"$TMP"/}"; skipped=$((skipped+1)); return 0
  fi
  base="$(sanitize "$name")"; [ -n "$base" ] || { skipped=$((skipped+1)); return 0; }
  target="$base"
  [ -e "$SKILLS_DIR/$target" ] && target="${tag}-${base}"
  [ -e "$SKILLS_DIR/$target" ] && target="${tag}-${base}-$RANDOM"
  cp -a "$src" "$SKILLS_DIR/$target"
  rm -rf "$SKILLS_DIR/$target/.git"
  touch "$SKILLS_DIR/$target/$MARKER"
  if [ "$target" != "$base" ]; then
    sed -i -E "0,/^name:.*/s##name: $target#" "$SKILLS_DIR/$target/SKILL.md"
    renamed=$((renamed+1))
  fi
  installed=$((installed+1))
}

install_tree() { # root tag [prune_glob] — install every dir containing a SKILL.md
  local root="$1" tag="$2" prune="${3:-}" f
  if [ -n "$prune" ]; then
    while IFS= read -r f; do install_skill "$(dirname "$f")" "$tag"; done \
      < <(find "$root" -path '*/.git' -prune -o -path "$prune" -prune -o -name SKILL.md -print | sort)
  else
    while IFS= read -r f; do install_skill "$(dirname "$f")" "$tag"; done \
      < <(find "$root" -path '*/.git' -prune -o -name SKILL.md -print | sort)
  fi
}

clone() { # url dest
  local url="$1" dest="$2" i
  for i in 1 2 3 4; do
    git clone --depth 1 -q "$url" "$dest" 2>/dev/null && return 0
    echo "    retry clone ($i): $url"; rm -rf "$dest"; sleep $((i*2))
  done
  echo "    FAILED clone: $url"; return 1
}

echo "== Bundle skills (uploads + ref-* cheat-sheets) =="
install_tree "$BUNDLE" "bundle"

echo "== Community skill collections =="
# Format: tag|url|subpath|prune_glob
#   subpath    — restrict install to this dir inside the clone (blank = repo root).
#                Used when a repo ships the same SKILL.md duplicated across many
#                platform dirs (.claude, .cursor, .gemini, ...); we take one canonical copy.
#   prune_glob — a `find -path` glob whose matches are skipped (blank = none).
#                Used to drop bulk auto-generated skill dumps we don't want.
REPOS='
anthropic|https://github.com/anthropics/skills||
superpowers|https://github.com/obra/superpowers||
obsidian|https://github.com/kepano/obsidian-skills||
ace|https://github.com/muratcankoylan/agent-skills-for-context-engineering||
mkt|https://github.com/coreyhaines31/marketingskills||
seo|https://github.com/AgriciDaniel/claude-seo||
omcc|https://github.com/Yeachan-Heo/oh-my-claudecode||
notebooklm|https://github.com/PleasePrompto/notebooklm-skill||
deepresearch|https://github.com/199-biotechnologies/claude-deep-research-skill||
promptmaster|https://github.com/nidhinjs/prompt-master||
securityreview|https://github.com/anthropics/claude-code-security-review||
impeccable|https://github.com/pbakaus/impeccable|.claude/skills|
taste|https://github.com/Leonxlnx/taste-skill|skills|
animate|https://github.com/delphi-ai/animate-skill||
motion|https://github.com/kylezantos/design-motion-principles|skills|
codex|https://github.com/ComposioHQ/awesome-codex-skills||*/composio-skills/*
designer|https://github.com/Owl-Listener/designer-skills||
'
while IFS='|' read -r tag url subpath prune; do
  [ -z "${tag// }" ] && continue
  echo "-- $tag"
  dest="$TMP/$tag"
  clone "$url" "$dest" || continue
  root="$dest"
  [ -n "${subpath// }" ] && root="$dest/${subpath// }"
  install_tree "$root" "$tag" "${prune// }"
done <<< "$REPOS"

echo ""
echo "== Summary =="
echo "installed=$installed  collisions_renamed=$renamed  skipped=$skipped"
echo "total skill dirs: $(find "$SKILLS_DIR" -maxdepth 1 -mindepth 1 -type d | wc -l)"
