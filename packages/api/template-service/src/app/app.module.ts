import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { KafkaService } from './kafka.service';
import { EventController } from './event.controller';
import { TemplateService } from './template.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:example@localhost:27017/?authSource=admin&readPreference=primary&ssl=false',
      {
        dbName: 'template-db',
      }
    ),
  ],
  controllers: [AppController, EventController],
  providers: [KafkaService, TemplateService],
})
export class AppModule {}
