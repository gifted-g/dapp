import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { BusinessParamsDto, CreateBusinessDepartmentDto } from './dto';
import { AuthGuard } from '../../guards';

@Controller('business')
@UseGuards(AuthGuard)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  create(@Body() payload: CreateBusinessDto) {
    return this.businessService.create(payload);
  }

  @Post(':businessId/department')
  createDepartment(
    @Param() params: BusinessParamsDto,
    @Body() payload: CreateBusinessDepartmentDto,
  ) {
    return this.businessService.createDepartment(params.businessId, payload);
  }

  @Get(':businessId/credit-score')
  getCreditScore(@Param() params: BusinessParamsDto) {
    return this.businessService.getCreditScore(params.businessId);
  }
}
