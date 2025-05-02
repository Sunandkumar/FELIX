/*
  # Storage and User Policies Setup

  1. Changes
    - Set up avatars storage bucket
    - Configure storage policies for avatar management
    - Update user table policies
    
  2. Security
    - Enable RLS on storage bucket
    - Ensure proper user access control
    - Add checks for existing policies
*/

-- First ensure the avatars bucket exists and has RLS enabled
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Enable RLS on the avatars bucket
update storage.buckets
set public = false
where id = 'avatars';

-- Drop existing policies if they exist
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;
drop policy if exists "Users can read their own avatar" on storage.objects;
drop policy if exists "Users can delete their own avatar" on storage.objects;

-- Create storage policies for the avatars bucket
create policy "Users can upload their own avatar"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update their own avatar"
on storage.objects for update to authenticated
using (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can read their own avatar"
on storage.objects for select to authenticated
using (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete their own avatar"
on storage.objects for delete to authenticated
using (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Drop existing user policies if they exist
drop policy if exists "Users can read their own data" on users;
drop policy if exists "Users can update their own data" on users;
drop policy if exists "Users can insert their own data" on users;

-- Update user policies to ensure proper access
create policy "Users can read their own data"
on users for select to authenticated
using (auth.uid() = id);

create policy "Users can update their own data"
on users for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can insert their own data"
on users for insert to authenticated
with check (auth.uid() = id);