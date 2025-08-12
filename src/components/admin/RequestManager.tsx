import React, { useState, useEffect } from 'react';
import { Download, Eye, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { api } from '../../utils/api';

// Типы для заявок
interface FirmwareRequest {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carBrand: string;
  carModel: string;
  year: string;
  engineType: string;
  ecuType: string;
  description: string;
  options?: Record<string, boolean>;
  totalPrice?: number;
  fileUrl?: string;
  fileName?: string;
  status: 'new' | 'processing' | 'completed' | 'rejected';
}

// Статусы заявок
const requestStatuses = [
  { id: 'new', name: 'Новая', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'processing', name: 'В обработке', color: 'bg-blue-100 text-blue-800' },
  { id: 'completed', name: 'Выполнена', color: 'bg-green-100 text-green-800' },
  { id: 'rejected', name: 'Отклонена', color: 'bg-red-100 text-red-800' }
];

export default function RequestManager() {
  const [requests, setRequests] = useState<FirmwareRequest[]>([]);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  
  // Загрузка заявок при монтировании
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await api.getAll('firmware-requests');
        setRequests(data);
      } catch (error) {
        console.error('Error fetching firmware requests:', error);
        // Используем пустой массив в случае ошибки
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, []);
  
  const toggleRequestExpand = (requestId: string) => {
    setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
  };
  
  const updateRequestStatus = async (requestId: string, newStatus: 'new' | 'processing' | 'completed' | 'rejected') => {
    try {
      const requestToUpdate = requests.find(request => request.id === requestId);
      if (!requestToUpdate) return;
      
      const updatedRequest = { ...requestToUpdate, status: newStatus };
      const result = await api.update('firmware-requests', requestId, updatedRequest);
      
      setRequests(requests.map(request => 
        request.id === requestId ? result : request
      ));
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Error al actualizar el estado de la solicitud');
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Фильтрация заявок по статусу
  const filteredRequests = statusFilter === 'all'
    ? requests
    : requests.filter(request => request.status === statusFilter);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Управление заявками на прошивку</h2>
        
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все статусы</option>
            {requestStatuses.map(status => (
              <option key={status.id} value={status.id}>{status.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map(request => (
            <div key={request.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Заголовок заявки */}
              <div 
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                onClick={() => toggleRequestExpand(request.id)}
              >
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    requestStatuses.find(s => s.id === request.status)?.color
                  }`}>
                    {requestStatuses.find(s => s.id === request.status)?.name}
                  </span>
                  <span className="font-medium">{request.id}</span>
                  <span>{formatDate(request.date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">{request.carBrand} {request.carModel}</span>
                  {expandedRequestId === request.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {/* Детали заявки */}
              {expandedRequestId === request.id && (
                <div className="p-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Информация о клиенте</h3>
                      <p className="text-gray-900">{request.customerName}</p>
                      <p className="text-gray-900">{request.customerEmail}</p>
                      <p className="text-gray-900">{request.customerPhone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Информация об автомобиле</h3>
                      <p className="text-gray-900">
                        {request.carBrand} {request.carModel}, {request.year}
                      </p>
                      <p className="text-gray-900">Тип двигателя: {request.engineType}</p>
                      <p className="text-gray-900">ECU: {request.ecuType}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Описание проблемы</h3>
                    <p className="text-gray-900 whitespace-pre-wrap">{request.description}</p>
                  </div>

                  {(request.options || request.totalPrice) && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Опции прошивки</h3>
                      {request.options && (
                        <ul className="list-disc ml-6 text-gray-900">
                          {Object.entries(request.options).filter(([,v])=>v).map(([k]) => (
                            <li key={k}>{k}</li>
                          ))}
                        </ul>
                      )}
                      {request.totalPrice && (
                        <p className="mt-2 text-gray-900 font-semibold">Итого: €{request.totalPrice}</p>
                      )}
                    </div>
                  )}
                  
                  {request.fileUrl && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Файл прошивки</h3>
                      <div className="flex items-center">
                        <a 
                          href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${request.fileUrl}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {request.fileName || 'Скачать файл'}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    <select
                      value={request.status}
                      onChange={(e) => updateRequestStatus(request.id, e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {requestStatuses.map(status => (
                        <option key={status.id} value={status.id}>{status.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600">Нет заявок на модификацию прошивок</p>
        </div>
      )}
    </div>
  );
}