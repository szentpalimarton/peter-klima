#!/usr/bin/env bash
# Egy Codex-review kör a heti cikk-kör cikkére (cikk-kor.md, 10a. lépés).
# A pingpong skill szkriptjeit hívja: diff a bázishoz képest, aztán egy kód-módú review,
# az írás-utasítással mint kontextussal. A Codex read-only sandboxban fut, nem ír semmit.
#
# Használat (a cikk worktree-jéből, `cd "<wt>" && …` alakban):
#   bash tools/codex-kor.sh <slug> <kimeneti-mappa> [bázis]
#   bázis: alap origin/main
# Kimenet (stdout): a diff és a review útvonala, és a verdikt sora.
# Kilépési kódok: 0 siker · 2 hibás hívás · 3 a Codex nem elérhető (nincs skill vagy nincs bejelentkezés)
#                 4 a review nem készült el (üres diff vagy a Codex hibával állt le)
set -euo pipefail

SLUG="${1:-}"; KI="${2:-}"; BAZIS="${3:-origin/main}"
if [ -z "$SLUG" ] || [ -z "$KI" ]; then
  echo "használat: bash tools/codex-kor.sh <slug> <kimeneti-mappa> [bázis]" >&2; exit 2
fi
case "$SLUG" in *[!a-z0-9-]*) echo "hibás slug: $SLUG" >&2; exit 2;; esac

SKILL="${PINGPONG_SKILL:-$HOME/.claude/skills/pingpong}"
if [ ! -f "$SKILL/scripts/codex-review.sh" ] || [ ! -f "$SKILL/scripts/diff-keszit.sh" ]; then
  echo "a pingpong skill nem található: $SKILL" >&2; exit 3
fi
CODEX="$(bash "$SKILL/scripts/codex-bin.sh" 2>/dev/null || true)"
if [ -z "$CODEX" ] || ! "$CODEX" login status >/dev/null 2>&1; then
  echo "a Codex nem elérhető vagy nincs bejelentkezve" >&2; exit 3
fi

ROOT="$(git rev-parse --show-toplevel)"
UTASITAS="$ROOT/docs/cikk-kor/iras-utasitas.md"
[ -f "$UTASITAS" ] || { echo "nincs írás-utasítás: $UTASITAS" >&2; exit 2; }
CIKK="src/content/tudastar/$SLUG.md"
[ -f "$ROOT/$CIKK" ] || { echo "a cikk nem létezik: $CIKK" >&2; exit 2; }
mkdir -p "$KI"
MA="$(date +%F)"
DIFF="$KI/$MA-$SLUG.diff"
REVIEW="$KI/$MA-$SLUG-codex-1.md"

if ! KIMENET="$(PROJECT_ROOT="$ROOT" bash "$SKILL/scripts/diff-keszit.sh" "$DIFF" "$BAZIS" 2>&1)"; then
  echo "a diff nem készült el: $KIMENET" >&2; exit 4
fi
if [ ! -s "$DIFF" ] || printf '%s' "$KIMENET" | grep -q 'fájlok: 0'; then
  echo "üres diff a bázishoz ($BAZIS) képest: nincs mit review-zni" >&2; exit 4
fi
if ! grep -q -- "$CIKK" "$DIFF"; then
  echo "a cikk ($CIKK) nem szerepel a diffben a bázishoz ($BAZIS) képest" >&2; exit 4
fi

if ! PROJECT_ROOT="$ROOT" bash "$SKILL/scripts/codex-review.sh" kod 1 "$REVIEW" --diff "$DIFF" --terv "$UTASITAS" >/dev/null 2>&1 || [ ! -s "$REVIEW" ]; then
  echo "a Codex-review nem készült el (napló: $REVIEW.log)" >&2; exit 4
fi

VERDIKT="$(awk '/^## Verdikt/{f=1;next} f&&NF{print;exit}' "$REVIEW")"
case "$VERDIKT" in
  MEHET*|JAVÍTANDÓ*|ÚJRAÍRANDÓ*) ;;
  *) echo "a review-ban nincs érvényes verdikt (MEHET / JAVÍTANDÓ / ÚJRAÍRANDÓ): $REVIEW" >&2; exit 4;;
esac
echo "diff: $DIFF"
echo "review: $REVIEW"
echo "verdikt: $VERDIKT"
