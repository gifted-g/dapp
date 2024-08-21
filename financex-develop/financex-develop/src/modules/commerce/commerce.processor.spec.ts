import { Test, TestingModule } from '@nestjs/testing';
import { CommerceProcessor } from './commerce.processor';
import { CommerceRepository } from './commerce.repository';
import { TaxService } from './tax.service';
import { Job } from 'bullmq';

const job: Job<any, any, string> = {
  id: 'test_job_id',
  data: {
    businessId: 'testBusinessId',
    departmentId: 'testDepartmentId',
    orderId: 'testOrderId',
    totalAmount: 100,
    taxAmount: 10,
  },
  log: jest.fn(),
  updateData: jest.fn(),
} as any;

describe('CommerceProcessor', () => {
  let processor: CommerceProcessor;
  let commerceRepositoryMock: Partial<CommerceRepository>;
  let taxServiceMock: Partial<TaxService>;

  beforeEach(async () => {
    commerceRepositoryMock = {
      logTransaction: jest.fn(),
    };

    taxServiceMock = {
      logTax: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommerceProcessor,
        { provide: CommerceRepository, useValue: commerceRepositoryMock },
        { provide: TaxService, useValue: taxServiceMock },
      ],
    }).compile();

    processor = module.get<CommerceProcessor>(CommerceProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('process', () => {
    it('should process job and log transaction and tax', async () => {
      await processor.process(job);

      expect(commerceRepositoryMock.logTransaction).toHaveBeenCalledWith({
        businessId: 'testBusinessId',
        departmentId: 'testDepartmentId',
        orderId: 'testOrderId',
        totalAmount: 100,
      });

      expect(taxServiceMock.logTax).toHaveBeenCalledWith({
        businessId: 'testBusinessId',
        orderId: 'testOrderId',
        totalAmount: 100,
        taxAmount: 10,
      });

      expect(job.updateData).toHaveBeenCalledTimes(2);
      expect(job.log).toHaveBeenCalledTimes(2);
    });

    it('should throw an error if logging transaction fails', async () => {
      commerceRepositoryMock.logTransaction = jest
        .fn()
        .mockRejectedValueOnce(new Error('Transaction logging failed'));

      await expect(processor.process(job)).rejects.toThrowError(
        'Transaction logging failed',
      );
      expect(job.log).toHaveBeenCalledWith(
        'Error logging transaction: Transaction logging failed',
      );
    });

    it('should throw an error if logging tax fails', async () => {
      taxServiceMock.logTax = jest
        .fn()
        .mockRejectedValueOnce(new Error('Tax logging failed'));

      await expect(processor.process(job)).rejects.toThrowError(
        'Tax logging failed',
      );
      expect(job.log).toHaveBeenCalledWith(
        'Error logging tax: Tax logging failed',
      );
    });
  });
});
