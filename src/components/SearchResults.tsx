import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../utils/api';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice: number | null;
  description: string;
  image: string;
  inStock: boolean;
  rating?: number;
  reviews?: number;
}

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    const searchProducts = async () => {
      try {
        setLoading(true);
        // Получаем все продукты с сервера
        const products = await api.getAll('products');
        
        // Фильтруем продукты по поисковому запросу
        const filteredProducts = products.filter((product: Product) => {
          const searchTerms = query.toLowerCase().split(' ');
          const productText = `${product.name} ${product.brand} ${product.description} ${product.category}`.toLowerCase();
          
          // Проверяем, содержит ли продукт все слова из запроса
          return searchTerms.every(term => productText.includes(term));
        });
        
        setResults(filteredProducts);
      } catch (error) {
        console.error('Error searching products:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    searchProducts();
  }, [query]);

  const addToCart = (product: Product) => {
    setAddingToCart(product.id);
    
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        quantity: 1
      }
    });
    
    setTimeout(() => {
      setAddingToCart(null);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No se encontraron resultados para "{query}"
        </h2>
        <p className="text-gray-600 mb-8">
          Intenta con otros términos de búsqueda o navega por nuestras categorías.
        </p>
        <Link
          to="/catalog"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ver todas las categorías
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Resultados para "{query}"
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative">
              <Link to={`/product/${product.id}`}>
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
              </Link>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-600 font-medium">{product.brand}</span>
                {product.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                    <span className="text-sm text-gray-400 ml-1">({product.reviews || 0})</span>
                  </div>
                )}
              </div>
              
              <Link
                to={`/product/${product.id}`}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors block mb-2"
              >
                {product.name}
              </Link>
              
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    €{product.price.toLocaleString()}
                  </span>
                  {product.oldPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      €{product.oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                  className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed ${
                    addingToCart === product.id ? 'scale-95 bg-green-600' : ''
                  }`}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {addingToCart === product.id ? '¡Añadido!' : product.inStock ? 'Añadir' : 'Sin stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}