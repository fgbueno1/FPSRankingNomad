import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { HealthService } from './app.service';

describe('AppController', () => {
  let service: HealthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [HealthService],
    }).compile();

    service = new HealthService();
  });

  describe('root', () => {
    it('should return a health check object', () => {
      const result = service.getHealthStatus();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('timestamp');
    });

    it('should return uptime as a number', () => {
      const result = service.getHealthStatus();
      expect(typeof result.uptime).toBe('number');
    });
  
    it('should return timestamp as an ISO string', () => {
      const result = service.getHealthStatus();
      expect(() => new Date(result.timestamp)).not.toThrow();
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });

  });
  
});
