import { create } from 'zustand';
export type CategoryType = 'Veg' | 'NonVeg' | 'Drink';
export type DietaryFilter = 'all' | 'veg' | 'nonveg';
export type VenueType = 'restaurant' | 'foodCourt';
export type TableType = 'private' | 'shared';
export type UserRole = 'admin' | 'waiter' | 'staff';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryType;
  subCategory: string;
  image: string;
  available: boolean;
  preparationTime: number;
  featured?: boolean;
  tags?: string[];
  rating?: number;
  ratingCount?: number;
  reviews?: Review[];
  ingredients?: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Stall {
  id: string;
  name: string;
  description: string;
  logo: string;
  cuisine: string;
  menu: MenuItem[];
}

export interface Restaurant {
  id: string;
  name: string;
  logo: string;
  venueType: VenueType;
  tables: Table[];
  menu: MenuItem[];
  stalls?: Stall[];
  currentStallId?: string;
  description?: string;
  location?: {
    country?: string;
    state?: string;
    city?: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  hours?: {
    open: string;
    close: string;
  };
}

export interface Table {
  id: string;
  number: number;
  seats: number;
  qrCode: string;
  type: TableType;
  isAvailable: boolean;
  isLocked: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
  specialInstructions?: string;
  stallId?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  tableId: string;
  items: CartItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  estimatedDeliveryTime?: Date;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface AppState {
  currentRestaurant: Restaurant | null;
  currentTable: Table | null;
  cart: CartItem[];
  orders: Order[];
  currentOrder: Order | null;
  notifications: Notification[];
  isScanning: boolean;
  dietaryFilter: DietaryFilter;
  selectedMenuItem: MenuItem | null;
  isLoggedIn: boolean;
  userRole: UserRole | null;
  
  login: (role: UserRole) => void;
  logout: () => void;
  setCurrentRestaurant: (restaurant: Restaurant) => void;
  setCurrentTable: (table: Table) => void;
  setDietaryFilter: (filter: DietaryFilter) => void;
  addToCart: (item: MenuItem, quantity: number, specialInstructions?: string, stallId?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItem: (itemId: string, quantity: number, specialInstructions?: string) => void;
  clearCart: () => void;
  placeOrder: () => void;
  updateOrder: (orderId: string, items: CartItem[]) => void;
  cancelOrder: (orderId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  setScanning: (isScanning: boolean) => void;
  setSelectedMenuItem: (item: MenuItem | null) => void;
  setCurrentStall: (stallId: string) => void;
  lockTable: (tableId: string) => void;
  unlockTable: (tableId: string) => void;
}