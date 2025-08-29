import { Controller, Get } from '@nestjs/common';
import { HealthService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  healthCheck() {
    return this.healthService.getHealthStatus();
  }
}
