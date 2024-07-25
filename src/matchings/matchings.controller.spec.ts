import { Test, TestingModule } from '@nestjs/testing';
import { MatchingsController } from './matchings.controller';
import { MatchingsService } from './matchings.service';

describe('MatchingsController', () => {
  let controller: MatchingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchingsController],
      providers: [MatchingsService],
    }).compile();

    controller = module.get<MatchingsController>(MatchingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
