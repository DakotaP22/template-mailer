import { Controller, Get } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Controller()
export class AppController {
  constructor(private readonly kafka: KafkaService) {}

  @Get('/test')
  test() {
    this.kafka.publishEmailRenderedEvent({
      campaign_id: 'test',
      email_address: 'test@testemail.fake',
      email_body: 'Hello, World!',
      email_id: '-1',
      email_subject: 'Test Rendering',
    });
    return;
  }
}
