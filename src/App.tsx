import { useState } from 'react';
import Navigation from './components/Navigation';
import ListProductForm from './components/ListProductForm';
import ListedProducts from './components/ListedProducts';
import ActiveOrders from './components/ActiveOrders';

function App() {
  const [activeTab, setActiveTab] = useState<'list' | 'products' | 'orders'>('list');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProductAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
    setActiveTab('products');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-green-700">Seller Dashboard</h1>
          </div>
        </div>
      </header>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'list' && <ListProductForm onProductAdded={handleProductAdded} />}
        {activeTab === 'products' && <ListedProducts refreshTrigger={refreshTrigger} />}
        {activeTab === 'orders' && <ActiveOrders />}
      </main>
    </div>
  );
}

export default App;
