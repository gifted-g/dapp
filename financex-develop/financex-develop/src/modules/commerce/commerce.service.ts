import { HttpException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { CommerceRepository } from './commerce.repository';
import { BusinessRepository } from '../business/business.repository';
import { InventoryItem, Order, OrderItems } from './entities';
import { CreateInventoryItemDto } from './dto';
import { CommerceQueueService } from './commerce.queue';
import { RedisService } from '../../shared';

@Injectable()
export class CommerceService {
  constructor(
    private readonly commerceRepository: CommerceRepository,
    private businessRepository: BusinessRepository,
    private orderQueueService: CommerceQueueService,
    private redisService: RedisService,
  ) {}

  private TAX_RATE = 0.1;

  async createOrder(
    businessId: string,
    departmentId: string,
    payload: CreateOrderDto,
  ) {
    const businessExists = await this.businessRepository.findBusinessById(
      businessId,
    );

    if (!businessExists) {
      throw new HttpException('Invalid business', 400);
    }

    const departmentExists =
      await this.businessRepository.validateBusinessDepartment(
        businessId,
        departmentId,
      );

    if (!departmentExists) {
      throw new HttpException('Invalid department', 400);
    }

    const orderItems: OrderItems[] = await Promise.all(
      payload.orderItems.map(async (item) => {
        const inventoryItem =
          await this.commerceRepository.findInventoryItemById(item.itemId);

        if (!inventoryItem) {
          throw new HttpException(
            `Invalid inventory item: ${item.itemId}`,
            400,
          );
        }

        return {
          item: inventoryItem,
          quantity: item.quantity,
          price: inventoryItem.price * item.quantity,
        };
      }),
    );

    const orderPayload: Order = {
      orderItems,
      businessId: businessExists.id,
      departmentHeadId: departmentId,
      totalPrice: orderItems.reduce((acc, item) => acc + item.price, 0),
    };

    const order = await this.commerceRepository.createOrder(orderPayload);

    const taxAmount = order.totalPrice * this.TAX_RATE;

    await Promise.allSettled([
      // process order meta in a queue, to avoid blocking the request
      // and to properly handle retries in case of failure
      this.orderQueueService.processOrderMeta({
        businessId,
        departmentId,
        orderId: order.id,
        totalAmount: order.totalPrice,
        taxAmount,
      }),

      // invalidate business stats cache, so next request will fetch fresh data
      this.redisService.invalidateBusinessStatsCache(businessId),
    ]);

    return order;
  }

  async createInventoryItem(
    businessId: string,
    payload: CreateInventoryItemDto,
  ) {
    const businessExists = await this.businessRepository.findBusinessById(
      businessId,
    );

    if (!businessExists) {
      throw new HttpException('Invalid business', 400);
    }

    const item: InventoryItem = {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      business: businessExists,
    };

    return this.commerceRepository.createInventoryItem(item);
  }

  async getBusinessOrders(
    businessId: string,
    pagination: {
      page: number;
      limit: number;
    },
  ) {
    const businessExists = await this.businessRepository.findBusinessById(
      businessId,
    );

    if (!businessExists) {
      throw new HttpException('Invalid business', 400);
    }

    const [data, meta] = await this.commerceRepository.getBusinessOrders(
      businessId,
      pagination,
    );

    return {
      data,
      meta,
    };
  }

  async getBusinessStats(businessId: string): Promise<{
    totalOrders: number;
    totalAmount: number;
    totalOrdersToday: number;
    totalAmountToday: number;
  }> {
    const businessExists = await this.businessRepository.findBusinessById(
      businessId,
    );

    if (!businessExists) {
      throw new HttpException('Invalid business', 400);
    }

    // fetch stats from cache, if available to reduce load on the database
    // invalidated when new orders are created or when the cache expires
    let stats = await this.redisService.getBusinessStats(businessId);

    if (!stats) {
      // fetch stats from the database
      stats = await this.commerceRepository.getStats(businessId);

      // cache the stats
      await this.redisService.setBusinessStats(businessId, stats);
    }

    return stats;
  }
}
