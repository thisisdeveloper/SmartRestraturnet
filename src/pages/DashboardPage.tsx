import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Utensils, Clock, CheckCircle, XCircle, 
  ChevronRight
} from 'lucide-react';
import useStore from '../store';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import Cart from '../components/Cart';
import OrderStatus from '../components/OrderStatus';
import Notifications from '../components/Notifications';
import RestaurantDetails from '../components/RestaurantDetails';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, currentRestaurant, userRole } = useStore();
  const [showCart, setShowCart] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const [showRestaurantDetails, setShowRestaurantDetails] = useState(false);

  // Calculate statistics
  const bookedTables = currentRestaurant?.tables.filter(t => !t.isAvailable).length || 0;
  const totalTables = currentRestaurant?.tables.length || 0;
  const waitingOrders = orders.filter(o => o.status === 'pending').length;
  const preparingOrders = orders.filter(o => o.status === 'preparing').length;
  const servedOrders = orders.filter(o => o.status === 'delivered').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

  const stats = [
    {
      title: 'Tables Booked',
      value: `${bookedTables}/${totalTables}`,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-500',
      permission: ['admin', 'waiter']
    },
    {
      title: 'Waiting Orders',
      value: waitingOrders,
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-yellow-500',
      permission: ['admin', 'waiter', 'staff']
    },
    {
      title: 'Being Prepared',
      value: preparingOrders,
      icon: <Utensils className="w-6 h-6" />,
      color: 'bg-purple-500',
      permission: ['admin', 'staff']
    },
    {
      title: 'Served Orders',
      value: servedOrders,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-green-500',
      permission: ['admin', 'waiter']
    },
    {
      title: 'Cancelled Orders',
      value: cancelledOrders,
      icon: <XCircle className="w-6 h-6" />,
      color: 'bg-red-500',
      permission: ['admin']
    }
  ];

  const recentOrders = orders
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  // Handle overlay visibility
  const handleCartClick = () => {
    setShowNotifications(false);
    setShowOrderStatus(false);
    setShowRestaurantDetails(false);
    setShowCart(true);
  };
  
  const handleNotificationsClick = () => {
    setShowCart(false);
    setShowOrderStatus(false);
    setShowRestaurantDetails(false);
    setShowNotifications(true);
  };
  
  const handleOrderStatusClick = () => {
    setShowCart(false);
    setShowNotifications(false);
    setShowRestaurantDetails(false);
    setShowOrderStatus(true);
  };

  const handleRestaurantClick = () => {
    setShowCart(false);
    setShowNotifications(false);
    setShowOrderStatus(false);
    setShowRestaurantDetails(true);
  };

  const handleOrderHistoryClick = () => {
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-[calc(4rem+env(safe-area-inset-bottom))]">
      <Header 
        onNotificationsClick={handleNotificationsClick}
        onOrderStatusClick={handleOrderStatusClick}
        onRestaurantClick={handleRestaurantClick}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium capitalize">
            {userRole} Dashboard
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats
            .filter(stat => stat.permission.includes(userRole as string))
            .map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center">
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    {stat.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{stat.title}</h3>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
          </div>
          <div className="divide-y">
            {recentOrders.map(order => (
              <div key={order.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">Order #{order.id}</span>
                      <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        order.status === 'preparing' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Table #{currentRestaurant?.tables.find(t => t.id === order.tableId)?.number}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-4">
                      <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} items
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation
        onOrderHistoryClick={handleOrderHistoryClick}
        onCartClick={handleCartClick}
      />

      {/* Overlays */}
      {showCart && <Cart isVisible={showCart} onClose={() => setShowCart(false)} />}
      {showNotifications && <Notifications isVisible={showNotifications} onClose={() => setShowNotifications(false)} />}
      {showOrderStatus && <OrderStatus isVisible={showOrderStatus} onClose={() => setShowOrderStatus(false)} />}
      {showRestaurantDetails && <RestaurantDetails isVisible={showRestaurantDetails} onClose={() => setShowRestaurantDetails(false)} />}
    </div>
  );
};

export default DashboardPage;