
import { Email, UnreadCounts } from "@/types/email";

export const getFilteredEmails = (emails: Email[], selectedFolder: string): Email[] => {
  let filtered = emails;

  switch (selectedFolder) {
    case 'inbox':
      filtered = emails.filter(email => email.type === 'Received');
      break;
    case 'sent':
      filtered = emails.filter(email => email.type === 'Sent');
      break;
    case 'starred':
      filtered = emails.filter(email => email.starred);
      break;
    case 'drafts':
      // In a real app, this would filter actual drafts
      filtered = [];
      break;
    case 'archive':
      // In a real app, this would filter archived emails
      filtered = [];
      break;
    case 'trash':
      // In a real app, this would filter trashed emails
      filtered = [];
      break;
    default:
      if (selectedFolder.startsWith('tag:')) {
        const tagName = selectedFolder.replace('tag:', '');
        const tagMap: Record<string, string> = {
          'priority': 'Priority',
          'clients': 'Client',
          'internal': 'Internal',
          'follow-up': 'Follow-up'
        };
        filtered = emails.filter(email => 
          email.tags?.includes(tagMap[tagName])
        );
      }
  }

  return filtered;
};

export const getUnreadCounts = (emails: Email[]): UnreadCounts => {
  return {
    inbox: emails.filter(e => e.type === 'Received' && !e.read).length,
    sent: 0,
    drafts: 0,
    starred: emails.filter(e => e.starred && !e.read).length,
    archive: 0,
    trash: 0,
  };
};
