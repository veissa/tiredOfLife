import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProducersPage from './pages/ProducersPage';
import PickupPointsPage from './pages/PickupPointsPage';
import CustomerAccountPage from './pages/CustomerAccountPage';
import ProviderAccountPage from './pages/ProviderAccountPage';
import CreateShopPage from './pages/CreateShopPage';
import NotFound from './pages/NotFound';
import CartPage from './pages/CartPage';
import { ProtectedRoute } from './components/ProtectedRoute';

// Assuming Auth is handled via a modal or a separate login component that doesn't need its own page route here.
// If you have a dedicated AuthPage.tsx, please ensure it's imported and routed correctly.

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/producers" element={<ProducersPage />} />
      <Route path="/pickup-points" element={<PickupPointsPage />} />
      <Route 
        path="/account/customer" 
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerAccountPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/account/provider" 
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <ProviderAccountPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-shop" 
        element={
          <ProtectedRoute allowedRoles={['producer']}>
            <CreateShopPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/cart" element={<CartPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
