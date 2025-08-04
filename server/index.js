const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Инициализация приложения Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Путь к файлам с данными
const dataDir = path.join(__dirname, 'data');
const productsFile = path.join(dataDir, 'products.json');
const categoriesFile = path.join(dataDir, 'categories.json');
const ordersFile = path.join(dataDir, 'orders.json');

// Создаем директорию для данных, если она не существует
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

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

// Инициализация файлов с данными, если они не существуют
if (!fs.existsSync(productsFile)) {
  fs.writeFileSync(productsFile, JSON.stringify(initialProducts, null, 2));
}

if (!fs.existsSync(categoriesFile)) {
  fs.writeFileSync(categoriesFile, JSON.stringify(initialCategories, null, 2));
}

if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, JSON.stringify(initialOrders, null, 2));
}

// Вспомогательные функции для работы с данными
const readData = (file) => {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${file}:`, error);
    return [];
  }
};

const writeData = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing file ${file}:`, error);
    return false;
  }
};

// API для товаров
app.get('/api/products', (req, res) => {
  const products = readData(productsFile);
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const products = readData(productsFile);
  const product = products.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const products = readData(productsFile);
  const newProduct = req.body;
  
  // Проверка, что ID не существует
  if (products.some(p => p.id === newProduct.id)) {
    return res.status(400).json({ message: 'Product with this ID already exists' });
  }
  
  products.push(newProduct);
  
  if (writeData(productsFile, products)) {
    res.status(201).json(newProduct);
  } else {
    res.status(500).json({ message: 'Error saving product' });
  }
});

app.put('/api/products/:id', (req, res) => {
  const products = readData(productsFile);
  const updatedProduct = req.body;
  const index = products.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  products[index] = { ...products[index], ...updatedProduct };
  
  if (writeData(productsFile, products)) {
    res.json(products[index]);
  } else {
    res.status(500).json({ message: 'Error updating product' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  const products = readData(productsFile);
  const filteredProducts = products.filter(p => p.id !== req.params.id);
  
  if (products.length === filteredProducts.length) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  if (writeData(productsFile, filteredProducts)) {
    res.json({ message: 'Product deleted successfully' });
  } else {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// API для категорий
app.get('/api/categories', (req, res) => {
  const categories = readData(categoriesFile);
  res.json(categories);
});

app.get('/api/categories/:id', (req, res) => {
  const categories = readData(categoriesFile);
  const category = categories.find(c => c.id === req.params.id);
  
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  
  res.json(category);
});

app.post('/api/categories', (req, res) => {
  const categories = readData(categoriesFile);
  const newCategory = req.body;
  
  // Проверка, что ID не существует
  if (categories.some(c => c.id === newCategory.id)) {
    return res.status(400).json({ message: 'Category with this ID already exists' });
  }
  
  categories.push(newCategory);
  
  if (writeData(categoriesFile, categories)) {
    res.status(201).json(newCategory);
  } else {
    res.status(500).json({ message: 'Error saving category' });
  }
});

app.put('/api/categories/:id', (req, res) => {
  const categories = readData(categoriesFile);
  const updatedCategory = req.body;
  const index = categories.findIndex(c => c.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Category not found' });
  }
  
  categories[index] = { ...categories[index], ...updatedCategory };
  
  if (writeData(categoriesFile, categories)) {
    res.json(categories[index]);
  } else {
    res.status(500).json({ message: 'Error updating category' });
  }
});

app.delete('/api/categories/:id', (req, res) => {
  const categories = readData(categoriesFile);
  const filteredCategories = categories.filter(c => c.id !== req.params.id);
  
  if (categories.length === filteredCategories.length) {
    return res.status(404).json({ message: 'Category not found' });
  }
  
  if (writeData(categoriesFile, filteredCategories)) {
    res.json({ message: 'Category deleted successfully' });
  } else {
    res.status(500).json({ message: 'Error deleting category' });
  }
});

// API для заказов
app.get('/api/orders', (req, res) => {
  const orders = readData(ordersFile);
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const orders = readData(ordersFile);
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  res.json(order);
});

app.post('/api/orders', (req, res) => {
  const orders = readData(ordersFile);
  const newOrder = req.body;
  
  // Проверка, что ID не существует
  if (orders.some(o => o.id === newOrder.id)) {
    return res.status(400).json({ message: 'Order with this ID already exists' });
  }
  
  orders.push(newOrder);
  
  if (writeData(ordersFile, orders)) {
    res.status(201).json(newOrder);
  } else {
    res.status(500).json({ message: 'Error saving order' });
  }
});

app.put('/api/orders/:id', (req, res) => {
  const orders = readData(ordersFile);
  const updatedOrder = req.body;
  const index = orders.findIndex(o => o.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  orders[index] = { ...orders[index], ...updatedOrder };
  
  if (writeData(ordersFile, orders)) {
    res.json(orders[index]);
  } else {
    res.status(500).json({ message: 'Error updating order' });
  }
});

app.delete('/api/orders/:id', (req, res) => {
  const orders = readData(ordersFile);
  const filteredOrders = orders.filter(o => o.id !== req.params.id);
  
  if (orders.length === filteredOrders.length) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  if (writeData(ordersFile, filteredOrders)) {
    res.json({ message: 'Order deleted successfully' });
  } else {
    res.status(500).json({ message: 'Error deleting order' });
  }
});

// Добавляем проверку работоспособности для хостинга
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'ElatNeo API is running' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});