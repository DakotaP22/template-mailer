import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Template {
	@Prop()
	template_id: string;

	@Prop()
	template_string: string;
}

export type TemplateDocument = Template & Document;
export const TemplateSchema = SchemaFactory.createForClass(Template);

export interface CreateTemplateDTO {
	template_string: string;
}

export interface UpdateTemplateDTO {
	template_string: string;
}
