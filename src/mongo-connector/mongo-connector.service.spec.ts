import { Test, TestingModule } from '@nestjs/testing';
import { MongoConnectorService } from './mongo-connector.service';

describe('MongoConnectorService', () => {
  let service: MongoConnectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoConnectorService],
    }).compile();

    service = module.get<MongoConnectorService>(MongoConnectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
