import React from 'react';
import { Home, ClipboardList, User, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store';

interface BottomNavigationProps {
  onOrderHistoryClick: () => void;
  onCartClick?: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  onOrderHistoryClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, isLoggedIn } = useStore();
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg safe-area-bottom z-50">
      <div className="max-w-lg mx-auto">
        <nav className="grid grid-cols-5 gap-1">
          <button 
            onClick={() => navigate('/')}
            className={`flex flex-col items-center justify-center py-3 ${
              location.pathname === '/' ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          
          <button 
            onClick={() => navigate('/booking')}
            className={`flex flex-col items-center justify-center py-3 ${
              location.pathname === '/booking' ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Booking</span>
          </button>
          
          <button 
            onClick={() => navigate('/cart')}
            className="flex flex-col items-center justify-center py-3 text-gray-600 relative"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="text-xs mt-1">Cart</span>
            {cartItemsCount > 0 && (
              <span className="absolute top-2 right-1/4 bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemsCount}
              </span>
            )}
          </button>
          
          <button 
            className="flex flex-col items-center justify-center py-3 text-gray-600"
            onClick={onOrderHistoryClick}
          >
            <ClipboardList className="w-6 h-6" />
            <span className="text-xs mt-1">Orders</span>
          </button>
          
          <button 
            className="flex flex-col items-center justify-center py-3 text-gray-600"
            onClick={() => navigate('/account')}
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Account</span>
          </button>
        </nav>
      </div>
      
      {/* Safe area padding for notched devices */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
};

export default BottomNavigation;