import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const { state, dispatch } = useCart();
  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  
  // Simulate order data from checkout form
  const orderData = location.state?.orderData || {
    firstName: 'Cliente',
    lastName: 'Ejemplo',
    email: 'cliente@ejemplo.com',
    phone: '+34 600 123 456',
    address: 'Calle Gran Vía, 123',
    city: 'Madrid',
    postalCode: '28013',
    paymentMethod: 'card',
    deliveryMethod: 'courier'
  };

  // Clear cart after confirmation
  React.useEffect(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Gracias por tu pedido!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Tu pedido #{orderNumber} ha sido recibido
          </p>
          <p className="text-gray-600">
            Hemos enviado la confirmación a {orderData.email}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Detalles del pedido</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Package className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Productos</h3>
                <div className="mt-2 space-y-3">
                  {state.items.length > 0 ? (
                    state.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.quantity} × €{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">Gracias por tu compra</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Truck className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Método de envío</h3>
                <p className="text-gray-600 mt-1">
                  {orderData.deliveryMethod === 'courier' 
                    ? 'Envío a domicilio (1-3 días)' 
                    : 'Recogida en tienda (hoy)'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Home className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Dirección de entrega</h3>
                <p className="text-gray-600 mt-1">
                  {orderData.firstName} {orderData.lastName}<br />
                  {orderData.address}<br />
                  {orderData.city}, {orderData.postalCode}<br />
                  {orderData.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-2">¿Qué ocurre ahora?</h3>
          <p className="text-gray-600">
            Procesaremos tu pedido lo antes posible. Recibirás un correo electrónico 
            con los detalles del seguimiento cuando tu pedido sea enviado.
          </p>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a la tienda
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}