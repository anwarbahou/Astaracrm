import type { Contact } from '@/components/contacts/ContactsTable';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { notificationService } from '@/services/notificationService';

// Database types
type ContactRow = Database['public']['Tables']['contacts']['Row'];
type ContactInsert = Database['public']['Tables']['contacts']['Insert'];
type ContactUpdate = Database['public']['Tables']['contacts']['Update'];

export interface ContactInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
  company?: string;
  country?: string;
  status?: 'Active' | 'Inactive';
  tags?: string[];
  notes?: string;
  owner?: string;
}

export interface ContactsServiceOptions {
  userId: string;
  userRole: 'admin' | 'manager' | 'user' | null;
}

// Convert database contact to UI contact format
const dbContactToContact = (dbContact: ContactRow & { owner?: any }): Contact => {
  return {
    id: typeof dbContact.id === 'string' ? parseInt(dbContact.id.slice(-8), 16) : Date.now(),
    firstName: dbContact.first_name,
    lastName: dbContact.last_name,
    email: dbContact.email || '',
    phone: dbContact.phone || '',
    role: dbContact.role || '',
    company: dbContact.company || '',
    tags: dbContact.tags || [],
    country: dbContact.country || '',
    status: dbContact.status === 'active' ? 'Active' : 'Inactive',
    createdDate: dbContact.created_at ? new Date(dbContact.created_at).toLocaleDateString() : '',
    lastContacted: dbContact.last_contacted_at ? new Date(dbContact.last_contacted_at).toLocaleDateString() : 'Never',
    notes: dbContact.notes || '',
    visibility: 'Public',
    owner: dbContact.owner ? `${dbContact.owner.first_name} ${dbContact.owner.last_name}` : undefined,
  };
};

// Convert UI contact input to database format
const contactInputToDbInsert = (input: Omit<ContactInput, 'owner'> & { owner?: string | null }, ownerId: string): ContactInsert => {
  return {
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    phone: input.phone || null,
    role: input.role || null,
    company: input.company || null,
    country: input.country || null,
    status: input.status === 'Inactive' ? 'inactive' : 'active',
    tags: input.tags || [],
    notes: input.notes || null,
    owner_id: input.owner || ownerId,
  };
};

// Convert UI contact input to database update format
const contactInputToDbUpdate = (input: Partial<ContactInput>): ContactUpdate => {
  return {
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email || null,
    phone: input.phone || null,
    role: input.role || null,
    company: input.company || null,
    country: input.country || null,
    status: input.status === 'Inactive' ? 'inactive' : 'active',
    tags: input.tags || [],
    notes: input.notes || null,
  };
};

