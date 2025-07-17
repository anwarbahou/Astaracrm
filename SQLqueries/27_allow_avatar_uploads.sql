-- Create a policy that allows authenticated users to upload to the 'avatars' bucket
CREATE POLICY "Allow authenticated uploads to avatars bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars'); 