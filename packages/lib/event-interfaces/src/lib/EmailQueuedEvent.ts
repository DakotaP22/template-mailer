export interface EmailQueuedEvent {
  email_id: string;
  campaign_id: string;
  email_address: string;
  email_subject: string;
  template_id: string;
  template_data: unknown;
}
