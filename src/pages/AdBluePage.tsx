import React, { useState } from 'react';
import { Filter, Search, Truck, ShieldCheck, HelpCircle } from 'lucide-react';

// Категории компонентов AdBlue
const adBlueCategories = [
  { id: 'injectors', name: 'Inyectores AdBlue' },
  { id: 'pumps', name: 'Bombas AdBlue' },
  { id: 'tanks', name: 'Depósitos y sensores' },
  { id: 'nox', name: 'Sensores NOx' },
  { id: 'controllers', name: 'Módulos de control SCR' },
  { id: 'liquid', name: 'Líquido AdBlue' }
];

// Бренды компонентов AdBlue
const adBlueBrands = [
  { id: 'bosch', name: 'Bosch' },
  { id: 'continental', name: 'Continental' },
  { id: 'denso', name: 'Denso' },
  { id: 'vdo', name: 'VDO' },
  { id: 'delphi', name: 'Delphi' }
];

// Данные о компонентах AdBlue
const adBlueProducts = [
  {
    id: 'adblue-001',
    name: 'Inyector AdBlue Bosch 0444025024',
    brand: 'Bosch',
    category: 'injectors',
    price: 189.99,
    oldPrice: 215.50,
    rating: 4.7,
    reviews: 32,
    image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
    description: 'Inyector de AdBlue original para motores diésel Euro 6',
    compatibility: ['Mercedes-Benz', 'BMW', 'Audi']
  },
  {
    id: 'adblue-002',
    name: 'Bomba de dosificación AdBlue Continental A2C59517051',
    brand: 'Continental',
    category: 'pumps',
    price: 245.99,
    oldPrice: null,
    rating: 4.8,
    reviews: 24,
    image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
    description: 'Bomba de dosificación para sistemas SCR de vehículos diésel',
    compatibility: ['Volvo', 'Renault', 'DAF']
  },
  {
    id: 'adblue-003',
    name: 'Sensor NOx Denso DOX-0321',
    brand: 'Denso',
    category: 'nox',
    price: 175.50,
    oldPrice: 195.99,
    rating: 4.6,
    reviews: 18,
    image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: false,
    description: 'Sensor de óxidos de nitrógeno para sistemas de control de emisiones',
    compatibility: ['Toyota', 'Lexus', 'Mazda']
  },
  {
    id: 'adblue-004',
    name: 'Depósito AdBlue VDO A2C53436794',
    brand: 'VDO',
    category: 'tanks',
    price: 320.99,
    oldPrice: 365.50,
    rating: 4.5,
    reviews: 15,
    image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
    description: 'Depósito completo con bomba y sensor de nivel para AdBlue',
    compatibility: ['Mercedes-Benz', 'Volkswagen', 'Audi']
  },
  {
    id: 'adblue-005',
    name: 'Módulo de control SCR Delphi 28357660',
    brand: 'Delphi',
    category: 'controllers',
    price: 289.99,
    oldPrice: null,
    rating: 4.9,
    reviews: 12,
    image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
    description: 'Unidad de control electrónico para sistema SCR',
    compatibility: ['Peugeot', 'Citroën', 'Opel']
  },
  {
    id: 'adblue-006',
    name: 'Líquido AdBlue 10L',
    brand: 'Bosch',
    category: 'liquid',
    price: 19.99,
    oldPrice: 22.50,
    rating: 4.8,
    reviews: 45,
    image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
    description: 'Solución de urea al 32.5% para sistemas SCR de vehículos diésel',
    compatibility: ['Todos los vehículos con sistema SCR']
  }
];

export default function AdBluePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Фильтрация продуктов
  const filteredProducts = adBlueProducts.filter(product => {
    // Фильтр по поиску
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !product.brand.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Фильтр по категории
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    
    // Фильтр по бренду
    if (selectedBrand && product.brand.toLowerCase() !== selectedBrand) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Componentes AdBlue y SCR</h1>
              <p className="text-gray-600 mt-2">Repuestos y accesorios para sistemas de reducción catalítica selectiva</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar componentes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <ShieldCheck className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Componentes originales</h3>
                <p className="text-sm text-gray-600">Garantía de calidad y compatibilidad</p>
              </div>
            </div>
            
            <div className="flex items-center mb-4 md:mb-0">
              <Truck className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Envío en 24-48h</h3>
                <p className="text-sm text-gray-600">A toda la península</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <HelpCircle className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Soporte técnico</h3>
                <p className="text-sm text-gray-600">Asesoramiento especializado</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar filters */}
          <div className={`md:w-64 bg-white p-6 rounded-lg shadow-md ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorías</h3>
              <div className="space-y-2">
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Todas las categorías</span>
                  </label>
                </div>
                {adBlueCategories.map(category => (
                  <div key={category.id}>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">{category.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Marca</h3>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las marcas</option>
                {adBlueBrands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedBrand('');
                setSearchQuery('');
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'resultado' : 'resultados'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.oldPrice && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                        -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-medium">Sin stock</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600">{product.brand}</span>
                      <div className="flex items-center">
                        <span className="text-amber-500">★</span>
                        <span className="text-sm text-gray-600 ml-1">{product.rating} ({product.reviews})</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    
                    <div className="mb-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        {adBlueCategories.find(c => c.id === product.category)?.name}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Compatible con:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {product.compatibility.map((brand, index) => (
                          <span key={index} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        {product.oldPrice && (
                          <span className="text-sm text-gray-500 line-through mr-2">€{product.oldPrice.toFixed(2)}</span>
                        )}
                        <span className="text-xl font-bold text-gray-900">€{product.price.toFixed(2)}</span>
                      </div>
                      
                      <button
                        disabled={!product.inStock}
                        className={`px-4 py-2 rounded-lg ${
                          product.inStock
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        } transition-colors`}
                      >
                        {product.inStock ? 'Añadir' : 'Agotado'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
                <p className="text-gray-600">Prueba a cambiar los filtros o la búsqueda</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">¿Qué es el sistema AdBlue/SCR?</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <p className="text-gray-700 mb-4">
              El sistema SCR (Reducción Catalítica Selectiva) es una tecnología utilizada en vehículos diésel para reducir las emisiones de óxidos de nitrógeno (NOx). El AdBlue es un líquido compuesto por urea y agua desmineralizada que se inyecta en los gases de escape para convertir los NOx en nitrógeno y vapor de agua.
            </p>
            <p className="text-gray-700">
              En Elat Store ofrecemos todos los componentes necesarios para el mantenimiento y reparación de sistemas SCR, desde inyectores y bombas hasta sensores NOx y módulos de control. Todos nuestros productos son de alta calidad y compatibles con las principales marcas de vehículos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Ventajas del sistema SCR</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Reducción de emisiones de NOx hasta un 90%</li>
                <li>Cumplimiento de normativas Euro 6</li>
                <li>Menor consumo de combustible</li>
                <li>Mayor vida útil del motor</li>
                <li>Mejor rendimiento del vehículo</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Síntomas de problemas en el sistema SCR</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Testigo de AdBlue encendido en el cuadro</li>
                <li>Mensajes de advertencia sobre calidad de AdBlue</li>
                <li>Limitación de potencia del motor</li>
                <li>Aumento del consumo de AdBlue</li>
                <li>Fallos en la inspección técnica por emisiones</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}