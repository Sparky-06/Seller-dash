import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  username: string;
  name: string;
  price: number;
  original_price: number;
  image: string;
  brand: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  product_id: string;
  buyer_name: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  seller_username: string;
  created_at: string;
  updated_at: string;
  products?: Product;
}
