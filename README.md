# Community Pickup Market

A local marketplace platform connecting producers and customers for direct product pickup.

## Features

- User authentication (Customer/Producer roles)
- Product management
- Profile management
- Secure authentication with JWT
- PostgreSQL database

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd community-pickup-market
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

3. Set up the database:
```bash
# Create PostgreSQL database
createdb community_market
```

4. Configure environment variables:
Create a `.env` file in the server directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=community_market
JWT_SECRET=your-secret-key
```

5. Start the development servers:
```bash
# Start backend server (in server directory)
cd server
npm run dev

# Start frontend server (in root directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:8080 (or next available port)
- Backend: http://localhost:3001

### Docker Setup

1. Build and start the containers:
```bash
docker-compose up --build
```

2. Access the application:
- Frontend: http://localhost:8080
- Backend: http://localhost:3001

## Test Credentials

### Customer Account
```
Email: test@test.com
Password: test123
```

### Producer Account
```
Email: producer@test.com
Password: test123
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get product by ID
- POST `/api/products` - Create new product (Producer only)
- PUT `/api/products/:id` - Update product (Producer only)
- DELETE `/api/products/:id` - Delete product (Producer only)

## User Roles

### Customer
- Browse products
- View product details
- Manage profile
- Access customer dashboard

### Producer
- Manage products (CRUD)
- View sales
- Manage profile
- Access producer dashboard

## Docker Configuration

The project includes Docker configuration for easy deployment:

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://localhost:3001

  backend:
    build: ./server
    ports:
      - "3001:3001"
    depends_on:
      - db
    environment:
      - DB_HOST=db
      - DB_PORT=5432
      - DB_USER=postgres
      - DB_PASSWORD=postgres
      - DB_NAME=community_market
      - JWT_SECRET=your-secret-key

  db:
    image: postgres:14
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=community_market
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Development

### Project Structure
```
community-pickup-market/
├── src/                    # Frontend source code
│   ├── components/        # React components
│   │   ├── lib/              # Utility functions
│   │   └── pages/            # Page components
│   ├── server/                # Backend source code
│   │   ├── src/
│   │   │   ├── controllers/  # Route controllers
│   │   │   ├── models/       # Database models
│   │   │   ├── routes/       # API routes
│   │   │   └── middleware/   # Custom middleware
│   │   └── package.json
│   └── package.json
```

### Available Scripts

Frontend:
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

Backend:
```bash
cd server
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
