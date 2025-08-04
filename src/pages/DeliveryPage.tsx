import React from 'react';
import { Truck, Clock, MapPin, CreditCard, Shield, Phone } from 'lucide-react';

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Envío y pago</h1>
          <p className="text-xl text-gray-600">
            Formas cómodas de recibir y pagar tus pedidos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Delivery Options */}
          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="flex items-center mb-6">
              <Truck className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Métodos de envío</h2>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Envío a domicilio</h3>
                  <span className="text-green-600 font-semibold">Gratis</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>1-3 días laborables</span>
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Madrid y área metropolitana</span>
                </div>
                <p className="text-gray-700">
                  La entrega se realiza por servicio de mensajería hasta la puerta.
                  Llamada previa una hora antes de la entrega.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Correos</h3>
                  <span className="text-blue-600 font-semibold">desde €5</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>5-14 días laborables</span>
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Por toda España</span>
                </div>
                <p className="text-gray-700">
                  Entrega en oficina de Correos o a domicilio.
                  Envío gratuito en pedidos superiores a €100.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Recogida en tienda</h3>
                  <span className="text-green-600 font-semibold">Gratis</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>El mismo día</span>
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Metro Gran Vía</span>
                </div>
                <p className="text-gray-700">
                  Puedes recoger tu pedido en nuestra tienda en:
                  Madrid, Calle Gran Vía, 123. Horario de 9:00 a 19:00.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="flex items-center mb-6">
              <CreditCard className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Métodos de pago</h2>
            </div>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tarjeta bancaria</h3>
                <p className="text-gray-700 mb-3">
                  Pago con tarjetas Visa, MasterCard a través de sistema de pago seguro.
                </p>
                <div className="flex items-center text-green-600">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="text-sm">Transacción SSL protegida</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Efectivo al repartidor</h3>
                <p className="text-gray-700">
                  Al recibir el pedido puedes pagar en efectivo o con tarjeta
                  a través del terminal móvil del repartidor.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Transferencia bancaria</h3>
                <p className="text-gray-700">
                  Para empresas. Después de realizar el pedido emitiremos factura
                  para pago por transferencia bancaria.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contra reembolso</h3>
                <p className="text-gray-700">
                  Con envío por Correos puedes pagar el pedido al recibirlo
                  en la oficina postal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Garantía de calidad</h3>
            <p className="text-gray-600">
              Todos los productos tienen garantía oficial del fabricante
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <Truck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Envío rápido</h3>
            <p className="text-gray-600">
              Enviamos pedidos el mismo día si hay stock disponible
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Soporte 24/7</h3>
            <p className="text-gray-600">
              Nuestros asesores están listos para ayudarte con la selección y pedidos
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 bg-blue-600 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">¿Tienes alguna pregunta?</h3>
          <p className="text-blue-100 text-lg mb-6">
            Contacta con nosotros de la forma que prefieras
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              <span>+34 900 123 456</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>Madrid, Calle Gran Vía, 123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}