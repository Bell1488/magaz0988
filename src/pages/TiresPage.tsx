import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';

// Типы шин
const tireTypes = [
  { id: 'summer', name: 'Verano' },
  { id: 'winter', name: 'Invierno' },
  { id: 'allseason', name: 'Todo tiempo' }
];

// Размеры шин
const tireSizes = [
  { id: '195-65-r15', name: '195/65 R15' },
  { id: '205-55-r16', name: '205/55 R16' },
  { id: '225-45-r17', name: '225/45 R17' },
  { id: '235-40-r18', name: '235/40 R18' },
  { id: '245-45-r19', name: '245/45 R19' }
];

// Бренды шин
const tireBrands = [
  { id: 'michelin', name: 'Michelin' },
  { id: 'continental', name: 'Continental' },
  { id: 'bridgestone', name: 'Bridgestone' },
  { id: 'pirelli', name: 'Pirelli' },
  { id: 'goodyear', name: 'Goodyear' }
];

// Данные о шинах
const tires = [
  {
    id: 'tire-001',
    name: 'Michelin Primacy 4',
    brand: 'Michelin',
    size: '205/55 R16',
    type: 'summer',
    price: 89.99,
    oldPrice: 105.99,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
    description: 'Neumático de verano de alta gama con excelente rendimiento en mojado'
  },
  {
    id: 'tire-002',
    name: 'Continental WinterContact TS 860',
    brand: 'Continental',
    size: '195/65 R15',
    type: 'winter',
    price: 75.50,
    oldPrice: null,
    rating: 4.6,
    reviews: 98,
    image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
    description: 'Neumático de invierno con excelente tracción en nieve y hielo'
  },
  {
    id: 'tire-003',
    name: 'Bridgestone Weather Control A005',
    brand: 'Bridgestone',
    size: '225/45 R17',
    type: 'allseason',
    price: 95.99,
    oldPrice: 110.50,
    rating: 4.5,
    reviews: 87,
    image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
    description: 'Neumático para todo tiempo con rendimiento equilibrado en todas las condiciones'
  },
  {
    id: 'tire-004',
    name: 'Pirelli P Zero',
    brand: 'Pirelli',
    size: '235/40 R18',
    type: 'summer',
    price: 120.99,
    oldPrice: 135.99,
    rating: 4.7,
    reviews: 112,
    image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: false,
    description: 'Neumático deportivo de alto rendimiento para vehículos potentes'
  },
  {
    id: 'tire-005',
    name: 'Goodyear UltraGrip 9',
    brand: 'Goodyear',
    size: '205/55 R16',
    type: 'winter',
    price: 82.50,
    oldPrice: 92.99,
    rating: 4.4,
    reviews: 76,
    image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
    description: 'Neumático de invierno con excelente agarre en condiciones frías'
  },
  {
    id: 'tire-006',
    name: 'Michelin CrossClimate 2',
    brand: 'Michelin',
    size: '245/45 R19',
    type: 'allseason',
    price: 135.99,
    oldPrice: null,
    rating: 4.9,
    reviews: 65,
    image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
    description: 'Neumático premium para todo tiempo con certificación de invierno'
  }
];

export default function TiresPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Фильтрация шин
  const filteredTires = tires.filter(tire => {
    // Фильтр по поиску
    if (searchQuery && !tire.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !tire.brand.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Фильтр по типу
    if (selectedType && tire.type !== selectedType) {
      return false;
    }
    
    // Фильтр по размеру
    if (selectedSize && !tire.size.includes(selectedSize.replace('-', '/').replace('-', ' '))) {
      return false;
    }
    
    // Фильтр по бренду
    if (selectedBrand && tire.brand.toLowerCase() !== selectedBrand) {
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
              <h1 className="text-3xl font-bold text-gray-900">Neumáticos</h1>
              <p className="text-gray-600 mt-2">Encuentra los neumáticos perfectos para tu vehículo</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por marca o modelo..."
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar filters */}
          <div className={`md:w-64 bg-white p-6 rounded-lg shadow-md ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipo de neumático</h3>
              <div className="space-y-2">
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="tireType"
                      value=""
                      checked={selectedType === ''}
                      onChange={() => setSelectedType('')}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Todos</span>
                  </label>
                </div>
                {tireTypes.map(type => (
                  <div key={type.id}>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="tireType"
                        value={type.id}
                        checked={selectedType === type.id}
                        onChange={() => setSelectedType(type.id)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">{type.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tamaño</h3>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los tamaños</option>
                {tireSizes.map(size => (
                  <option key={size.id} value={size.id}>{size.name}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Marca</h3>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las marcas</option>
                {tireBrands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => {
                setSelectedType('');
                setSelectedSize('');
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
                {filteredTires.length} {filteredTires.length === 1 ? 'resultado' : 'resultados'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTires.map(tire => (
                <div key={tire.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={tire.image}
                      alt={tire.name}
                      className="w-full h-48 object-cover"
                    />
                    {tire.oldPrice && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                        -{Math.round((1 - tire.price / tire.oldPrice) * 100)}%
                      </div>
                    )}
                    {!tire.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-medium">Sin stock</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600">{tire.brand}</span>
                      <div className="flex items-center">
                        <span className="text-amber-500">★</span>
                        <span className="text-sm text-gray-600 ml-1">{tire.rating} ({tire.reviews})</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tire.name}</h3>
                    
                    <div className="flex items-center mb-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">{tire.size}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm ml-2">
                        {tireTypes.find(t => t.id === tire.type)?.name}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{tire.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        {tire.oldPrice && (
                          <span className="text-sm text-gray-500 line-through mr-2">€{tire.oldPrice.toFixed(2)}</span>
                        )}
                        <span className="text-xl font-bold text-gray-900">€{tire.price.toFixed(2)}</span>
                      </div>
                      
                      <button
                        disabled={!tire.inStock}
                        className={`px-4 py-2 rounded-lg ${
                          tire.inStock
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        } transition-colors`}
                      >
                        {tire.inStock ? 'Añadir' : 'Agotado'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredTires.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron neumáticos</h3>
                <p className="text-gray-600">Prueba a cambiar los filtros o la búsqueda</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Servicio de neumáticos Elat Store</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Amplio catálogo</h3>
              <p className="text-gray-700">
                Ofrecemos una amplia selección de neumáticos de las mejores marcas para todo tipo de vehículos, desde turismos hasta SUVs y vehículos comerciales.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Entrega rápida</h3>
              <p className="text-gray-700">
                Entrega en toda España en 24-48 horas. También ofrecemos la posibilidad de montaje en talleres asociados.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Asesoramiento experto</h3>
              <p className="text-gray-700">
                Nuestro equipo de expertos está disponible para ayudarte a elegir los neumáticos perfectos para tu vehículo y tus necesidades de conducción.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}