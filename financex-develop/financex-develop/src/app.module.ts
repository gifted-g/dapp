import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { CommerceQueueService } from './modules/commerce/commerce.queue';
import { BusinessProcessor } from './modules/business/business.processor';
import { RedisModule } from './shared';
import { BasicAuthMiddleware } from './guards';
import { BusinessModule } from './modules/business/business.module';
import { CommerceModule } from './modules/commerce/commerce.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('POSTGRES_DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_DATABASE_URL'),
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
    }),
    ScheduleModule.forRoot(),
    BusinessModule,
    CommerceModule,
    {
      global: true,
      module: RedisModule,
    },
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  private readonly serverAdapter = new ExpressAdapter();

  constructor(
    private readonly commerceQueueService: CommerceQueueService,
    private businessQueueProcessor: BusinessProcessor,
  ) {
    createBullBoard({
      queues: [
        ...this.commerceQueueService.getQueueAdapter(),
        ...this.businessQueueProcessor.getQueueAdapter(),
      ],
      serverAdapter: this.serverAdapter,
    });
  }

  configure(consumer: MiddlewareConsumer): void {
    this.serverAdapter.setBasePath('/admin/queues');
    consumer
      .apply(BasicAuthMiddleware, this.serverAdapter.getRouter())
      .forRoutes('/admin/queues');
  }
}
