import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('producers')
export class Producer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

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