import { Test, TestingModule } from '@nestjs/testing';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { BusinessRepository } from './business.repository';
import { CreateBusinessDto } from './dto/create-business.dto';
import { CreateBusinessDepartmentDto } from './dto';

describe('BusinessController', () => {
  let controller: BusinessController;
  let businessServiceMock: Partial<BusinessService>;
  let businessRepositoryMock: Partial<BusinessRepository>;

  beforeEach(async () => {
    businessServiceMock = {
      create: jest.fn(),
      createDepartment: jest.fn(),
    };

    businessRepositoryMock = {
      createBusiness: jest.fn(),
      findBusinessById: jest.fn(),
      findDepartmentHeadByEmail: jest.fn(),
      createDepartment: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessController],
      providers: [
        {
          provide: BusinessService,
          useValue: businessServiceMock,
        },
        {
          provide: BusinessRepository,
          useValue: businessRepositoryMock,
        },
      ],
    }).compile();

    controller = module.get<BusinessController>(BusinessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call businessService.create with correct payload', async () => {
      const createBusinessDto: CreateBusinessDto = {
        name: 'Test Business',
      };

      await controller.create(createBusinessDto);

      expect(businessServiceMock.create).toHaveBeenCalledWith(
        createBusinessDto,
      );
    });
  });

  describe('createDepartment', () => {
    it('should call businessService.createDepartment with correct businessId and payload', async () => {
      const businessId = 'testBusinessId';
      const createBusinessDepartmentDto: CreateBusinessDepartmentDto = {
        name: 'Test Department',
        email: 'test@test.com',
      };

      businessRepositoryMock.findBusinessById = jest
        .fn()
        .mockImplementation((id: string) => {
          return Promise.resolve({
            id: id,
            name: 'Test Business',
          });
        });

      await controller.createDepartment(
        { businessId },
        createBusinessDepartmentDto,
      );

      expect(businessServiceMock.createDepartment).toHaveBeenCalledWith(
        businessId,
        createBusinessDepartmentDto,
      );
    });
  });
});
