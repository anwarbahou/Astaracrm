
import { useState } from "react";
import { Email } from "@/types/email";

export function useEmailData() {
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  const [selectedEmails, setSelectedEmails] = useState<number[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  // Enhanced mock email data
  const emails: Email[] = [
    {
      id: 1,
      from: "john@acme.com",
      fromName: "John Smith",
      to: "you@wolfhunt.com",
      subject: "Re: Q4 Proposal Discussion",
      preview: "Thanks for the detailed proposal. I have a few questions about the implementation timeline...",
      body: "Hi there,\n\nThanks for the detailed proposal. I have a few questions about the implementation timeline and the pricing structure. Could we schedule a call to discuss?\n\nBest regards,\nJohn Smith",
      date: "2024-12-15T10:30:00",
      read: false,
      starred: true,
      client: "Acme Corporation",
      thread: 3,
      attachments: [],
      type: "Received",
      tags: ["Priority", "Client"]
    },
    {
      id: 2,
      from: "you@wolfhunt.com",
      fromName: "You",
      to: "sarah@techsolutions.com",
      subject: "Product Demo Follow-up",
      preview: "I wanted to follow up on our product demonstration last week...",
      body: "Hi Sarah,\n\nI wanted to follow up on our product demonstration last week. Did you have any additional questions about the features we discussed?\n\nI'm happy to schedule another call if needed.\n\nBest regards,\nYour Name",
      date: "2024-12-14T16:45:00",
      read: true,
      starred: false,
      client: "Tech Solutions Ltd",
      thread: 1,
      attachments: ["demo-recording.mp4"],
      type: "Sent",
      tags: ["Follow-up"]
    },
    {
      id: 3,
      from: "mike@global.com",
      fromName: "Mike Chen",
      to: "you@wolfhunt.com",
      subject: "Contract Terms Review",
      preview: "I've reviewed the contract terms and have some feedback...",
      body: "Hello,\n\nI've reviewed the contract terms and have some feedback on the service level agreements. Can we discuss the details?\n\nRegards,\nMike Chen",
      date: "2024-12-13T14:20:00",
      read: true,
      starred: false,
      client: "Global Industries",
      thread: 1,
      attachments: ["contract-feedback.pdf"],
      type: "Received",
      tags: ["Client"]
    },
    {
      id: 4,
      from: "you@wolfhunt.com",
      fromName: "You",
      to: "team@wolfhunt.com",
      subject: "Weekly Sales Update",
      preview: "Here's our weekly sales summary for the team...",
      body: "Team,\n\nHere's our weekly sales summary:\n- 5 new leads\n- 3 demos scheduled\n- 2 deals closed\n\nGreat work everyone!\n\nBest,\nYour Name",
      date: "2024-12-12T09:00:00",
      read: true,
      starred: false,
      client: "Internal",
      thread: 1,
      attachments: [],
      type: "Sent",
      tags: ["Internal"]
    },
    {
      id: 5,
      from: "emily@startupxyz.com",
      fromName: "Emily Davis",
      to: "you@wolfhunt.com",
      subject: "Partnership Opportunity",
      preview: "I'd like to discuss a potential partnership between our companies...",
      body: "Hi,\n\nI'd like to discuss a potential partnership between our companies. We're looking for a CRM solution and your platform seems like a great fit.\n\nWould you be available for a call next week?\n\nBest,\nEmily Davis",
      date: "2024-12-11T11:30:00",
      read: false,
      starred: false,
      client: "StartupXYZ",
      thread: 1,
      attachments: ["company-overview.pdf"],
      type: "Received",
      tags: ["Priority"]
    },
    {
      id: 6,
      from: "alex@consulting.com",
      fromName: "Alex Rodriguez",
      to: "you@wolfhunt.com",
      subject: "Meeting Confirmation - Tomorrow 2 PM",
      preview: "Just confirming our meeting scheduled for tomorrow at 2 PM...",
      body: "Hi,\n\nJust confirming our meeting scheduled for tomorrow at 2 PM to discuss the consulting engagement.\n\nThe meeting will be held in our downtown office, conference room B.\n\nLooking forward to it!\n\nBest,\nAlex",
      date: "2024-12-10T15:20:00",
      read: true,
      starred: true,
      client: "Rodriguez Consulting",
      thread: 2,
      attachments: [],
      type: "Received",
      tags: ["Meeting"]
    },
    {
      id: 7,
      from: "support@techplatform.com",
      fromName: "Tech Platform Support",
      to: "you@wolfhunt.com",
      subject: "Your API Integration is Ready",
      preview: "Your API integration has been successfully configured...",
      body: "Dear Developer,\n\nYour API integration has been successfully configured and is now ready for testing.\n\nAPI Endpoint: https://api.techplatform.com/v2\nAPI Key: [REDACTED]\n\nPlease find the documentation attached.\n\nBest regards,\nTech Platform Team",
      date: "2024-12-09T10:15:00",
      read: false,
      starred: false,
      client: "Tech Platform",
      thread: 1,
      attachments: ["api-documentation.pdf"],
      type: "Received",
      tags: ["Technical"]
    },
    {
      id: 8,
      from: "you@wolfhunt.com",
      fromName: "You",
      to: "david@enterprise.com",
      subject: "Proposal: CRM Implementation for Enterprise Corp",
      preview: "Please find attached our comprehensive proposal for your CRM implementation...",
      body: "Dear David,\n\nPlease find attached our comprehensive proposal for your CRM implementation project.\n\nThe proposal includes:\n- Technical specifications\n- Implementation timeline\n- Pricing breakdown\n- Support packages\n\nI'm available to discuss any questions you may have.\n\nBest regards,\nYour Name",
      date: "2024-12-08T14:30:00",
      read: true,
      starred: false,
      client: "Enterprise Corp",
      thread: 1,
      attachments: ["crm-proposal.pdf", "pricing-sheet.xlsx"],
      type: "Sent",
      tags: ["Proposal"]
    }
  ];

  return {
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
  };
}