export const contactsService = {
  async checkEmailExists(email: string): Promise<{ data: boolean }> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('id')
        .eq('email', email.trim().toLowerCase())
        .limit(1);
      
      if (error) {
        console.error('Error checking email existence:', error);
        throw error;
      }
      
      return { data: data && data.length > 0 };
    } catch (error) {
      console.error('Error checking email existence:', error);
      throw error;
    }
  },

  async getContacts(options: ContactsServiceOptions): Promise<Contact[]> {
    const { userId, userRole } = options;
    
    try {
      let query = supabase.from('contacts').select(`
        *,
        owner:users!contacts_owner_id_fkey(first_name, last_name)
      `);
      
      // Apply role-based filtering for non-admins
      if (userRole !== 'admin') {
        query = query.eq('owner_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching contacts from Supabase:', error);
        throw error;
      }
      
      const contacts = data.map(dbContactToContact);
      
      console.log(`🔗 Supabase: ${userRole === 'admin' ? '🔑 Admin' : '👤 User'} viewing contacts: ${contacts.length} total`);
      if (userRole === 'admin') {
        const ownerGroups = data.reduce((acc, contact) => {
          const owner = contact.owner_id || 'unassigned';
          acc[owner] = (acc[owner] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        console.log('📊 Contact ownership breakdown:');
        Object.entries(ownerGroups).forEach(([ownerId, count]) => {
          console.log(`   ${ownerId === userId ? '👤 YOU' : '👥 OTHER'}: ${ownerId.substring(0, 8)}... (${count} contacts)`);
        });
      }
      
      return contacts;
    } catch (error) {
      console.error('Error fetching contacts from Supabase:', error);
      throw error;
    }
  },

  async createContact(contactInput: ContactInput, options: ContactsServiceOptions): Promise<Contact | null> {
    const { userId } = options;
    
    try {
      const dbInsert = contactInputToDbInsert(contactInput, userId);
      const { data, error } = await supabase
        .from('contacts')
        .insert(dbInsert)
        .select(`
          *,
          owner:users!contacts_owner_id_fkey(first_name, last_name)
        `)
        .single();
      
      if (error) {
        console.error('Error creating contact in Supabase:', error);
        throw error;
      }
      
      const contact = dbContactToContact(data);
      console.log(`🔗 Supabase: Contact created by user ${userId}:`, contact.firstName, contact.lastName);
      return contact;
    } catch (error) {
      console.error('Error creating contact in Supabase:', error);
      throw error;
    }
  },

  async updateContact(id: number, contactInput: Partial<ContactInput>, options: ContactsServiceOptions): Promise<Contact | null> {
    const { userId, userRole } = options;
    
    try {
      // First, find the contact by converting the numeric ID back to UUID
      // We need to find the contact first to get its UUID
      const { data: existingContacts, error: findError } = await supabase
        .from('contacts')
        .select(`
          *,
          owner:users!contacts_owner_id_fkey(first_name, last_name)
        `);
      
      if (findError) {
        console.error('Error finding contact:', findError);
        throw findError;
      }
      
      // Find the contact with matching numeric ID
      const existingContact = existingContacts.find(contact => {
        const numericId = parseInt(contact.id.slice(-8), 16);
        return numericId === id;
      });
      
      if (!existingContact) {
        throw new Error('Contact not found');
      }
      
      // Check permissions
      if (userRole !== 'admin' && existingContact.owner_id !== userId) {
        throw new Error('Access denied: You can only update your own contacts');
      }
      
      const dbUpdate = contactInputToDbUpdate(contactInput);
      const { data, error } = await supabase
        .from('contacts')
        .update(dbUpdate)
        .eq('id', existingContact.id)
        .select(`
          *,
          owner:users!contacts_owner_id_fkey(first_name, last_name)
        `)
        .single();
      
      if (error) {
        console.error('Error updating contact in Supabase:', error);
        throw error;
      }
      
      const contact = dbContactToContact(data);
      console.log(`🔗 Supabase: Contact updated by ${userRole} ${userId}:`, contact.firstName, contact.lastName);
      return contact;
    } catch (error) {
      console.error('Error updating contact in Supabase:', error);
      throw error;
    }
  },

  async deleteContact(id: number, options: ContactsServiceOptions): Promise<boolean> {
    const { userId, userRole } = options;
    
    try {
      // First, find the contact by converting the numeric ID back to UUID
      const { data: existingContacts, error: findError } = await supabase
        .from('contacts')
        .select('*');
      
      if (findError) {
        console.error('Error finding contact:', findError);
        throw findError;
      }
      
      // Find the contact with matching numeric ID
      const existingContact = existingContacts.find(contact => {
        const numericId = parseInt(contact.id.slice(-8), 16);
        return numericId === id;
      });
      
      if (!existingContact) {
        return false; // Contact not found
      }
      
      // Check permissions
      if (userRole !== 'admin' && existingContact.owner_id !== userId) {
        throw new Error('Access denied: You can only delete your own contacts');
      }
      
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', existingContact.id);
      
      if (error) {
        console.error('Error deleting contact in Supabase:', error);
        throw error;
      }
      
      console.log(`🔗 Supabase: Contact deleted by ${userRole} ${userId}:`, existingContact.first_name, existingContact.last_name);

      // Notify deletion
      notificationService.createNotifications({
        type: 'contact_deleted',
        title: 'Contact Deleted',
        description: `deleted contact ${existingContact.first_name} ${existingContact.last_name}`,
        entity_id: existingContact.id,
        entity_type: 'contact',
      }, { userId, userRole: (userRole || 'user') as any });
      return true;
    } catch (error) {
      console.error('Error deleting contact in Supabase:', error);
      throw error;
    }
  },

  async clearAllContacts(): Promise<void> {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all contacts
      
      if (error) {
        console.error('Error clearing contacts from Supabase:', error);
        throw error;
      }
      
      console.log('🔗 Supabase: All contacts cleared');
    } catch (error) {
      console.error('Error clearing contacts:', error);
      throw error;
    }
  },

  async seedTestContacts(currentUserId?: string): Promise<void> {
    try {
      const testContactsDb: ContactInsert[] = [
        {
          first_name: 'John',
          last_name: 'Smith',
          email: 'john.smith@techcorp.com',
          phone: '+1-555-0101',
          role: 'CEO',
          company: 'TechCorp Solutions',
          tags: ['Decision Maker', 'VIP'],
          country: 'United States',
          status: 'active',
          notes: 'Interested in our enterprise package. Follow up needed.',
          owner_id: currentUserId || '550e8400-e29b-41d4-a716-446655440001'
        },
        {
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah.johnson@innovate.com',
          phone: '+1-555-0102',
          role: 'CTO',
          company: 'Innovate Inc',
          tags: ['Technical', 'Lead'],
          country: 'Canada',
          status: 'active',
          notes: 'Technical decision maker. Needs detailed integration specs.',
          owner_id: '550e8400-e29b-41d4-a716-446655440002'
        },
        {
          first_name: 'Michael',
          last_name: 'Chen',
          email: 'michael.chen@globaltech.com',
          phone: '+1-555-0103',
          role: 'VP Sales',
          company: 'GlobalTech Ltd',
          tags: ['Sales', 'Partnership'],
          country: 'Singapore',
          status: 'active',
          notes: 'Exploring partnership opportunities in APAC region.',
          owner_id: '550e8400-e29b-41d4-a716-446655440003'
        },
        {
          first_name: 'Emily',
          last_name: 'Rodriguez',
          email: 'emily.rodriguez@startup.io',
          phone: '+1-555-0104',
          role: 'Founder',
          company: 'StartupIO',
          tags: ['Startup', 'Early Adopter'],
          country: 'Spain',
          status: 'active',
          notes: 'Early stage startup, budget conscious but growth potential.',
          owner_id: currentUserId || '550e8400-e29b-41d4-a716-446655440001'
        },
        {
          first_name: 'David',
          last_name: 'Wilson',
          email: 'david.wilson@enterprise.com',
          phone: '+1-555-0105',
          role: 'IT Director',
          company: 'Enterprise Solutions',
          tags: ['Enterprise', 'Security Focused'],
          country: 'United Kingdom',
          status: 'inactive',
          notes: 'Security concerns raised. Need compliance documentation.',
          owner_id: '550e8400-e29b-41d4-a716-446655440002'
        }
      ];

      const { data, error } = await supabase
        .from('contacts')
        .insert(testContactsDb)
        .select();
      
      if (error) {
        console.error('Error seeding test contacts in Supabase:', error);
        throw error;
      }
      
      console.log('🔗 Supabase: Test contacts seeded:', data.length, 'contacts created with different owners');
    } catch (error) {
      console.error('Error seeding test contacts:', error);
      throw error;
    }
  },

  async importContacts(
    contactsToImport: Omit<Contact, 'id' | 'created_at' | 'updated_at'>[],
    options: ContactsServiceOptions
  ): Promise<number> {
    const { userId } = options;
    try {
      const dbInserts = contactsToImport.map(contact => contactInputToDbInsert({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        role: contact.role,
        company: contact.company,
        country: contact.country,
        status: contact.status === 'Active' ? 'Active' : 'Inactive',
        tags: contact.tags || [],
        notes: contact.notes,
        owner: contact.owner,
      }, userId));

      const { error, count } = await supabase
        .from('contacts')
        .upsert(dbInserts, { onConflict: 'email', ignoreDuplicates: true, count: 'exact' });

      if (error) {
        console.error('Error importing contacts to Supabase:', error);
        throw error;
      }

      console.log(`🔗 Supabase: Import complete. Inserted ${count ?? 0} new contacts (duplicates ignored).`);
      return count ?? 0;
    } catch (error) {
      console.error('Error importing contacts:', error);
      throw error;
    }
  },
}; 