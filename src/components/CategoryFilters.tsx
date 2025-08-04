import React from 'react';
import { X } from 'lucide-react';

interface FilterOption {
  id: string;
  name: string;
}

interface FilterGroup {
  id: string;
  name: string;
  options: FilterOption[];
}

interface CategoryFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  onFilterChange: (filters: Record<string, string[]>) => void;
  activeFilters: Record<string, string[]>;
}

const engineFilters: FilterGroup[] = [
  {
    id: 'brand',
    name: 'Marca',
    options: [
      { id: 'mann', name: 'MANN-FILTER' },
      { id: 'bosch', name: 'BOSCH' },
      { id: 'pierburg', name: 'PIERBURG' },
      { id: 'mahle', name: 'MAHLE' },
      { id: 'hengst', name: 'HENGST' }
    ]
  },
  {
    id: 'compatibility',
    name: 'Compatibilidad',
    options: [
      { id: 'bmw', name: 'BMW' },
      { id: 'mercedes', name: 'Mercedes-Benz' },
      { id: 'audi', name: 'Audi' },
      { id: 'volkswagen', name: 'Volkswagen' },
      { id: 'toyota', name: 'Toyota' }
    ]
  },
  {
    id: 'price',
    name: 'Precio',
    options: [
      { id: 'under-50', name: 'Menos de 50€' },
      { id: '50-100', name: '50€ - 100€' },
      { id: '100-200', name: '100€ - 200€' },
      { id: 'over-200', name: 'Más de 200€' }
    ]
  }
];

const brakesFilters: FilterGroup[] = [
  {
    id: 'brand',
    name: 'Marca',
    options: [
      { id: 'brembo', name: 'BREMBO' },
      { id: 'zimmermann', name: 'ZIMMERMANN' },
      { id: 'textar', name: 'TEXTAR' },
      { id: 'ate', name: 'ATE' },
      { id: 'trw', name: 'TRW' }
    ]
  },
  {
    id: 'position',
    name: 'Posición',
    options: [
      { id: 'front', name: 'Delantero' },
      { id: 'rear', name: 'Trasero' }
    ]
  },
  {
    id: 'type',
    name: 'Tipo',
    options: [
      { id: 'disc', name: 'Disco' },
      { id: 'pad', name: 'Pastilla' },
      { id: 'caliper', name: 'Pinza' },
      { id: 'drum', name: 'Tambor' }
    ]
  }
];

const suspensionFilters: FilterGroup[] = [
  {
    id: 'brand',
    name: 'Marca',
    options: [
      { id: 'bilstein', name: 'BILSTEIN' },
      { id: 'koni', name: 'KONI' },
      { id: 'monroe', name: 'MONROE' },
      { id: 'sachs', name: 'SACHS' },
      { id: 'kyb', name: 'KYB' }
    ]
  },
  {
    id: 'position',
    name: 'Posición',
    options: [
      { id: 'front', name: 'Delantero' },
      { id: 'rear', name: 'Trasero' }
    ]
  },
  {
    id: 'type',
    name: 'Tipo',
    options: [
      { id: 'shock', name: 'Amortiguador' },
      { id: 'spring', name: 'Muelle' },
      { id: 'strut', name: 'Columna' },
      { id: 'arm', name: 'Brazo' }
    ]
  }
];

const electricalFilters: FilterGroup[] = [
  {
    id: 'brand',
    name: 'Marca',
    options: [
      { id: 'bosch', name: 'BOSCH' },
      { id: 'denso', name: 'DENSO' },
      { id: 'valeo', name: 'VALEO' },
      { id: 'hella', name: 'HELLA' },
      { id: 'varta', name: 'VARTA' }
    ]
  },
  {
    id: 'type',
    name: 'Tipo',
    options: [
      { id: 'battery', name: 'Batería' },
      { id: 'alternator', name: 'Alternador' },
      { id: 'starter', name: 'Motor de arranque' },
      { id: 'spark-plug', name: 'Bujía' },
      { id: 'sensor', name: 'Sensor' }
    ]
  }
];

