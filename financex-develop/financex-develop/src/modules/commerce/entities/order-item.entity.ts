import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseTable } from '../../..//database';
import { InventoryItem } from './inventory-item.entity';
import { Order } from './order.entity';

@Entity({ name: 'order_items' })
export class OrderItems extends BaseTable {
  @ManyToOne(() => Order)
  @JoinColumn()
  order?: Order;

  @ManyToOne(() => InventoryItem)
  @JoinColumn()
  item: InventoryItem;

  @Column()
  quantity: number;

  @Column()
  price: number;
}
