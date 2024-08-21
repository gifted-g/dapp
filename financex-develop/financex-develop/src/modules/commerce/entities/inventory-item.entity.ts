import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseTable } from '../../../database';
import { Business } from '../../../modules/business/entities';

@Entity({ name: 'inventory_item' })
export class InventoryItem extends BaseTable {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @ManyToOne(() => Business)
  @JoinColumn()
  business: Business;
}
