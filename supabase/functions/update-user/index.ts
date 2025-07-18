import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: 'Missing environment variables' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
    }
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    let body: any = {};
    try {
      body = await req.json();
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
    }

    const { userId, firstName, lastName, role, avatarUrl, email } = body;
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
    }

    // 1. Update users table
    const updateFields: any = {};
    if (firstName !== undefined) updateFields.first_name = firstName;
    if (lastName !== undefined) updateFields.last_name = lastName;
    if (role !== undefined) updateFields.role = role;
    if (avatarUrl !== undefined) updateFields.avatar_url = avatarUrl;
    if (email !== undefined) updateFields.email = email;

    let updatedUserTable = null;
    if (Object.keys(updateFields).length > 0) {
      const { data, error } = await supabaseAdmin
        .from('users')
        .update(updateFields)
        .eq('id', userId)
        .select()
        .single();
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
      }
      updatedUserTable = data;
    }

    // 2. Update Supabase Auth user metadata
    const userMeta: any = {};
    if (firstName !== undefined) userMeta.firstName = firstName;
    if (lastName !== undefined) userMeta.lastName = lastName;
    if (role !== undefined) userMeta.role = role;
    if (avatarUrl !== undefined) userMeta.avatarUrl = avatarUrl;
    // Only update email if provided
    const updateAuthFields: any = {};
    if (Object.keys(userMeta).length > 0) updateAuthFields.user_metadata = userMeta;
    if (email !== undefined) updateAuthFields.email = email;

    let updatedAuthUser = null;
    if (Object.keys(updateAuthFields).length > 0) {
      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, updateAuthFields);
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
      }
      updatedAuthUser = data.user;
    }

    return new Response(
      JSON.stringify({ user: updatedUserTable, authUser: updatedAuthUser }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
}); 