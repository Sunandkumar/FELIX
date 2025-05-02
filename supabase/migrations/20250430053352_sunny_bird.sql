/*
  # Storage Bucket and Policies Setup

  1. Changes
    - Create avatars bucket if it doesn't exist
    - Enable RLS on avatars bucket
    - Add policies for authenticated users to:
      - Upload files
      - Read files
      - Update their own files
      - Delete their own files
  
  2. Security
    - Only authenticated users can upload files
    - Files are publicly readable
    - Users can only modify their own files
    - File names must start with user's ID
*/

-- Create avatars bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Enable RLS
alter table storage.objects enable row level security;

-- Allow public file reading
create policy "Avatar files are publicly accessible"
on storage.objects for select
to public
using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload avatar files
create policy "Users can upload avatar files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own avatar files
create policy "Users can update own avatar files"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatar files
create policy "Users can delete own avatar files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);