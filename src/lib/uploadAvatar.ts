import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads an avatar file to the public `userprofileimage` bucket and returns its public URL.
 */
export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${userId}-${new Date().getTime()}.${ext}`;

  console.log('[uploadAvatar] Uploading to userprofileimage bucket:', fileName);

  const { error } = await supabase.storage
    .from('userprofileimage')
    .upload(fileName, file, { upsert: false });

  if (error) {
    console.error('[uploadAvatar] Upload error', error);
    throw error;
  }

  console.log('[uploadAvatar] Upload successful');

  const { data } = supabase.storage.from('userprofileimage').getPublicUrl(fileName);
  console.log('[uploadAvatar] Public URL generated', data.publicUrl);
  return data.publicUrl;
} 