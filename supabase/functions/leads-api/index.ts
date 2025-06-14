
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const url = new URL(req.url);
    const pathname = url.pathname;
    const method = req.method;

    // Handle different API endpoints
    if (method === 'GET' && pathname.includes('/leads')) {
      return await handleGetLeads(req, supabaseClient, user.id);
    } else if (method === 'GET' && pathname.includes('/lead/')) {
      return await handleGetLead(req, supabaseClient, user.id);
    } else if (method === 'POST' && pathname.includes('/campaigns')) {
      return await handleCreateCampaign(req, supabaseClient, user.id);
    } else if (method === 'POST' && pathname.includes('/filters/saved')) {
      return await handleSaveFilters(req, supabaseClient, user.id);
    } else if (method === 'GET' && pathname.includes('/filters/saved')) {
      return await handleGetSavedFilters(req, supabaseClient, user.id);
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }), 
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in leads-api function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function handleGetLeads(req: Request, supabaseClient: any, userId: string) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '25');
  const search = url.searchParams.get('search') || '';
  const status = url.searchParams.get('status') || '';
  const industry = url.searchParams.get('industry') || '';
  const country = url.searchParams.get('country') || '';

  const offset = (page - 1) * limit;

  let query = supabaseClient
    .from('generated_leads')
    .select('*', { count: 'exact' })
    .eq('userId', userId)
    .order('dateAdded', { ascending: false })
    .range(offset, offset + limit - 1);

  // Apply filters
  if (search) {
    query = query.or(`fullName.ilike.%${search}%,company.ilike.%${search}%,email.ilike.%${search}%`);
  }
  if (status) {
    query = query.eq('status', status);
  }
  if (industry) {
    query = query.eq('industry', industry);
  }
  if (country) {
    query = query.eq('country', country);
  }

  const { data: leads, error, count } = await query;

  if (error) {
    throw error;
  }

  return new Response(
    JSON.stringify({
      leads,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit)
      }
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function handleGetLead(req: Request, supabaseClient: any, userId: string) {
  const url = new URL(req.url);
  const leadId = url.pathname.split('/').pop();

  const { data: lead, error } = await supabaseClient
    .from('generated_leads')
    .select('*')
    .eq('id', leadId)
    .eq('userId', userId)
    .single();

  if (error) {
    throw error;
  }

  if (!lead) {
    return new Response(
      JSON.stringify({ error: 'Lead not found' }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify(lead),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function handleCreateCampaign(req: Request, supabaseClient: any, userId: string) {
  const { name, leadIds, messageTemplate, duration, budget, status = 'draft' } = await req.json();

  // Validate required fields
  if (!name || !leadIds || !messageTemplate) {
    throw new Error('Missing required fields: name, leadIds, and messageTemplate are required');
  }

  // Create campaign
  const { data: campaign, error: campaignError } = await supabaseClient
    .from('campaigns')
    .insert({
      name,
      message_template: messageTemplate,
      duration,
      budget,
      status,
      user_id: userId,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (campaignError) {
    throw campaignError;
  }

  // Associate leads with campaign
  const campaignLeads = leadIds.map((leadId: string) => ({
    campaign_id: campaign.id,
    lead_id: leadId,
    status: 'pending'
  }));

  const { error: leadsError } = await supabaseClient
    .from('campaign_leads')
    .insert(campaignLeads);

  if (leadsError) {
    throw leadsError;
  }

  return new Response(
    JSON.stringify({ campaign, leadCount: leadIds.length }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function handleSaveFilters(req: Request, supabaseClient: any, userId: string) {
  const { name, filters } = await req.json();

  if (!name || !filters) {
    throw new Error('Missing required fields: name and filters are required');
  }

  const { data, error } = await supabaseClient
    .from('saved_filters')
    .insert({
      name,
      filters,
      user_id: userId,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return new Response(
    JSON.stringify(data),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function handleGetSavedFilters(req: Request, supabaseClient: any, userId: string) {
  const { data: filters, error } = await supabaseClient
    .from('saved_filters')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return new Response(
    JSON.stringify(filters),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}
