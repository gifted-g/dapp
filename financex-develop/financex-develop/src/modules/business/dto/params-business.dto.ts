import { IsNotEmpty, IsUUID } from 'class-validator';

export class BusinessParamsDto {
  @IsNotEmpty()
  @IsUUID()
  businessId: string;
}

export class DepartmentParamsDto {
  @IsNotEmpty()
  @IsUUID()
  businessId: string;
}

export class BusinessDepartmentParamsDto {
  @IsNotEmpty()
  @IsUUID()
  businessId: string;

  @IsNotEmpty()
  @IsUUID()
  departmentId: string;
}
