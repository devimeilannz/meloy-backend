import { Test, TestingModule } from '@nestjs/testing';
import { GroomingPackageController } from './grooming-package.controller';

describe('GroomingPackageController', () => {
  let controller: GroomingPackageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroomingPackageController],
    }).compile();

    controller = module.get<GroomingPackageController>(GroomingPackageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
