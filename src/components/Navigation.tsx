import { Package, List, ShoppingCart } from 'lucide-react';

interface NavigationProps {
  activeTab: 'list' | 'products' | 'orders';
  onTabChange: (tab: 'list' | 'products' | 'orders') => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'list' as const, label: 'List Product', icon: Package },
    { id: 'products' as const, label: 'Listed Products', icon: List },
    { id: 'orders' as const, label: 'Active Orders', icon: ShoppingCart },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-700'
                    : 'border-transparent text-gray-600 hover:text-green-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
