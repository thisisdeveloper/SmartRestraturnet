import React, { useState } from 'react';
import { ArrowLeft, Search, MapPin, Navigation, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Restaurant } from '../types';
import useStore from '../store';
import { mockRestaurant, mockFoodCourt } from '../data/mockData';

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' }
];

const statesByCountry: Record<string, string[]> = {
  'US': ['New York', 'California', 'Texas', 'Florida'],
  'UK': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'CA': ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
  'AU': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'],
  'IN': ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu']
};

const citiesByState: Record<string, string[]> = {
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Syracuse'],
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore']
};

interface Location {
  country: string;
  state: string;
  city: string;
  pincode?: string;
}

// Use both restaurant and food court in the mock data
const mockRestaurants: Restaurant[] = [
  mockRestaurant,
  mockFoodCourt,
  {
    id: 'rest-3',
    name: 'Sushi Master',
    description: 'Premium Japanese dining experience',
    logo: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=800',
    venueType: 'restaurant',
    location: {
      country: 'US',
      state: 'California',
      city: 'San Francisco',
      address: '789 Pine St, San Francisco, CA 94101',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    tables: mockRestaurant.tables,
    menu: mockRestaurant.menu
  }
];

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentRestaurant, setCurrentTable } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [location, setLocation] = useState<Location>({
    country: '',
    state: '',
    city: '',
    pincode: ''
  });

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCountry = !location.country || 
      restaurant.location?.country === location.country;
    
    const matchesState = !location.state || 
      restaurant.location?.state === location.state;
    
    const matchesCity = !location.city || 
      restaurant.location?.city === location.city;

    const matchesPincode = !location.pincode ||
      restaurant.location?.address.includes(location.pincode);

    return matchesSearch && matchesCountry && matchesState && matchesCity && matchesPincode;
  });

  const handleCountryChange = (country: string) => {
    setLocation({
      country,
      state: '',
      city: '',
      pincode: location.pincode
    });
  };

  const handleStateChange = (state: string) => {
    setLocation({
      ...location,
      state,
      city: '',
    });
  };

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setCurrentRestaurant(restaurant);
    setCurrentTable(restaurant.tables[0]);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/scan')}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold ml-2">Find Restaurants</h1>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <button
          onClick={() => setShowLocationFilter(!showLocationFilter)}
          className="w-full mb-4 py-3 px-4 bg-white rounded-xl border border-gray-300 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-indigo-600 mr-2" />
            <span className="font-medium">Filter by Location</span>
          </div>
          {showLocationFilter ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {showLocationFilter && (
          <div className="bg-white p-4 rounded-xl shadow-sm mb-4 animate-fade-in">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  value={location.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  value={location.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={!location.country}
                >
                  <option value="">Select State</option>
                  {location.country && statesByCountry[location.country]?.map(state => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  value={location.city}
                  onChange={(e) => setLocation({ ...location, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={!location.state}
                >
                  <option value="">Select City</option>
                  {location.state && citiesByState[location.state]?.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode (Optional)
                </label>
                <input
                  type="text"
                  value={location.pincode}
                  onChange={(e) => setLocation({ ...location, pincode: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter pincode"
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {filteredRestaurants.map(restaurant => (
            <div
              key={restaurant.id}
              onClick={() => handleRestaurantSelect(restaurant)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex">
                <img
                  src={restaurant.logo}
                  alt={restaurant.name}
                  className="w-24 h-24 object-cover"
                />
                <div className="p-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      {restaurant.venueType === 'foodCourt' ? 'Food Court' : 'Restaurant'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{restaurant.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Navigation className="w-4 h-4 mr-1" />
                    {restaurant.location?.address}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredRestaurants.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No restaurants found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;