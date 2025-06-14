
export interface Email {
  id: number;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  client: string;
  thread: number;
  attachments: string[];
  type: "Received" | "Sent";
  tags?: string[];
}

export interface UnreadCounts {
  inbox: number;
  sent: number;
  drafts: number;
  starred: number;
  archive: number;
  trash: number;
  [key: string]: number; // Add index signature to allow any string key
}
