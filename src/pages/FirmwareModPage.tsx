import React, { useState } from 'react';
import { Upload, Send, FileText, Clock, CreditCard, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import UiSelect from '../components/UiSelect';

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
  
  const BASE_PRICE = 250;
  const OPTION_PRICE = 50;
  const firmwareOptions = [
    'DPF', 'EGR', 'TVA', 'LAMBDA', 'MAF', 'FLAPS', 'START/STOP', 'ADBLUE', 'READINESS'
  ] as const;
  type FirmwareOption = typeof firmwareOptions[number];
  const [optionsState, setOptionsState] = useState<Record<FirmwareOption, boolean>>({
    DPF: false,
    EGR: false,
    TVA: false,
    LAMBDA: false,
    MAF: false,
    FLAPS: false,
    'START/STOP': false,
    ADBLUE: false,
    READINESS: false,
  });

  const enabledCount = Object.values(optionsState).filter(Boolean).length;
  const totalPrice = BASE_PRICE + OPTION_PRICE * enabledCount;

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
      formData.append('options', JSON.stringify(optionsState));
      formData.append('totalPrice', String(totalPrice));
      
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
      <div className="min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="e-card p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="h-8 w-8 text-green-300" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">¡Solicitud enviada con éxito!</h2>
            <p className="text-white/80 mb-6">
              Hemos recibido tu solicitud de modificación de firmware. Nuestro equipo técnico la analizará y se pondrá en contacto contigo en breve para confirmar la posibilidad de realizar el servicio y proporcionar información sobre el pago.
            </p>
            <button
              onClick={() => setFormSubmitted(false)}
              className="e-btn-primary"
            >
              Enviar otra solicitud
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Modificación de Firmware — ElatNeo | Precio base 250€ + opciones</title>
        <meta name="description" content="Servicio de modificación de firmware para ECU/TCU: potencia, consumo, limitadores, EGR/DPF, AdBlue. Precio base 250€ y opciones adicionales." />
        <link rel="canonical" href="https://elatneo.com/firmware-mod" />
      </Helmet>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="e-heading text-3xl mb-4">Modificación de Firmware</h1>
          <p className="e-subtle text-xl max-w-3xl mx-auto">
            Servicio remoto para modificación de proshivos de bloques de control del motor y transmisión automática.
          </p>
        </div>

        <div className="e-card p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Cómo funciona nuestro servicio:</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-white/10 rounded-lg p-6 flex bg-white/5">
              <div className="mr-4">
                <FileText className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-sky-400 mb-3">1. Envío de solicitud</h3>
                <p className="text-white/80">
                  Completa el formulario con los datos de tu vehículo, describe los cambios deseados y adjunta el archivo de firmware original.
                </p>
              </div>
            </div>
            
            <div className="border border-white/10 rounded-lg p-6 flex bg-white/5">
              <div className="mr-4">
                <CheckCircle className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-sky-400 mb-3">2. Verificación técnica</h3>
                <p className="text-white/80">
                  Nuestros especialistas analizan tu solicitud y confirman la viabilidad de las modificaciones solicitadas.
                </p>
              </div>
            </div>
            
            <div className="border border-white/10 rounded-lg p-6 flex bg-white/5">
              <div className="mr-4">
                <CreditCard className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-sky-400 mb-3">3. Pago del servicio</h3>
                <p className="text-white/80">
                  Una vez confirmada la viabilidad, recibirás un enlace para realizar el pago seguro del servicio.
                </p>
              </div>
            </div>
            
            <div className="border border-white/10 rounded-lg p-6 flex bg-white/5">
              <div className="mr-4">
                <Clock className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-sky-400 mb-3">4. Entrega rápida</h3>
                <p className="text-white/80">
                  En 20-30 minutos después de confirmar el pago, recibirás tu archivo modificado listo para instalar.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <p className="text-white/80">
              <strong>Nota importante:</strong> Nuestro servicio está especializado en la modificación de firmware para bloques de control del motor (ECU) y transmisiones automáticas (TCU). Trabajamos con la mayoría de marcas y modelos europeos, asiáticos y americanos.
            </p>
          </div>
        </div>

        <div className="e-card p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Solicita tu modificación personalizada</h2>

          {/* Pricing controls - switches like screenshot */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-3">
                {(['DPF','EGR','TVA','LAMBDA','MAF'] as FirmwareOption[]).map(key => (
                  <OptionSwitch key={key} label={key} checked={optionsState[key]} onChange={(v)=>setOptionsState(s=>({...s,[key]:v}))} />
                ))}
              </div>
              {/* Right column */}
              <div className="space-y-3">
                {(['FLAPS','START/STOP','ADBLUE','READINESS'] as FirmwareOption[]).map(key => (
                  <OptionSwitch key={key} label={key} checked={optionsState[key]} onChange={(v)=>setOptionsState(s=>({...s,[key]:v}))} />
                ))}
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3">
              <div className="text-white/80">
                Precio base: <span className="font-semibold text-white">€{BASE_PRICE}</span> · Opciones: {enabledCount} × €{OPTION_PRICE}
              </div>
              <div className="text-2xl font-extrabold text-white">Total: €{totalPrice}</div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca del vehículo *
                </label>
                <UiSelect
                  value={selectedBrand}
                  onChange={(v) => setSelectedBrand(v)}
                  options={carBrands}
                  placeholder="Seleccionar marca"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo *
                </label>
                <UiSelect
                  value={selectedModel}
                  onChange={(v) => setSelectedModel(v)}
                  options={selectedBrand ? (carModels as any)[selectedBrand] : []}
                  placeholder="Seleccionar modelo"
                  disabled={!selectedBrand}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año de fabricación *
                </label>
                <UiSelect
                  value={selectedYear}
                  onChange={(v) => setSelectedYear(v)}
                  options={yearOptions}
                  placeholder="Seleccionar año"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de motor *
                </label>
                <UiSelect
                  value={selectedEngineType}
                  onChange={(v) => setSelectedEngineType(v)}
                  options={engineTypes}
                  placeholder="Seleccionar tipo"
                />
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
                 className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
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
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/20 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 text-white/60" />
                    <p className="mb-2 text-sm text-white/80">
                      <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                    </p>
                    <p className="text-xs text-white/70">
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
                <p className="mt-2 text-sm text-white/80">
                  Archivo seleccionado: {file.name}
                </p>
              )}
            </div>
            
            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Información de contacto</h3>
              
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
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
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
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
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
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-white/80">
                Total estimado: <span className="text-2xl font-extrabold text-white">€{totalPrice}</span>
              </div>
              <button type="submit" className="e-btn-primary">Enviar solicitud</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// UI компонента переключателя «ON/OFF» как на скриншоте
function OptionSwitch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean)=>void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white text-lg font-semibold mr-4">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-40 h-10 rounded-md overflow-hidden border ${checked ? 'border-green-400' : 'border-white/20'} bg-white/10`}
        aria-pressed={checked}
      >
        <div className="absolute inset-0 grid grid-cols-2">
          <div className={`flex items-center justify-center text-sm font-bold ${checked ? 'bg-green-500 text-white' : 'bg-white/10 text-white/60'}`}>ON</div>
          <div className={`flex items-center justify-center text-sm font-bold ${!checked ? 'bg-gray-500 text-white' : 'bg-white/10 text-white/60'}`}>OFF</div>
        </div>
      </button>
    </div>
  );
}