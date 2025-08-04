import React, { useState, useEffect } from 'react';
import { Check, X, ChevronDown, ChevronUp, Eye } from 'lucide-react';

// Типы для заказов
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: string;
}

// Начальные данные для демонстрации
const initialOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2023-08-01T10:30:00',
    customerName: 'Juan García',
    customerEmail: 'juan.garcia@example.com',
    customerPhone: '+34 612 345 678',
    items: [
      { id: 'eng-001', name: 'Filtro de aceite Mann W712/75', price: 45, quantity: 1 },
      { id: 'brk-001', name: 'Pastillas de freno Brembo P50088', price: 32, quantity: 2 }
    ],
    total: 109,
    status: 'completed',
    shippingAddress: 'Calle Gran Vía 123, 28013 Madrid, España'
  },
  {
    id: 'ORD-002',
    date: '2023-08-02T14:45:00',
    customerName: 'María López',
    customerEmail: 'maria.lopez@example.com',
    customerPhone: '+34 623 456 789',
    items: [
      { id: 'tire-001', name: 'Michelin Primacy 4', price: 89.99, quantity: 4 }
    ],
    total: 359.96,
    status: 'processing',
    shippingAddress: 'Avenida Diagonal 456, 08036 Barcelona, España'
  },
  {
    id: 'ORD-003',
    date: '2023-08-03T09:15:00',
    customerName: 'Carlos Rodríguez',
    customerEmail: 'carlos.rodriguez@example.com',
    customerPhone: '+34 634 567 890',
    items: [
      { id: 'adblue-001', name: 'Inyector AdBlue Bosch 0444025024', price: 189.99, quantity: 1 },
      { id: 'adblue-006', name: 'Líquido AdBlue 10L', price: 19.99, quantity: 2 }
    ],
    total: 229.97,
    status: 'pending',
    shippingAddress: 'Calle Serrano 789, 28006 Madrid, España'
  }
];

// Статусы заказов
const orderStatuses = [
  { id: 'pending', name: 'Ожидает обработки', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'processing', name: 'В обработке', color: 'bg-blue-100 text-blue-800' },
  { id: 'completed', name: 'Выполнен', color: 'bg-green-100 text-green-800' },
  { id: 'cancelled', name: 'Отменен', color: 'bg-red-100 text-red-800' }
];

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Загрузка заказов при монтировании
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Error fetching orders:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Используем начальные данные в случае ошибки
        setOrders(initialOrders);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Фильтрация заказов по статусу
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);
  
  // Обработчики событий
  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  
  const updateOrderStatus = async (orderId: string, newStatus: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    try {
      const orderToUpdate = orders.find(order => order.id === orderId);
      if (!orderToUpdate) return;
      
      const updatedOrder = { ...orderToUpdate, status: newStatus };
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder),
      });
      
      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        console.error('Error updating order status:', await response.text());
        alert('Error al actualizar el estado del pedido');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error al actualizar el estado del pedido');
    }
  };
  
  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Управление заказами</h2>
        
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">
            Фильтр по статусу:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все заказы</option>
            {orderStatuses.map(status => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                onClick={() => toggleOrderExpand(order.id)}
              >
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    orderStatuses.find(s => s.id === order.status)?.color
                  }`}>
                    {orderStatuses.find(s => s.id === order.status)?.name}
                  </span>
                  <span className="font-medium">{order.id}</span>
                  <span className="text-gray-600">{formatDate(order.date)}</span>
                </div>
                
                <div className="flex items-center space-x-6">
                  <span className="font-semibold">€{order.total.toFixed(2)}</span>
                  <span className="text-gray-600">{order.customerName}</span>
                  {expandedOrderId === order.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
              
              {expandedOrderId === order.id && (
                <div className="p-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Информация о клиенте</h4>
                      <p className="text-sm text-gray-600">Имя: {order.customerName}</p>
                      <p className="text-sm text-gray-600">Email: {order.customerEmail}</p>
                      <p className="text-sm text-gray-600">Телефон: {order.customerPhone}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Адрес доставки</h4>
                      <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Товары</h4>
                  <table className="min-w-full divide-y divide-gray-200 mb-4">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Название
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Цена
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Количество
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Сумма
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {item.id}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            €{item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            €{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={4} className="px-4 py-2 text-right text-sm font-medium text-gray-900">
                          Итого:
                        </td>
                        <td className="px-4 py-2 text-right text-sm font-bold text-gray-900">
                          €{order.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mr-2">
                        Изменить статус:
                      </label>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(
                          order.id, 
                          e.target.value as 'pending' | 'processing' | 'completed' | 'cancelled'
                        )}
                        className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {orderStatuses.map(status => (
                          <option key={status.id} value={status.id}>
                            {status.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                        <Eye className="h-4 w-4 inline mr-1" />
                        Подробнее
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Заказы не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}