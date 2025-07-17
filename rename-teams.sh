#!/usr/bin/env bash
echo "🔄 Substituindo 'teams' por 'times' no código..."
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" \) \
  -exec sed -i '' 's/\bteams\b/times/g' {} +
echo "✅ Código atualizado."
