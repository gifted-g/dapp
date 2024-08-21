import { Test, TestingModule } from '@nestjs/testing';
import { BusinessCron } from './business.cron';
import { BusinessRepository } from './business.repository';
import { RedisService } from '../../shared';
import { Queue } from 'bullmq';
import { getQueueToken } from '@nestjs/bullmq';
import { BUSINESS_CREDIT_SCORE_QUEUE } from './business.constant';

describe('BusinessCron', () => {
  let cron: BusinessCron;
  let businessRepositoryMock: Partial<BusinessRepository>;
  let redisServiceMock: Partial<RedisService>;
  let businessQueueMock: Partial<Queue>;

  beforeEach(async () => {
    businessRepositoryMock = {
      getAllBusinesses: jest.fn(),
    };

    redisServiceMock = {
      acquireLock: jest.fn(),
      releaseLock: jest.fn(),
    };

    businessQueueMock = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessCron,
        {
          provide: BusinessRepository,
          useValue: businessRepositoryMock,
        },
        {
          provide: RedisService,
          useValue: redisServiceMock,
        },
        {
          provide: getQueueToken(BUSINESS_CREDIT_SCORE_QUEUE),
          useValue: businessQueueMock,
        },
      ],
    }).compile();

    cron = module.get<BusinessCron>(BusinessCron);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(cron).toBeDefined();
  });

  describe('calculateBusinessCreditScore', () => {
    it('should process businesses and push jobs to queue', async () => {
      const businesses = [{ id: '1' }, { id: '2' }, { id: '3' }];
      const meta = { hasNextPage: false, totalPages: 1 };

      businessRepositoryMock.getAllBusinesses = jest
        .fn()
        .mockResolvedValue([businesses, meta]);
      redisServiceMock.acquireLock = jest.fn().mockResolvedValue(true);

      await cron.calculateBusinessCreditScore();

      expect(businessRepositoryMock.getAllBusinesses).toHaveBeenCalledWith({
        page: 1,
        limit: 100,
      });
      expect(redisServiceMock.acquireLock).toHaveBeenCalledWith(
        'business_credit_score',
        expect.any(String),
        86400,
      );

      expect(businessQueueMock.add).toHaveBeenCalledTimes(businesses.length);
      businesses.forEach((business) => {
        expect(businessQueueMock.add).toHaveBeenCalledWith(
          'calculateCreditScore',
          { businessId: business.id },
        );
      });

      expect(redisServiceMock.releaseLock).toHaveBeenCalledWith(
        'business_credit_score',
        expect.any(String),
      );
    });

    it('should handle error when failing to acquire lock', async () => {
      redisServiceMock.acquireLock = jest.fn().mockResolvedValue(false);

      await cron.calculateBusinessCreditScore();

      expect(businessRepositoryMock.getAllBusinesses).not.toHaveBeenCalled();
      expect(redisServiceMock.releaseLock).not.toHaveBeenCalled();
    });
  });
});
