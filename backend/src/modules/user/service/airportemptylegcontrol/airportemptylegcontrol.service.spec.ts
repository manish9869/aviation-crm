import { Test, TestingModule } from '@nestjs/testing';
import { AirportEmptylegControlService } from './airportemptylegcontrol.service';

describe('AirportemptylegcontrolService', () => {
  let service: AirportEmptylegControlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirportEmptylegControlService],
    }).compile();

    service = module.get<AirportEmptylegControlService>(AirportEmptylegControlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
