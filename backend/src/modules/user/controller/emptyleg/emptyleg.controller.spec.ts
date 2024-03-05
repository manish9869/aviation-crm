import { Test, TestingModule } from '@nestjs/testing';
import { EmptylegController } from './emptyleg.controller';

describe('EmptylegController', () => {
  let controller: EmptylegController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmptylegController],
    }).compile();

    controller = module.get<EmptylegController>(EmptylegController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
