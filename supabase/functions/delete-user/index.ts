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

    const { userId } = body;
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
    }

    // 1. Delete from users table
    const { error: tableError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);

    if (tableError) {
      return new Response(JSON.stringify({ error: tableError.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
    }

    // 2. Delete from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
}); 