export interface Database {
  public: {
    Tables: {
      suppliers: {
        Row: Supplier;
        Insert: Omit<Supplier, 'id' | 'created_at'>;
        Update: Partial<Omit<Supplier, 'id' | 'created_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Order, 'id' | 'created_at' | 'updated_at'>>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, 'id'>;
        Update: Partial<Omit<OrderItem, 'id'>>;
      };
    };
  };
}

export interface Supplier {
  id: string;
  company_name: string;
  contact_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  status: string;
  created_at: string;
}

export interface Product {
  id: string;
  supplier_id: string;
  product_name: string;
  description: string | null;
  category: string | null;
  unit_price: number;
  units_in_stock: number;
  reorder_level: number;
  discontinued: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  supplier_id: string;
  order_date: string;
  required_date: string | null;
  shipped_date: string | null;
  status: string;
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  discount: number;
  line_total: number;
}

export interface ProductWithSupplier extends Product {
  supplier?: Supplier;
}

export interface OrderWithDetails extends Order {
  supplier?: Supplier;
  order_items?: (OrderItem & { product?: Product })[];
}
