import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { productId } = useParams();
  const { dispatch } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">
            El producto que estás buscando no existe o ha sido eliminado.
          </p>
          <Link
            to="/catalog"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const addToCart = async () => {
    setAddingToCart(true);
    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images && product.images.length > 0 ? product.images[0] : product.image,
          brand: product.brand
        }
      });
    }
    
    setTimeout(() => {
      setAddingToCart(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-blue-600">Inicio</Link>
          <span className="mx-2">›</span>
          <Link to="/catalog" className="hover:text-blue-600">Catálogo</Link>
          <span className="mx-2">›</span>
          <Link to={`/category/${product.category}`} className="hover:text-blue-600">
            {product.category === 'engine' ? 'Motor' : 
             product.category === 'brakes' ? 'Frenos' :
             product.category === 'suspension' ? 'Suspensión' :
             product.category === 'electrical' ? 'Sistema eléctrico' :
             product.category === 'body' ? 'Carrocería' :
             product.category === 'interior' ? 'Interior' :
             product.category === 'consumables' ? 'Consumibles' :
             product.category === 'tools' ? 'Herramientas' : 'Categoría'}
          </Link>
          <span className="mx-2">›</span>
          <span>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg p-8 mb-4">
              <img
                src={product.images && product.images.length > 0 ? product.images[activeImage] : product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <div className="flex space-x-4">
              {product.images && product.images.length > 0 ? (
                product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    activeImage === index ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
                ))
              ) : (
                <button
                  className="w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-600"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-lg p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg text-blue-600 font-medium">{product.brand}</span>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="text-sm text-gray-500 mb-4">ID: {product.id}</div>

              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        product.rating && i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg text-gray-600 ml-2">{product.rating || 5.0}</span>
                <span className="text-gray-400 ml-2">({product.reviews || 0} reseñas)</span>
              </div>

              <div className="flex items-center space-x-4 mb-8">
                <span className="text-4xl font-bold text-gray-900">
                  €{product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      €{product.oldPrice.toLocaleString()}
                    </span>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-700 mb-8">{product.fullDescription || product.description}</p>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center space-x-4 mb-8">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={addToCart}
                  className={`flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 ${
                    addingToCart ? 'scale-95 bg-green-600' : ''
                  }`}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {addingToCart ? '¡Añadido al carrito!' : 'Añadir al carrito'}
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Truck className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Envío rápido</p>
                    <p className="text-sm text-gray-600">1-3 días en España</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Garantía</p>
                    <p className="text-sm text-gray-600">12 meses</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="h-6 w-6 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">Devolución</p>
                    <p className="text-sm text-gray-600">14 días</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg p-8 mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Especificaciones</h3>
              <div className="space-y-4">
                {product.specifications ? (
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600">{key}</span>
                      <span className="text-gray-900 font-medium">{value}</span>
                    </div>
                  ))
                ) : (
                  <div className="py-2">
                    <span className="text-gray-600">Información no disponible</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}