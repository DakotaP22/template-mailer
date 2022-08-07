import { Injectable } from '@nestjs/common';
import { TemplateService } from './template.service';
import * as Mustache from 'mustache';

@Injectable()
export class RenderingService {
	constructor(private templateSvc: TemplateService) {}

	async render(template_id: string, data: unknown) {
		const { template_string } = await this.templateSvc.read(template_id);
		if (!template_string) throw Error('Template Does Not Exist');

		return Mustache.render(template_string, data);
	}
}
