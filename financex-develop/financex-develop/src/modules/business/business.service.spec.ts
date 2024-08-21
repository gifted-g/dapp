import { Test, TestingModule } from '@nestjs/testing';
import { BusinessService } from './business.service';
import { BusinessRepository } from './business.repository';
import { CreateBusinessDto } from './dto/create-business.dto';
import { CreateBusinessDepartmentDto } from './dto';

describe('BusinessService', () => {
  let service: BusinessService;
  let businessRepositoryMock: Partial<BusinessRepository>;

  const businessId = 'testBusinessId';
  const createBusinessDepartmentDto: CreateBusinessDepartmentDto = {
    name: 'Test Department',
    email: 'test@test.com',
  };

  beforeEach(async () => {
    businessRepositoryMock = {
      createBusiness: jest.fn(),
      findBusinessById: jest.fn(),
      findDepartmentHeadByEmail: jest.fn(),
      createDepartment: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessService,
        {
          provide: BusinessRepository,
          useValue: businessRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<BusinessService>(BusinessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call businessRepository.createBusiness with correct payload', async () => {
      const createBusinessDto: CreateBusinessDto = {
        name: 'Test Business',
      };

      await service.create(createBusinessDto);

      expect(businessRepositoryMock.createBusiness).toHaveBeenCalledWith(
        createBusinessDto,
      );
    });
  });

  describe('createDepartment', () => {
    it('should call businessRepository.findBusinessById with correct businessId', async () => {
      businessRepositoryMock.findBusinessById = jest.fn().mockResolvedValue({
        id: businessId,
      });

      await service.createDepartment(businessId, createBusinessDepartmentDto);

      expect(businessRepositoryMock.findBusinessById).toHaveBeenCalledWith(
        businessId,
      );
    });

    it('should throw an error if business is not found', async () => {
      businessRepositoryMock.findBusinessById = jest
        .fn()
        .mockResolvedValue(null);

      await expect(
        service.createDepartment(businessId, createBusinessDepartmentDto),
      ).rejects.toThrowError('Business not found');
    });
  });

  it('should create a department if business is found', async () => {
    businessRepositoryMock.findBusinessById = jest.fn().mockResolvedValue({
      id: businessId,
    });

    businessRepositoryMock.findDepartmentHeadByEmail = jest
      .fn()
      .mockResolvedValue(null);

    await service.createDepartment(businessId, createBusinessDepartmentDto);

    expect(businessRepositoryMock.createDepartment).toHaveBeenCalledWith(
      { id: businessId },
      createBusinessDepartmentDto,
    );

    expect(
      businessRepositoryMock.findDepartmentHeadByEmail,
    ).toHaveBeenCalledWith(createBusinessDepartmentDto.email);
  });
});
