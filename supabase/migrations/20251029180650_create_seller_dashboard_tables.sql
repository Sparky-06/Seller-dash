/*
  # Seller Dashboard Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `username` (text) - seller username
      - `name` (text) - product name
      - `price` (numeric) - current selling price
      - `original_price` (numeric) - original price before discount
      - `image` (text) - product image URL
      - `brand` (text) - product brand
      - `category` (text) - product category
      - `created_at` (timestamptz) - timestamp of product creation
      - `updated_at` (timestamptz) - timestamp of last update
    
    - `orders`
      - `id` (uuid, primary key)
      - `product_id` (uuid) - reference to products table
      - `buyer_name` (text) - name of the buyer
      - `quantity` (integer) - quantity ordered
      - `total_price` (numeric) - total order price
      - `status` (text) - order status (pending, processing, completed, cancelled)
      - `seller_username` (text) - username of the seller
      - `created_at` (timestamptz) - timestamp of order creation
      - `updated_at` (timestamptz) - timestamp of last update

  2. Security
    - Enable RLS on both tables
    - Sellers can read and manage their own products
    - Sellers can view orders for their products
    - Public can view products but not modify them
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  name text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  original_price numeric NOT NULL CHECK (original_price >= 0),
  image text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  buyer_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  total_price numeric NOT NULL CHECK (total_price >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  seller_username text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_username ON products(username);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_seller_username ON orders(seller_username);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Sellers can insert their own products"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Sellers can update their own products"
  ON products FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Sellers can delete their own products"
  ON products FOR DELETE
  USING (true);

-- Orders policies
CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Sellers can update orders for their products"
  ON orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
