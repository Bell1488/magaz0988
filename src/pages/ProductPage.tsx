import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';

const productData = {
  // Motor y sistema de alimentación
  'eng-001': {
    id: 'eng-001',
    name: 'Filtro de aceite Mann W712/75',
    brand: 'MANN-FILTER',
    price: 45,
    oldPrice: 52,
    rating: 4.8,
    reviews: 124,
    images: [
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Filtro de aceite original para BMW, Mercedes, Audi',
    fullDescription: 'Filtro de aceite de alta calidad Mann W712/75 diseñado para la limpieza eficaz del aceite del motor de contaminantes y productos de desgaste. Fabricado con materiales de alta calidad utilizando tecnologías avanzadas de filtración.',
    specifications: {
      'Referencia': 'W712/75',
      'Fabricante': 'MANN-FILTER',
      'Tipo de filtro': 'Aceite',
      'Diámetro': '76 mm',
      'Altura': '79 mm',
      'Rosca': 'M20 x 1.5',
      'Aplicación': 'BMW, Mercedes-Benz, Audi'
    },
    category: 'engine'
  },
  'eng-002': {
    id: 'eng-002',
    name: 'Filtro de aire Bosch F026400165',
    brand: 'BOSCH',
    price: 89,
    rating: 4.9,
    reviews: 89,
    images: [
      'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Filtro de aire de alta calidad para el motor',
    fullDescription: 'El filtro de aire Bosch F026400165 garantiza una protección óptima del motor contra partículas y contaminantes. Diseñado específicamente para maximizar el flujo de aire y mejorar el rendimiento del motor.',
    specifications: {
      'Referencia': 'F026400165',
      'Fabricante': 'BOSCH',
      'Tipo de filtro': 'Aire',
      'Altura': '56 mm',
      'Longitud': '213 mm',
      'Anchura': '219 mm',
      'Aplicación': 'Varios modelos europeos'
    },
    category: 'engine'
  },
  'eng-003': {
    id: 'eng-003',
    name: 'Bomba de combustible Pierburg 7.50000.50.0',
    brand: 'PIERBURG',
    price: 125,
    rating: 4.7,
    reviews: 56,
    images: [
      'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: false,
    description: 'Bomba de combustible eléctrica para sistema de inyección',
    fullDescription: 'Bomba de combustible eléctrica Pierburg 7.50000.50.0 de alta precisión y durabilidad. Proporciona un suministro constante de combustible al sistema de inyección para un rendimiento óptimo del motor.',
    specifications: {
      'Referencia': '7.50000.50.0',
      'Fabricante': 'PIERBURG',
      'Tipo': 'Eléctrica',
      'Presión': '3.5 bar',
      'Voltaje': '12V',
      'Aplicación': 'Vehículos con inyección electrónica'
    },
    category: 'engine'
  },
  'eng-004': {
    id: 'eng-004',
    name: 'Filtro de combustible Mahle KL228/2D',
    brand: 'MAHLE',
    price: 38,
    rating: 4.6,
    reviews: 78,
    images: [
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Filtro de combustible de alta eficiencia para motores diésel',
    fullDescription: 'El filtro de combustible Mahle KL228/2D está diseñado específicamente para motores diésel modernos, proporcionando una filtración óptima que protege el sistema de inyección contra partículas y agua.',
    specifications: {
      'Referencia': 'KL228/2D',
      'Fabricante': 'MAHLE',
      'Tipo de filtro': 'Combustible',
      'Altura': '142 mm',
      'Diámetro': '83 mm',
      'Eficiencia de filtración': '98%',
      'Aplicación': 'Vehículos diésel europeos'
    },
    category: 'engine'
  },
  'eng-005': {
    id: 'eng-005',
    name: 'Sensor de presión de aceite Hella 6PP010324-021',
    brand: 'HELLA',
    price: 65,
    rating: 4.5,
    reviews: 42,
    images: [
      'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Sensor de presión de aceite para sistemas de monitorización del motor',
    fullDescription: 'Sensor de presión de aceite Hella 6PP010324-021 de alta precisión para la monitorización constante de la presión del aceite en el motor. Componente esencial para el sistema de alerta y protección del motor.',
    specifications: {
      'Referencia': '6PP010324-021',
      'Fabricante': 'HELLA',
      'Tipo': 'Sensor de presión',
      'Rango de medición': '0-10 bar',
      'Conexión eléctrica': '3 pines',
      'Rosca': 'M10 x 1',
      'Aplicación': 'Varios modelos europeos'
    },
    category: 'engine'
  },
  
  // Sistema de frenos
  'brk-001': {
    id: 'brk-001',
    name: 'Pastillas de freno Brembo P50088',
    brand: 'BREMBO',
    price: 32,
    oldPrice: 35,
    rating: 4.9,
    reviews: 203,
    images: [
      'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Pastillas de freno delanteras para conducción deportiva',
    fullDescription: 'Las pastillas de freno Brembo P50088 están diseñadas para ofrecer un rendimiento de frenado excepcional en condiciones de conducción deportiva. Fabricadas con materiales de alta fricción para una respuesta inmediata y consistente.',
    specifications: {
      'Referencia': 'P50088',
      'Fabricante': 'BREMBO',
      'Posición': 'Delantera',
      'Material': 'Compuesto cerámico',
      'Índice de fricción': 'Alto',
      'Aplicación': 'Vehículos deportivos europeos'
    },
    category: 'brakes'
  },
  'brk-002': {
    id: 'brk-002',
    name: 'Disco de freno Zimmermann 600.3243.20',
    brand: 'ZIMMERMANN',
    price: 45,
    rating: 4.8,
    reviews: 145,
    images: [
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Disco de freno ventilado, diámetro 320mm',
    fullDescription: 'Disco de freno ventilado Zimmermann 600.3243.20 fabricado con fundición de alta calidad. Diseño ventilado para una mejor disipación del calor y mayor durabilidad en condiciones exigentes.',
    specifications: {
      'Referencia': '600.3243.20',
      'Fabricante': 'ZIMMERMANN',
      'Tipo': 'Ventilado',
      'Diámetro': '320 mm',
      'Espesor': '28 mm',
      'Altura': '47.5 mm',
      'Aplicación': 'Vehículos de gama media-alta'
    },
    category: 'brakes'
  },
  'brk-003': {
    id: 'brk-003',
    name: 'Pinza de freno TRW BHW357E',
    brand: 'TRW',
    price: 120,
    rating: 4.7,
    reviews: 68,
    images: [
      'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Pinza de freno delantera izquierda remanufacturada',
    fullDescription: 'Pinza de freno TRW BHW357E remanufacturada según los estándares más exigentes. Proporciona la misma calidad y rendimiento que una pinza nueva a un precio más económico y respetuoso con el medio ambiente.',
    specifications: {
      'Referencia': 'BHW357E',
      'Fabricante': 'TRW',
      'Posición': 'Delantera izquierda',
      'Tipo': 'Flotante',
      'Diámetro pistón': '57 mm',
      'Estado': 'Remanufacturada',
      'Aplicación': 'Varios modelos europeos'
    },
    category: 'brakes'
  },
  'brk-004': {
    id: 'brk-004',
    name: 'Kit de frenos ATE 13.0460-7103.2',
    brand: 'ATE',
    price: 195,
    oldPrice: 220,
    rating: 4.8,
    reviews: 112,
    images: [
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Kit completo con discos y pastillas para eje delantero',
    fullDescription: 'Kit completo de frenos ATE 13.0460-7103.2 que incluye discos y pastillas para el eje delantero. Todos los componentes están perfectamente adaptados entre sí para garantizar un rendimiento óptimo del sistema de frenado.',
    specifications: {
      'Referencia': '13.0460-7103.2',
      'Fabricante': 'ATE',
      'Contenido': 'Discos y pastillas delanteros',
      'Diámetro discos': '312 mm',
      'Espesor discos': '25 mm',
      'Material pastillas': 'Compuesto cerámico',
      'Aplicación': 'Vehículos de gama media europea'
    },
    category: 'brakes'
  },
  
  // Suspensión y dirección
  'sus-001': {
    id: 'sus-001',
    name: 'Amortiguador Bilstein B4 22-045633',
    brand: 'BILSTEIN',
    price: 180,
    rating: 4.7,
    reviews: 89,
    images: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Amortiguador delantero para suspensión deportiva',
    fullDescription: 'Amortiguador Bilstein B4 22-045633 de alta calidad para una conducción deportiva pero confortable. Tecnología monotubo presurizada con gas para un rendimiento constante incluso en condiciones exigentes.',
    specifications: {
      'Referencia': '22-045633',
      'Fabricante': 'BILSTEIN',
      'Posición': 'Delantera',
      'Tipo': 'Monotubo',
      'Presurizado': 'Sí',
      'Longitud extendida': '340 mm',
      'Aplicación': 'Vehículos deportivos europeos'
    },
    category: 'suspension'
  },
  'sus-002': {
    id: 'sus-002',
    name: 'Muelle de suspensión Sachs 994 084',
    brand: 'SACHS',
    price: 65,
    rating: 4.6,
    reviews: 52,
    images: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Muelle helicoidal para suspensión trasera',
    fullDescription: 'Muelle de suspensión Sachs 994 084 fabricado con acero de alta resistencia. Diseñado para ofrecer la combinación perfecta entre confort de marcha y estabilidad en carretera.',
    specifications: {
      'Referencia': '994 084',
      'Fabricante': 'SACHS',
      'Posición': 'Trasera',
      'Tipo': 'Helicoidal',
      'Longitud': '360 mm',
      'Diámetro': '120 mm',
      'Aplicación': 'Varios modelos europeos'
    },
    category: 'suspension'
  },
  'sus-003': {
    id: 'sus-003',
    name: 'Kit de suspensión KYB 935604',
    brand: 'KYB',
    price: 210,
    oldPrice: 250,
    rating: 4.8,
    reviews: 74,
    images: [
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Kit completo de suspensión con amortiguadores y muelles',
    fullDescription: 'Kit completo de suspensión KYB 935604 que incluye amortiguadores y muelles perfectamente adaptados entre sí. Proporciona una mejora significativa en el comportamiento dinámico del vehículo y en el confort de marcha.',
    specifications: {
      'Referencia': '935604',
      'Fabricante': 'KYB',
      'Contenido': 'Amortiguadores y muelles',
      'Posición': 'Delantera',
      'Tipo amortiguadores': 'Bitubo',
      'Tipo muelles': 'Progresivos',
      'Aplicación': 'Vehículos compactos y berlinas'
    },
    category: 'suspension'
  },
  
  // Sistema eléctrico
  'elec-001': {
    id: 'elec-001',
    name: 'Batería Bosch S5 008 77Ah',
    brand: 'BOSCH',
    price: 95,
    rating: 4.6,
    reviews: 156,
    images: [
      'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Batería de arranque 12V 77Ah 780A',
    fullDescription: 'Batería Bosch S5 008 de alto rendimiento con tecnología Silver para una mayor durabilidad y fiabilidad. Ideal para vehículos con alto consumo eléctrico y equipamiento electrónico avanzado.',
    specifications: {
      'Referencia': 'S5 008',
      'Fabricante': 'BOSCH',
      'Voltaje': '12V',
      'Capacidad': '77Ah',
      'Corriente de arranque': '780A',
      'Polaridad': 'Derecha +',
      'Dimensiones': '278 x 175 x 190 mm'
    },
    category: 'electrical'
  },
  'elec-002': {
    id: 'elec-002',
    name: 'Alternador Valeo 439656',
    brand: 'VALEO',
    price: 245,
    oldPrice: 280,
    rating: 4.7,
    reviews: 83,
    images: [
      'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Alternador 14V 150A para vehículos europeos',
    fullDescription: 'Alternador Valeo 439656 de alta eficiencia para garantizar una carga óptima de la batería y el suministro eléctrico del vehículo. Fabricado según los estándares más exigentes para una larga vida útil.',
    specifications: {
      'Referencia': '439656',
      'Fabricante': 'VALEO',
      'Voltaje': '14V',
      'Amperaje': '150A',
      'Número de ranuras': '6',
      'Diámetro polea': '54 mm',
      'Aplicación': 'Vehículos europeos de gama media-alta'
    },
    category: 'electrical'
  },
  'elec-003': {
    id: 'elec-003',
    name: 'Kit de bujías NGK LZKR6B-10E',
    brand: 'NGK',
    price: 42,
    rating: 4.9,
    reviews: 215,
    images: [
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Set de 4 bujías de encendido de iridio para motores de gasolina',
    fullDescription: 'Kit de bujías NGK LZKR6B-10E con tecnología de iridio para un encendido más eficiente y una mayor vida útil. Proporcionan un mejor arranque en frío y un consumo de combustible optimizado.',
    specifications: {
      'Referencia': 'LZKR6B-10E',
      'Fabricante': 'NGK',
      'Material electrodo': 'Iridio',
      'Distancia electrodos': '1.0 mm',
      'Rosca': 'M14 x 1.25',
      'Longitud rosca': '19 mm',
      'Aplicación': 'Motores de gasolina de inyección directa'
    },
    category: 'electrical'
  },
  
  // Carrocería
  'body-001': {
    id: 'body-001',
    name: 'Faro delantero Hella 1EL 008 880-811',
    brand: 'HELLA',
    price: 245,
    rating: 4.5,
    reviews: 67,
    images: [
      'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Faro delantero derecho con regulación eléctrica',
    fullDescription: 'Faro delantero Hella 1EL 008 880-811 con tecnología halógena y regulación eléctrica de altura. Diseñado para ofrecer una iluminación óptima y cumplir con todas las normativas europeas.',
    specifications: {
      'Referencia': '1EL 008 880-811',
      'Fabricante': 'HELLA',
      'Posición': 'Delantera derecha',
      'Tipo': 'Halógeno',
      'Regulación': 'Eléctrica',
      'Homologación': 'ECE',
      'Aplicación': 'Varios modelos europeos'
    },
    category: 'body'
  },
  'body-002': {
    id: 'body-002',
    name: 'Paragolpes delantero Magneti Marelli 021316900010',
    brand: 'MAGNETI MARELLI',
    price: 185,
    rating: 4.4,
    reviews: 38,
    images: [
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Paragolpes delantero completo con rejillas',
    fullDescription: 'Paragolpes delantero Magneti Marelli 021316900010 fabricado con materiales de alta calidad para garantizar durabilidad y resistencia a impactos. Incluye todas las rejillas y soportes necesarios para su instalación.',
    specifications: {
      'Referencia': '021316900010',
      'Fabricante': 'MAGNETI MARELLI',
      'Posición': 'Delantera',
      'Material': 'Polipropileno reforzado',
      'Color': 'Imprimado para pintar',
      'Incluye': 'Rejillas y soportes',
      'Aplicación': 'Vehículos compactos europeos'
    },
    category: 'body'
  },
  
  // Interior y confort
  'int-001': {
    id: 'int-001',
    name: 'Filtro de habitáculo Mann CU 2545',
    brand: 'MANN-FILTER',
    price: 28,
    rating: 4.4,
    reviews: 92,
    images: [
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Filtro de aire del habitáculo con carbón activo',
    fullDescription: 'Filtro de habitáculo Mann CU 2545 con carbón activo para eliminar eficazmente partículas, polen, olores y gases nocivos. Proporciona un aire más limpio y saludable en el interior del vehículo.',
    specifications: {
      'Referencia': 'CU 2545',
      'Fabricante': 'MANN-FILTER',
      'Tipo': 'Carbón activo',
      'Longitud': '248 mm',
      'Anchura': '216 mm',
      'Altura': '30 mm',
      'Aplicación': 'Varios modelos europeos'
    },
    category: 'interior'
  },
  'int-002': {
    id: 'int-002',
    name: 'Compresor de aire acondicionado Valeo 813144',
    brand: 'VALEO',
    price: 320,
    oldPrice: 380,
    rating: 4.6,
    reviews: 45,
    images: [
      'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Compresor de climatización para sistemas R134a',
    fullDescription: 'Compresor de aire acondicionado Valeo 813144 de alta eficiencia para sistemas que utilizan refrigerante R134a. Fabricado según los estándares más exigentes para garantizar un rendimiento óptimo y una larga vida útil.',
    specifications: {
      'Referencia': '813144',
      'Fabricante': 'VALEO',
      'Tipo': 'Pistón',
      'Refrigerante': 'R134a',
      'Voltaje': '12V',
      'Número de ranuras': '7',
      'Aplicación': 'Varios modelos europeos'
    },
    category: 'interior'
  },
  
  // Consumibles
  'cons-001': {
    id: 'cons-001',
    name: 'Aceite motor Castrol GTX 5W-30 5L',
    brand: 'CASTROL',
    price: 42,
    rating: 4.8,
    reviews: 234,
    images: [
      'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Aceite sintético para motor gasolina y diésel',
    fullDescription: 'Aceite motor Castrol GTX 5W-30 de tecnología sintética para motores gasolina y diésel. Proporciona una excelente protección contra el desgaste y los depósitos, incluso en condiciones de conducción exigentes.',
    specifications: {
      'Referencia': 'GTX 5W-30',
      'Fabricante': 'CASTROL',
      'Tipo': 'Sintético',
      'Viscosidad': '5W-30',
      'Capacidad': '5 litros',
      'Especificaciones': 'API SL/CF, ACEA A3/B4',
      'Aplicación': 'Motores gasolina y diésel'
    },
    category: 'consumables'
  },
  'cons-002': {
    id: 'cons-002',
    name: 'Líquido de frenos Motul DOT 5.1 500ml',
    brand: 'MOTUL',
    price: 18,
    rating: 4.9,
    reviews: 156,
    images: [
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Líquido de frenos sintético de alto rendimiento',
    fullDescription: 'Líquido de frenos Motul DOT 5.1 100% sintético con un punto de ebullición muy elevado (270°C). Proporciona una respuesta de frenado excepcional incluso en condiciones extremas y tiene una excelente resistencia a la absorción de humedad.',
    specifications: {
      'Referencia': 'DOT 5.1',
      'Fabricante': 'MOTUL',
      'Tipo': 'Sintético',
      'Punto ebullición seco': '270°C',
      'Punto ebullición húmedo': '185°C',
      'Capacidad': '500 ml',
      'Aplicación': 'Sistemas de frenos hidráulicos'
    },
    category: 'consumables'
  },
  
  // Herramientas y equipos
  'tool-001': {
    id: 'tool-001',
    name: 'Juego llaves combinadas Gedore 6-22mm',
    brand: 'GEDORE',
    price: 89,
    rating: 4.9,
    reviews: 45,
    images: [
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Set de 12 llaves combinadas cromadas',
    fullDescription: 'Juego de llaves combinadas Gedore de 6 a 22mm fabricadas en acero al cromo-vanadio con acabado cromado. Diseño ergonómico con perfil DynamicDrive para una transmisión óptima de la fuerza y protección de los tornillos.',
    specifications: {
      'Referencia': '7-012',
      'Fabricante': 'GEDORE',
      'Material': 'Acero al cromo-vanadio',
      'Acabado': 'Cromado',
      'Contenido': '12 llaves (6-22mm)',
      'Norma': 'DIN 3113',
      'Aplicación': 'Uso profesional'
    },
    category: 'tools'
  },
  'tool-002': {
    id: 'tool-002',
    name: 'Gato hidráulico Hazet 2171N',
    brand: 'HAZET',
    price: 175,
    oldPrice: 195,
    rating: 4.8,
    reviews: 67,
    images: [
      'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    description: 'Gato hidráulico de 3 toneladas para elevación de vehículos',
    fullDescription: 'Gato hidráulico Hazet 2171N de alta calidad con capacidad de carga de 3 toneladas. Diseño compacto y robusto para un uso profesional en talleres. Sistema de elevación rápida para mayor eficiencia.',
    specifications: {
      'Referencia': '2171N',
      'Fabricante': 'HAZET',
      'Capacidad': '3 toneladas',
      'Altura mínima': '135 mm',
      'Altura máxima': '500 mm',
      'Peso': '16.5 kg',
      'Aplicación': 'Uso profesional en talleres'
    },
    category: 'tools'
  }
};

export default function ProductPage() {
  const { productId } = useParams();
  const { dispatch } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Загрузка данных о товаре с сервера
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
        if (response.ok) {
          const allProducts = await response.json();
          // Ищем товар по ID
          const foundProduct = allProducts.find((p: any) => p.id === productId);
          
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            // Если товар не найден на сервере, ищем в локальных данных
            const localProduct = productData[productId as keyof typeof productData];
            setProduct(localProduct);
          }
        } else {
          console.error('Error fetching product:', await response.text());
          // Используем локальные данные в случае ошибки
          const localProduct = productData[productId as keyof typeof productData];
          setProduct(localProduct);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        // Используем локальные данные в случае ошибки
        const localProduct = productData[productId as keyof typeof productData];
        setProduct(localProduct);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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
                product.images.map((image, index) => (
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