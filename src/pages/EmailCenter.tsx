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
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const { emailData } = useEmailData();
  
  // Filter emails based on selected folder
  const filteredEmails = getFilteredEmails(emailData.emails, selectedFolder);
  const unreadCounts = getUnreadCounts(emailData.emails);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <EmailSidebar
        selectedFolder={selectedFolder}
        onFolderSelect={setSelectedFolder}
        unreadCounts={unreadCounts}
        onComposeClick={() => setComposeOpen(true)}
      />
      <EmailList
        emails={filteredEmails}
        selectedEmail={selectedEmail}
        onEmailSelect={(email) => {
          setSelectedEmail(email);
          setDetailOpen(true);
        }}
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
