import { Injectable } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Injectable()
export class QueueService {
	constructor(private readonly kafka: KafkaService) {}

	test() {
		const campaign_id = 'test-campaign';
		const email_address = 'test@test.test';
		const email_id = '-1';
		const email_subject = 'Test Email Subject';
		const template_id = '62eea0b22a59656d3969661a';
		const template_data = {
			name: 'Testy McTesterson',
		};

		this.kafka.queueEmail(campaign_id, email_address, email_id, email_subject, template_id, template_data);
	}
}
