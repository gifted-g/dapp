import { HttpException, Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { CreateBusinessDepartmentDto } from './dto';
import { BusinessRepository } from './business.repository';

@Injectable()
export class BusinessService {
  constructor(private businessRepository: BusinessRepository) {}

  create(payload: CreateBusinessDto) {
    return this.businessRepository.createBusiness(payload);
  }

  async createDepartment(
    businessId: string,
    payload: CreateBusinessDepartmentDto,
  ) {
    const business = await this.businessRepository.findBusinessById(businessId);

    if (!business) {
      throw new HttpException('Business not found', 404);
    }

    const departmentHead =
      await this.businessRepository.findDepartmentHeadByEmail(payload.email);

    if (departmentHead) {
      throw new HttpException('Department head already exists', 400);
    }

    return this.businessRepository.createDepartment(business, payload);
  }

  async getCreditScore(businessId: string) {
    const business = await this.businessRepository.findBusinessById(businessId);

    if (!business) {
      throw new HttpException('Business not found', 404);
    }

    return {
      creditScore: business.creditScore,
      calculatedAt: business.creditScoreCalculatedAt,
      isCalculated: business.creditScoreCalculatedAt !== null,
    };
  }
}
