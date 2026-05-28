import { Test, TestingModule } from '@nestjs/testing';
import { GroomingPackageService } from './grooming-package.service';

describe('GroomingPackageService', () => {
  let service: GroomingPackageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroomingPackageService],
    }).compile();

    service = module.get<GroomingPackageService>(GroomingPackageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
