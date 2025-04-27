import { create } from 'zustand';
import { 
  AppState, 
  Restaurant, 
  Table, 
  MenuItem, 
  CartItem, 
  Order, 
  Notification,
  DietaryFilter
} from '../types';
import { mockRestaurant } from '../data/mockData';

const useStore = create<AppState>((set) => ({
  currentRestaurant: null,
  currentTable: null,
  cart: [],
  orders: [],
  currentOrder: null,
  notifications: [],
  isScanning: false,
  dietaryFilter: 'all',
  selectedMenuItem: null,
  isLoggedIn: false,

  login: (role: 'admin' | 'waiter' | 'staff') => set((state) => {
    // For demo purposes, set mock data
    return {
      isLoggedIn: true,
      currentRestaurant: mockRestaurant,
      currentTable: mockRestaurant.tables[0],
    };
  }),

  logout: () => set({
    isLoggedIn: false,
    currentRestaurant: null,
    currentTable: null,
    cart: [],
    orders: [],
    currentOrder: null,
    notifications: [],
  }),

  setCurrentRestaurant: (restaurant: Restaurant) => set({ currentRestaurant: restaurant }),
  
  setCurrentTable: (table: Table) => set({ currentTable: table }),
  
  setDietaryFilter: (filter: DietaryFilter) => set({ dietaryFilter: filter }),
  
  setSelectedMenuItem: (item: MenuItem | null) => set({ selectedMenuItem: item }),

  setCurrentStall: (stallId: string) => set((state) => ({
    currentRestaurant: state.currentRestaurant ? {
      ...state.currentRestaurant,
      currentStallId: stallId
    } : null
  })),

  lockTable: (tableId: string) => set((state) => ({
    currentRestaurant: state.currentRestaurant ? {
      ...state.currentRestaurant,
      tables: state.currentRestaurant.tables.map(table => 
        table.id === tableId ? { ...table, isLocked: true } : table
      )
    } : null
  })),

  unlockTable: (tableId: string) => set((state) => ({
    currentRestaurant: state.currentRestaurant ? {
      ...state.currentRestaurant,
      tables: state.currentRestaurant.tables.map(table => 
        table.id === tableId ? { ...table, isLocked: false } : table
      )
    } : null
  })),
  
  addToCart: (item: MenuItem, quantity: number, specialInstructions?: string, stallId?: string) => 
    set((state) => {
      const existingItemIndex = state.cart.findIndex((cartItem) => 
        cartItem.id === item.id && cartItem.stallId === stallId
      );
      
      if (existingItemIndex !== -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity,
          specialInstructions: specialInstructions || updatedCart[existingItemIndex].specialInstructions
        };
        return { cart: updatedCart };
      } else {
        return { 
          cart: [...state.cart, { ...item, quantity, specialInstructions, stallId }] 
        };
      }
    }),
  
  removeFromCart: (itemId: string) => 
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== itemId)
    })),
  
  updateCartItem: (itemId: string, quantity: number, specialInstructions?: string) => 
    set((state) => {
      if (quantity <= 0) {
        return { cart: state.cart.filter((item) => item.id !== itemId) };
      }
      
      return {
        cart: state.cart.map((item) => 
          item.id === itemId 
            ? { ...item, quantity, specialInstructions: specialInstructions ?? item.specialInstructions } 
            : item
        )
      };
    }),
  
  clearCart: () => set({ cart: [] }),
  
  placeOrder: () => 
    set((state) => {
      if (!state.currentTable || !state.currentRestaurant || state.cart.length === 0) {
        return state;
      }
      
      const totalAmount = state.cart.reduce(
        (total, item) => total + item.price * item.quantity, 
        0
      );
      
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        tableId: state.currentTable.id,
        items: [...state.cart],
        status: 'pending',
        totalAmount,
        createdAt: new Date(),
        updatedAt: new Date(),
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000)
      };
      
      const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        message: `Your order has been placed! Order #${newOrder.id}`,
        type: 'success',
        read: false,
        createdAt: new Date()
      };
      
      return {
        orders: [...state.orders, newOrder],
        currentOrder: newOrder,
        notifications: [newNotification, ...state.notifications],
        cart: []
      };
    }),
  
  updateOrder: (orderId: string, items: CartItem[]) => 
    set((state) => {
      const orderIndex = state.orders.findIndex((order) => order.id === orderId);
      
      if (orderIndex === -1) return state;
      
      const totalAmount = items.reduce(
        (total, item) => total + item.price * item.quantity, 
        0
      );
      
      const updatedOrders = [...state.orders];
      updatedOrders[orderIndex] = {
        ...updatedOrders[orderIndex],
        items,
        totalAmount,
        updatedAt: new Date()
      };
      
      const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        message: `Your order #${orderId} has been updated!`,
        type: 'info',
        read: false,
        createdAt: new Date()
      };
      
      return {
        orders: updatedOrders,
        currentOrder: orderId === state.currentOrder?.id 
          ? updatedOrders[orderIndex] 
          : state.currentOrder,
        notifications: [newNotification, ...state.notifications]
      };
    }),
  
  cancelOrder: (orderId: string) => 
    set((state) => {
      const updatedOrders = state.orders.map((order) => 
        order.id === orderId 
          ? { ...order, status: 'cancelled', updatedAt: new Date() } 
          : order
      );
      
      const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        message: `Your order #${orderId} has been cancelled.`,
        type: 'warning',
        read: false,
        createdAt: new Date()
      };
      
      return {
        orders: updatedOrders,
        currentOrder: state.currentOrder?.id === orderId 
          ? { ...state.currentOrder, status: 'cancelled', updatedAt: new Date() } 
          : state.currentOrder,
        notifications: [newNotification, ...state.notifications]
      };
    }),
  
  markNotificationAsRead: (notificationId: string) => 
    set((state) => ({
      notifications: state.notifications.map((notification) => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    })),
  
  setScanning: (isScanning: boolean) => set({ isScanning })
}));

export default useStore;