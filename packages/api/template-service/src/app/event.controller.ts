import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailQueuedEvent, EmailRenderedEvent, Topics } from '@templatemailer/events';
import { KafkaService } from './kafka.service';
import { RenderingService } from './rendering.service';

@Controller('event')
export class EventController {
	constructor(private readonly renderingSvc: RenderingService, private readonly kafka: KafkaService) {}

	@MessagePattern(Topics.EmailQueuedEvent)
	async processEmailQueuedEvent(@Payload() event: { value: EmailQueuedEvent }) {
		console.log(event.value);
		const rendering = await this.renderingSvc.render(event.value.template_id, event.value.template_data);
		this.kafka.publishEmailRenderedEvent({
			campaign_id: event.value.campaign_id,
			email_address: event.value.email_address,
			email_body: rendering,
			email_subject: event.value.email_subject,
			email_id: event.value.email_id,
		} as EmailRenderedEvent);
	}
}
