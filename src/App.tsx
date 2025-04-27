import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
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
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import DashboardPage from './pages/DashboardPage';
import useStore from './store';
import './index.css';

function App() {
  const { isLoggedIn } = useStore();

  useEffect(() => {
    document.title = 'Smart Restaurant Menu';
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={
            isLoggedIn ? <DashboardPage /> : <Navigate to="/auth" replace />
          } />
          <Route path="/auth" element={
            isLoggedIn ? <Navigate to="/" replace /> : <AuthPage />
          } />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/booking" element={
            isLoggedIn ? <BookingPage /> : <Navigate to="/auth" replace />
          } />
          <Route path="/cart" element={
            isLoggedIn ? <CartPage /> : <Navigate to="/auth" replace />
          } />
          <Route path="/orders" element={
            isLoggedIn ? <OrdersPage /> : <Navigate to="/auth" replace />
          } />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/profile" element={
            isLoggedIn ? <ProfilePage /> : <Navigate to="/auth" replace />
          } />
          <Route path="/wallet" element={
            isLoggedIn ? <WalletPage /> : <Navigate to="/auth" replace />
          } />
          <Route path="/discounts" element={
            isLoggedIn ? <DiscountsPage /> : <Navigate to="/auth" replace />
          } />
          <Route path="/rewards" element={
            isLoggedIn ? <RewardsPage /> : <Navigate to="/auth" replace />
          } />
          <Route path="/refunds" element={
            isLoggedIn ? <RefundsPage /> : <Navigate to="/auth" replace />
          } />
          <Route path="/feedback" element={
            isLoggedIn ? <FeedbackPage /> : <Navigate to="/auth" replace />
          } />
          <Route path="/preferences" element={
            isLoggedIn ? <PreferencesPage /> : <Navigate to="/auth" replace />
          } />
          <Route path="/support" element={
            isLoggedIn ? <SupportPage /> : <Navigate to="/auth" replace />
          } />
          <Route path="/notifications" element={
            isLoggedIn ? <NotificationsPage /> : <Navigate to="/auth" replace />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;