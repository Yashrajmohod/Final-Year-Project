/*
  # Aqua Supplier Catalog Database Schema

  ## Overview
  Creates the complete database structure for the Aqua Supplier Catalog application,
  enabling management of suppliers, products, and orders.

  ## New Tables

  ### 1. suppliers
  Stores supplier/vendor information
  - `id` (uuid, primary key) - Unique identifier
  - `company_name` (text) - Name of the supplier company
  - `contact_name` (text) - Primary contact person
  - `email` (text) - Contact email address
  - `phone` (text) - Contact phone number
  - `address` (text) - Physical address
  - `city` (text) - City
  - `country` (text) - Country
  - `status` (text) - Active/Inactive status
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. products
  Stores product catalog information
  - `id` (uuid, primary key) - Unique identifier
  - `supplier_id` (uuid, foreign key) - References suppliers table
  - `product_name` (text) - Name of the product
  - `description` (text) - Product description
  - `category` (text) - Product category
  - `unit_price` (numeric) - Price per unit
  - `units_in_stock` (integer) - Current inventory quantity
  - `reorder_level` (integer) - Minimum stock level before reorder
  - `discontinued` (boolean) - Whether product is discontinued
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. orders
  Stores order header information
  - `id` (uuid, primary key) - Unique identifier
  - `order_number` (text, unique) - Human-readable order number
  - `supplier_id` (uuid, foreign key) - References suppliers table
  - `order_date` (date) - Date order was placed
  - `required_date` (date) - Date order is needed
  - `shipped_date` (date, nullable) - Date order was shipped
  - `status` (text) - Order status (Pending/Approved/Shipped/Completed/Cancelled)
  - `total_amount` (numeric) - Total order amount
  - `notes` (text) - Additional order notes
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. order_items
  Stores individual line items for each order
  - `id` (uuid, primary key) - Unique identifier
  - `order_id` (uuid, foreign key) - References orders table
  - `product_id` (uuid, foreign key) - References products table
  - `quantity` (integer) - Quantity ordered
  - `unit_price` (numeric) - Price per unit at time of order
  - `discount` (numeric) - Discount percentage applied
  - `line_total` (numeric) - Total for this line item

  ## Security
  - All tables have RLS enabled
  - Public access policies for demonstration (can be restricted later)

  ## Indexes
  - Foreign key indexes for performance
  - Order number index for quick lookups
*/

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text,
  phone text,
  address text,
  city text,
  country text,
  status text DEFAULT 'Active' NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
  product_name text NOT NULL,
  description text,
  category text,
  unit_price numeric(10, 2) DEFAULT 0 NOT NULL,
  units_in_stock integer DEFAULT 0 NOT NULL,
  reorder_level integer DEFAULT 0 NOT NULL,
  discontinued boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  supplier_id uuid NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
  order_date date DEFAULT CURRENT_DATE NOT NULL,
  required_date date,
  shipped_date date,
  status text DEFAULT 'Pending' NOT NULL,
  total_amount numeric(10, 2) DEFAULT 0 NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity integer NOT NULL,
  unit_price numeric(10, 2) NOT NULL,
  discount numeric(5, 2) DEFAULT 0 NOT NULL,
  line_total numeric(10, 2) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Enable Row Level Security
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demonstration purposes)
-- In production, these should be restricted based on user roles

CREATE POLICY "Allow public read access to suppliers"
  ON suppliers FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to suppliers"
  ON suppliers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to suppliers"
  ON suppliers FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to suppliers"
  ON suppliers FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to products"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to products"
  ON products FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to products"
  ON products FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to orders"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to orders"
  ON orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to orders"
  ON orders FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to order_items"
  ON order_items FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to order_items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to order_items"
  ON order_items FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to order_items"
  ON order_items FOR DELETE
  USING (true);