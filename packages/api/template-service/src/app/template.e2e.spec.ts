import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { CreateTemplateDTO, Template, TemplateSchema, UpdateTemplateDTO } from '@template-mailer/models';
import { create } from 'domain';
import * as request from 'supertest';
import { RenderingService } from './rendering.service';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';

describe('Template API', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [TemplateService, RenderingService],
			controllers: [TemplateController],
			imports: [
				MongooseModule.forRoot('mongodb://root:example@localhost:27017/?authSource=admin&readPreference=primary&ssl=false', {
					dbName: 'e2e-db',
				}),
				MongooseModule.forFeature([{ name: Template.name, schema: TemplateSchema }]),
			],
		}).compile();

		app = moduleRef.createNestApplication();
		await app.init();
	});

	it('/POST create template', async () => createTestTemplate('Hello, {{name}}'));

	it('/GET read template', async () => {
		const template_string = 'Hello, {{name}}';
		const created = await createTestTemplate(template_string);

		const res = await request(app.getHttpServer()).get(`/templates/${created.template_id}`).expect(200);
		const read = { ...res.body };
		expectTemplateEquality(created, read);
	});

	it('/PATCH update template', async () => {
		const initialTemplate = 'Hello {{name}}';
		const updatedTemplate = 'Hello, {{name}}!';
		//create template
		const created = await createTestTemplate(initialTemplate);
		//update template
		const res = await request(app.getHttpServer())
			.patch(`/templates/${created.template_id}`)
			.send({ template_string: updatedTemplate } as UpdateTemplateDTO)
			.expect(200);
		const updated = { ...res.body };
		expect(updated.template_id).toEqual(created.template_id);
		expect(updated.template_string).toEqual(updatedTemplate);
	});

	it('/DELETE delete template', async () => {
		const created = await createTestTemplate('Hello, {{name}}');

		let res = await request(app.getHttpServer()).delete(`/templates/${created.template_id}`).expect(200);
		const deleted = { ...res.body };
		expectTemplateEquality(created, deleted);

		res = await request(app.getHttpServer()).get(`/templates/${created.template_id}`).expect(404);
	});

	it('/POST render template', async () => {
		const template = 'Hello, {{name}}!';
		const created = await createTestTemplate(template);

		const render = await request(app.getHttpServer())
			.post(`/templates/${created.template_id}/render`)
			.send({ name: 'Testy McGee' })
			.expect(201);

		expect(render.text).toEqual('Hello, Testy McGee!');
	});

	afterAll(async () => {
		await app.close();
	});

	const expectTemplateEquality = (t1: Template, t2: Template) => {
		expect(t1.template_id).toEqual(t2.template_id);
		expect(t1.template_string).toEqual(t2.template_string);
	};

	const createTestTemplate = async (template_string): Promise<Template> => {
		const res = await request(app.getHttpServer())
			.post('/templates')
			.send({ template_string } as CreateTemplateDTO)
			.expect(201);
		const created = { ...res.body };
		expect(created.template_id).toBeDefined();
		expect(created.template_string).toEqual(template_string);
		return created;
	};
});
