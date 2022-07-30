import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailOpenedEvent, Topics } from '@templatemailer/events';

@Controller('event')
export class EventController {
  constructor() {
    Logger.log('Controller Started');
  }

  @MessagePattern(Topics.EmailQueuedEvent)
  processEmailQueuedEvent(@Payload() event: EmailOpenedEvent) {
    Logger.log(event);
  }
}
