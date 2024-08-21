import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { COMMERCE_QUEUE, TCommerceOrderDetails } from './commerce.processor';

@Injectable()
export class CommerceQueueService {
  constructor(
    @InjectQueue(COMMERCE_QUEUE) private readonly commerceQueue: Queue,
  ) {}

  private logger = new Logger(CommerceQueueService.name);

  async processOrderMeta(orderDetails: TCommerceOrderDetails) {
    try {
      await this.commerceQueue.add(orderDetails.orderId, orderDetails, {
        jobId: orderDetails.orderId,
      });

      this.logger.log(
        `Order meta added to queue: ${orderDetails.orderId}`,
        CommerceQueueService.name,
      );
    } catch (error) {
      // fail silently, to avoid failing the main process
      // log and send to monitoring/alerting service
      this.logger.error(
        `Error adding order meta to queue: ${orderDetails.orderId}`,
        error.stack,
        CommerceQueueService.name,
      );
    }
  }

  getQueueAdapter() {
    return [new BullMQAdapter(this.commerceQueue, { readOnlyMode: false })];
  }
}
