import { Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Topics } from '@templatemailer/events';
import { uuid } from 'uuidv4';

@Injectable()
export class KafkaService {
	@Client({
		transport: Transport.KAFKA,
		options: {
			client: {
				clientId: `mailer-1`,
				brokers: ['localhost:29092'],
			},
			consumer: {
				groupId: `mailing-consumer`,
			},
			producer: {
				allowAutoTopicCreation: true,
			},
		},
	})
	client: ClientKafka;

	async onModuleInit() {
		this.client.connect();

		// subscribe to all topics you are publishing to!
		this.client.subscribeToResponseOf(Topics.EmailRenderedEvent);
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
}
