import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import DeliveryPage from './pages/DeliveryPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import FirmwareModPage from './pages/FirmwareModPage';
import TiresPage from './pages/TiresPage';
import AdBluePage from './pages/AdBluePage';
import AdminPage from './pages/AdminPage';
import { CartProvider } from './context/CartContext';

function App() {
  // Проверяем, находимся ли мы на странице администратора
  const isAdminPage = window.location.pathname === '/admin';
  
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {!isAdminPage && <Header />}
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/product/:productId" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/delivery" element={<DeliveryPage />} />
              <Route path="/firmware-mod" element={<FirmwareModPage />} />
              <Route path="/tires" element={<TiresPage />} />
              <Route path="/adblue" element={<AdBluePage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          {!isAdminPage && <Footer />}
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;