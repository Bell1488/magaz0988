import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Grid, List, Filter } from 'lucide-react';
import SearchResults from '../components/SearchResults';

export default function CatalogPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search') || '';
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`)
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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