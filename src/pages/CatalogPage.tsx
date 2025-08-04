import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchResults from '../components/SearchResults';
import { Grid, List, Filter } from 'lucide-react';

// Начальные данные для категорий (будут использоваться, если API недоступен)
const initialCategories = [
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
    id: 'suspension',
    name: 'Suspensión y dirección',
    description: 'Amortiguadores, muelles, rótulas, brazos',
    image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 756
  },
  {
    id: 'electrical',
    name: 'Sistema eléctrico',
    description: 'Baterías, alternadores, motores de arranque, bujías',
    image: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 623
  },
  {
    id: 'body',
    name: 'Carrocería',
    description: 'Paragolpes, aletas, capós, puertas, faros',
    image: 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 445
  },
  {
    id: 'interior',
    name: 'Interior y confort',
    description: 'Asientos, tapicería, climatización, sistemas de audio',
    image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 334
  },
  {
    id: 'consumables',
    name: 'Consumibles',
    description: 'Aceites, líquidos, filtros, correas, escobillas',
    image: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 567
  },
  {
    id: 'tools',
    name: 'Herramientas y equipos',
    description: 'Llaves, extractores, gatos, compresores',
    image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 289
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

export default function CatalogPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(true);
  
  // Загрузка категорий с сервера
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`);
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search');
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Catálogo de repuestos</h1>
              <p className="text-gray-600 mt-2">Selecciona una categoría de productos</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </button>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : searchQuery ? (
          <SearchResults query={searchQuery} />
        ) : (
          /* Categories Grid */
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className={`group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <img
                src={category.image}
                alt={category.name}
                className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                  viewMode === 'grid' ? 'w-full h-48' : 'w-48 h-32'
                }`}
              />
              <div className="p-6 flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {category.count.toLocaleString()} productos
                  </span>
                  <span className="text-blue-600 font-medium group-hover:underline">
                    Ver →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}