import { Test, TestingModule } from '@nestjs/testing';
import { CommerceService } from './commerce.service';
import { CommerceRepository } from './commerce.repository';
import { BusinessRepository } from '../business/business.repository';
import { HttpException } from '@nestjs/common';
import { CreateOrderDto, CreateInventoryItemDto } from './dto';
import { InventoryItem, Order } from './entities';
import { CommerceQueueService } from './commerce.queue';
import { RedisService } from '../../shared';

describe('CommerceService', () => {
  let service: CommerceService;
  let commerceRepositoryMock: Partial<CommerceRepository>;
  let businessRepositoryMock: Partial<BusinessRepository>;
  let commerceQueueService: Partial<CommerceQueueService>;
  let redisService: Partial<RedisService>;

  beforeEach(async () => {
    commerceRepositoryMock = {
      findInventoryItemById: jest.fn().mockImplementation((itemId: string) => {
        // Mock finding an inventory item by ID
        if (itemId === 'validItemId') {
          return Promise.resolve({
            id: 'validItemId',
            name: 'Test Item',
            description: 'Test description',
            price: 10,
          } as InventoryItem);
        } else {
          return Promise.resolve(null);
        }
      }),
      createOrder: jest.fn().mockImplementation((orderPayload: Order) => {
        // Mock creating an order
        return Promise.resolve({
          id: 'testOrderId',
          ...orderPayload,
        } as Order);
      }),
      getBusinessOrders: jest.fn().mockResolvedValue([
        [],
        {
          totalPages: 0,
          hasNextPage: false,
        },
      ]),
      createInventoryItem: jest
        .fn()
        .mockImplementation((item: InventoryItem) => {
          return Promise.resolve(item);
        }),
      getStats: jest.fn(),
    };

    businessRepositoryMock = {
      findBusinessById: jest.fn().mockImplementation((businessId: string) => {
        if (['validBusinessId', 'notCachedBusinessId'].includes(businessId)) {
          return Promise.resolve({
            id: businessId,
            name: 'Test Business',
          });
        } else {
          return Promise.resolve(null);
        }
      }),
      validateBusinessDepartment: jest.fn().mockResolvedValue(true),
    };

    commerceQueueService = {
      processOrderMeta: jest.fn().mockResolvedValue(undefined),
    };

    redisService = {
      acquireLock: jest.fn().mockResolvedValue(true),
      releaseLock: jest.fn().mockResolvedValue(true),
      getBusinessStats: jest.fn().mockImplementation((businessId: string) => {
        if (businessId === 'validBusinessId') {
          return Promise.resolve({
            totalOrders: 10,
            totalAmount: 200,
            totalOrdersToday: 5,
            totalAmountToday: 100,
          });
        } else {
          return Promise.resolve(null);
        }
      }),
      setBusinessStats: jest.fn().mockResolvedValue(undefined),
      invalidateBusinessStatsCache: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommerceService,
        {
          provide: CommerceRepository,
          useValue: commerceRepositoryMock,
        },
        {
          provide: BusinessRepository,
          useValue: businessRepositoryMock,
        },
        {
          provide: CommerceQueueService,
          useValue: commerceQueueService,
        },
        {
          provide: RedisService,
          useValue: redisService,
        },
      ],
    }).compile();

    service = module.get<CommerceService>(CommerceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should createOrder a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        orderItems: [{ itemId: 'validItemId', quantity: 2 }],
      };
      const result = await service.createOrder(
        'validBusinessId',
        'validDepartmentId',
        createOrderDto,
      );
      expect(result.id).toBe('testOrderId');
      expect(commerceRepositoryMock.createOrder).toBeCalledWith(
        expect.objectContaining({
          businessId: 'validBusinessId',
          departmentHeadId: 'validDepartmentId',
          totalPrice: 20, // 2 items at 10 each
        }),
      );
    });

    it('should throw an error if business does not exist', async () => {
      await expect(
        service.createOrder(
          'invalidBusinessId',
          'validDepartmentId',
          {} as CreateOrderDto,
        ),
      ).rejects.toThrowError(HttpException);
      expect(businessRepositoryMock.findBusinessById).toBeCalledWith(
        'invalidBusinessId',
      );
    });

    it('should process the transaction and tax after creating an order', async () => {
      const createOrderDto: CreateOrderDto = {
        orderItems: [{ itemId: 'validItemId', quantity: 2 }],
      };
      await service.createOrder(
        'validBusinessId',
        'validDepartmentId',
        createOrderDto,
      );
      expect(commerceQueueService.processOrderMeta).toBeCalled();
    });

    it('should throw an error if an item does not exist', async () => {
      commerceRepositoryMock.findInventoryItemById = jest
        .fn()
        .mockResolvedValue(null);
      const createOrderDto: CreateOrderDto = {
        orderItems: [{ itemId: 'invalidItemId', quantity: 2 }],
      };
      await expect(
        service.createOrder(
          'validBusinessId',
          'validDepartmentId',
          createOrderDto,
        ),
      ).rejects.toThrowError(HttpException);
      expect(commerceRepositoryMock.findInventoryItemById).toBeCalledWith(
        'invalidItemId',
      );
    });
  });

  describe('createInventoryItem', () => {
    it('should createOrder a new inventory item', async () => {
      const createInventoryItemDto: CreateInventoryItemDto = {
        name: 'New Item',
        description: 'Item description',
        price: 20,
      };
      const result = await service.createInventoryItem(
        'validBusinessId',
        createInventoryItemDto,
      );
      expect(result.name).toBe('New Item');
      expect(result.price).toBe(20);
      expect(commerceRepositoryMock.createInventoryItem).toHaveBeenCalled();
    });
  });

  describe('getBusinessOrders', () => {
    it('should return orders for a valid business', async () => {
      const result = await service.getBusinessOrders('validBusinessId', {
        page: 1,
        limit: 10,
      });

      expect(result.data).toEqual([]);
      expect(result.meta).toEqual({
        totalPages: 0,
        hasNextPage: false,
      });
    });
  });

  describe('getBusinessStats', () => {
    it('should return business statistics from cache if available', async () => {
      redisService.getBusinessStats = jest.fn().mockResolvedValueOnce({
        totalOrders: 15,
        totalAmount: 300,
        totalOrdersToday: 7,
        totalAmountToday: 150,
      });

      const stats = await service.getBusinessStats('validBusinessId');

      expect(stats).toEqual({
        totalOrders: 15,
        totalAmount: 300,
        totalOrdersToday: 7,
        totalAmountToday: 150,
      });
      expect(redisService.getBusinessStats).toHaveBeenCalledWith(
        'validBusinessId',
      );
      expect(commerceRepositoryMock.getStats).not.toHaveBeenCalled();
      expect(redisService.setBusinessStats).not.toHaveBeenCalled();
    });

    it('should return business statistics from database if not available in cache', async () => {
      await service.getBusinessStats('notCachedBusinessId');

      expect(redisService.getBusinessStats).toHaveBeenCalledWith(
        'notCachedBusinessId',
      );
      expect(commerceRepositoryMock.getStats).toHaveBeenCalledWith(
        'notCachedBusinessId',
      );
      expect(redisService.setBusinessStats).toHaveBeenCalled();
    });

    it('should throw an error if the business does not exist', async () => {
      businessRepositoryMock.findBusinessById = jest
        .fn()
        .mockResolvedValueOnce(null);

      await expect(
        service.getBusinessStats('invalidBusinessId'),
      ).rejects.toThrowError(HttpException);
      expect(businessRepositoryMock.findBusinessById).toHaveBeenCalledWith(
        'invalidBusinessId',
      );
      expect(redisService.getBusinessStats).not.toHaveBeenCalled();
      expect(commerceRepositoryMock.getStats).not.toHaveBeenCalled();
      expect(redisService.setBusinessStats).not.toHaveBeenCalled();
    });
  });
});
