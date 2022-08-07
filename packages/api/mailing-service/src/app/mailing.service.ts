import { Injectable } from '@nestjs/common';

@Injectable()
export class MailingService {
	getData(): { message: string } {
		return { message: 'Welcome to mailing-service!' };
	}
}
