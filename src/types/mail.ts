
export type MailMedium = 'Email' | 'Physical' | 'Fax' | 'Other';

export type MailType = 'Administrative' | 'Technical' | 'Commercial' | 'Financial' | 'Other';

export type MailStatus = 'Pending' | 'Processing' | 'Completed' | 'Overdue';

// Base mail interface with common properties
export interface BaseMail {
  id: string;
  chronoNumber: string;
  date: Date;
  issueDate?: Date; // Date d'émission de la correspondance
  medium: MailMedium;
  subject: string;
  observations?: string;
  documentLink?: string;
  status: MailStatus;
}

// Incoming mail specific properties
export interface IncomingMail extends BaseMail {
  mailType: MailType;
  responseDate?: Date;
  senderName: string;
  senderAddress: string;
  recipientService: string;
}

// Outgoing mail specific properties
export interface OutgoingMail extends BaseMail {
  correspondent: string;
  address: string;
  service: string;
  writer: string;
}

// For statistics
export interface MailStats {
  month: string;
  year: number;
  incomingCount: number;
  outgoingCount: number;
  byType: Record<MailType, number>;
}
