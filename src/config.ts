// API URL конфигурация
// В режиме разработки используем локальный сервер
// В продакшене используем URL развернутого бэкенда

// Для локальной разработки
const LOCAL_API_URL = 'http://localhost:5000';

// URL для продакшена - замените на URL вашего развернутого бэкенда
// Например: https://elatneo-api.herokuapp.com, https://elatneo-api.onrender.com и т.д.
const PRODUCTION_API_URL = 'https://elatneo-api.onrender.com';

// Определяем, какой URL использовать
export const API_URL = import.meta.env.PROD ? PRODUCTION_API_URL : LOCAL_API_URL;