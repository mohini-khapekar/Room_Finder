import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Room = {
  id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  rent_price: number;
  property_type: string;
  tenant_preference: string;
  image_url: string | null;
  owner_id: string;
  owner_name: string;
  owner_contact: string;
  owner_email: string;
  created_at: string;
  updated_at: string;
  is_available: boolean;
};
