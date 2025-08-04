import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CategoryFilters from '../components/CategoryFilters';

const products = {
  engine: [
    {
      id: 'eng-001',
      name: 'Filtro de aceite Mann W712/75',
      brand: 'MANN-FILTER',
      price: 45,
      oldPrice: 52,
      rating: 4.8,
      reviews: 124,
      image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Filtro de aceite original para BMW, Mercedes, Audi'
    },
    {
      id: 'eng-002',
      name: 'Filtro de aire Bosch F026400165',
      brand: 'BOSCH',
      price: 89,
      rating: 4.9,
      reviews: 89,
      image: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Filtro de aire de alta calidad para el motor'
    },
    {
      id: 'eng-003',
      name: 'Bomba de combustible Pierburg 7.50000.50.0',
      brand: 'PIERBURG',
      price: 125,
      rating: 4.7,
      reviews: 56,
      image: 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: false,
      description: 'Bomba de combustible eléctrica para sistema de inyección'
    },
    {
      id: 'eng-004',
      name: 'Filtro de combustible Mahle KL228/2D',
      brand: 'MAHLE',
      price: 38,
      rating: 4.6,
      reviews: 78,
      image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Filtro de combustible de alta eficiencia para motores diésel'
    },
    {
      id: 'eng-005',
      name: 'Sensor de presión de aceite Hella 6PP010324-021',
      brand: 'HELLA',
      price: 65,
      rating: 4.5,
      reviews: 42,
      image: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Sensor de presión de aceite para sistemas de monitorización del motor'
    }
  ],
  suspension: [
    {
      id: 'sus-001',
      name: 'Amortiguador Bilstein B4 22-045633',
      brand: 'BILSTEIN',
      price: 180,
      rating: 4.7,
      reviews: 89,
      image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Amortiguador delantero para suspensión deportiva'
    },
    {
      id: 'sus-002',
      name: 'Muelle de suspensión Sachs 994 084',
      brand: 'SACHS',
      price: 65,
      rating: 4.6,
      reviews: 52,
      image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Muelle helicoidal para suspensión trasera'
    },
    {
      id: 'sus-003',
      name: 'Kit de suspensión KYB 935604',
      brand: 'KYB',
      price: 210,
      oldPrice: 250,
      rating: 4.8,
      reviews: 74,
      image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Kit completo de suspensión con amortiguadores y muelles'
    }
  ],
  electrical: [
    {
      id: 'elec-001',
      name: 'Batería Bosch S5 008 77Ah',
      brand: 'BOSCH',
      price: 95,
      rating: 4.6,
      reviews: 156,
      image: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Batería de arranque 12V 77Ah 780A'
    },
    {
      id: 'elec-002',
      name: 'Alternador Valeo 439656',
      brand: 'VALEO',
      price: 245,
      oldPrice: 280,
      rating: 4.7,
      reviews: 83,
      image: 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Alternador 14V 150A para vehículos europeos'
    },
    {
      id: 'elec-003',
      name: 'Kit de bujías NGK LZKR6B-10E',
      brand: 'NGK',
      price: 42,
      rating: 4.9,
      reviews: 215,
      image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Set de 4 bujías de encendido de iridio para motores de gasolina'
    }
  ],
  body: [
    {
      id: 'body-001',
      name: 'Faro delantero Hella 1EL 008 880-811',
      brand: 'HELLA',
      price: 245,
      rating: 4.5,
      reviews: 67,
      image: 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Faro delantero derecho con regulación eléctrica'
    },
    {
      id: 'body-002',
      name: 'Paragolpes delantero Magneti Marelli 021316900010',
      brand: 'MAGNETI MARELLI',
      price: 185,
      rating: 4.4,
      reviews: 38,
      image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Paragolpes delantero completo con rejillas'
    }
  ],
  interior: [
    {
      id: 'int-001',
      name: 'Filtro de habitáculo Mann CU 2545',
      brand: 'MANN-FILTER',
      price: 28,
      rating: 4.4,
      reviews: 92,
      image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Filtro de aire del habitáculo con carbón activo'
    },
    {
      id: 'int-002',
      name: 'Compresor de aire acondicionado Valeo 813144',
      brand: 'VALEO',
      price: 320,
      oldPrice: 380,
      rating: 4.6,
      reviews: 45,
      image: 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Compresor de climatización para sistemas R134a'
    }
  ],
  consumables: [
    {
      id: 'cons-001',
      name: 'Aceite motor Castrol GTX 5W-30 5L',
      brand: 'CASTROL',
      price: 42,
      rating: 4.8,
      reviews: 234,
      image: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Aceite sintético para motor gasolina y diésel'
    },
    {
      id: 'cons-002',
      name: 'Líquido de frenos Motul DOT 5.1 500ml',
      brand: 'MOTUL',
      price: 18,
      rating: 4.9,
      reviews: 156,
      image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Líquido de frenos sintético de alto rendimiento'
    }
  ],
  tools: [
    {
      id: 'tool-001',
      name: 'Juego llaves combinadas Gedore 6-22mm',
      brand: 'GEDORE',
      price: 89,
      rating: 4.9,
      reviews: 45,
      image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Set de 12 llaves combinadas cromadas'
    },
    {
      id: 'tool-002',
      name: 'Gato hidráulico Hazet 2171N',
      brand: 'HAZET',
      price: 175,
      oldPrice: 195,
      rating: 4.8,
      reviews: 67,
      image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Gato hidráulico de 3 toneladas para elevación de vehículos'
    }
  ],
  brakes: [
    {
      id: 'brk-001',
      name: 'Pastillas de freno Brembo P50088',
      brand: 'BREMBO',
      price: 32,
      oldPrice: 35,
      rating: 4.9,
      reviews: 203,
      image: 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Pastillas de freno delanteras para conducción deportiva'
    },
    {
      id: 'brk-002',
      name: 'Disco de freno Zimmermann 600.3243.20',
      brand: 'ZIMMERMANN',
      price: 45,
      rating: 4.8,
      reviews: 145,
      image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Disco de freno ventilado, diámetro 320mm'
    },
    {
      id: 'brk-003',
      name: 'Pinza de freno TRW BHW357E',
      brand: 'TRW',
      price: 120,
      rating: 4.7,
      reviews: 68,
      image: 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Pinza de freno delantera izquierda remanufacturada'
    },
    {
      id: 'brk-004',
      name: 'Kit de frenos ATE 13.0460-7103.2',
      brand: 'ATE',
      price: 195,
      oldPrice: 220,
      rating: 4.8,
      reviews: 112,
      image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
      inStock: true,
      description: 'Kit completo con discos y pastillas para eje delantero'
    }
  ],
};

