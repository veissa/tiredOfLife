import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import bcrypt from 'bcryptjs';

export enum UserRole {
  CUSTOMER = 'customer',
  PRODUCER = 'producer'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER
  })
  role: UserRole;

  @Column({ type: 'jsonb', nullable: true })
  profileData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Method to hash password
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Method to check password
  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
} 