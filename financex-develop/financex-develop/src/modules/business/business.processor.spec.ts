import { Test, TestingModule } from '@nestjs/testing';
import { BusinessProcessor } from './business.processor';
import { BusinessRepository } from './business.repository';
import { Queue } from 'bullmq';
import { Job } from 'bullmq';
import { getQueueToken } from '@nestjs/bullmq';
import { BUSINESS_CREDIT_SCORE_QUEUE } from './business.constant';

describe('BusinessProcessor', () => {
  let processor: BusinessProcessor;
  let businessRepositoryMock: Partial<BusinessRepository>;
  let queueMock: Partial<Queue>;

  beforeEach(async () => {
    businessRepositoryMock = {
      getTransactionLogs: jest.fn(),
      updateBusinessCreditScore: jest.fn(),
    };

    queueMock = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessProcessor,
        { provide: BusinessRepository, useValue: businessRepositoryMock },
        {
          provide: getQueueToken(BUSINESS_CREDIT_SCORE_QUEUE),
          useValue: queueMock,
        },
      ],
    }).compile();

    processor = module.get<BusinessProcessor>(BusinessProcessor);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('process', () => {
    it('should process job and update business credit score', async () => {
      const job: Job<{ businessId: string }, any, string> = {
        id: 'test_job_id',
        data: { businessId: 'test_business_id' },
      } as any;

      const transactions = [{ totalAmount: 500 }, { totalAmount: 1000 }];

      businessRepositoryMock.getTransactionLogs = jest
        .fn()
        .mockResolvedValue([
          transactions,
          { hasNextPage: false, count: transactions.length },
        ]);

      await processor.process(job);

      expect(businessRepositoryMock.getTransactionLogs).toHaveBeenCalledWith({
        businessId: 'test_business_id',
        page: 1,
        limit: 100,
      });
      expect(
        businessRepositoryMock.updateBusinessCreditScore,
      ).toHaveBeenCalledWith({
        businessId: 'test_business_id',
        creditScore: 25,
      });
    });

    it('should handle error', async () => {
      const job: Job<{ businessId: string }, any, string> = {
        id: 'test_job_id',
        data: { businessId: 'test_business_id' },
      } as any;

      businessRepositoryMock.getTransactionLogs = jest
        .fn()
        .mockRejectedValue(new Error('Failed to fetch transactions'));

      await expect(processor.process(job)).rejects.toThrowError(
        'Failed to fetch transactions',
      );
    });
  });
});
