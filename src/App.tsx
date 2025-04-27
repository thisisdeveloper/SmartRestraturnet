import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerView from './pages/CustomerView';
import OrdersPage from './pages/OrdersPage';
import AccountPage from './pages/AccountPage';
import ProfilePage from './pages/ProfilePage';
import WalletPage from './pages/WalletPage';
import DiscountsPage from './pages/DiscountsPage';
import RewardsPage from './pages/RewardsPage';
import RefundsPage from './pages/RefundsPage';
import FeedbackPage from './pages/FeedbackPage';
import PreferencesPage from './pages/PreferencesPage';
import SupportPage from './pages/SupportPage';
import NotificationsPage from './pages/NotificationsPage';
import AuthPage from './pages/AuthPage';
import QRScanner from './components/QRScanner';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import './index.css';

function App() {
  useEffect(() => {
    document.title = 'Smart Restaurant Menu';
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/scan" element={<QRScanner />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/" element={<CustomerView />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/discounts" element={<DiscountsPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/refunds" element={<RefundsPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;