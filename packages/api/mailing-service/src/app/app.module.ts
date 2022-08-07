import { Module } from '@nestjs/common';

import { EventController } from './app.controller';
import { KafkaService } from './kafka.service';
import { MailingService } from './mailing.service';

@Module({
	imports: [],
	controllers: [EventController],
	providers: [MailingService, KafkaService],
})
export class AppModule {}
