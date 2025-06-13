
import { ActivityLog } from "@/types/activity";

export const mockActivities: ActivityLog[] = [
  {
    id: 1,
    type: "deal_created",
    action: "Created new deal",
    details: "Q4 Software License deal created for Acme Corporation",
    user: "John Doe",
    userAvatar: "JD",
    timestamp: "2024-12-15T14:30:00",
    entity: "Deal",
    entityId: "DEAL-001",
    relatedTo: "Acme Corporation",
    changes: {
      deal_name: "Q4 Software License",
      deal_value: "$45,000",
      stage: "Discovery"
    }
  },
  {
    id: 2,
    type: "email_sent",
    action: "Sent email",
    details: "Follow-up email sent to Tech Solutions regarding proposal",
    user: "Sarah Smith",
    userAvatar: "SS",
    timestamp: "2024-12-15T13:15:00",
    entity: "Email",
    entityId: "EMAIL-123",
    relatedTo: "Tech Solutions Ltd",
    changes: {
      subject: "Follow-up on Proposal",
      recipient: "sarah@techsolutions.com"
    }
  },
  {
    id: 3,
    type: "task_completed",
    action: "Completed task",
    details: "Demo preparation task marked as complete",
    user: "Mike Johnson",
    userAvatar: "MJ",
    timestamp: "2024-12-15T12:45:00",
    entity: "Task",
    entityId: "TASK-456",
    relatedTo: "Global Industries",
    changes: {
      status: "Completed",
      completion_date: "2024-12-15"
    }
  },
  {
    id: 4,
    type: "client_added",
    action: "Added new client",
    details: "New client StartupXYZ added to system",
    user: "Emily Davis",
    userAvatar: "ED",
    timestamp: "2024-12-15T11:20:00",
    entity: "Client",
    entityId: "CLIENT-789",
    relatedTo: "StartupXYZ",
    changes: {
      company_name: "StartupXYZ",
      industry: "Technology",
      status: "Active"
    }
  },
  {
    id: 5,
    type: "deal_stage_changed",
    action: "Updated deal stage",
    details: "Deal moved from Proposal to Negotiation",
    user: "John Doe",
    userAvatar: "JD",
    timestamp: "2024-12-15T10:30:00",
    entity: "Deal",
    entityId: "DEAL-002",
    relatedTo: "Tech Solutions Ltd",
    changes: {
      previous_stage: "Proposal",
      new_stage: "Negotiation",
      probability: "75%"
    }
  },
  {
    id: 6,
    type: "call_logged",
    action: "Logged phone call",
    details: "30-minute discovery call with Enterprise Corp",
    user: "David Wilson",
    userAvatar: "DW",
    timestamp: "2024-12-15T09:15:00",
    entity: "Call",
    entityId: "CALL-101",
    relatedTo: "Enterprise Corp",
    changes: {
      duration: "30 minutes",
      outcome: "Interested in enterprise package",
      next_action: "Send proposal"
    }
  },
  {
    id: 7,
    type: "note_created",
    action: "Created note",
    details: "Added meeting notes from client discussion",
    user: "Sarah Smith",
    userAvatar: "SS",
    timestamp: "2024-12-15T08:45:00",
    entity: "Note",
    entityId: "NOTE-999",
    relatedTo: "Acme Corporation",
    changes: {
      note_type: "Meeting Notes",
      priority: "High"
    }
  },
  {
    id: 8,
    type: "user_login",
    action: "User logged in",
    details: "User accessed the system",
    user: "Mike Johnson",
    userAvatar: "MJ",
    timestamp: "2024-12-15T08:00:00",
    entity: "System",
    entityId: null,
    relatedTo: "System Access",
    changes: {
      login_time: "08:00:00",
      ip_address: "192.168.1.100"
    }
  },
  {
    id: 9,
    type: "report_generated",
    action: "Generated report",
    details: "Monthly sales report generated and sent to stakeholders",
    user: "System",
    userAvatar: "SY",
    timestamp: "2024-12-15T07:00:00",
    entity: "Report",
    entityId: "RPT-001",
    relatedTo: "Monthly Reporting",
    changes: {
      report_type: "Sales Summary",
      period: "November 2024",
      recipients: "5 stakeholders"
    }
  },
  {
    id: 10,
    type: "task_assigned",
    action: "Assigned task",
    details: "Follow-up task assigned to sales team member",
    user: "John Doe",
    userAvatar: "JD",
    timestamp: "2024-12-14T16:30:00",
    entity: "Task",
    entityId: "TASK-789",
    relatedTo: "Global Industries",
    changes: {
      assigned_to: "Sarah Smith",
      due_date: "2024-12-18",
      priority: "Medium"
    }
  }
];
