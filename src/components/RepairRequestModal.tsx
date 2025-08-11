import React, { useEffect, useState } from 'react';
import { X, Upload, Phone, Mail, User, Wrench } from 'lucide-react';

interface RepairRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPartName?: string;
}

export default function RepairRequestModal({ isOpen, onClose, defaultPartName }: RepairRequestModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    partName: '',
    description: '',
    images: [] as File[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, partName: defaultPartName || '' }));
    }
  }, [isOpen, defaultPartName]);

  if (!isOpen) return null;

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
      formData.images.forEach((image) => formDataToSend.append('images', image));

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

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="e-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Solicitud de Reparación</h2>
            <button onClick={onClose} className="p-2 text-white/70 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Teléfono
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <Wrench className="h-4 w-4 inline mr-2" />
                Nombre de la pieza
              </label>
              <input
                type="text"
                required
                value={formData.partName}
                onChange={(e) => setFormData(prev => ({ ...prev, partName: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                placeholder="Ejemplo: ECU del motor, 0AW VL300, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Descripción del problema</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                placeholder="Describe detalladamente el problema con la pieza..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <Upload className="h-4 w-4 inline mr-2" />
                Fotos de la pieza (opcional)
              </label>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white" />
              {formData.images.length > 0 && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={URL.createObjectURL(image)} alt={`Foto ${index + 1}`} className="w-full h-20 object-cover rounded border border-white/10" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-2">
              <button type="button" onClick={onClose} className="px-6 py-2 border border-white/15 text-white/80 rounded-lg hover:bg-white/10">Cancelar</button>
              <button type="submit" disabled={isSubmitting} className="e-btn-primary disabled:opacity-60">
                {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


