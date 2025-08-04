const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Инициализация приложения Express
const app = express();
const PORT = process.env.PORT || 5000;

// Путь к файлам с данными
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');
const productsFile = path.join(dataDir, 'products.json');
const categoriesFile = path.join(dataDir, 'categories.json');
const ordersFile = path.join(dataDir, 'orders.json');
const firmwareRequestsFile = path.join(dataDir, 'firmware-requests.json');

// Создаем директории для данных и загрузок, если они не существуют
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Настройка хранилища для загружаемых файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Создаем уникальное имя файла с оригинальным расширением
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Ограничение размера файла (10MB)
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Начальные данные для товаров
const initialProducts = [
  {
    id: 'eng-001',
    name: 'Filtro de aceite Mann W712/75',
    brand: 'MANN-FILTER',
    category: 'engine',
    price: 45,
    oldPrice: 52,
    description: 'Filtro de aceite original para BMW, Mercedes, Audi',
    image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=800',
    inStock: true
  },
  {
    id: 'brk-001',
    name: 'Pastillas de freno Brembo P50088',
    brand: 'BREMBO',
    category: 'brakes',
    price: 32,
    oldPrice: 35,
    description: 'Pastillas de freno delanteras para conducción deportiva',
    image: 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=800',
    inStock: true
  }
];

// Начальные данные для категорий
const initialCategories = [
  {
    id: 'engine',
    name: 'Motor y sistema de alimentación',
    description: 'Pistones, anillos, filtros, inyectores, bombas de combustible',
    image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 1234
  },
  {
    id: 'brakes',
    name: 'Sistema de frenos',
    description: 'Pastillas, discos, tambores, cilindros, latiguillos',
    image: 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 892
  },
  {
    id: 'tires',
    name: 'Neumáticos',
    description: 'Neumáticos de verano, invierno y todo tiempo para todo tipo de vehículos',
    image: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 425
  },
  {
    id: 'adblue',
    name: 'Componentes AdBlue y SCR',
    description: 'Inyectores, bombas, sensores NOx y líquido AdBlue',
    image: 'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 178
  }
];

// Начальные данные для заказов
const initialOrders = [
  {
    id: 'ORD-001',
    date: '2023-08-01T10:30:00',
    customerName: 'Juan García',
    customerEmail: 'juan.garcia@example.com',
    customerPhone: '+34 612 345 678',
    items: [
      { id: 'eng-001', name: 'Filtro de aceite Mann W712/75', price: 45, quantity: 1 },
      { id: 'brk-001', name: 'Pastillas de freno Brembo P50088', price: 32, quantity: 2 }
    ],
    total: 109,
    status: 'completed',
    shippingAddress: 'Calle Gran Vía 123, 28013 Madrid, España'
  }
];

// Начальные данные для заявок на прошивку
const initialFirmwareRequests = [];

// Вспомогательные функции для работы с данными
const readData = (file) => {
  try {
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, 'utf8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error(`Error reading data from ${file}:`, error);
    return null;
  }
};

