
import type { Note } from "@/types/note";

export const mockNotes: Note[] = [
  {
    id: "1",
    title: "Q4 Strategy Meeting - Acme Corp",
    content: "Discussed the Q4 strategy with John Smith from Acme Corp. Key points:\n\n• Expansion plans for next quarter\n• Budget allocation for new tools\n• Timeline: End of December\n• Main concerns: Integration challenges\n\nNext steps:\n- Send detailed proposal\n- Schedule technical demo\n- Follow up with pricing",
    tags: ["Strategy", "Q4", "Important"],
    type: "meeting",
    visibility: "team",
    linkedTo: {
      type: "client",
      id: "acme-1",
      name: "Acme Corporation"
    },
    isPinned: true,
    hasReminder: true,
    reminderDate: "2024-12-20T10:00:00Z",
    attachments: [
      {
        id: "att-1",
        name: "meeting-notes.pdf",
        type: "application/pdf",
        size: 245760,
        url: "#"
      }
    ],
    createdBy: {
      id: "user-1",
      name: "Sarah Johnson",
      avatar: "SJ"
    },
    createdAt: "2024-12-15T14:30:00Z",
    updatedAt: "2024-12-15T16:45:00Z"
  },
  {
    id: "2",
    title: "Product Feature Ideas",
    content: "Brainstorming session for new CRM features:\n\n• Advanced reporting dashboard\n• Mobile app improvements\n• Integration with Slack\n• AI-powered lead scoring\n• Automated follow-up sequences\n\nPriority: High impact, low effort features first",
    tags: ["Product", "Ideas", "Brainstorming"],
    type: "idea",
    visibility: "team",
    isPinned: true,
    hasReminder: false,
    attachments: [],
    createdBy: {
      id: "user-2",
      name: "Mike Chen",
      avatar: "MC"
    },
    createdAt: "2024-12-14T09:15:00Z",
    updatedAt: "2024-12-15T11:30:00Z"
  },
  {
    id: "3",
    title: "Client Onboarding Checklist",
    content: "Standard checklist for new client onboarding:\n\n✓ Welcome email sent\n✓ Account setup completed\n✓ Initial training scheduled\n□ Documentation provided\n□ First check-in call\n□ Feedback survey sent\n\nEstimated timeline: 2 weeks",
    tags: ["Process", "Onboarding", "Checklist"],
    type: "task",
    visibility: "public",
    isPinned: false,
    hasReminder: true,
    reminderDate: "2024-12-18T14:00:00Z",
    attachments: [
      {
        id: "att-2",
        name: "onboarding-guide.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 512000,
        url: "#"
      }
    ],
    createdBy: {
      id: "user-3",
      name: "Emily Davis",
      avatar: "ED"
    },
    createdAt: "2024-12-13T10:20:00Z",
    updatedAt: "2024-12-14T15:45:00Z"
  },
  {
    id: "4",
    title: "Competitive Analysis - TechStart",
    content: "Research on competitor TechStart:\n\nStrengths:\n• Strong social media presence\n• Competitive pricing\n• Good customer reviews\n\nWeaknesses:\n• Limited integration options\n• Poor customer support\n• Outdated UI\n\nOpportunities for us:\n• Better customer service\n• More integrations\n• Modern design",
    tags: ["Research", "Competition", "Analysis"],
    type: "general",
    visibility: "private",
    isPinned: false,
    hasReminder: false,
    attachments: [],
    createdBy: {
      id: "user-1",
      name: "Sarah Johnson",
      avatar: "SJ"
    },
    createdAt: "2024-12-12T16:30:00Z",
    updatedAt: "2024-12-12T17:15:00Z"
  },
  {
    id: "5",
    title: "Team Standup Notes",
    content: "Daily standup meeting notes:\n\nSarah: Working on client proposals, blocked on pricing approval\nMike: Completed feature design, moving to development\nEmily: Client onboarding going well, 3 new accounts this week\n\nAction items:\n- Sarah: Follow up with finance team\n- Mike: Start development sprint\n- Emily: Update onboarding documentation",
    tags: ["Team", "Standup", "Daily"],
    type: "meeting",
    visibility: "team",
    isPinned: true,
    hasReminder: false,
    attachments: [],
    createdBy: {
      id: "user-2",
      name: "Mike Chen",
      avatar: "MC"
    },
    createdAt: "2024-12-15T09:00:00Z",
    updatedAt: "2024-12-15T09:30:00Z"
  },
  {
    id: "6",
    title: "Customer Success Metrics",
    content: "Q4 customer success metrics and insights:\n\n• Customer satisfaction: 4.7/5\n• Churn rate: 2.1% (down from 3.2%)\n• NPS Score: 58 (industry avg: 31)\n• Feature adoption: 73%\n\nTop customer requests:\n1. Better reporting\n2. Mobile app\n3. API documentation\n4. Training resources\n\nNext quarter goals:\n- Improve onboarding flow\n- Launch customer portal\n- Expand help documentation",
    tags: ["Metrics", "Success", "Q4"],
    type: "general",
    visibility: "team",
    isPinned: true,
    hasReminder: false,
    attachments: [
      {
        id: "att-3",
        name: "q4-metrics.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 102400,
        url: "#"
      }
    ],
    createdBy: {
      id: "user-3",
      name: "Emily Davis",
      avatar: "ED"
    },
    createdAt: "2024-12-11T14:20:00Z",
    updatedAt: "2024-12-15T12:10:00Z"
  }
];
