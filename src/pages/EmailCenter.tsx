
import { EmailSidebar } from "@/components/email/EmailSidebar";
import { EmailList } from "@/components/email/EmailList";
import { ComposeEmailModal } from "@/components/email/ComposeEmailModal";
import { EmailDetailModal } from "@/components/email/EmailDetailModal";
import { useEmailData } from "@/hooks/useEmailData";
import { getFilteredEmails, getUnreadCounts } from "@/utils/emailUtils";
import { Email } from "@/types/email";

export default function EmailCenter() {
  const {
    emails,
    selectedFolder,
    setSelectedFolder,
    selectedEmails,
    setSelectedEmails,
    selectedEmail,
    setSelectedEmail,
    composeOpen,
    setComposeOpen,
    detailOpen,
    setDetailOpen
  } = useEmailData();

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
    
    // Mark as read
    if (!email.read) {
      email.read = true;
    }
  };

  const handleBulkSelect = (emailIds: number[]) => {
    setSelectedEmails(emailIds);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <EmailSidebar
        selectedFolder={selectedFolder}
        onFolderSelect={setSelectedFolder}
        onComposeClick={() => setComposeOpen(true)}
        unreadCounts={getUnreadCounts(emails)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <EmailList
          emails={getFilteredEmails(emails, selectedFolder)}
          selectedEmails={selectedEmails}
          onEmailSelect={handleEmailSelect}
          onEmailClick={handleEmailClick}
          onBulkSelect={handleBulkSelect}
          folder={selectedFolder}
        />
      </div>

      {/* Modals */}
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
