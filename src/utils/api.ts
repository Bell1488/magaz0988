// Утилита для работы с API

// Базовый URL API
const getApiBaseUrl = () => {
  // В продакшене используем Render API, в разработке - локальный сервер
  return import.meta.env.PROD ? 'https://magaz0988.onrender.com' : 'http://localhost:5000';
};

// Экспортируем функцию для использования в других файлах
export const getApiUrl = () => getApiBaseUrl();

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