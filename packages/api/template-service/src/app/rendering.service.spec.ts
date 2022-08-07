import { Test, TestingModule } from '@nestjs/testing';
import { Template } from '@template-mailer/models';
import { RenderingService } from './rendering.service';
import { TemplateService } from './template.service';

describe('RenderingService', () => {
	let renderingSvc: RenderingService;
	let templateSvc: TemplateService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RenderingService,
				{
					provide: TemplateService,
					useValue: {
						read: jest
							.fn()
							.mockImplementation(() =>
								Promise.resolve({ template_id: 'test-value', template_string: 'Hello, {{title}} {{name.last}}.' })
							),
					},
				},
			],
		}).compile();

		renderingSvc = module.get<RenderingService>(RenderingService);
	});

	it('should be defined', () => {
		expect(renderingSvc).toBeDefined();
	});

	it("should render 'Hello, Mr. McTesterson.'", async () => {
		const rendering = await renderingSvc.render('test-value', { title: 'Mr.', name: { first: 'Testy', last: 'McTesterson' } });
		expect(rendering).toEqual('Hello, Mr. McTesterson.');
	});
});
