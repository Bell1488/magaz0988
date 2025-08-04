import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/admin/Tabs';
import ProductManager from '../components/admin/ProductManager';
import CategoryManager from '../components/admin/CategoryManager';
import OrderManager from '../components/admin/OrderManager';
import RequestManager from '../components/admin/RequestManager';
import { Lock } from 'lucide-react';

// Простая аутентификация для админ-панели
const ADMIN_PASSWORD = 'admin123'; // В реальном приложении используйте безопасную аутентификацию

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [newOrders, setNewOrders] = useState(0);
  const [newRequests, setNewRequests] = useState(0);

  // Проверка аутентификации при загрузке страницы
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Загрузка данных о новых заказах и заявках
  useEffect(() => {
    const fetchNewItems = async () => {
      if (!isAuthenticated) return;

      try {
        // Загрузка новых заказов
        const ordersResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`);
        if (ordersResponse.ok) {
          const orders = await ordersResponse.json();
          const newOrdersCount = orders.filter(order => order.status === 'pending' && !localStorage.getItem(`viewed_order_${order.id}`)).length;
          setNewOrders(newOrdersCount);
        }

        // Загрузка новых заявок на прошивку
        const requestsResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/firmware-requests`);
        if (requestsResponse.ok) {
          const requests = await requestsResponse.json();
          const newRequestsCount = requests.filter(request => request.status === 'new' && !localStorage.getItem(`viewed_request_${request.id}`)).length;
          setNewRequests(newRequestsCount);
        }
      } catch (error) {
        console.error('Error fetching new items:', error);
      }
    };

    fetchNewItems();
    
    // Обновлять каждые 30 секунд
    const interval = setInterval(fetchNewItems, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Обработчик переключения вкладки
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Отмечаем заказы как просмотренные при переходе на вкладку заказов
    if (value === 'orders' && newOrders > 0) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`)
        .then(response => response.json())
        .then(orders => {
          orders.forEach(order => {
            if (order.status === 'pending') {
              localStorage.setItem(`viewed_order_${order.id}`, 'true');
            }
          });
          setNewOrders(0);
        })
        .catch(error => console.error('Error marking orders as viewed:', error));
    }
    
    // Отмечаем заявки как просмотренные при переходе на вкладку заявок
    if (value === 'requests' && newRequests > 0) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/firmware-requests`)
        .then(response => response.json())
        .then(requests => {
          requests.forEach(request => {
            if (request.status === 'new') {
              localStorage.setItem(`viewed_request_${request.id}`, 'true');
            }
          });
          setNewRequests(0);
        })
        .catch(error => console.error('Error marking requests as viewed:', error));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      setError('');
    } else {
      setError('Неверный пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <Lock className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите пароль администратора"
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Панель администратора ElatNeo</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="products">Товары</TabsTrigger>
            <TabsTrigger value="categories">Категории</TabsTrigger>
            <TabsTrigger value="orders" className="relative">
              Заказы
              {newOrders > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {newOrders}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests" className="relative">
              Заявки
              {newRequests > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {newRequests}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <ProductManager />
          </TabsContent>
          
          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>
          
          <TabsContent value="orders">
            <OrderManager />
          </TabsContent>
          
          <TabsContent value="requests">
            <RequestManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}