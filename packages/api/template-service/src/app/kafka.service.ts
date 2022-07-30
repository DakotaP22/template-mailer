import { Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { EmailRenderedEvent, Topics } from '@templatemailer/events';
import { uuid } from 'uuidv4';

@Injectable()
export class KafkaService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `render-1`,
        brokers: ['localhost:29092'],
      },
      consumer: {
        groupId: `rendering-consumer`,
      },
      producer: {
        allowAutoTopicCreation: true,
      },
    },
  })
  client: ClientKafka;

  async onModuleInit() {
    this.client.subscribeToResponseOf(Topics.EmailRenderedEvent);

    this.client.connect();
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

  publishEmailRenderedEvent(event: EmailRenderedEvent) {
    // const event: EmailRenderedEvent = {
    //   campaign_id: 'test',
    //   email_address: 'test@testemail.fake',
    //   email_body: 'Hello, World!',
    //   email_id: '-1',
    //   email_subject: 'Test Rendering',
    // };
    //this.client.send(Topics.EmailRenderedEvent, event).subscribe();
    this.publishEvent(Topics.EmailRenderedEvent, event);
  }
}
