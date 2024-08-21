import { Entity, Column, ManyToOne, JoinColumn, In, Index } from 'typeorm';
import { BaseTable } from '../../../database';
import { Business } from './business.entity';

@Entity({ name: 'department_head' })
export class DepartmentHead extends BaseTable {
  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @ManyToOne(() => Business, (business) => business.departmentHeads)
  @JoinColumn()
  business: Business;
}
