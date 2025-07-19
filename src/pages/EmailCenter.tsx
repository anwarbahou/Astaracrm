import { EmailSidebar } from "@/components/email/EmailSidebar";
import { EmailList } from "@/components/email/EmailList";
import { ComposeEmailModal } from "@/components/email/ComposeEmailModal";
import { EmailDetailModal } from "@/components/email/EmailDetailModal";
import { useEmailData } from "@/hooks/useEmailData";
import { getFilteredEmails, getUnreadCounts } from "@/utils/emailUtils";
import { Email } from "@/types/email";
import { withPageTitle } from '@/components/withPageTitle';
import { useState } from "react";

function EmailCenter() {
  const [selectedFolder, setSelectedFolder] = useState<string>("inbox");
  const [selectedEmails, setSelectedEmails] = useState<number[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const { emails } = useEmailData();
  
  // Filter emails based on selected folder
  const filteredEmails = getFilteredEmails(emails, selectedFolder);
  const unreadCounts = getUnreadCounts(emails);

  const handleEmailSelect = (emailId: number) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setDetailOpen(true);
  };

  const handleBulkSelect = (emailIds: number[]) => {
    setSelectedEmails(emailIds);
  };

  return (
    <div className="flex flex-col sm:flex-row h-[calc(100vh-8rem)] sm:h-[calc(100vh-4rem)] overflow-hidden">
      <EmailSidebar
        selectedFolder={selectedFolder}
        onFolderSelect={setSelectedFolder}
        unreadCounts={unreadCounts}
        onComposeClick={() => setComposeOpen(true)}
      />
      <EmailList
        emails={filteredEmails}
        selectedEmails={selectedEmails}
        onEmailSelect={handleEmailSelect}
        onEmailClick={handleEmailClick}
        onBulkSelect={handleBulkSelect}
        folder={selectedFolder}
      />
      <ComposeEmailModal
        open={composeOpen}
        onOpenChange={setComposeOpen}
      />
      <EmailDetailModal
        email={selectedEmail}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}

export default withPageTitle(EmailCenter, 'email');
