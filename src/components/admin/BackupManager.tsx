import React, { useState, useEffect } from 'react';
import { Download, Upload, RefreshCw, List, Save } from 'lucide-react';
import { getApiUrl } from '../../utils/api';

interface Backup {
  name: string;
  timestamp: string;
}

export default function BackupManager() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Загрузка списка резервных копий
  const loadBackups = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${getApiUrl()}/api/backup/list`);
      if (response.ok) {
        const data = await response.json();
        setBackups(data.backups || []);
      } else {
        throw new Error('Ошибка при загрузке списка резервных копий');
      }
    } catch (error) {
      console.error('Error loading backups:', error);
      setMessage({ type: 'error', text: 'Ошибка при загрузке списка резервных копий' });
    } finally {
      setIsLoading(false);
    }
  };

  // Создание резервной копии
  const createBackup = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${getApiUrl()}/api/backup`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Резервная копия создана успешно' });
        // Перезагружаем список резервных копий
        await loadBackups();
      } else {
        throw new Error('Ошибка при создании резервной копии');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      setMessage({ type: 'error', text: 'Ошибка при создании резервной копии' });
    } finally {
      setIsLoading(false);
    }
  };

  // Восстановление из резервной копии
  const restoreBackup = async () => {
    if (!window.confirm('Вы уверены, что хотите восстановить данные из последней резервной копии? Текущие данные будут перезаписаны.')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${getApiUrl()}/api/backup/restore`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Данные восстановлены из резервной копии' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при восстановлении данных');
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Ошибка при восстановлении данных' });
    } finally {
      setIsLoading(false);
    }
  };

  // Очистка сообщения через 5 секунд
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Загружаем список резервных копий при монтировании
  useEffect(() => {
    loadBackups();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Управление резервными копиями</h2>
        <button
          onClick={loadBackups}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Обновить
        </button>
      </div>

      {/* Сообщения */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Кнопки действий */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={createBackup}
          disabled={isLoading}
          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save className="h-5 w-5 mr-2" />
          Создать резервную копию
        </button>
        
        <button
          onClick={restoreBackup}
          disabled={isLoading || backups.length === 0}
          className="flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          <Upload className="h-5 w-5 mr-2" />
          Восстановить из резервной копии
        </button>
      </div>

      {/* Список резервных копий */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <List className="h-5 w-5 mr-2 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Доступные резервные копии</h3>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Загрузка...</p>
          </div>
        ) : backups.length === 0 ? (
          <div className="text-center py-8">
            <Download className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">Резервные копии не найдены</p>
            <p className="text-sm text-gray-400">Создайте первую резервную копию, чтобы сохранить ваши данные</p>
          </div>
        ) : (
          <div className="space-y-3">
            {backups.map((backup, index) => (
              <div key={backup.name} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{backup.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(backup.timestamp).toLocaleString('ru-RU')}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {index === backups.length - 1 && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Последняя
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Информация */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Информация о резервных копиях</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Резервные копии создаются автоматически при каждом деплое</li>
          <li>• Хранятся последние 5 резервных копий</li>
          <li>• Включают все данные: товары, категории, заказы, заявки</li>
          <li>• При восстановлении текущие данные будут перезаписаны</li>
        </ul>
      </div>
    </div>
  );
}
