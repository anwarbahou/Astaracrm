
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadFilters {
  industry: string;
  country: string;
  jobTitle: string;
  companySize?: string;
  experience?: string;
  language?: string;
  count?: number;
}

interface GeneratedLead {
  fullName: string;
  jobTitle: string;
  company: string;
  country: string;
  industry: string;
  email: string;
  phone?: string;
  linkedin?: string;
  experience: string;
  companySize: string;
  language: string;
  leadScore: number;
  source: string;
}

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

    const { filters }: { filters: LeadFilters } = await req.json();

    // Validate required filters
    if (!filters.industry || !filters.country || !filters.jobTitle) {
      throw new Error('Missing required filters: industry, country, and jobTitle are required');
    }

    // Check rate limits (basic implementation)
    const { data: usageData } = await supabaseClient
      .from('api_usage')
      .select('requests_count, last_request')
      .eq('user_id', user.id)
      .eq('date', new Date().toISOString().split('T')[0])
      .single();

    const dailyLimit = 100; // Configurable rate limit
    if (usageData && usageData.requests_count >= dailyLimit) {
      throw new Error('Daily rate limit exceeded');
    }

    // Generate intelligent prompt for OpenAI
    const prompt = generateLeadPrompt(filters);

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert B2B lead generation specialist focused on MENA and European markets. Generate realistic, high-quality business leads based on specific criteria. Always return valid JSON array format.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
    }

    const openAIData = await openAIResponse.json();
    const generatedContent = openAIData.choices[0].message.content;

    // Parse and validate generated leads
    let leads: GeneratedLead[];
    try {
      leads = JSON.parse(generatedContent);
    } catch (parseError) {
      // Fallback: try to extract JSON from the response
      const jsonMatch = generatedContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        leads = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse generated leads');
      }
    }

    // Enrich and validate leads
    const enrichedLeads = leads.map((lead, index) => ({
      ...lead,
      id: crypto.randomUUID(),
      leadScore: calculateLeadScore(lead),
      source: 'AI Generated',
      dateAdded: new Date().toISOString(),
      status: 'new',
      tags: [filters.industry, filters.country, 'AI Generated'],
      userId: user.id
    }));

    // Store leads in database
    const { error: insertError } = await supabaseClient
      .from('generated_leads')
      .insert(enrichedLeads);

    if (insertError) {
      console.error('Error storing leads:', insertError);
    }

    // Update usage tracking
    await updateUsageTracking(supabaseClient, user.id);

    // Log generation activity
    await supabaseClient
      .from('lead_generation_logs')
      .insert({
        user_id: user.id,
        filters: filters,
        leads_generated: enrichedLeads.length,
        timestamp: new Date().toISOString()
      });

    return new Response(
      JSON.stringify({ 
        leads: enrichedLeads,
        count: enrichedLeads.length,
        filters: filters
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-leads function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateLeadPrompt(filters: LeadFilters): string {
  const count = filters.count || 10;
  
  return `Generate ${count} realistic business leads for the following criteria:

Industry: ${filters.industry}
Country: ${filters.country}
Job Title: ${filters.jobTitle}
Company Size: ${filters.companySize || 'Any'}
Experience Level: ${filters.experience || 'Mid to Senior'}
Language: ${filters.language || 'English/French/Arabic'}

Focus on:
- Moroccan companies and MENA region businesses
- European companies with MENA operations
- Real-sounding names appropriate for the region
- Professional email formats (firstname.lastname@company.com)
- Realistic company names in the specified industry
- Valid phone numbers with country codes
- LinkedIn profile URLs
- Appropriate job titles for the industry

Return ONLY a valid JSON array with this exact structure:
[
  {
    "fullName": "Ahmed El Mansouri",
    "jobTitle": "Marketing Director",
    "company": "TechCorp MENA",
    "country": "Morocco",
    "industry": "${filters.industry}",
    "email": "ahmed.elmansouri@techcorp-mena.com",
    "phone": "+212-6-12-34-56-78",
    "linkedin": "https://linkedin.com/in/ahmed-elmansouri",
    "experience": "8 years",
    "companySize": "200-500 employees",
    "language": "French, Arabic, English"
  }
]

Generate diverse, realistic leads with cultural authenticity for the specified region.`;
}

function calculateLeadScore(lead: GeneratedLead): number {
  let score = 50; // Base score
  
  // Score based on job title seniority
  const seniorTitles = ['CEO', 'CTO', 'CMO', 'Director', 'VP', 'Head of'];
  if (seniorTitles.some(title => lead.jobTitle.includes(title))) {
    score += 20;
  }
  
  // Score based on company size
  if (lead.companySize.includes('500+') || lead.companySize.includes('1000+')) {
    score += 15;
  }
  
  // Score based on contact information completeness
  if (lead.email && lead.phone && lead.linkedin) {
    score += 15;
  }
  
  return Math.min(100, score);
}

async function updateUsageTracking(supabaseClient: any, userId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: existing } = await supabaseClient
    .from('api_usage')
    .select('requests_count')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (existing) {
    await supabaseClient
      .from('api_usage')
      .update({ 
        requests_count: existing.requests_count + 1,
        last_request: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('date', today);
  } else {
    await supabaseClient
      .from('api_usage')
      .insert({
        user_id: userId,
        date: today,
        requests_count: 1,
        last_request: new Date().toISOString()
      });
  }
}
