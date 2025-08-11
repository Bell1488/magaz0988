import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Загружаем только нужные категории
    const mainCategories: Category[] = [
      {
        id: 'tires',
        name: 'Neumáticos',
        description: 'Neumáticos de verano, invierno y todo tiempo para todas las marcas de vehículos',
        image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
        productCount: 150
      },
      {
        id: 'adblue',
        name: 'Componentes AdBlue y SCR',
        description: 'Sistemas de limpieza de gases de escape y componentes para cumplimiento de normativas Euro 6',
        image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800',
        productCount: 75
      },
      {
        id: 'repair',
        name: 'Servicio de Reparación',
        description: 'Reparación profesional de ECUs/TCMs y módulos electrónicos (Mercedes, Audi, VW...)',
        image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=800',
        productCount: 4
      }
    ];
    
    setCategories(mainCategories);
    setLoading(false);
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="e-heading text-3xl lg:text-4xl mb-4">
              Catálogo de Productos
            </h1>
            <p className="e-subtle text-xl mb-8">
              Encuentre los repuestos que necesita para su vehículo
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Buscar categorías..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group e-card overflow-hidden"
            >
              <div className="relative h-64">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-white/70">{category.productCount} productos disponibles</p>
                </div>
              </div>
              <div className="p-6">
                <p className="e-subtle mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-sky-400 font-semibold">
                  Ver productos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Category Descriptions */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Neumáticos Description */}
          <div className="e-card p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Neumáticos</h3>
            <div className="space-y-4 text-white/80">
              <p>
                Ofrecemos una amplia gama de neumáticos para todas las estaciones y condiciones de conducción:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span><strong>Neumáticos de verano:</strong> Optimizados para temperaturas cálidas y superficies secas</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span><strong>Neumáticos de invierno:</strong> Diseñados para nieve, hielo y temperaturas bajas</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span><strong>Neumáticos todo tiempo:</strong> Versátiles para uso durante todo el año</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span><strong>Neumáticos de alto rendimiento:</strong> Para vehículos deportivos y de lujo</span>
                </li>
              </ul>
              <p className="mt-4">
                Todas nuestras marcas incluyen: Michelin, Continental, Pirelli, Bridgestone, Goodyear y más.
              </p>
            </div>
          </div>

          {/* AdBlue Description */}
          <div className="e-card p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Componentes AdBlue y SCR</h3>
            <div className="space-y-4 text-white/80">
              <p>
                Sistemas completos para la reducción de emisiones y cumplimiento de normativas ambientales:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span><strong>Líquido AdBlue:</strong> Solución de urea para sistemas SCR</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span><strong>Inyectores AdBlue:</strong> Componentes de inyección precisos</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span><strong>Sensores NOx:</strong> Monitoreo de emisiones en tiempo real</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  <span><strong>Bombas de dosificación:</strong> Control preciso del flujo de AdBlue</span>
                </li>
              </ul>
              <p className="mt-4">
                Compatible con vehículos Euro 4, Euro 5 y Euro 6. Cumple con la norma ISO 22241.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-blue-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">¿No encuentra lo que busca?</h3>
            <p className="text-blue-100 mb-6">
              Nuestro equipo técnico está disponible para ayudarle a encontrar el repuesto correcto para su vehículo.
            </p>
            <button
              onClick={() => window.location.href = '/#repair'}
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              Contactar con soporte técnico
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}