const writeData = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing data to ${file}:`, error);
    return false;
  }
};

// Проверяем и инициализируем файлы с данными
if (!fs.existsSync(productsFile)) {
  writeData(productsFile, initialProducts);
}

if (!fs.existsSync(categoriesFile)) {
  writeData(categoriesFile, initialCategories);
}

if (!fs.existsSync(ordersFile)) {
  writeData(ordersFile, initialOrders);
}

if (!fs.existsSync(firmwareRequestsFile)) {
  writeData(firmwareRequestsFile, initialFirmwareRequests);
}

// Маршруты API для товаров
app.get('/api/products', (req, res) => {
  const products = readData(productsFile) || initialProducts;
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const products = readData(productsFile) || initialProducts;
  const product = products.find(p => p.id === req.params.id);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

app.post('/api/products', (req, res) => {
  const products = readData(productsFile) || initialProducts;
  const newProduct = req.body;
  
  // Проверяем, что ID товара не существует
  if (products.some(p => p.id === newProduct.id)) {
    return res.status(400).send('El ID del producto ya existe');
  }
  
  products.push(newProduct);
  
  if (writeData(productsFile, products)) {
    res.status(201).json(newProduct);
  } else {
    res.status(500).send('Error al guardar el producto');
  }
});

app.put('/api/products/:id', (req, res) => {
  const products = readData(productsFile) || initialProducts;
  const updatedProduct = req.body;
  const index = products.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).send('Producto no encontrado');
  }
  
  products[index] = updatedProduct;
  
  if (writeData(productsFile, products)) {
    res.json(updatedProduct);
  } else {
    res.status(500).send('Error al actualizar el producto');
  }
});

app.delete('/api/products/:id', (req, res) => {
  const products = readData(productsFile) || initialProducts;
  const index = products.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).send('Producto no encontrado');
  }
  
  const deletedProduct = products.splice(index, 1)[0];
  
  if (writeData(productsFile, products)) {
    res.json(deletedProduct);
  } else {
    res.status(500).send('Error al eliminar el producto');
  }
});

// Маршруты API для категорий
app.get('/api/categories', (req, res) => {
  const categories = readData(categoriesFile) || initialCategories;
  res.json(categories);
});

app.get('/api/categories/:id', (req, res) => {
  const categories = readData(categoriesFile) || initialCategories;
  const category = categories.find(c => c.id === req.params.id);
  
  if (category) {
    res.json(category);
  } else {
    res.status(404).send('Categoría no encontrada');
  }
});

app.post('/api/categories', (req, res) => {
  const categories = readData(categoriesFile) || initialCategories;
  const newCategory = req.body;
  
  // Проверяем, что ID категории не существует
  if (categories.some(c => c.id === newCategory.id)) {
    return res.status(400).send('El ID de la categoría ya existe');
  }
  
  categories.push(newCategory);
  
  if (writeData(categoriesFile, categories)) {
    res.status(201).json(newCategory);
  } else {
    res.status(500).send('Error al guardar la categoría');
  }
});

app.put('/api/categories/:id', (req, res) => {
  const categories = readData(categoriesFile) || initialCategories;
  const updatedCategory = req.body;
  const index = categories.findIndex(c => c.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).send('Categoría no encontrada');
  }
  
  categories[index] = updatedCategory;
  
  if (writeData(categoriesFile, categories)) {
    res.json(updatedCategory);
  } else {
    res.status(500).send('Error al actualizar la categoría');
  }
});

app.delete('/api/categories/:id', (req, res) => {
  const categories = readData(categoriesFile) || initialCategories;
  const index = categories.findIndex(c => c.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).send('Categoría no encontrada');
  }
  
  const deletedCategory = categories.splice(index, 1)[0];
  
  if (writeData(categoriesFile, categories)) {
    res.json(deletedCategory);
  } else {
    res.status(500).send('Error al eliminar la categoría');
  }
});

// Маршруты API для заказов
app.get('/api/orders', (req, res) => {
  const orders = readData(ordersFile) || initialOrders;
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const orders = readData(ordersFile) || initialOrders;
  const order = orders.find(o => o.id === req.params.id);
  
  if (order) {
    res.json(order);
  } else {
    res.status(404).send('Pedido no encontrado');
  }
});

app.post('/api/orders', (req, res) => {
  const orders = readData(ordersFile) || initialOrders;
  const newOrder = req.body;
  
  // Генерируем уникальный ID для заказа
  const lastOrder = orders.length > 0 ? orders[orders.length - 1] : { id: 'ORD-000' };
  const lastId = parseInt(lastOrder.id.split('-')[1]);
  newOrder.id = `ORD-${String(lastId + 1).padStart(3, '0')}`;
  
  // Добавляем дату создания заказа
  newOrder.date = new Date().toISOString();
  
  orders.push(newOrder);
  
  if (writeData(ordersFile, orders)) {
    res.status(201).json(newOrder);
  } else {
    res.status(500).send('Error al guardar el pedido');
  }
});

app.put('/api/orders/:id', (req, res) => {
  const orders = readData(ordersFile) || initialOrders;
  const updatedOrder = req.body;
  const index = orders.findIndex(o => o.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).send('Pedido no encontrado');
  }
  
  orders[index] = updatedOrder;
  
  if (writeData(ordersFile, orders)) {
    res.json(updatedOrder);
  } else {
    res.status(500).send('Error al actualizar el pedido');
  }
});

// Маршруты API для заявок на прошивку
app.get('/api/firmware-requests', (req, res) => {
  const requests = readData(firmwareRequestsFile) || initialFirmwareRequests;
  res.json(requests);
});

app.get('/api/firmware-requests/:id', (req, res) => {
  const requests = readData(firmwareRequestsFile) || initialFirmwareRequests;
  const request = requests.find(r => r.id === req.params.id);
  
  if (request) {
    res.json(request);
  } else {
    res.status(404).send('Solicitud no encontrada');
  }
});

app.post('/api/firmware-requests', upload.single('file'), (req, res) => {
  try {
    const requests = readData(firmwareRequestsFile) || initialFirmwareRequests;
    
    // Генерируем уникальный ID для заявки
    const lastRequest = requests.length > 0 ? requests[requests.length - 1] : { id: 'FW-000' };
    const lastId = parseInt(lastRequest.id ? lastRequest.id.split('-')[1] : '000');
    const newId = `FW-${String(lastId + 1).padStart(3, '0')}`;
    
    const newRequest = {
      id: newId,
      date: new Date().toISOString(),
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      customerPhone: req.body.customerPhone,
      carBrand: req.body.carBrand,
      carModel: req.body.carModel,
      year: req.body.year,
      engineType: req.body.engineType,
      ecuType: req.body.ecuType,
      description: req.body.description,
      status: 'new'
    };
    
    // Если был загружен файл, добавляем информацию о нем
    if (req.file) {
      newRequest.fileUrl = `/uploads/${req.file.filename}`;
      newRequest.fileName = req.file.originalname;
    }
    
    requests.push(newRequest);
    
    if (writeData(firmwareRequestsFile, requests)) {
      res.status(201).json(newRequest);
    } else {
      res.status(500).send('Error al guardar la solicitud');
    }
  } catch (error) {
    console.error('Error processing firmware request:', error);
    res.status(500).send('Error al procesar la solicitud');
  }
});

app.put('/api/firmware-requests/:id', (req, res) => {
  const requests = readData(firmwareRequestsFile) || initialFirmwareRequests;
  const updatedRequest = req.body;
  const index = requests.findIndex(r => r.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).send('Solicitud no encontrada');
  }
  
  requests[index] = updatedRequest;
  
  if (writeData(firmwareRequestsFile, requests)) {
    res.json(updatedRequest);
  } else {
    res.status(500).send('Error al actualizar la solicitud');
  }
});

// Проверка работоспособности сервера
app.get('/', (req, res) => {
  res.send('ElatNeo API is running');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});