import { Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Business, DepartmentHead } from './entities';
import { Repository } from 'typeorm';
import { CreateBusinessDepartmentDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionModelName } from '../commerce/entities';
import { Model } from 'mongoose';

@Injectable()
export class BusinessRepository {
  constructor(
    @InjectRepository(Business) private businessRepo: Repository<Business>,
    @InjectRepository(DepartmentHead)
    private departmentHeadRepo: Repository<DepartmentHead>,
    @InjectModel(TransactionModelName)
    private transactionModel: Model<Transaction>,
  ) {}

  findBusinessById(id: string) {
    return this.businessRepo.findOne({ where: { id } });
  }

  validateBusinessDepartment(businessId: string, departmentId: string) {
    return this.businessRepo.findOne({
      where: { id: businessId, departmentHeads: { id: departmentId } },
      relations: {
        departmentHeads: true,
      },
    });
  }

  findDepartmentHeadByEmail(email: string) {
    return this.departmentHeadRepo.findOne({ where: { email } });
  }

  createBusiness(payload: CreateBusinessDto) {
    return this.businessRepo.save(payload);
  }

  async createDepartment(
    business: Business,
    payload: CreateBusinessDepartmentDto,
  ) {
    const departmentHead = this.departmentHeadRepo.create({
      ...payload,
      business,
    });

    return this.departmentHeadRepo.save(departmentHead);
  }

  async getAllBusinesses({
    page = 1,
    limit = 10,
  }: {
    page?: number;
    limit?: number;
  }): Promise<
    [
      Business[],
      {
        totalPages: number;
        hasNextPage: boolean;
      },
    ]
  > {
    const [businesses, count] = await this.businessRepo.findAndCount();

    return [
      businesses,
      {
        totalPages: Math.ceil(count / limit),
        hasNextPage: count > (page - 1) * limit + limit,
      },
    ];
  }

  async getTransactionLogs(data: {
    businessId: string;
    page: number;
    limit: number;
  }): Promise<
    [
      Transaction[],
      {
        totalPages: number;
        hasNextPage: boolean;
        count: number;
      },
    ]
  > {
    const { businessId, page = 1, limit = 10 } = data;

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.transactionModel.find({ businessId }).skip(skip).limit(limit).exec(),
      this.transactionModel.countDocuments({ businessId }),
    ]);

    return [
      transactions,
      {
        totalPages: Math.ceil(total / limit),
        hasNextPage: total > skip + limit,
        count: total,
      },
    ];
  }

  async updateBusinessCreditScore(data: {
    businessId: string;
    creditScore: number;
  }) {
    const { businessId, creditScore } = data;

    return this.businessRepo.update(
      { id: businessId },
      { creditScore, creditScoreCalculatedAt: new Date() },
    );
  }
}
