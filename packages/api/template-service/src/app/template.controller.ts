import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { CreateTemplateDTO, Template, UpdateTemplateDTO } from '@template-mailer/models';
import { RenderingService } from './rendering.service';
import { TemplateService } from './template.service';

@Controller('/templates')
export class TemplateController {
	constructor(private templateSvc: TemplateService, private renderingSvc: RenderingService) {}

	@Post()
	async create(@Body() dto: CreateTemplateDTO): Promise<Template> {
		const template = await this.templateSvc.create(dto.template_string);
		return template;
	}

	@Get(':id')
	async read(@Param('id') id: string, @Res() res) {
		const template = await this.templateSvc.read(id);
		if (!template) {
			res.status(404).send(`Template ${id} Not Found`);
			return;
		}

		res.status(200).json(template);
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() updates: UpdateTemplateDTO) {
		return await this.templateSvc.update(id, updates.template_string);
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		return await this.templateSvc.delete(id);
	}

	@Post(':id/render')
	async render(@Param('id') id: string, @Body() data: unknown) {
		return await this.renderingSvc.render(id, data);
	}
}
