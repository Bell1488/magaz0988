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
const repairRequestsFile = path.join(dataDir, 'repair-requests.json');
const blogPostsFile = path.join(dataDir, 'blog-posts.json');

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

// Начальные данные для товаров (будут загружены из файла)
const initialProducts = [];

// Начальные данные для категорий (будут загружены из файла)
const initialCategories = [];

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

// Начальные данные для заявок на ремонт
const initialRepairRequests = [];

// Начальные данные для статей блога
const initialBlogPosts = [];

// Вспомогательные функции для работы с данными
const readData = (file) => {
  try {
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, 'utf8');
      // Удаляем BOM если он есть
      const cleanData = data.replace(/^\uFEFF/, '');
      return JSON.parse(cleanData);
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

if (!fs.existsSync(blogPostsFile)) {
  writeData(blogPostsFile, initialBlogPosts);
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

// Настройка загрузки изображений товаров
const productImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const productImagesDir = path.join(uploadsDir, 'products');
    if (!fs.existsSync(productImagesDir)) {
      fs.mkdirSync(productImagesDir, { recursive: true });
    }
    cb(null, productImagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

const uploadProductImage = multer({ 
  storage: productImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Загрузка изображения товара
app.post('/api/products/upload-image', uploadProductImage.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  
  // Возвращаем URL загруженного файла
  const imageUrl = `/uploads/products/${req.file.filename}`;
  res.json({ url: imageUrl });
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
      options: (() => {
        try { return req.body.options ? JSON.parse(req.body.options) : {}; } catch { return {}; }
      })(),
      totalPrice: req.body.totalPrice ? Number(req.body.totalPrice) : undefined,
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

// Маршруты API для заявок на ремонт
app.get('/api/repair-requests', (req, res) => {
  const requests = readData(repairRequestsFile) || initialRepairRequests;
  res.json(requests);
});

app.get('/api/repair-requests/:id', (req, res) => {
  const requests = readData(repairRequestsFile) || initialRepairRequests;
  const request = requests.find(r => r.id === req.params.id);
  
  if (request) {
    res.json(request);
  } else {
    res.status(404).send('Solicitud de reparación no encontrada');
  }
});

app.post('/api/repair-requests', upload.array('images', 5), (req, res) => {
  try {
    const requests = readData(repairRequestsFile) || initialRepairRequests;
    
    // Генерируем уникальный ID для заявки
    const lastRequest = requests.length > 0 ? requests[requests.length - 1] : { id: 'REP-000' };
    const lastId = parseInt(lastRequest.id ? lastRequest.id.split('-')[1] : '000');
    const newId = `REP-${String(lastId + 1).padStart(3, '0')}`;
    
    const newRequest = {
      id: newId,
      date: new Date().toISOString(),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      partName: req.body.partName,
      description: req.body.description,
      status: 'new',
      images: [],
      isNew: true
    };
    
    // Если были загружены изображения, добавляем информацию о них
    if (req.files && req.files.length > 0) {
      newRequest.images = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        originalName: file.originalname
      }));
    }
    
    requests.push(newRequest);
    
    if (writeData(repairRequestsFile, requests)) {
      res.status(201).json(newRequest);
    } else {
      res.status(500).send('Error al guardar la solicitud de reparación');
    }
  } catch (error) {
    console.error('Error processing repair request:', error);
    res.status(500).send('Error al procesar la solicitud de reparación');
  }
});

app.put('/api/repair-requests/:id', (req, res) => {
  const requests = readData(repairRequestsFile) || initialRepairRequests;
  const updatedRequest = req.body;
  const index = requests.findIndex(r => r.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).send('Solicitud de reparación no encontrada');
  }
  
  requests[index] = updatedRequest;
  
  if (writeData(repairRequestsFile, requests)) {
    res.json(updatedRequest);
  } else {
    res.status(500).send('Error al actualizar la solicitud de reparación');
  }
});

// Маршруты API для статей блога
app.get('/api/blog-posts', (req, res) => {
  const posts = readData(blogPostsFile) || initialBlogPosts;
  res.json(posts);
});

app.get('/api/blog-posts/:id', (req, res) => {
  const posts = readData(blogPostsFile) || initialBlogPosts;
  const post = posts.find(p => p.id === req.params.id);
  
  if (post) {
    res.json(post);
  } else {
    res.status(404).send('Artículo no encontrado');
  }
});

app.post('/api/blog-posts', upload.single('image'), (req, res) => {
  try {
    const posts = readData(blogPostsFile) || initialBlogPosts;
    
    // Генерируем уникальный ID для статьи
    const lastPost = posts.length > 0 ? posts[posts.length - 1] : { id: 'blog-000' };
    const lastId = parseInt(lastPost.id ? lastPost.id.split('-')[1] : '000');
    const newId = `blog-${String(lastId + 1).padStart(3, '0')}`;
    
    const newPost = {
      id: newId,
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      author: req.body.author,
      date: new Date().toISOString(),
      readTime: parseInt(req.body.readTime) || 5,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      image: req.body.image || 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800'
    };
    
    // Если был загружен файл изображения, используем его
    if (req.file) {
      newPost.image = `/uploads/${req.file.filename}`;
    }
    
    posts.push(newPost);
    
    if (writeData(blogPostsFile, posts)) {
      res.status(201).json(newPost);
    } else {
      res.status(500).send('Error al guardar el artículo');
    }
  } catch (error) {
    console.error('Error processing blog post:', error);
    res.status(500).send('Error al procesar el artículo');
  }
});

app.put('/api/blog-posts/:id', upload.single('image'), (req, res) => {
  try {
    const posts = readData(blogPostsFile) || initialBlogPosts;
    const index = posts.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).send('Artículo no encontrado');
    }
    
    const updatedPost = {
      ...posts[index],
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      author: req.body.author,
      readTime: parseInt(req.body.readTime) || 5,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
    };
    
    // Если был загружен новый файл изображения, используем его
    if (req.file) {
      updatedPost.image = `/uploads/${req.file.filename}`;
    }
    
    posts[index] = updatedPost;
    
    if (writeData(blogPostsFile, posts)) {
      res.json(updatedPost);
    } else {
      res.status(500).send('Error al actualizar el artículo');
    }
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).send('Error al actualizar el artículo');
  }
});

app.delete('/api/blog-posts/:id', (req, res) => {
  const posts = readData(blogPostsFile) || initialBlogPosts;
  const index = posts.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).send('Artículo no encontrado');
  }
  
  const deletedPost = posts.splice(index, 1)[0];
  
  if (writeData(blogPostsFile, posts)) {
    res.json(deletedPost);
  } else {
    res.status(500).send('Error al eliminar el artículo');
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