-- Set role to postgres first
SET ROLE postgres;

-- Create avatars storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload avatars
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid() = owner
);

-- Allow authenticated users to update their own avatars
CREATE POLICY "Allow authenticated users to update their own avatars"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid() = owner
);

-- Allow authenticated users to delete their own avatars
CREATE POLICY "Allow authenticated users to delete their own avatars"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid() = owner
);

-- Allow public read access to avatars
CREATE POLICY "Allow public read access to avatars"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');

-- Reset role
RESET ROLE; 