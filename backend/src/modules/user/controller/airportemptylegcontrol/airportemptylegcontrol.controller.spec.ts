import { Test, TestingModule } from '@nestjs/testing';
import { AirportemptylegcontrolController } from './airportemptylegcontrol.controller';

describe('AirportemptylegcontrolController', () => {
  let controller: AirportemptylegcontrolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirportemptylegcontrolController],
    }).compile();

    controller = module.get<AirportemptylegcontrolController>(AirportemptylegcontrolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
