import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads an avatar file to the public `userprofileimage` bucket and returns its public URL.
 */
export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${userId}-${new Date().getTime()}.${ext}`;

  const { error } = await supabase.storage
    .from('userprofileimage')
    .upload(fileName, file, { upsert: false });

  if (error) {
    console.error('[uploadAvatar] Upload error', error);
    throw error;
  }

  const { data } = supabase.storage.from('userprofileimage').getPublicUrl(fileName);
  return data.publicUrl;
} 