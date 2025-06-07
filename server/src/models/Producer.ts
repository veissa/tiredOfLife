import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('producers')
export class Producer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.producers)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  shopName: string;

  @Column('text')
  description: string;

  @Column()
  address: string;

  @Column('text', { array: true, nullable: true })
  certifications: string[];

  @Column('jsonb', { nullable: true })
  pickupInfo: {
    location?: string;
    hours?: string;
    instructions?: string;
  };

  @Column('text', { array: true, nullable: true })
  images: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
} 