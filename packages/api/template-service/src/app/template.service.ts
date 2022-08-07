import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Template, TemplateDocument } from '@template-mailer/models';
import { Model } from 'mongoose';

@Injectable()
export class TemplateService {
	constructor(
		@InjectModel(Template.name)
		private model: Model<TemplateDocument>
	) {}

	async create(template_string: string): Promise<Template> {
		const newModel = new this.model({
			template_string,
		});
		newModel.set('template_id', newModel._id as string);
		return newModel.save();
	}

	async read(template_id: string): Promise<Template> {
		return this.model.findOne({ template_id }).exec();
	}

	async update(template_id: string, template_string: string): Promise<Template> {
		return this.model.findOneAndUpdate({ template_id }, { template_string }, { new: true }).exec();
	}

	async delete(template_id: string): Promise<Template> {
		return this.model.findOneAndDelete({ template_id }).exec();
	}
}
