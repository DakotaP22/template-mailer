import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaService } from './kafka.service';
import { QueueService } from './queue.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, KafkaService, QueueService],
})
export class AppModule {}
