import { useState } from 'react';
import { LayoutDashboard, Users, Package, ShoppingCart, Droplet } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Suppliers from './components/Suppliers';
import Products from './components/Products';
import Orders from './components/Orders';

type Page = 'dashboard' | 'suppliers' | 'products' | 'orders';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const navigation = [
    { id: 'dashboard' as Page, name: 'Dashboard', icon: LayoutDashboard },
    { id: 'suppliers' as Page, name: 'Suppliers', icon: Users },
    { id: 'products' as Page, name: 'Products', icon: Package },
    { id: 'orders' as Page, name: 'Orders', icon: ShoppingCart },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'suppliers':
        return <Suppliers />;
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-blue-500 to-teal-500 p-2 rounded-lg">
                  <Droplet className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Aqua Supplier Catalog</h1>
                  <p className="text-xs text-gray-500">Inventory Management System</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white shadow-md min-h-[calc(100vh-4rem)]">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon
                      className={`mr-3 flex-shrink-0 ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                      size={20}
                    />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
