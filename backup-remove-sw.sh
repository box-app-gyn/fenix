#!/bin/bash

echo "🗂️ Criando backup dos arquivos PWA..."

mkdir -p backup_sw

for file in dist/sw.js dist/manifest*.webmanifest dist/workbox-*.js; do
  if [ -f "$file" ]; then
    echo "📦 Salvando $file em backup_sw/"
    cp "$file" backup_sw/
    rm "$file"
  fi
done

echo "✅ Backup feito e arquivos PWA removidos de dist/"
