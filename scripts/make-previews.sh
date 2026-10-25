#!/bin/sh
# Builds lightweight copies of every project JPEG for the /projects list
# previews: public/images/projects/X.jpg -> public/images/previews/X.jpg
# (max 1200px, quality 72). Detail pages keep using the originals.
# Re-run after adding or replacing project images. Requires macOS `sips`.
set -e
cd "$(dirname "$0")/.."

SRC=public/images/projects
OUT=public/images/previews

find "$SRC" -type f -name '*.jpg' | while read -r f; do
  rel=${f#"$SRC"/}
  dest="$OUT/$rel"
  if [ -f "$dest" ] && [ "$dest" -nt "$f" ]; then continue; fi
  mkdir -p "$(dirname "$dest")"
  sips -s format jpeg -s formatOptions 72 -Z 1200 "$f" --out "$dest" >/dev/null 2>&1
  chmod 644 "$dest"
  echo "preview: $rel"
done
