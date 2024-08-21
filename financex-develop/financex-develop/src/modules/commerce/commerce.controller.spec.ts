import { Test, TestingModule } from '@nestjs/testing';
import { CommerceController } from './commerce.controller';
import { CommerceService } from './commerce.service';
import { CreateInventoryItemDto, CreateOrderDto } from './dto';

describe('CommerceController', () => {
  let controller: CommerceController;
  let commerceServiceMock: Partial<CommerceService>;

  beforeEach(async () => {
    commerceServiceMock = {
      createOrder: jest.fn(),
      createInventoryItem: jest.fn(),
      getBusinessOrders: jest.fn(),
      getBusinessStats: jest.fn().mockResolvedValue({
        totalOrders: 10,
        totalAmount: 1000,
        totalOrdersToday: 5,
        totalAmountToday: 500,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommerceController],
      providers: [
        {
          provide: CommerceService,
          useValue: commerceServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CommerceController>(CommerceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create order with correct payload and params', async () => {
      const payload: CreateOrderDto = {
        orderItems: [
          {
            itemId: 'validId',
            quantity: 1,
          },
        ],
      };
      const params = {
        businessId: 'validId',
        departmentId: 'validId',
      };

      await controller.create(payload, params);

      expect(commerceServiceMock.createOrder).toHaveBeenCalledWith(
        params.businessId,
        params.departmentId,
        payload,
      );
    });
  });

  describe('createInventoryItem', () => {
    it('should create inventory item with correct payload and params', async () => {
      const payload: CreateInventoryItemDto = {
        name: 'Test Item',
        price: 100,
        description: 'Test Description',
      };
      const params = { businessId: 'validId' };

      await controller.createInventoryItem(payload, params);

      expect(commerceServiceMock.createInventoryItem).toHaveBeenCalledWith(
        params.businessId,
        payload,
      );
    });
  });

  describe('getBusinessOrders', () => {
    it('should get business orders', async () => {
      const businessId = 'validId';

      await controller.getBusinessOrders({ businessId });

      expect(commerceServiceMock.getBusinessOrders).toHaveBeenCalledWith(
        businessId,
        { page: 1, limit: 10 },
      );
    });

    it('should get business orders', async () => {
      const businessId = 'validId';
      const page = 2;
      const limit = 20;

      await controller.getBusinessOrders({ businessId }, page, limit);

      expect(commerceServiceMock.getBusinessOrders).toHaveBeenCalledWith(
        businessId,
        { page, limit },
      );
    });
  });

  describe('getBusinessStats', () => {
    it('should get business stats', async () => {
      const businessId = 'validId';

      const data = await controller.getBusinessStats({ businessId });

      expect(commerceServiceMock.getBusinessStats).toHaveBeenCalledWith(
        businessId,
      );
      expect(data).toEqual({
        totalOrders: 10,
        totalAmount: 1000,
        totalOrdersToday: 5,
        totalAmountToday: 500,
      });
    });
  });
});
