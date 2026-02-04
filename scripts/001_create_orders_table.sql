-- Create orders table for Take & Go Falkenberg
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'swish',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  order_status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert orders (customers placing orders)
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to view orders (for order tracking and admin)
CREATE POLICY "Anyone can view orders" ON orders
  FOR SELECT
  USING (true);

-- Allow anyone to update orders (for admin panel)
CREATE POLICY "Anyone can update orders" ON orders
  FOR UPDATE
  USING (true);
