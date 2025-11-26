# E-commerce REST API

A fully-functioning e-commerce REST API built with Express.js, Node.js, and PostgreSQL that allows users to perform complete CRUD operations on products, user accounts, shopping carts, and orders.

## Features

✅ **User Authentication**
- User registration with email and password
- User login and logout
- Session management with Passport.js
- User profile management (read, update, delete)

✅ **Product Management**
- Browse all products
- View product details
- Create new products
- Update product information
- Delete products

✅ **Shopping Cart**
- Create and manage shopping carts
- Add items to cart
- Update item quantities
- Remove items from cart
- Load cart contents with product details

✅ **Orders**
- Place orders from cart
- View order history
- Retrieve order details
- Order status tracking
- Payment integration (Stripe)

✅ **API Documentation**
- Swagger/OpenAPI documentation
- Interactive API explorer at `/docs`

## Project Structure

```
ecommerce-app/
├── config.js                 # Configuration management
├── index.js                  # Application entry point
├── setupDatabase.js          # Database initialization script
├── swagger.yml               # Swagger API documentation
├── .env                      # Environment variables
├── db/
│   └── index.js             # Database connection pool
├── loaders/
│   ├── index.js             # Loader initialization
│   ├── express.js           # Express middleware setup
│   ├── passport.js          # Passport authentication setup
│   └── swagger.js           # Swagger UI setup
├── models/
│   ├── user.js              # User model with CRUD operations
│   ├── product.js           # Product model with CRUD operations
│   ├── cart.js              # Cart model
│   ├── cartItem.js          # Cart item model
│   ├── order.js             # Order model
│   └── orderItem.js         # Order item model
├── routes/
│   ├── index.js             # Route initialization
│   ├── auth.js              # Authentication endpoints
│   ├── user.js              # User endpoints
│   ├── product.js           # Product endpoints
│   ├── cart.js              # Cart endpoints
│   └── order.js             # Order endpoints
└── services/
    ├── AuthService.js       # Authentication business logic
    ├── UserService.js       # User business logic
    ├── ProductService.js    # Product business logic
    ├── CartService.js       # Cart business logic
    └── OrderService.js      # Order business logic
```

## Prerequisites

- Node.js (v12 or higher)
- npm or yarn
- PostgreSQL (v10 or higher)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy the `.env.example` to `.env`
   - Update the following variables with your PostgreSQL credentials:
     ```env
     PORT=4000
     SESSION_SECRET='your_session_secret'
     PGHOST='localhost'
     PGUSER='postgres'
     PGDATABASE='ecommerce_project'
     PGPASSWORD='your_password'
     PGPORT=5432
     STRIPE_SECRET_KEY='your_stripe_key'
     ```

4. **Create the database**
   ```bash
   createdb ecommerce_project
   ```

5. **Initialize database tables**
   ```bash
   npm run create-db
   ```

## Running the Application

### Development Mode
```bash
npm start
```

The server will start on `http://localhost:4000`

### API Documentation
Visit `http://localhost:4000/docs` to view the interactive Swagger documentation

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login to user account |
| POST | `/auth/logout` | Logout from user account |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/{userId}` | Get user details |
| PUT | `/users/{userId}` | Update user information |
| DELETE | `/users/{userId}` | Delete user account |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all products |
| GET | `/products/{productId}` | Get product details |
| POST | `/products` | Create new product |
| PUT | `/products/{productId}` | Update product |
| DELETE | `/products/{productId}` | Delete product |

### Shopping Cart

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/carts/mine` | Get user's cart |
| POST | `/carts/mine` | Create new cart |
| POST | `/carts/mine/items` | Add item to cart |
| PUT | `/carts/mine/items/{cartItemId}` | Update cart item |
| DELETE | `/carts/mine/items/{cartItemId}` | Remove item from cart |
| POST | `/carts/mine/checkout` | Checkout and create order |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | List user's orders |
| GET | `/orders/{orderId}` | Get order details |

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email VARCHAR(50),
  password TEXT,
  firstName VARCHAR(50),
  lastName VARCHAR(50),
  google JSON,
  facebook JSON
);
```

### Products Table
```sql
CREATE TABLE products (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50) NOT NULL,
  price BIGINT NOT NULL,
  description VARCHAR(50) NOT NULL
);
```

### Carts Table
```sql
CREATE TABLE carts (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  userId INT NOT NULL,
  modified DATE NOT NULL,
  created DATE NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### Cart Items Table
```sql
CREATE TABLE cartItems (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  cartId INT NOT NULL,
  productId INT NOT NULL,
  qty INT NOT NULL,
  FOREIGN KEY (cartId) REFERENCES carts(id),
  FOREIGN KEY (productId) REFERENCES products(id)
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  total INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  userId INT NOT NULL,
  created DATE NOT NULL,
  modified DATE NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### Order Items Table
```sql
CREATE TABLE orderItems (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created DATE NOT NULL,
  orderId INT NOT NULL,
  qty INT NOT NULL,
  price INT NOT NULL,
  productId INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(200) NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(id)
);
```

## Example Usage

### Register a User
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Create a Product
```bash
curl -X POST http://localhost:4000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 99999,
    "description": "High-performance laptop"
  }'
```

### Add Item to Cart
```bash
curl -X POST http://localhost:4000/carts/mine/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "qty": 2
  }'
```

### Checkout
```bash
curl -X POST http://localhost:4000/carts/mine/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "cartId": 1,
    "paymentInfo": {
      "id": "tok_visa"
    }
  }'
```

## Technologies Used

- **Express.js** - Web application framework
- **Node.js** - JavaScript runtime
- **PostgreSQL** - Database
- **Passport.js** - Authentication middleware
- **Stripe** - Payment processing
- **Swagger UI** - API documentation
- **pg-promise** - PostgreSQL query builder

## Error Handling

The API uses HTTP status codes and descriptive error messages:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Security Considerations

- Passwords should be hashed before storing (bcrypt recommended)
- Environment variables protect sensitive credentials
- Passport.js provides session-based authentication
- Input validation on all endpoints
- CORS enabled for cross-origin requests

## Future Enhancements

- Implement password hashing with bcrypt
- Add JWT token-based authentication
- Implement role-based access control (RBAC)
- Add product reviews and ratings
- Implement email notifications
- Add inventory management
- Implement order tracking and status updates
- Add advanced search and filtering
- Implement user profile pictures
- Add wishlist functionality

## License

This project is open source and available under the ISC License.

## Support

For issues or questions, please create an issue in the repository.

## Contributors

- Project developed as an e-commerce platform learning exercise
