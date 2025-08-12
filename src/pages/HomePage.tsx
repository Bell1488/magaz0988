import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wrench, Settings, X, Upload, Phone, Mail, User, Star, Truck, Shield, Clock } from 'lucide-react';
import RepairRequestModal from '../components/RepairRequestModal';

// Компонент поп-апа для заявки на ремонт
function RepairModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    partName: '',
    description: '',
    images: [] as File[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('partName', formData.partName);
      formDataToSend.append('description', formData.description);
      
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images`, image);
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/repair-requests`, {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        alert('¡Solicitud de reparación enviada con éxito!');
        setFormData({ name: '', email: '', phone: '', partName: '', description: '', images: [] });
        onClose();
      } else {
        alert('Error al enviar la solicitud. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error submitting repair request:', error);
      alert('Error al enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...filesArray] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Solicitud de Reparación</h2>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Teléfono *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Wrench className="h-4 w-4 inline mr-2" />
                Nombre de la pieza *
              </label>
              <input
                type="text"
                required
                value={formData.partName}
                onChange={(e) => setFormData(prev => ({ ...prev, partName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ejemplo: ECU del motor, Sensor de oxígeno..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del problema *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe detalladamente el problema con la pieza..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Upload className="h-4 w-4 inline mr-2" />
                Fotos de la pieza (opcional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {formData.images.length > 0 && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [repairProducts, setRepairProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadRepairProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
        const data = await res.json();
        const repairs = data.filter((p: any) => p.category === 'repair').slice(0, 4);
        setRepairProducts(repairs);
      } catch (e) {
        console.error('Error loading repair products', e);
      }
    };
    loadRepairProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(59,130,246,0.25),transparent),radial-gradient(800px_400px_at_90%_10%,rgba(14,165,233,0.25),transparent)]">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(1000px_300px_at_50%_0%,rgba(255,255,255,0.15),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="e-badge mb-4">ElatNeo — Repuestos y Servicios</div>
              <h1 className="e-heading text-4xl lg:text-6xl mb-6">
                Piezas premium y soluciones técnicas para su coche
              </h1>
              <p className="e-subtle text-lg lg:text-xl mb-8 max-w-xl">
                Compra neumáticos y componentes AdBlue, solicita reparación de módulos electrónicos y
                modificación de firmware — todo en un solo lugar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/catalog" className="e-btn-primary">
                  Ver catálogo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <button onClick={() => setIsRepairModalOpen(true)} className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white/90 border border-white/15 bg-white/5 hover:bg-white/10 transition-all">
                  <Wrench className="mr-2 h-5 w-5" />
                  Solicitar reparación
                </button>
              </div>
            </div>
            <div className="e-card overflow-hidden">
              <img src="/mainpage.png" alt="ElatNeo" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>



      {/* Colecciones destacadas — мозаика */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="e-badge mb-3">Colecciones destacadas</div>
              <h2 className="e-heading text-3xl lg:text-4xl">Encuentre lo que necesita</h2>
            </div>
            <Link to="/catalog" className="hidden md:inline-flex e-btn-primary">Ver todo el catálogo</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Reparación */}
            <Link to="/category/repair" className="group e-card overflow-hidden order-1">
              <div className="relative h-60">
                <img src="/deagnostic.png" alt="Servicio de Reparación" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <h3 className="text-2xl font-bold mb-1">Servicio de Reparación</h3>
                  <p className="text-white/80 text-sm">ECU/TCM y módulos electrónicos. Diagnóstico, reparación, pruebas.</p>
                </div>
              </div>
            </Link>

            {/* Neumáticos */}
            <Link to="/category/tires" className="group e-card overflow-hidden order-2">
              <div className="relative h-60">
                <img src="/neumaticos.png" alt="Neumáticos" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-5 left-5 text-white">
                  <h3 className="text-2xl font-bold mb-1">Neumáticos</h3>
                  <p className="text-white/80 text-sm">Verano, invierno y todo tiempo</p>
                </div>
              </div>
            </Link>

            {/* AdBlue */}
            <Link to="/category/adblue" className="group e-card overflow-hidden order-3">
              <div className="relative h-60">
                <img src="/componentes.png" alt="Componentes AdBlue y SCR" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-5 left-5 text-white">
                  <h3 className="text-2xl font-bold mb-1">Componentes AdBlue y SCR</h3>
                  <p className="text-white/80 text-sm">Inyectores, bombas, sensores y más</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-6 md:hidden text-center">
            <Link to="/catalog" className="e-btn-primary">Ver todo el catálogo</Link>
          </div>
        </div>
      </section>

      {/* Сервис ремонта */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="e-heading text-3xl lg:text-4xl mb-6">
                Servicio de Reparación
              </h2>
              <p className="e-subtle text-lg mb-6">
                Nos especializamos en la reparación de todos los componentes electrónicos del automóvil:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-white/80">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Unidades de control del motor (ECU)
                </li>
                <li className="flex items-center text-white/80">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Sensores de oxígeno y temperatura
                </li>
                <li className="flex items-center text-white/80">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Módulos ABS y ESP
                </li>
                <li className="flex items-center text-white/80">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Unidades de control de transmisión
                </li>
                <li className="flex items-center text-white/80">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Módulos de confort y seguridad
                </li>
                <li className="flex items-center text-white/80">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Diagnóstico y programación
                </li>
              </ul>
              <button onClick={() => setIsRepairModalOpen(true)} className="e-btn-primary">
                <Wrench className="mr-2 h-5 w-5" />
                Solicitar reparación
              </button>
            </div>
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {repairProducts.map((p) => (
                  <Link key={p.id} to={`/product/${p.id}`} className="group e-card overflow-hidden">
                    <div className="aspect-square w-full">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-white/80 line-clamp-2">{p.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4 text-right">
                <Link to="/category/repair" className="inline-flex items-center text-sky-400 hover:text-sky-300 font-semibold">
                  Ver todo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modificación de firmware */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="e-card overflow-hidden">
                <img src="/Modificación de Firmware.png" alt="Modificación de firmware" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <h2 className="e-heading text-3xl lg:text-4xl mb-6">Modificación de Firmware</h2>
              <p className="e-subtle text-lg mb-6">Modificación profesional de firmware para mejorar las características de su automóvil:</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-white/80"><div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>Aumento de potencia y par motor</li>
                <li className="flex items-center text-white/80"><div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>Optimización del consumo de combustible</li>
                <li className="flex items-center text-white/80"><div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>Eliminación de limitadores de velocidad</li>
                <li className="flex items-center text-white/80"><div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>Desactivación de sistemas EGR y DPF</li>
                <li className="flex items-center text-white/80"><div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>Adaptación a nuevos componentes</li>
              </ul>
              <Link to="/firmware-mod" className="e-btn-primary">
                <Settings className="mr-2 h-5 w-5" />
                Solicitar servicio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo trabajamos (timeline) */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="e-heading text-3xl lg:text-4xl mb-4">Cómo trabajamos</h2>
            <p className="e-subtle text-lg">Proceso transparente de servicio y прошивки</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {n: '01', t: 'Solicitud', d: 'Formulario con datos del coche y archivo (si aplica)'},
              {n: '02', t: 'Evaluación', d: 'Diagnóstico técnico y confirmación de viabilidad'},
              {n: '03', t: 'Pago', d: 'Enlace de pago seguro y emisión de orden'},
              {n: '04', t: 'Trabajo', d: 'Reparación/modificación 20–30 min tras confirmación'},
              {n: '05', t: 'Entrega', d: 'Archivo/envío listo por email o descarga'},
            ].map((s) => (
              <div key={s.n} className="e-card p-6">
                <div className="text-sky-400 font-bold">{s.n}</div>
                <h3 className="text-white font-semibold mt-2">{s.t}</h3>
                <p className="text-white/70 text-sm mt-2">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marcas */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {['Mercedes-Benz', 'BMW', 'Audi', 'Toyota', 'Lexus', 'Seat', 'Bosch', 'Varta', 'MANN'].map((b) => (
              <span key={b} className="e-badge">{b}</span>
            ))}
          </div>
        </div>
      </section>

      

      {/* О нас */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="e-heading text-3xl lg:text-4xl mb-4">
              Sobre Nosotros
            </h2>
            <p className="e-subtle text-xl max-w-3xl mx-auto">
              ElatNeo es su socio de confianza para repuestos de automóviles de alta calidad. 
              Con años de experiencia en el sector, ofrecemos soluciones completas para el mantenimiento 
              y reparación de su vehículo.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center e-card p-8">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-glow">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Calidad Garantizada
              </h3>
              <p className="text-white/80">
                Todos nuestros productos provienen de fabricantes reconocidos y cuentan con garantía oficial.
              </p>
            </div>

            <div className="text-center e-card p-8">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-glow">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Envío Rápido
              </h3>
              <p className="text-white/80">
                Entrega en Madrid el mismo día, en España hasta 3 días hábiles.
              </p>
            </div>

            <div className="text-center e-card p-8">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-glow">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Soporte Técnico
              </h3>
              <p className="text-white/80">
                Asesoramiento técnico especializado y servicio de reparación de componentes electrónicos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Поп-ап: единый компонент модалки ремонта */}
      <RepairRequestModal isOpen={isRepairModalOpen} onClose={() => setIsRepairModalOpen(false)} />
    </div>
  );
}