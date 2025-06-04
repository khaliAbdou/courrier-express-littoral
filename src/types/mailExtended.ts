
import { OutgoingMail, MailStatus } from './mail';

export type ValidationStatus = 'draft' | 'pending_validation' | 'validated' | 'rejected';

export interface OutgoingMailExtended extends OutgoingMail {
  validationStatus: ValidationStatus;
  validatedBy?: string;
  validatedAt?: Date;
  validationComments?: string;
  needsValidation: boolean;
}

export interface ValidationHistory {
  id: string;
  mailId: string;
  action: 'submit' | 'validate' | 'reject' | 'modify';
  userId: string;
  timestamp: Date;
  comments?: string;
}
