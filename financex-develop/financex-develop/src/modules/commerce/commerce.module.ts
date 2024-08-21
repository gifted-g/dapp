import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { CommerceService } from './commerce.service';
import { CommerceController } from './commerce.controller';
import { CommerceRepository } from './commerce.repository';
import {
  InventoryItem,
  Order,
  TransactionModelName,
  TransactionSchema,
} from './entities';
import { BusinessModule } from '../business/business.module';
import { TaxService } from './tax.service';
import { COMMERCE_QUEUE, CommerceProcessor } from './commerce.processor';
import { CommerceQueueService } from './commerce.queue';

@Module({
  imports: [
    HttpModule,
    BusinessModule,
    TypeOrmModule.forFeature([InventoryItem, Order]),
    MongooseModule.forFeature([
      { name: TransactionModelName, schema: TransactionSchema },
    ]),
    BullModule.registerQueue({
      name: COMMERCE_QUEUE,
      defaultJobOptions: {
        removeOnComplete: false,
        removeOnFail: false,
        // when a job fails, retry it 3 times with an exponential backoff delay of 1 second
        // before finally failing
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    }),
  ],
  controllers: [CommerceController],
  providers: [
    CommerceService,
    CommerceRepository,
    TaxService,
    CommerceProcessor,
    CommerceQueueService,
  ],
  exports: [CommerceQueueService],
})
export class CommerceModule {}