const categoryNames = {
  engine: 'Motor y sistema de alimentación',
  brakes: 'Sistema de frenos',
  suspension: 'Suspensión y dirección',
  electrical: 'Sistema eléctrico',
  body: 'Carrocería',
  interior: 'Interior y confort',
  consumables: 'Consumibles',
  tools: 'Herramientas y equipos'
};

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { dispatch } = useCart();
  const [sortBy, setSortBy] = useState('popular');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка товаров для выбранной категории
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
        if (response.ok) {
          const allProducts = await response.json();
          // Фильтруем продукты по категории
          const productsInCategory = allProducts.filter((p: any) => p.category === categoryId);
          if (productsInCategory.length > 0) {
            setCategoryProducts(productsInCategory);
            setFilteredProducts(productsInCategory);
          } else {
            // Если на сервере нет товаров для этой категории, используем локальные данные
            const fallbackProducts = products[categoryId as keyof typeof products] || [];
            setCategoryProducts(fallbackProducts);
            setFilteredProducts(fallbackProducts);
          }
        } else {
          console.error('Error fetching products:', await response.text());
          // Используем локальные данные в случае ошибки
          const fallbackProducts = products[categoryId as keyof typeof products] || [];
          setCategoryProducts(fallbackProducts);
          setFilteredProducts(fallbackProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Используем локальные данные в случае ошибки
        const fallbackProducts = products[categoryId as keyof typeof products] || [];
        setCategoryProducts(fallbackProducts);
        setFilteredProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const categoryName = categoryNames[categoryId as keyof typeof categoryNames] || 'Categoría';
  
  useEffect(() => {
    // Apply filters to products
    if (Object.keys(activeFilters).length === 0) {
      setFilteredProducts(categoryProducts);
      return;
    }

    const filtered = categoryProducts.filter(product => {
      // Check if product matches all active filters
      for (const [groupId, selectedOptions] of Object.entries(activeFilters)) {
        if (selectedOptions.length === 0) continue;
        
        // For demonstration, we'll use simple matching based on product properties
        // In a real app, you'd have more structured data
        switch (groupId) {
          case 'brand':
            if (selectedOptions.length > 0 && !selectedOptions.includes(product.brand.toLowerCase())) {
              return false;
            }
            break;
          case 'price':
            const price = product.price;
            let priceMatch = false;
            
            for (const option of selectedOptions) {
              if (
                (option === 'under-50' && price < 50) ||
                (option === '50-100' && price >= 50 && price <= 100) ||
                (option === '100-200' && price > 100 && price <= 200) ||
                (option === 'over-200' && price > 200)
              ) {
                priceMatch = true;
                break;
              }
            }
            
            if (!priceMatch) return false;
            break;
          // Add more filter types as needed
        }
      }
      return true;
    });

    setFilteredProducts(filtered);
  }, [categoryProducts, activeFilters]);

  const addToCart = async (product: any) => {
    setAddingToCart(product.id);
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand
      }
    });
    
    setTimeout(() => {
      setAddingToCart(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <nav className="text-sm text-gray-500 mb-2">
                <Link to="/" className="hover:text-blue-600">Inicio</Link>
                <span className="mx-2">›</span>
                <Link to="/catalog" className="hover:text-blue-600">Catálogo</Link>
                <span className="mx-2">›</span>
                <span>{categoryName}</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
              <p className="text-gray-600 mt-2">{categoryProducts.length} productos en la categoría</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros {Object.values(activeFilters).reduce((count, options) => count + options.length, 0) > 0 && 
                  `(${Object.values(activeFilters).reduce((count, options) => count + options.length, 0)})`}
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <option value="popular">Por popularidad</option>
                <option value="price-asc">Por precio: más baratos</option>
                <option value="price-desc">Por precio: más caros</option>
                <option value="rating">Por valoración</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryFilters 
          isOpen={isFilterOpen} 
          onClose={() => setIsFilterOpen(false)} 
          categoryId={categoryId || ''}
          onFilterChange={setActiveFilters}
          activeFilters={activeFilters}
        />
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                    <span className="text-sm text-gray-400 ml-1">({product.reviews})</span>
                  </div>
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
        )}
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            {categoryProducts.length === 0 ? (
              <p className="text-xl text-gray-600">Los productos de esta categoría estarán disponibles pronto</p>
            ) : (
              <p className="text-xl text-gray-600">No se encontraron productos que coincidan con los filtros seleccionados</p>
            )}
            <Link
              to="/catalog"
              className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver al catálogo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}