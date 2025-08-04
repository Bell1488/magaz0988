import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Save, X, Search, Upload } from 'lucide-react';
import { api } from '../../utils/api';

// Типы для продуктов
interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice: number | null;
  description: string;
  fullDescription?: string;
  image: string;
  images?: string[];
  inStock: boolean;
  rating?: number;
  reviews?: number;
  specifications?: Record<string, string>;
}

// Начальные данные для демонстрации
const initialProducts: Product[] = [
  {
    id: 'eng-001',
    name: 'Filtro de aceite Mann W712/75',
    brand: 'MANN-FILTER',
    category: 'engine',
    price: 45,
    oldPrice: 52,
    description: 'Filtro de aceite original para BMW, Mercedes, Audi',
    image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800',
    inStock: true
  },
  {
    id: 'brk-001',
    name: 'Pastillas de freno Brembo P50088',
    brand: 'BREMBO',
    category: 'brakes',
    price: 32,
    oldPrice: 35,
    description: 'Pastillas de freno delanteras para conducción deportiva',
    image: 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=800',
    inStock: true
  }
];

// Категории для выпадающего списка
const categories = [
  { id: 'engine', name: 'Motor y sistema de alimentación' },
  { id: 'brakes', name: 'Sistema de frenos' },
  { id: 'suspension', name: 'Suspensión y dirección' },
  { id: 'electrical', name: 'Sistema eléctrico' },
  { id: 'body', name: 'Carrocería' },
  { id: 'interior', name: 'Interior y confort' },
  { id: 'consumables', name: 'Consumibles' },
  { id: 'tools', name: 'Herramientas y equipos' },
  { id: 'tires', name: 'Neumáticos' },
  { id: 'adblue', name: 'Componentes AdBlue y SCR' }
];

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [specifications, setSpecifications] = useState<{key: string, value: string}[]>([]);
  
  // Новый продукт по умолчанию
  const defaultNewProduct: Product = {
    id: '',
    name: '',
    brand: '',
    category: '',
    price: 0,
    oldPrice: null,
    description: '',
    fullDescription: '',
    image: '',
    images: [''],
    inStock: true,
    rating: 5.0,
    reviews: 0,
    specifications: {}
  };
  
  // Загрузка продуктов при монтировании
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getAll('products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Используем начальные данные в случае ошибки
        setProducts(initialProducts);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Фильтрация продуктов по поиску
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Обработчики событий
  const handleAddNew = () => {
    setEditingProduct({...defaultNewProduct});
    setSpecifications([]);
    setIsAdding(true);
  };
  
  const handleEdit = (product: Product) => {
    setEditingProduct({...product});
    
    // Преобразуем спецификации из объекта в массив пар ключ-значение
    const specs = product.specifications ? 
      Object.entries(product.specifications).map(([key, value]) => ({ key, value })) : 
      [];
    setSpecifications(specs);
    
    setIsAdding(false);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      try {
        await api.delete('products', id);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  };
  
  const handleSave = async () => {
    if (!editingProduct) return;
    
    try {
      // Преобразуем спецификации из массива пар ключ-значение в объект
      const specsObject: Record<string, string> = {};
      specifications.forEach(spec => {
        if (spec.key && spec.value) {
          specsObject[spec.key] = spec.value;
        }
      });
      
      // Подготовка данных перед сохранением
      const productToSave = {
        ...editingProduct,
        // Убедимся, что числовые поля имеют правильный тип
        price: parseFloat(editingProduct.price as any),
        oldPrice: editingProduct.oldPrice ? parseFloat(editingProduct.oldPrice as any) : null,
        rating: editingProduct.rating ? parseFloat(editingProduct.rating as any) : 5,
        reviews: editingProduct.reviews ? parseInt(editingProduct.reviews as any) : 0,
        // Убедимся, что у нас есть массив изображений
        images: editingProduct.images || [editingProduct.image],
        // Добавляем спецификации
        specifications: specsObject
      };
      
      let savedProduct;
      
      if (isAdding) {
        // Создание нового товара
        savedProduct = await api.create('products', productToSave);
        setProducts([...products, savedProduct]);
      } else {
        // Обновление существующего товара
        savedProduct = await api.update('products', productToSave.id, productToSave);
        setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
      }
      
      setEditingProduct(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto');
    }
  };
  
  const handleCancel = () => {
    setEditingProduct(null);
    setIsAdding(false);
    setSpecifications([]);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editingProduct) return;
    
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditingProduct({ ...editingProduct, [name]: checked });
    } else if (name === 'price' || name === 'oldPrice') {
      const numValue = name === 'oldPrice' && value === '' ? null : parseFloat(value);
      setEditingProduct({ ...editingProduct, [name]: numValue });
    } else {
      setEditingProduct({ ...editingProduct, [name]: value });
    }
  };

  // Обработчик загрузки изображения
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !editingProduct) return;
    
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('image', files[0]);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/upload-image`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Error uploading image');
      }
      
      const data = await response.json();
      const imageUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${data.url}`;
      
      // Если это первое изображение, устанавливаем его как основное
      if (!editingProduct.image) {
        setEditingProduct({ ...editingProduct, image: imageUrl });
      } else {
        // Иначе добавляем в массив изображений
        const newImages = [...(editingProduct.images || [editingProduct.image])];
        if (!newImages.includes(imageUrl)) {
          newImages.push(imageUrl);
          setEditingProduct({ ...editingProduct, images: newImages });
        }
      }
      
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
  
  // Обработчик добавления спецификации
  const handleAddSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };
  
  // Обработчик изменения спецификации
  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };
  
  // Обработчик удаления спецификации
  const handleRemoveSpecification = (index: number) => {
    const newSpecs = [...specifications];
    newSpecs.splice(index, 1);
    setSpecifications(newSpecs);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Управление товарами</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить товар
        </button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {editingProduct && (
        <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isAdding ? 'Добавление нового товара' : 'Редактирование товара'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID товара
              </label>
              <input
                type="text"
                name="id"
                value={editingProduct.id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isAdding}
              />
              <p className="text-xs text-gray-500 mt-1">Например: eng-005, brk-003, etc.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название
              </label>
              <input
                type="text"
                name="name"
                value={editingProduct.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Бренд
              </label>
              <input
                type="text"
                name="brand"
                value={editingProduct.brand}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория
              </label>
              <select
                name="category"
                value={editingProduct.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Выберите категорию</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цена
              </label>
              <input
                type="number"
                name="price"
                value={editingProduct.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Старая цена (для скидки)
              </label>
              <input
                type="number"
                name="oldPrice"
                value={editingProduct.oldPrice || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL основного изображения
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="image"
                  value={editingProduct.image}
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
              <p className="text-xs text-gray-500 mt-1">Это изображение будет использоваться в каталоге и как первое в галерее товара</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Галерея изображений
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {editingProduct.images && editingProduct.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img} alt={`Image ${index}`} className="h-16 w-16 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = editingProduct.images?.filter((_, i) => i !== index);
                        setEditingProduct({...editingProduct, images: newImages});
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-16 w-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-500 transition-colors"
                >
                  <Plus className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Краткое описание
              </label>
              <textarea
                name="description"
                value={editingProduct.description}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Полное описание
              </label>
              <textarea
                name="fullDescription"
                value={editingProduct.fullDescription || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Рейтинг (0-5)
              </label>
              <input
                type="number"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                value={editingProduct.rating || 5}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Количество отзывов
              </label>
              <input
                type="number"
                name="reviews"
                min="0"
                value={editingProduct.reviews || 0}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Спецификации
                </label>
                <button
                  type="button"
                  onClick={handleAddSpecification}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Добавить спецификацию
                </button>
              </div>
              
              {specifications.map((spec, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                    placeholder="Характеристика"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                    placeholder="Значение"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecification(index)}
                    className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={editingProduct.inStock}
                  onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">В наличии</span>
              </label>
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
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Изображение
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Категория
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Цена
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-10 w-10 object-cover rounded-md"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-500 text-xs">Нет фото</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.brand}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {categories.find(c => c.id === product.category)?.name || product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">€{product.price.toFixed(2)}</div>
                    {product.oldPrice && (
                      <div className="text-sm text-gray-500 line-through">€{product.oldPrice.toFixed(2)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.inStock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'В наличии' : 'Нет в наличии'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Pencil className="h-4 w-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Нет товаров, соответствующих критериям поиска
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}