/*
  # Room Finder Database Schema

  1. New Tables
    - `rooms`
      - `id` (uuid, primary key) - Unique identifier for each room
      - `title` (text) - Room listing title
      - `description` (text) - Detailed description of the room
      - `location` (text) - Location of the room
      - `city` (text) - City for better filtering
      - `rent_price` (integer) - Monthly rent amount
      - `property_type` (text) - Type: '1 BHK', '2 BHK', '1 Bed', '2 Bed', '3 Bed'
      - `tenant_preference` (text) - Preference: 'Bachelor', 'Family', 'Girls', 'Working'
      - `image_url` (text) - URL to the room image in Supabase storage
      - `owner_id` (uuid) - Foreign key to auth.users
      - `owner_name` (text) - Name of the room owner
      - `owner_contact` (text) - Contact number of the owner
      - `owner_email` (text) - Email of the owner
      - `created_at` (timestamptz) - Timestamp when listing was created
      - `updated_at` (timestamptz) - Timestamp when listing was last updated
      - `is_available` (boolean) - Whether the room is still available

  2. Security
    - Enable RLS on `rooms` table
    - Policy: Anyone can view available rooms
    - Policy: Authenticated users can create rooms
    - Policy: Room owners can update their own rooms
    - Policy: Room owners can delete their own rooms
    
  3. Storage
    - Create storage bucket for room images
    - Allow authenticated users to upload images
    - Allow public access to view images
*/

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  city text NOT NULL,
  rent_price integer NOT NULL,
  property_type text NOT NULL,
  tenant_preference text NOT NULL,
  image_url text,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  owner_name text NOT NULL,
  owner_contact text NOT NULL,
  owner_email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_available boolean DEFAULT true
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_rooms_city ON rooms(city);
CREATE INDEX IF NOT EXISTS idx_rooms_property_type ON rooms(property_type);
CREATE INDEX IF NOT EXISTS idx_rooms_tenant_preference ON rooms(tenant_preference);
CREATE INDEX IF NOT EXISTS idx_rooms_owner_id ON rooms(owner_id);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view available rooms
CREATE POLICY "Anyone can view available rooms"
  ON rooms FOR SELECT
  USING (is_available = true);

-- Policy: Authenticated users can view their own rooms (even if not available)
CREATE POLICY "Users can view own rooms"
  ON rooms FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

-- Policy: Authenticated users can create rooms
CREATE POLICY "Authenticated users can create rooms"
  ON rooms FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Room owners can update their own rooms
CREATE POLICY "Owners can update own rooms"
  ON rooms FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Room owners can delete their own rooms
CREATE POLICY "Owners can delete own rooms"
  ON rooms FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create storage bucket for room images
INSERT INTO storage.buckets (id, name, public)
VALUES ('room-images', 'room-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Authenticated users can upload images
CREATE POLICY "Authenticated users can upload room images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'room-images');

-- Storage policy: Anyone can view room images
CREATE POLICY "Anyone can view room images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'room-images');

-- Storage policy: Users can update their own images
CREATE POLICY "Users can update own images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'room-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policy: Users can delete their own images
CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'room-images' AND auth.uid()::text = (storage.foldername(name))[1]);