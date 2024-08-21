import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TaxService {
  constructor(private readonly httpService: HttpService) {}

  private logger = new Logger(TaxService.name);

  async logTax(orderDetails: {
    orderId: string;
    businessId: string;
    totalAmount: number;
    taxAmount: number;
  }): Promise<void> {
    try {
      await this.httpService.axiosRef.post(
        'https://taxes.free.beeceptor.com/log-tax',
        orderDetails,
        {
          // 35 seconds timeout
          timeout: 35 * 1000,
        },
      );
      this.logger.log('Tax logged successfully', orderDetails.orderId);
    } catch (error) {
      this.logger.error('Error logging tax:', error.message);
      throw error;
    }
  }
}
