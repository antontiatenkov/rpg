#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Сборка проекта для GitHub Pages..."
npm run build

# Создаем копию 404.html для корректной работы SPA-маршрутизации на GitHub Pages
echo "📄 Создание 404.html..."
cp dist/index.html dist/404.html

# Создаем файл .nojekyll, чтобы GitHub Pages не игнорировал файлы с подчеркиванием
touch dist/.nojekyll

echo "📦 Публикация в ветку gh-pages..."
npx gh-pages -d dist --dotfiles

echo "✅ Успешно опубликовано на GitHub Pages!"
