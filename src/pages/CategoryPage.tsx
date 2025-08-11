import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CategoryFilters from '../components/CategoryFilters';

// Названия категорий
const categoryNames: Record<string, string> = {
  engine: 'Motor y sistema de alimentación',
  brakes: 'Sistema de frenos',
  suspension: 'Suspensión y dirección',
  electrical: 'Sistema eléctrico',
  body: 'Carrocería',
  interior: 'Interior y confort',
  consumables: 'Consumibles',
  tools: 'Herramientas y equipos',
  tires: 'Neumáticos',
  adblue: 'Componentes AdBlue y SCR',
  repair: 'Servicio de Reparación'
};

export default function CategoryPage() {
  const { categoryId } = useParams();
  const { dispatch } = useCart();
  const [sortBy, setSortBy] = useState('popular');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`;
    console.log('Fetching products from:', apiUrl);
    console.log('Category ID:', categoryId);
    
    fetch(apiUrl)
      .then(res => {
        console.log('Response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('Products data:', data);
        const filteredProducts = data.filter((p: any) => p.category === categoryId);
        console.log('Filtered products for category', categoryId, ':', filteredProducts);
        setProducts(filteredProducts);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, [categoryId]);

  const categoryName = categoryNames[categoryId as keyof typeof categoryNames] || 'Categoría';
  
  useEffect(() => {
    // Apply filters to products
    if (Object.keys(activeFilters).length === 0) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product => {
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
  }, [products, activeFilters]);

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
    <div className="min-h-screen">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <nav className="text-sm text-white/60 mb-2">
                <Link to="/" className="hover:text-white">Inicio</Link>
                <span className="mx-2">›</span>
                <Link to="/catalog" className="hover:text-white">Catálogo</Link>
                <span className="mx-2">›</span>
                <span className="text-white">{categoryName}</span>
              </nav>
              <h1 className="e-heading text-3xl">{categoryName}</h1>
              <p className="e-subtle mt-2">{products.length} productos en la categoría</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center px-4 py-2 text-white/80 border border-white/15 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros {Object.values(activeFilters).reduce((count, options) => count + options.length, 0) > 0 && 
                  `(${Object.values(activeFilters).reduce((count, options) => count + options.length, 0)})`}
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-white/15 rounded-lg text-white/80 bg-white/5 hover:bg-white/10 transition-colors"
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
            <div key={product.id} className="e-card hover:shadow-glow transition-all duration-300 overflow-hidden">
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
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-medium">Sin stock</span>
                    </div>
                  )}
                </Link>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-sky-400 font-medium">{product.brand}</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-white/80 ml-1">{product.rating}</span>
                    <span className="text-sm text-white/60 ml-1">({product.reviews})</span>
                  </div>
                </div>
                
                <Link
                  to={`/product/${product.id}`}
                  className="text-lg font-semibold text-white hover:text-sky-300 transition-colors block mb-2"
                >
                  {product.name}
                </Link>
                
                <p className="text-white/80 text-sm mb-4">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-white">
                      €{product.price.toLocaleString()}
                    </span>
                    {product.oldPrice && (
                      <span className="text-lg text-white/60 line-through">
                        €{product.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed ${
                      addingToCart === product.id ? 'scale-95 bg-green-600 text-white' : 'bg-gradient-to-r from-blue-600 to-sky-500 text-white hover:from-blue-500 hover:to-sky-400'
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
            {products.length === 0 ? (
              <p className="text-xl text-white/80">Los productos de esta categoría estarán disponibles pronto</p>
            ) : (
              <p className="text-xl text-white/80">No se encontraron productos que coincidan con los filtros seleccionados</p>
            )}
            <Link
              to="/catalog"
              className="inline-block mt-4 px-6 py-3 e-btn-primary"
            >
              Volver al catálogo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}