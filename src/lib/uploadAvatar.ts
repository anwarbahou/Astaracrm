import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads an avatar file to the public `userprofileimage` bucket and returns its public URL.
 */
export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const filePath = `${userId}.${ext}`;

  console.log('[uploadAvatar] Uploading', filePath, 'to userprofileimage bucket');

  const { error } = await supabase.storage
    .from('userprofileimage')
    .upload(filePath, file, { upsert: true });

  if (error) {
    console.error('[uploadAvatar] Upload error', error);
    throw error;
  }

  console.log('[uploadAvatar] Upload successful');

  const { data } = supabase.storage.from('userprofileimage').getPublicUrl(filePath);
  console.log('[uploadAvatar] Public URL generated', data.publicUrl);
  return data.publicUrl;
} 