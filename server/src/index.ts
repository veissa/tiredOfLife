import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import { User } from './models/User';
import { Producer } from './models/Producer';
import { Customer } from './models/Customer';
import { Product } from './models/Product';
import path from 'path';
import producerRoutes from './routes/producer.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082', 'http://localhost:8083'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Database configuration
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'community_market',
  synchronize: true,
  logging: true,
  entities: [User, Producer, Customer, Product],
  subscribers: [],
  migrations: [],
});

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');

    // Routes
    app.use('/api/products', productRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/producers', producerRoutes);

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    // Start server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  }); 