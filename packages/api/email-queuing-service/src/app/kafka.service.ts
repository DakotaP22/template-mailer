import { Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { EmailQueuedEvent, Topics } from '@templatemailer/events';
import { uuid } from 'uuidv4';

@Injectable()
export class KafkaService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'queuing-service',
        brokers: ['localhost: 29092'],
      },
    },
  })
  client: ClientKafka;

  async onModuleInit() {
    this.client.connect();

    // subscribe to all topics you are publishing to!
    this.client.subscribeToResponseOf(Topics.EmailQueuedEvent);
  }

  onModuleDestroy() {
    this.client.close();
  }

  private publishEvent(topic: string, event: unknown) {
    this.client
      .send(topic, {
        key: uuid(),
        value: event,
      })
      .subscribe();
  }

  queueEmail(
    campaign_id: string,
    email_address: string,
    email_id: string,
    email_subject: string,
    template_id: string,
    template_data: unknown
  ) {
    const event: EmailQueuedEvent = {
      campaign_id,
      email_address,
      email_id,
      email_subject,
      template_id,
      template_data,
    };

    this.publishEvent(Topics.EmailQueuedEvent, event);
  }
}
