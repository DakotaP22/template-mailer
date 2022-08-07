/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.connectMicroservice({
		transport: Transport.KAFKA,
		options: {
			client: {
				clientId: `mailer-1`,
				brokers: ['localhost:29092'],
			},
			consumer: {
				groupId: `mailing-consumer`,
			},
		},
	});
	app.startAllMicroservices();

	const globalPrefix = 'api';
	app.setGlobalPrefix(globalPrefix);
	const port = process.env.PORT || 3335;
	await app.listen(port);
	Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
