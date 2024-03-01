import { Test, TestingModule } from '@nestjs/testing';
import { EmptylegService } from './emptyleg.service';

describe('EmptylegService', () => {
  let service: EmptylegService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmptylegService],
    }).compile();

    service = module.get<EmptylegService>(EmptylegService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
