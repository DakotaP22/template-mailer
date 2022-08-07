import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Template, TemplateSchema } from '@template-mailer/models';
import { TemplateService } from './template.service';

describe('TemplateService', () => {
	let service: TemplateService;
	let module: TestingModule;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			providers: [TemplateService],
			imports: [
				MongooseModule.forRoot('mongodb://root:example@localhost:27017/?authSource=admin&readPreference=primary&ssl=false', {
					dbName: 'test-db',
				}),
				MongooseModule.forFeature([{ name: Template.name, schema: TemplateSchema }]),
			],
		}).compile();

		service = module.get<TemplateService>(TemplateService);
	});

	afterAll(async () => {
		await module.close();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	// CREATE Tests
	it('should create and read a template', async () => {
		const testTemplateString = 'Test Template';
		const { template_id } = await service.create(testTemplateString);
		expect(template_id).toBeDefined();

		const { template_string } = await service.read(template_id);
		expect(template_string).toEqual(testTemplateString);
	});

	// READ Tests
	it('should return null for a read operation with an invalid id', async () => {
		const template = await service.read('-1');
		expect(template).toBeNull();
	});

	// UPDATE Tests
	it('should update a given template and return the updated template', async () => {
		const initialTemplate = 'Initial Template';
		const updatedTemplate = 'Updated Template';

		let template = await service.create(initialTemplate);
		expect(template.template_string).toEqual(initialTemplate);
		template = await service.update(template.template_id, updatedTemplate);
		expect(template.template_string).toEqual(updatedTemplate);
	});

	it('should return null when trying to update nonexistant templates', async () => {
		const template = await service.update('-1', 'Test Update');
		expect(template).toBeNull();
	});

	// DELETE Tests
	it('should return null for a deleted template', async () => {
		const { template_id } = await service.create('Delete');
		let template = await service.read(template_id);
		expect(template).toBeDefined();
		await service.delete(template_id);
		template = await service.read(template_id);
		expect(template).toBeNull();
	});

	it('should return null for deleting an invalid template', async () => {
		const template = await service.delete('-1');
		expect(template).toBeNull();
	});

	it('should return the deleted Template', async () => {
		const { template_id } = await service.create('Delete');
		const template = await service.read(template_id);
		expect(template).toBeDefined();
		const deleted = await service.delete(template_id);
		expect(deleted.template_id).toEqual(template.template_id);
		expect(deleted.template_string).toEqual(template.template_string);
	});
});
