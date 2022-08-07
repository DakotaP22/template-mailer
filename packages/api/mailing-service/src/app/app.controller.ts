import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { EmailRenderedEvent, Topics } from '@templatemailer/events';
import { KafkaService } from './kafka.service';
import { MailingService } from './mailing.service';

@Controller()
export class EventController {
	constructor(private readonly mailingSvc: MailingService, private readonly kafka: KafkaService) {}

	@MessagePattern(Topics.EmailRenderedEvent)
	processEmailRenderedEvent(@Payload('value') event: EmailRenderedEvent) {
		Logger.log(event);
	}
}
