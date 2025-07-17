import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.0";

interface UserCreationRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'user';
  avatarUrl: string;
  password?: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const requestBody = await req.json();
    console.log('📝 Received request:', { ...requestBody, password: '[REDACTED]' });
    
    const { email, firstName, lastName, role, avatarUrl, password }: UserCreationRequest = requestBody;

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      },
    });

    if (authError) {
      console.error('❌ Auth creation failed:', authError);
      // Check for duplicate email error from Supabase
      if (authError.message && authError.message.toLowerCase().includes('user already registered')) {
        return new Response(JSON.stringify({ error: 'This email is already in use. Please use a different email.' }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
          },
          status: 400,
        });
      }
      throw authError;
    }
    
    console.log('✅ User created in auth:', authData.user?.id);

    if (authData.user) {
      // First try to insert, if it already exists (from auth trigger), update it
      const { error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          first_name: firstName,
          last_name: lastName,
          role,
          avatar_url: avatarUrl,
        });

      // If insert fails due to duplicate key, update instead
      if (insertError && insertError.code === '23505') {
        // This means the user already exists in the users table, but we still want to show the friendly message if this is due to duplicate email
        return new Response(JSON.stringify({ error: 'This email is already in use. Please use a different email.' }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
          },
          status: 400,
        });
      } else if (insertError) {
        console.error('❌ Profile insert failed:', insertError);
        throw insertError;
      } else {
        console.log('✅ User profile created');
      }
    }

    return new Response(JSON.stringify({ user: authData.user }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
      status: 200,
    });
  } catch (error) {
    console.error('🔥 Function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
      status: 400,
    });
  }
});
