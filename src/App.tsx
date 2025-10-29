import { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ListProductForm from './components/ListProductForm';
import ListedProducts from './components/ListedProducts';
import ActiveOrders from './components/ActiveOrders';

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'products' | 'orders'>('list');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const enteredUsername = formData.get('username') as string;
    if (enteredUsername.trim()) {
      setUsername(enteredUsername.trim());
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setActiveTab('list');
  };

  const handleProductAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
    setActiveTab('products');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-700 mb-2">Seller Dashboard</h1>
            <p className="text-gray-600">Enter your username to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your username"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header username={username} onLogout={handleLogout} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'list' && (
          <ListProductForm username={username} onProductAdded={handleProductAdded} />
        )}
        {activeTab === 'products' && (
          <ListedProducts username={username} refreshTrigger={refreshTrigger} />
        )}
        {activeTab === 'orders' && <ActiveOrders username={username} />}
      </main>
    </div>
  );
}

export default App;
