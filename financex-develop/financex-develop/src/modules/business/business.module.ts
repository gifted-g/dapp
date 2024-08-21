import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { Business, DepartmentHead } from './entities';
import { BusinessRepository } from './business.repository';
import { TransactionModelName, TransactionSchema } from '../commerce/entities';
import { BusinessCron } from './business.cron';
import { BUSINESS_CREDIT_SCORE_QUEUE } from './business.constant';
import { BusinessProcessor } from './business.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Business, DepartmentHead]),
    MongooseModule.forFeature([
      { name: TransactionModelName, schema: TransactionSchema },
    ]),
    BullModule.registerQueue({
      name: BUSINESS_CREDIT_SCORE_QUEUE,
      defaultJobOptions: {
        removeOnComplete: true,
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
  controllers: [BusinessController],
  providers: [
    BusinessService,
    BusinessRepository,
    BusinessCron,
    BusinessProcessor,
  ],
  exports: [BusinessRepository, BusinessProcessor],
})
export class BusinessModule {}
