
import Dexie, { Table } from 'dexie';
import { IncomingMail, OutgoingMail } from '@/types/mail';

export class MailDatabase extends Dexie {
  incomingMails!: Table<IncomingMail>;
  outgoingMails!: Table<OutgoingMail>;

  constructor() {
    super('MailDatabase');
    this.version(1).stores({
      incomingMails: 'id, chronoNumber, date, subject, senderName, recipientService, status, mailType',
      outgoingMails: 'id, chronoNumber, date, subject, correspondent, service, status'
    });
  }
}

export const db = new MailDatabase();
