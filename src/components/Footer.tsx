import React from 'react';
import { Settings, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/elat-logo-final.png" alt="ElatNeo" className="h-10 w-auto" />
            </div>
            <p className="text-blue-200 mb-4">
              Tu taller y tienda de confianza: piezas de calidad y servicio técnico de primera.
              Enviamos a toda España con plazos muy ágiles.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces útiles</h3>
            <ul className="space-y-2">
              <li><a href="/catalog" className="text-blue-200 hover:text-white transition-colors">Catálogo</a></li>
              <li><a href="/category/repair" className="text-blue-200 hover:text-white transition-colors">Servicio de reparación</a></li>
              <li><a href="/firmware-mod" className="text-blue-200 hover:text-white transition-colors">Modificación de firmware</a></li>
              <li><a href="/delivery" className="text-blue-200 hover:text-white transition-colors">Envíos y métodos de pago</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li><a href="/category/engine" className="text-blue-200 hover:text-white transition-colors">Motor</a></li>
              <li><a href="/category/brakes" className="text-blue-200 hover:text-white transition-colors">Frenos</a></li>
              <li><a href="/category/suspension" className="text-blue-200 hover:text-white transition-colors">Suspensión</a></li>
              <li><a href="/category/electrical" className="text-blue-200 hover:text-white transition-colors">Eléctrico</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-blue-200">+34 900 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-blue-200">info@autorepuestos.es</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-blue-200">C/ de Garcia Gutierrez, 3, 03013 Alacant, Alicante</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 text-center">
          <p className="text-blue-200">© 2025 ElatNeo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}