import React, { useState } from 'react';
import { Upload, Send, FileText, Clock, CreditCard, CheckCircle } from 'lucide-react';

const carBrands = [
  { id: 'mercedes', name: 'Mercedes-Benz' },
  { id: 'bmw', name: 'BMW' },
  { id: 'lexus', name: 'Lexus' },
  { id: 'toyota', name: 'Toyota' },
  { id: 'seat', name: 'Seat' }
];

const engineTypes = [
  { id: 'petrol', name: 'Gasolina' },
  { id: 'diesel', name: 'Diésel' },
  { id: 'hybrid', name: 'Híbrido' },
  { id: 'electric', name: 'Eléctrico' }
];

const yearOptions = Array.from({ length: 25 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { id: year.toString(), name: year.toString() };
});

const carModels = {
  mercedes: [
    { id: 'c-class', name: 'Clase C' },
    { id: 'e-class', name: 'Clase E' },
    { id: 's-class', name: 'Clase S' },
    { id: 'glc', name: 'GLC' },
    { id: 'gle', name: 'GLE' }
  ],
  bmw: [
    { id: '3-series', name: 'Serie 3' },
    { id: '5-series', name: 'Serie 5' },
    { id: '7-series', name: 'Serie 7' },
    { id: 'x3', name: 'X3' },
    { id: 'x5', name: 'X5' }
  ],
  lexus: [
    { id: 'is', name: 'IS' },
    { id: 'es', name: 'ES' },
    { id: 'ls', name: 'LS' },
    { id: 'nx', name: 'NX' },
    { id: 'rx', name: 'RX' }
  ],
  toyota: [
    { id: 'corolla', name: 'Corolla' },
    { id: 'camry', name: 'Camry' },
    { id: 'rav4', name: 'RAV4' },
    { id: 'land-cruiser', name: 'Land Cruiser' },
    { id: 'hilux', name: 'Hilux' }
  ],
  seat: [
    { id: 'ibiza', name: 'Ibiza' },
    { id: 'leon', name: 'León' },
    { id: 'ateca', name: 'Ateca' },
    { id: 'tarraco', name: 'Tarraco' },
    { id: 'arona', name: 'Arona' }
  ]
};

export default function FirmwareModPage() {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedEngineType, setSelectedEngineType] = useState('');
  const [ecuType, setEcuType] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
    setSelectedModel('');
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };
  
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };
  
  const handleEngineTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEngineType(e.target.value);
  };
  
  const handleEcuTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEcuType(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Создаем FormData для отправки файла
      const formData = new FormData();
      formData.append('carBrand', selectedBrand);
      formData.append('carModel', selectedModel);
      formData.append('year', selectedYear);
      formData.append('engineType', selectedEngineType);
      formData.append('ecuType', ecuType);
      formData.append('description', description);
      formData.append('customerName', contactInfo.name);
      formData.append('customerEmail', contactInfo.email);
      formData.append('customerPhone', contactInfo.phone);
      
      if (file) {
        formData.append('file', file);
      }
      
      // Отправляем данные на сервер
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/firmware-requests`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        setFormSubmitted(true);
      } else {
        const errorText = await response.text();
        console.error('Error submitting firmware request:', errorText);
        alert('Error al enviar la solicitud. Por favor, inténtelo de nuevo más tarde.');
      }
    } catch (error) {
      console.error('Error submitting firmware request:', error);
      alert('Error al enviar la solicitud. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Solicitud enviada con éxito!</h2>
            <p className="text-gray-600 mb-6">
              Hemos recibido tu solicitud de modificación de firmware. Nuestro equipo técnico la analizará y se pondrá en contacto contigo en breve para confirmar la posibilidad de realizar el servicio y proporcionar información sobre el pago.
            </p>
            <button
              onClick={() => setFormSubmitted(false)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enviar otra solicitud
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Modificación de Firmware</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Servicio remoto para modificación de proshivos de bloques de control del motor y transmisión automática.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cómo funciona nuestro servicio:</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-6 flex">
              <div className="mr-4">
                <FileText className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-3">1. Envío de solicitud</h3>
                <p className="text-gray-700">
                  Completa el formulario con los datos de tu vehículo, describe los cambios deseados y adjunta el archivo de firmware original.
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 flex">
              <div className="mr-4">
                <CheckCircle className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-3">2. Verificación técnica</h3>
                <p className="text-gray-700">
                  Nuestros especialistas analizan tu solicitud y confirman la viabilidad de las modificaciones solicitadas.
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 flex">
              <div className="mr-4">
                <CreditCard className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-3">3. Pago del servicio</h3>
                <p className="text-gray-700">
                  Una vez confirmada la viabilidad, recibirás un enlace para realizar el pago seguro del servicio.
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 flex">
              <div className="mr-4">
                <Clock className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-3">4. Entrega rápida</h3>
                <p className="text-gray-700">
                  En 20-30 minutos después de confirmar el pago, recibirás tu archivo modificado listo para instalar.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
            <p className="text-gray-700">
              <strong>Nota importante:</strong> Nuestro servicio está especializado en la modificación de firmware para bloques de control del motor (ECU) y transmisiones automáticas (TCU). Trabajamos con la mayoría de marcas y modelos europeos, asiáticos y americanos.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Solicita tu modificación personalizada</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca del vehículo *
                </label>
                <select
                  value={selectedBrand}
                  onChange={handleBrandChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar marca</option>
                  {carBrands.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo *
                </label>
                <select
                  value={selectedModel}
                  onChange={handleModelChange}
                  required
                  disabled={!selectedBrand}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Seleccionar modelo</option>
                  {selectedBrand && carModels[selectedBrand as keyof typeof carModels].map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año de fabricación *
                </label>
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar año</option>
                  {yearOptions.map(year => (
                    <option key={year.id} value={year.id}>{year.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de motor *
                </label>
                <select
                  value={selectedEngineType}
                  onChange={handleEngineTypeChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar tipo</option>
                  {engineTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de unidad de control y número de pieza (si se conoce)
              </label>
              <input
                type="text"
                value={ecuType}
                onChange={handleEcuTypeChange}
                placeholder="Ej: Bosch EDC17C46, Continental SID310, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe tu solicitud y objetivos *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                placeholder="Explica qué tipo de modificación necesitas y qué resultados esperas obtener..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivo de firmware actual (opcional)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                    </p>
                    <p className="text-xs text-gray-500">
                      BIN, HEX, o archivos comprimidos (máx. 10MB)
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept=".bin,.hex,.zip,.rar" 
                  />
                </label>
              </div>
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Archivo seleccionado: {file.name}
                </p>
              )}
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de contacto</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={contactInfo.name}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactInfo.email}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enviar solicitud
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}