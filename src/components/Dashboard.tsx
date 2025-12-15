import { useState, useEffect } from 'react';
import { Package, Users, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Stats {
  totalSuppliers: number;
  activeSuppliers: number;
  totalProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalOrderValue: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalSuppliers: 0,
    activeSuppliers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        { data: suppliers },
        { data: products },
        { data: orders },
      ] = await Promise.all([
        supabase.from('suppliers').select('*'),
        supabase.from('products').select('*'),
        supabase.from('orders').select('*'),
      ]);

      const activeSuppliers = suppliers?.filter(s => s.status === 'Active').length || 0;
      const lowStockProducts = products?.filter(p => p.units_in_stock <= p.reorder_level).length || 0;
      const pendingOrders = orders?.filter(o => o.status === 'Pending').length || 0;
      const totalOrderValue = orders?.reduce((sum, o) => sum + o.total_amount, 0) || 0;

      setStats({
        totalSuppliers: suppliers?.length || 0,
        activeSuppliers,
        totalProducts: products?.length || 0,
        lowStockProducts,
        totalOrders: orders?.length || 0,
        pendingOrders,
        totalOrderValue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-600 mt-1">Overview of your Aqua Supplier Catalog</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalSuppliers}</p>
              <p className="text-sm text-green-600 mt-1">{stats.activeSuppliers} active</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
              {stats.lowStockProducts > 0 && (
                <p className="text-sm text-orange-600 mt-1 flex items-center gap-1">
                  <AlertTriangle size={14} />
                  {stats.lowStockProducts} low stock
                </p>
              )}
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Package className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
              <p className="text-sm text-yellow-600 mt-1">{stats.pendingOrders} pending</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <ShoppingCart className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Order Value</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${stats.totalOrderValue.toFixed(0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">All time</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-full">
              <TrendingUp className="text-teal-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg shadow-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">Welcome to Aqua Supplier Catalog</h3>
        <p className="text-blue-50 mb-4">
          Manage your suppliers, products, and orders efficiently in one place.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-4">
            <h4 className="font-semibold mb-1">Suppliers</h4>
            <p className="text-sm text-blue-50">Track and manage supplier relationships</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-4">
            <h4 className="font-semibold mb-1">Products</h4>
            <p className="text-sm text-blue-50">Monitor inventory and pricing</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-4">
            <h4 className="font-semibold mb-1">Orders</h4>
            <p className="text-sm text-blue-50">Process and track purchase orders</p>
          </div>
        </div>
      </div>
    </div>
  );
}
