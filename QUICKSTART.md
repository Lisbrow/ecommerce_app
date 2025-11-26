# E-commerce REST API - Quick Start Guide

## 🚀 Quick Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create PostgreSQL Database
```bash
# Using psql command line
psql -U postgres -c "CREATE DATABASE ecommerce_project;"

# Or using createdb
createdb -U postgres ecommerce_project
```

### Step 3: Initialize Database Tables
```bash
npm run create-db
```

This will create the following tables:
- `users` - User account information
- `products` - Product catalog
- `carts` - Shopping carts
- `cartItems` - Items in shopping carts
- `orders` - Customer orders
- `orderItems` - Items in orders

### Step 4: Start the Server
```bash
npm start
```

The server will run on `http://localhost:4000`

## 📚 API Documentation

### Interactive Documentation
Visit `http://localhost:4000/docs` to view and test all API endpoints with Swagger UI

## ✨ Project Objectives - All Complete

### ✅ Authentication
- [x] User registration with email and password
- [x] User login with session management
- [x] User logout functionality
- [x] Passport.js local strategy implementation

### ✅ User Management (CRUD)
- [x] Create new user accounts
- [x] Read user profile information
- [x] Update user details
- [x] Delete user accounts

### ✅ Product Management (CRUD)
- [x] Create products
- [x] Read/list all products
- [x] Read individual product details
- [x] Update product information
- [x] Delete products

### ✅ Shopping Cart Management (CRUD)
- [x] Create shopping carts
- [x] Read/load cart contents
- [x] Add items to cart (Create)
- [x] Update item quantities in cart
- [x] Remove items from cart (Delete)
- [x] Get cart details

### ✅ Order Management (CRUD)
- [x] Create orders from cart checkout
- [x] List user's orders
- [x] Get order details by ID
- [x] Retrieve order items
- [x] Update order status

### ✅ Additional Features
- [x] Payment processing integration (Stripe)
- [x] Comprehensive error handling
- [x] Input validation on all endpoints
- [x] Swagger/OpenAPI documentation
- [x] Session management with cookies
- [x] CORS support for cross-origin requests
- [x] HTTP status codes (201 for creation, 200 for success, 404 for not found, etc.)

## 🔌 Key Endpoints Summary

### Authentication
```
POST   /auth/register          Register a new user
POST   /auth/login             Login to account
POST   /auth/logout            Logout from account
```

### Users
```
GET    /users/{userId}         Get user details
PUT    /users/{userId}         Update user information
DELETE /users/{userId}         Delete user account
```

### Products
```
GET    /products               List all products
GET    /products/{productId}   Get product details
POST   /products               Create new product
PUT    /products/{productId}   Update product
DELETE /products/{productId}   Delete product
```

### Shopping Cart
```
GET    /carts/mine             Get user's cart
POST   /carts/mine             Create new cart
POST   /carts/mine/items       Add item to cart
PUT    /carts/mine/items/{id}  Update cart item quantity
DELETE /carts/mine/items/{id}  Remove item from cart
POST   /carts/mine/checkout    Place order
```

### Orders
```
GET    /orders                 List user's orders
GET    /orders/{orderId}       Get order details
```

## 📋 Environment Variables (.env)

```env
# Server
PORT=4000
NODE_ENV=development
SESSION_SECRET='your_session_secret_here'

# PostgreSQL Database
PGHOST=localhost
PGUSER=postgres
PGDATABASE=ecommerce_project
PGPASSWORD=postgres
PGPORT=5432

# Stripe Payment (Optional)
STRIPE_SECRET_KEY='your_stripe_secret_key'
STRIPE_PUBLIC_KEY='your_stripe_public_key'
```

## 🏗️ Architecture Overview

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with pg-promise
- **Authentication**: Passport.js (Local Strategy)
- **API Documentation**: Swagger/OpenAPI
- **Payment**: Stripe API

### Project Structure
```
services/
  ├── AuthService.js       - Handles user registration and login
  ├── UserService.js       - Manages user CRUD operations
  ├── ProductService.js    - Manages product CRUD operations
  ├── CartService.js       - Manages cart and checkout operations
  └── OrderService.js      - Manages order operations

models/
  ├── user.js              - Database operations for users
  ├── product.js           - Database operations for products
  ├── cart.js              - Database operations for carts
  ├── cartItem.js          - Database operations for cart items
  ├── order.js             - Database operations for orders
  └── orderItem.js         - Database operations for order items

routes/
  ├── auth.js              - Authentication endpoints
  ├── user.js              - User management endpoints
  ├── product.js           - Product management endpoints
  ├── cart.js              - Cart management endpoints
  └── order.js             - Order management endpoints

loaders/
  ├── express.js           - Express middleware setup
  ├── passport.js          - Passport authentication setup
  └── swagger.js           - Swagger UI setup
```

## 🧪 Testing the API

### Example: Complete User Journey

#### 1. Register a User
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

#### 3. Get All Products
```bash
curl -X GET http://localhost:4000/products \
  -b cookies.txt
```

#### 4. Create a Product
```bash
curl -X POST http://localhost:4000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 99999,
    "description": "High-performance laptop"
  }' \
  -b cookies.txt
```

#### 5. Create a Cart
```bash
curl -X POST http://localhost:4000/carts/mine \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

#### 6. Add Item to Cart
```bash
curl -X POST http://localhost:4000/carts/mine/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "qty": 2
  }' \
  -b cookies.txt
```

#### 7. Checkout
```bash
curl -X POST http://localhost:4000/carts/mine/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "cartId": 1,
    "paymentInfo": {
      "id": "tok_visa"
    }
  }' \
  -b cookies.txt
```

#### 8. Get Orders
```bash
curl -X GET http://localhost:4000/orders \
  -b cookies.txt
```

## 🛠️ Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check .env file credentials
- Ensure database exists: `psql -U postgres -l | grep ecommerce`

### Port Already in Use
- Change PORT in .env file
- Or kill the process: `kill -9 $(lsof -t -i:4000)`

### Missing Dependencies
```bash
npm install
npm audit fix
```

### Database Tables Not Created
```bash
npm run create-db
```

## 📖 Swagger Documentation Features

- Interactive API testing directly in browser
- All endpoints documented with parameters
- Request/response examples
- Error codes and descriptions
- Try it out functionality

## 🔒 Security Notes

- Passwords are currently stored in plain text (consider bcrypt)
- Use HTTPS in production
- Implement rate limiting
- Add CORS restrictions for production
- Validate and sanitize all inputs
- Use environment variables for sensitive data

## 🎯 Next Steps

1. Test all endpoints using Swagger UI
2. Implement password hashing with bcrypt
3. Add JWT token-based authentication
4. Implement role-based access control
5. Add product reviews and ratings
6. Implement email notifications
7. Add inventory management
8. Create unit and integration tests

## 📝 Notes

- Session expires after 24 hours of inactivity
- All times stored in UTC format
- Prices stored as integers (in cents)
- All endpoints return JSON responses
- Authentication required for cart and order endpoints (when accessed with req.user)

## 🤝 Support

For issues or questions:
1. Check the API documentation at `/docs`
2. Review the README.md file
3. Check the .env configuration
4. Ensure PostgreSQL is running
5. Check database tables with `\dt` in psql

---

**Happy coding! 🚀**
