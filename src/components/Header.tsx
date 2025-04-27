import React, { useState, useEffect, useRef } from 'react';
import { Bell, List, Map, ClipboardCheck, ChevronDown, Lock, Unlock } from 'lucide-react';
import useStore from '../store';
import { DietaryFilter, Stall } from '../types';

interface HeaderProps {
  onNotificationsClick: () => void;
  onOrderStatusClick: () => void;
  onRestaurantClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onNotificationsClick,
  onOrderStatusClick,
  onRestaurantClick
}) => {
  const { 
    currentRestaurant, 
    currentTable,
    notifications,
    orders,
    setCurrentStall,
    setCurrentTable,
    lockTable,
    unlockTable
  } = useStore();
  
  const [showStallDropdown, setShowStallDropdown] = useState(false);
  const [showTableDropdown, setShowTableDropdown] = useState(false);
  
  const stallDropdownRef = useRef<HTMLDivElement>(null);
  const tableDropdownRef = useRef<HTMLDivElement>(null);
  
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const activeOrders = orders.filter(order => 
    order.status !== 'cancelled' && 
    order.status !== 'delivered' && 
    order.status !== 'ready'
  ).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stallDropdownRef.current && !stallDropdownRef.current.contains(event.target as Node)) {
        setShowStallDropdown(false);
      }
      if (tableDropdownRef.current && !tableDropdownRef.current.contains(event.target as Node)) {
        setShowTableDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStallChange = (stall: Stall) => {
    setCurrentStall(stall.id);
    setShowStallDropdown(false);
  };

  const handleTableChange = (table: typeof currentRestaurant.tables[0]) => {
    setCurrentTable(table);
    setShowTableDropdown(false);
  };

  const getCurrentStall = () => {
    if (!currentRestaurant?.stalls || !currentRestaurant.currentStallId) return null;
    return currentRestaurant.stalls.find(s => s.id === currentRestaurant.currentStallId);
  };

  const handleRestaurantClick = (e: React.MouseEvent) => {
    if (currentRestaurant?.venueType === 'foodCourt') {
      e.stopPropagation();
      setShowStallDropdown(!showStallDropdown);
    } else {
      onRestaurantClick();
    }
  };

  const handleStallImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRestaurantClick();
  };

  const getAvailableTables = () => {
    if (!currentRestaurant) return [];
    return currentRestaurant.tables.filter(table => 
      table.isAvailable && (!table.isLocked || table.type === 'shared')
    );
  };

  const toggleTableLock = (tableId: string, isLocked: boolean) => {
    if (isLocked) {
      unlockTable(tableId);
    } else {
      lockTable(tableId);
    }
  };

  const currentStall = getCurrentStall();
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {currentRestaurant ? (
              <div 
                className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleRestaurantClick}
              >
                <img 
                  src={currentRestaurant.venueType === 'foodCourt' && currentStall 
                    ? currentStall.logo 
                    : currentRestaurant.logo
                  } 
                  alt={currentRestaurant.venueType === 'foodCourt' && currentStall 
                    ? currentStall.name 
                    : currentRestaurant.name
                  }
                  className="w-10 h-10 rounded-full object-cover mr-2 cursor-pointer"
                  onClick={handleStallImageClick}
                />
                <div>
                  <div className="flex items-center">
                    <h1 className="font-bold text-lg leading-tight">
                      {currentRestaurant.venueType === 'foodCourt' && currentStall 
                        ? currentStall.name 
                        : currentRestaurant.name
                      }
                    </h1>
                    {currentRestaurant.venueType === 'foodCourt' && (
                      <button 
                        className="ml-2 text-gray-600 hover:text-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowStallDropdown(!showStallDropdown);
                        }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Map size={14} className="text-gray-500 mr-1" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTableDropdown(!showTableDropdown);
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                    >
                      {currentTable ? (
                        <>
                          {currentRestaurant.venueType === 'foodCourt' ? (
                            <>
                              {currentRestaurant.name} • Table #{currentTable.number}
                            </>
                          ) : (
                            `Table #${currentTable.number}`
                          )}
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </>
                      ) : (
                        'Select Table'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                  <List />
                </div>
                <h1 className="ml-2 font-bold text-lg">
                  QR Menu
                </h1>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {activeOrders > 0 && (
              <button
                onClick={onOrderStatusClick}
                className="relative p-2 rounded-full hover:bg-gray-100"
                aria-label="View active orders"
              >
                <ClipboardCheck className="h-6 w-6 text-gray-600" />
                <span className="absolute top-0 right-0 bg-purple-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  {activeOrders}
                </span>
              </button>
            )}
            
            <button
              onClick={onNotificationsClick}
              className="relative p-2 rounded-full hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6 text-gray-600" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Stall Dropdown */}
        {currentRestaurant?.venueType === 'foodCourt' && currentRestaurant.stalls && showStallDropdown && (
          <div 
            ref={stallDropdownRef}
            className="absolute mt-2 w-64 bg-white rounded-lg shadow-lg border z-20"
          >
            {currentRestaurant.stalls.map((stall: Stall) => (
              <button
                key={stall.id}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center"
                onClick={() => handleStallChange(stall)}
              >
                <img 
                  src={stall.logo} 
                  alt={stall.name}
                  className="w-8 h-8 rounded-full object-cover mr-2 cursor-pointer" 
                  onClick={handleStallImageClick}
                />
                <div>
                  <div className="font-medium">{stall.name}</div>
                  <div className="text-sm text-gray-500">{stall.cuisine}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Table Dropdown */}
        {showTableDropdown && currentRestaurant && (
          <div 
            ref={tableDropdownRef}
            className="absolute mt-2 w-64 bg-white rounded-lg shadow-lg border z-20"
          >
            {getAvailableTables().map((table) => (
              <button
                key={table.id}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between"
                onClick={() => handleTableChange(table)}
              >
                <div>
                  <div className="font-medium">Table #{table.number}</div>
                  <div className="text-sm text-gray-500">
                    {table.seats} seats • {table.type}
                  </div>
                </div>
                {table.type === 'private' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTableLock(table.id, table.isLocked);
                    }}
                    className={`p-1 rounded-full ${
                      table.isLocked 
                        ? 'text-red-600 hover:bg-red-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {table.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;