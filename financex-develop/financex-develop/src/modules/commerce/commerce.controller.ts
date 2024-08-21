import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommerceService } from './commerce.service';
import { CreateInventoryItemDto, CreateOrderDto } from './dto';
import { AuthGuard } from '../../guards';
import {
  BusinessDepartmentParamsDto,
  BusinessParamsDto,
} from '../business/dto';

@Controller('commerce')
@UseGuards(AuthGuard)
export class CommerceController {
  constructor(private readonly commerceService: CommerceService) {}

  @Post(':businessId/order/:departmentId')
  create(
    @Body() payload: CreateOrderDto,
    @Param() params: BusinessDepartmentParamsDto,
  ) {
    return this.commerceService.createOrder(
      params.businessId,
      params.departmentId,
      payload,
    );
  }

  @Post(':businessId/inventory')
  createInventoryItem(
    @Body() payload: CreateInventoryItemDto,
    @Param() params: BusinessParamsDto,
  ) {
    return this.commerceService.createInventoryItem(params.businessId, payload);
  }

  @Get(':businessId/orders')
  getBusinessOrders(
    @Param() params: BusinessParamsDto,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.commerceService.getBusinessOrders(params.businessId, {
      page,
      limit,
    });
  }

  @Get(':businessId/stats')
  getBusinessStats(@Param() params: BusinessParamsDto) {
    return this.commerceService.getBusinessStats(params.businessId);
  }
}
