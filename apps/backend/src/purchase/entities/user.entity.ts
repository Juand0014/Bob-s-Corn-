import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User as IUser } from '@packages/shared';

@Entity('users')
export class User implements Partial<IUser> {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'timestamp', nullable: true })
  lastPurchase: Date | null;

  @Column({ type: 'int', default: 0 })
  totalCorns: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
