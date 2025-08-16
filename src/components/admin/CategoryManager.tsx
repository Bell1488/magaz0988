import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Save, X, Upload } from 'lucide-react';
import { getApiUrl } from '../../utils/api';

// Типы для категорий
interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  count: number;
}

// Начальные данные для демонстрации
const initialCategories: Category[] = [
  {
    id: 'engine',
    name: 'Motor y sistema de alimentación',
    description: 'Pistones, anillos, filtros, inyectores, bombas de combustible',
    image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 1234
  },
  {
    id: 'brakes',
    name: 'Sistema de frenos',
    description: 'Pastillas, discos, tambores, cilindros, latiguillos',
    image: 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 892
  },
  {
    id: 'tires',
    name: 'Neumáticos',
    description: 'Neumáticos de verano, invierno y todo tiempo para todo tipo de vehículos',
    image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 425
  },
  {
    id: 'adblue',
    name: 'Componentes AdBlue y SCR',
    description: 'Inyectores, bombas, sensores NOx y líquido AdBlue',
    image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 178
  }
];

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Новая категория по умолчанию
  const defaultNewCategory: Category = {
    id: '',
    name: '',
    description: '',
    image: '',
    count: 0
  };
  
  // Загрузка категорий при монтировании
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/api/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Error fetching categories:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Используем начальные данные в случае ошибки
        setCategories(initialCategories);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Обработчики событий
  const handleAddNew = () => {
    setEditingCategory({ ...defaultNewCategory });
    setIsAdding(true);
  };
  
  const handleEdit = (category: Category) => {
    setEditingCategory({ ...category });
    setIsAdding(false);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta categoría?')) {
      try {
        const response = await fetch(`${getApiUrl()}/api/categories/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setCategories(categories.filter(c => c.id !== id));
        } else {
          console.error('Error deleting category:', await response.text());
          alert('Error al eliminar la categoría');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error al eliminar la categoría');
      }
    }
  };
  
  const handleSave = async () => {
    if (!editingCategory) return;
    
    try {
      let response;
      
      if (isAdding) {
        // Создание новой категории
        response = await fetch(`${getApiUrl()}/api/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingCategory),
        });
      } else {
        // Обновление существующей категории
        response = await fetch(`${getApiUrl()}/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingCategory),
        });
      }
      
      if (response.ok) {
        const savedCategory = await response.json();
        
        if (isAdding) {
          setCategories([...categories, savedCategory]);
        } else {
          setCategories(categories.map(c => c.id === savedCategory.id ? savedCategory : c));
        }
        
        setEditingCategory(null);
        setIsAdding(false);
      } else {
        console.error('Error saving category:', await response.text());
        alert('Error al guardar la categoría');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error al guardar la categoría');
    }
  };
  
  const handleCancel = () => {
    setEditingCategory(null);
    setIsAdding(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingCategory) return;
    
    const { name, value } = e.target;
    
    if (name === 'count') {
      setEditingCategory({ ...editingCategory, [name]: parseInt(value) || 0 });
    } else {
      setEditingCategory({ ...editingCategory, [name]: value });
    }
  };

  // Обработчик загрузки изображения
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !editingCategory) return;
    
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('image', files[0]);
      
      const response = await fetch(`${getApiUrl()}/api/categories/upload-image`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Error uploading image');
      }
      
      const data = await response.json();
      const imageUrl = `${getApiUrl()}${data.url}`;
      
      setEditingCategory({ ...editingCategory, image: imageUrl });
      
      // Очищаем input для возможности повторной загрузки того же файла
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Управление категориями</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить категорию
        </button>
      </div>
      
      {editingCategory && (
        <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isAdding ? 'Добавление новой категории' : 'Редактирование категории'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID категории
              </label>
              <input
                type="text"
                name="id"
                value={editingCategory.id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название
              </label>
              <input
                type="text"
                name="name"
                value={editingCategory.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                name="description"
                value={editingCategory.description}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL изображения
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="image"
                  value={editingCategory.image}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? 'Загрузка...' : 'Загрузить'}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Загрузите изображение или введите URL вручную</p>
              
              {/* Предварительный просмотр изображения */}
              {editingCategory.image && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Предварительный просмотр
                  </label>
                  <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                    <img 
                      src={editingCategory.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const nextElement = target.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500 text-sm hidden">
                      Ошибка загрузки
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Количество товаров
              </label>
              <input
                type="number"
                name="count"
                value={editingCategory.count}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4 inline mr-1" />
              Отмена
            </button>
            
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 inline mr-1" />
              Сохранить
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="relative h-40">
              {category.image ? (
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Нет изображения</span>
                </div>
              )}
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
                >
                  <Pencil className="h-4 w-4 text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">ID: {category.id}</span>
                <span className="text-sm font-medium text-blue-600">{category.count} товаров</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {categories.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Категории не найдены</p>
        </div>
      )}
    </div>
  );
}