import React, { useState, useEffect } from 'react';
import { Download, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../../utils/api';

interface RepairRequest {
  id: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  partName: string;
  description: string;
  status: 'new' | 'in-progress' | 'completed' | 'cancelled';
  images: Array<{
    url: string;
    originalName: string;
  }>;
  isNew: boolean;
}

export default function RepairManager() {
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<RepairRequest | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/api/repair-requests`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching repair requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: RepairRequest['status']) => {
    try {
      const request = requests.find(r => r.id === id);
      if (!request) return;

      const updatedRequest = { ...request, status, isNew: false };
      
      const response = await fetch(`${getApiUrl()}/api/repair-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRequest),
      });

      if (response.ok) {
        setRequests(requests.map(r => r.id === id ? updatedRequest : r));
      }
    } catch (error) {
      console.error('Error updating repair request:', error);
    }
  };

  const getStatusIcon = (status: RepairRequest['status']) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: RepairRequest['status']) => {
    switch (status) {
      case 'new':
        return 'Новая';
      case 'in-progress':
        return 'В работе';
      case 'completed':
        return 'Завершена';
      case 'cancelled':
        return 'Отменена';
      default:
        return 'Неизвестно';
    }
  };

  const handleViewRequest = (request: RepairRequest) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    if (filter === 'new') return request.status === 'new';
    return request.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Заявки на ремонт</h2>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600"
          >
            <option value="all">Все заявки</option>
            <option value="new">Новые</option>
            <option value="in-progress">В работе</option>
            <option value="completed">Завершенные</option>
            <option value="cancelled">Отмененные</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Деталь
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Фото
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className={request.isNew ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.id}
                    {request.isNew && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Новое
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.date).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.name}</div>
                    <div className="text-sm text-gray-500">{request.email}</div>
                    <div className="text-sm text-gray-500">{request.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{request.partName}</div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">{request.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(request.status)}
                      <span className="ml-2 text-sm text-gray-900">{getStatusText(request.status)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.images.length > 0 ? (
                      <div className="flex space-x-1">
                        {request.images.slice(0, 3).map((image, index) => (
                          <a
                            key={index}
                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${image.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                          >
                            <Eye className="h-4 w-4 text-gray-600" />
                          </a>
                        ))}
                        {request.images.length > 3 && (
                          <span className="text-xs text-gray-500">+{request.images.length - 3}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">Нет фото</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewRequest(request)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Просмотреть заявку"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <select
                        value={request.status}
                        onChange={(e) => updateStatus(request.id, e.target.value as RepairRequest['status'])}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="new">Новая</option>
                        <option value="in-progress">В работе</option>
                        <option value="completed">Завершена</option>
                        <option value="cancelled">Отменена</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Нет заявок на ремонт</p>
        </div>
      )}

      {/* Модальное окно для просмотра заявки */}
      {isViewModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Заявка на ремонт #{selectedRequest.id}
                </h2>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedRequest(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Информация о клиенте */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Информация о клиенте
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Имя:</label>
                      <p className="text-gray-900">{selectedRequest.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email:</label>
                      <p className="text-gray-900">{selectedRequest.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Телефон:</label>
                      <p className="text-gray-900">{selectedRequest.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Дата заявки:</label>
                      <p className="text-gray-900">
                        {new Date(selectedRequest.date).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Информация о ремонте */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Информация о ремонте
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Название детали:</label>
                      <p className="text-gray-900">{selectedRequest.partName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Описание проблемы:</label>
                      <p className="text-gray-900">{selectedRequest.description}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Статус:</label>
                      <div className="flex items-center">
                        {getStatusIcon(selectedRequest.status)}
                        <span className="ml-2 text-gray-900">{getStatusText(selectedRequest.status)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Фотографии */}
              {selectedRequest.images.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                    Фотографии ({selectedRequest.images.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedRequest.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${image.url}`}
                          alt={`Фото ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <a
                          href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${image.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-50 transition-all rounded-lg"
                        >
                          <Eye className="h-6 w-6 text-white opacity-0 hover:opacity-100" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Управление статусом */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Изменить статус:
                    </label>
                    <select
                      value={selectedRequest.status}
                      onChange={(e) => {
                        updateStatus(selectedRequest.id, e.target.value as RepairRequest['status']);
                        setSelectedRequest({
                          ...selectedRequest,
                          status: e.target.value as RepairRequest['status']
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="new">Новая</option>
                      <option value="in-progress">В работе</option>
                      <option value="completed">Завершена</option>
                      <option value="cancelled">Отменена</option>
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setSelectedRequest(null);
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 