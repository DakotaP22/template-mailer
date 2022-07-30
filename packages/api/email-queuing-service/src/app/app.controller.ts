import { Controller, Get } from '@nestjs/common';

import { QueueService } from './queue.service';

@Controller()
export class AppController {
  constructor(private readonly queueSvc: QueueService) {}

  @Get('/test')
  test() {
    return this.queueSvc.test();
  }
}
