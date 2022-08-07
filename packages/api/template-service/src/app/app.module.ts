import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { TemplateController } from './template.controller';
import { KafkaService } from './kafka.service';
import { EventController } from './event.controller';
import { TemplateService } from './template.service';
import { Template, TemplateSchema } from '@template-mailer/models';
import { RenderingService } from './rendering.service';

@Module({
	imports: [
		MongooseModule.forRoot('mongodb://root:example@localhost:27017/?authSource=admin&readPreference=primary&ssl=false', {
			dbName: 'template-db',
		}),
		MongooseModule.forFeature([{ name: Template.name, schema: TemplateSchema }]),
	],
	controllers: [TemplateController, EventController],
	providers: [KafkaService, TemplateService, RenderingService],
})
export class AppModule {}