const bodyFilters: FilterGroup[] = [
  {
    id: 'brand',
    name: 'Marca',
    options: [
      { id: 'hella', name: 'HELLA' },
      { id: 'valeo', name: 'VALEO' },
      { id: 'magneti', name: 'MAGNETI MARELLI' },
      { id: 'tyc', name: 'TYC' }
    ]
  },
  {
    id: 'position',
    name: 'Posición',
    options: [
      { id: 'front', name: 'Delantero' },
      { id: 'rear', name: 'Trasero' },
      { id: 'left', name: 'Izquierdo' },
      { id: 'right', name: 'Derecho' }
    ]
  },
  {
    id: 'type',
    name: 'Tipo',
    options: [
      { id: 'bumper', name: 'Paragolpes' },
      { id: 'hood', name: 'Capó' },
      { id: 'door', name: 'Puerta' },
      { id: 'light', name: 'Faro' },
      { id: 'mirror', name: 'Espejo' }
    ]
  }
];

const interiorFilters: FilterGroup[] = [
  {
    id: 'brand',
    name: 'Marca',
    options: [
      { id: 'mann', name: 'MANN-FILTER' },
      { id: 'bosch', name: 'BOSCH' },
      { id: 'hella', name: 'HELLA' },
      { id: 'valeo', name: 'VALEO' }
    ]
  },
  {
    id: 'type',
    name: 'Tipo',
    options: [
      { id: 'cabin-filter', name: 'Filtro de habitáculo' },
      { id: 'seat', name: 'Asiento' },
      { id: 'climate', name: 'Climatización' },
      { id: 'audio', name: 'Audio' }
    ]
  }
];

const consumablesFilters: FilterGroup[] = [
  {
    id: 'brand',
    name: 'Marca',
    options: [
      { id: 'castrol', name: 'CASTROL' },
      { id: 'mobil', name: 'MOBIL' },
      { id: 'shell', name: 'SHELL' },
      { id: 'motul', name: 'MOTUL' },
      { id: 'liqui-moly', name: 'LIQUI MOLY' }
    ]
  },
  {
    id: 'type',
    name: 'Tipo',
    options: [
      { id: 'oil', name: 'Aceite' },
      { id: 'coolant', name: 'Refrigerante' },
      { id: 'brake-fluid', name: 'Líquido de frenos' },
      { id: 'filter', name: 'Filtro' },
      { id: 'belt', name: 'Correa' }
    ]
  }
];

const toolsFilters: FilterGroup[] = [
  {
    id: 'brand',
    name: 'Marca',
    options: [
      { id: 'gedore', name: 'GEDORE' },
      { id: 'hazet', name: 'HAZET' },
      { id: 'stahlwille', name: 'STAHLWILLE' },
      { id: 'bosch', name: 'BOSCH' },
      { id: 'kraftwerk', name: 'KRAFTWERK' }
    ]
  },
  {
    id: 'type',
    name: 'Tipo',
    options: [
      { id: 'wrench', name: 'Llave' },
      { id: 'socket', name: 'Vaso' },
      { id: 'plier', name: 'Alicate' },
      { id: 'screwdriver', name: 'Destornillador' },
      { id: 'jack', name: 'Gato' }
    ]
  }
];

const filtersMap: Record<string, FilterGroup[]> = {
  engine: engineFilters,
  brakes: brakesFilters,
  suspension: suspensionFilters,
  electrical: electricalFilters,
  body: bodyFilters,
  interior: interiorFilters,
  consumables: consumablesFilters,
  tools: toolsFilters
};

export default function CategoryFilters({ isOpen, onClose, categoryId, onFilterChange, activeFilters }: CategoryFiltersProps) {
  const filters = filtersMap[categoryId] || [];

  const handleFilterChange = (groupId: string, optionId: string) => {
    const newFilters = { ...activeFilters };
    
    if (!newFilters[groupId]) {
      newFilters[groupId] = [];
    }
    
    const index = newFilters[groupId].indexOf(optionId);
    if (index > -1) {
      newFilters[groupId].splice(index, 1);
    } else {
      newFilters[groupId].push(optionId);
    }
    
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((count, options) => count + options.length, 0);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Filtros</h3>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          {filters.length > 0 ? (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {getActiveFilterCount()} filtros aplicados
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {filters.map((group) => (
                  <div key={group.id} className="border-b border-gray-200 pb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">{group.name}</h4>
                    <div className="space-y-2">
                      {group.options.map((option) => (
                        <label key={option.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={activeFilters[group.id]?.includes(option.id) || false}
                            onChange={() => handleFilterChange(group.id, option.id)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-3 text-gray-700">{option.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button
                  onClick={onClose}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Aplicar filtros
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay filtros disponibles para esta categoría</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}