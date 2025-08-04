// Утилита для работы с API

// Базовый URL API
const getApiBaseUrl = () => {
  // Приоритет:
  // 1. Переменная окружения VITE_API_URL (если задана)
  // 2. В продакшене - URL развернутого бэкенда
  // 3. В разработке - локальный сервер
  return import.meta.env.VITE_API_URL || 
    (import.meta.env.PROD ? 'https://elatneo-api.onrender.com' : 'http://localhost:5000');
};

// Функция для выполнения запросов к API
export const fetchApi = async (endpoint: string, options = {}) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options as any).headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    // Для DELETE запросов может не быть тела ответа
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

// Вспомогательные функции для работы с API
export const api = {
  // Получение списка элементов
  getAll: (resource: string) => fetchApi(`/api/${resource}`),
  
  // Получение одного элемента по ID
  getById: (resource: string, id: string) => fetchApi(`/api/${resource}/${id}`),
  
  // Создание нового элемента
  create: (resource: string, data: any) => fetchApi(`/api/${resource}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Обновление элемента
  update: (resource: string, id: string, data: any) => fetchApi(`/api/${resource}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Удаление элемента
  delete: (resource: string, id: string) => fetchApi(`/api/${resource}/${id}`, {
    method: 'DELETE',
  }),
};