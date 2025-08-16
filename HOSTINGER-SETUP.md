# Настройка ElatNeo на Hostinger

## 🚨 Важно! Решение проблемы с 404 ошибкой

### Проблема
При переходе на https://elat.store/admin получаете ошибку 404.

### Решение

#### 1. Загрузите новые файлы
Загрузите **все содержимое** папки `dist/` в корень вашего домена на Hostinger.

#### 2. Создайте .htaccess файл
Создайте файл `.htaccess` в корне домена (там же, где index.html) со следующим содержимым:

```apache
RewriteEngine On
RewriteBase /

# Handle React Router - все маршруты должны вести к index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

#### 3. Структура файлов на Hostinger
Убедитесь, что в корне домена есть следующие файлы:

```
public_html/
├── .htaccess          ← НОВЫЙ ФАЙЛ
├── index.html         ← из папки dist/
├── assets/
│   ├── index-DZxK-Ddr.css
│   └── index-DdNZqSjo.js
└── (другие файлы из dist/)
```

## 🔧 Пошаговая инструкция

### Шаг 1: Подготовка файлов
1. Скопируйте содержимое папки `dist/` из вашего проекта
2. Скопируйте файл `.htaccess` из корня проекта

### Шаг 2: Загрузка на Hostinger
1. Войдите в панель Hostinger
2. Откройте File Manager
3. Перейдите в папку `public_html`
4. **Удалите все существующие файлы** (кроме .htaccess если есть)
5. Загрузите все файлы из папки `dist/`
6. Загрузите файл `.htaccess` в корень

### Шаг 3: Проверка
После загрузки проверьте:
- https://elat.store/ (главная страница)
- https://elat.store/admin (админ-панель)
- https://elat.store/catalog (каталог)

## 🐛 Если проблема остается

### Проверьте:
1. **Файл .htaccess** - убедитесь, что он загружен в корень
2. **Права доступа** - файлы должны быть доступны для чтения
3. **Кэш браузера** - очистите кэш или откройте в режиме инкогнито

### Альтернативный .htaccess (если первый не работает):
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

## 📞 Поддержка

Если проблема не решается:
1. Проверьте логи ошибок в панели Hostinger
2. Убедитесь, что mod_rewrite включен на сервере
3. Обратитесь в поддержку Hostinger с вопросом о настройке .htaccess для SPA

