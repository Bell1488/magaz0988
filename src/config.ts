// API URL конфигурация
// В режиме разработки используем локальный сервер
// В продакшене используем URL развернутого бэкенда

// Для локальной разработки
const LOCAL_API_URL = 'http://localhost:5000';

// URL для продакшена - ваш API на Render
const PRODUCTION_API_URL = 'https://magaz0988.onrender.com';

// Определяем, какой URL использовать
export const API_URL = import.meta.env.PROD ? PRODUCTION_API_URL : LOCAL_API_URL;