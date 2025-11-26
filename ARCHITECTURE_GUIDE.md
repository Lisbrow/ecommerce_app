# E-commerce REST API - Visual Architecture & File Guide

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT APPLICATIONS                      │
│              (Web Browser, Mobile App, etc.)                 │
└────────────────────────────┬────────────────────────────────┘
                             │
                    HTTP/REST Requests
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS SERVER                         │
│                    (Port 4000)                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           MIDDLEWARE STACK                           │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  • CORS (Cross-Origin Resource Sharing)             │   │
│  │  • Body Parser (JSON/URL-encoded)                   │   │
│  │  • Cookie Parser                                    │   │
│  │  • Express Session                                  │   │
│  │  • Passport (Authentication)                        │   │
│  │  • Morgan (Logging)                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                             │                                 │
│                    Route Handlers ▼                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              ROUTES (23 Endpoints)                   │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  • /auth/*        (Authentication)                  │   │
│  │  • /users/*       (User Management)                 │   │
│  │  • /products/*    (Product Management)              │   │
│  │  • /carts/*       (Shopping Cart)                   │   │
│  │  • /orders/*      (Orders)                          │   │
│  │  • /docs          (Swagger Documentation)           │   │
│  └──────────────────────────────────────────────────────┘   │
│                             │                                 │
│                    Services Layer ▼                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              SERVICES (Business Logic)               │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  • AuthService (Registration, Login)                │   │
│  │  • UserService (User CRUD)                          │   │
│  │  • ProductService (Product CRUD)                    │   │
│  │  • CartService (Cart & Checkout)                    │   │
│  │  • OrderService (Order Management)                  │   │
│  │                                                      │   │
│  │  Functions:                                          │   │
│  │  • Input Validation                                 │   │
│  │  • Business Logic                                   │   │
│  │  • Error Handling                                   │   │
│  │  • Database Operations Coordination                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                             │                                 │
│                     Models Layer ▼                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              MODELS (Data Access)                    │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  • UserModel (CRUD operations)                      │   │
│  │  • ProductModel (CRUD operations)                   │   │
│  │  • CartModel (Create, Read, Find)                   │   │
│  │  • CartItemModel (CRUD operations)                  │   │
│  │  • OrderModel (Create, Read, Find)                  │   │
│  │  • OrderItemModel (Create, Read)                    │   │
│  │                                                      │   │
│  │  Uses: pg-promise for parameterized queries         │   │
│  └──────────────────────────────────────────────────────┘   │
│                             │                                 │
└────────────────────────────┼────────────────────────────────┘
                             │
                    Database Queries
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   POSTGRESQL DATABASE                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tables:                                             │   │
│  │  ├── users (User accounts)                          │   │
│  │  ├── products (Product catalog)                     │   │
│  │  ├── carts (Shopping carts)                         │   │
│  │  ├── cartItems (Cart line items)                    │   │
│  │  ├── orders (Customer orders)                       │   │
│  │  └── orderItems (Order line items)                  │   │
│  │                                                      │   │
│  │  Connection: Pooling with pg                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

                             │
                    Data & Results
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│               RESPONSE TO CLIENT                             │
│  • JSON Response                                            │
│  • HTTP Status Code (200, 201, 400, 404, 500, etc.)        │
│  • Error Messages (if applicable)                           │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Complete File Structure

```
ecommerce-app/
│
├── 📄 index.js                    [Entry point - starts server]
├── 📄 package.json                [Dependencies & scripts]
├── 📄 config.js                   [Environment configuration]
├── 📄 setupDatabase.js            [Database initialization]
├── 📄 swagger.yml                 [OpenAPI/Swagger spec]
├── 📄 .env                        [Environment variables]
├── 📄 .gitignore                  [Git ignore file]
│
├── 📁 db/
│   └── 📄 index.js               [PostgreSQL connection pool]
│
├── 📁 loaders/
│   ├── 📄 index.js               [Initialize all loaders]
│   ├── 📄 express.js             [Express middleware setup]
│   ├── 📄 passport.js            [Passport authentication setup]
│   └── 📄 swagger.js             [Swagger UI setup]
│
├── 📁 models/
│   ├── 📄 user.js                [User database operations]
│   │                             [✅ Methods: create, findOneById, 
│   │                             findOneByEmail, update, delete]
│   │
│   ├── 📄 product.js             [Product database operations]
│   │                             [✅ Methods: find, findOne, 
│   │                             create, update, delete]
│   │
│   ├── 📄 cart.js                [Cart database operations]
│   │                             [✅ Methods: create, 
│   │                             findOneByUser, findOneById]
│   │
│   ├── 📄 cartItem.js            [Cart item operations]
│   │                             [✅ Methods: create, update,
│   │                             delete, find]
│   │
│   ├── 📄 order.js               [Order database operations]
│   │                             [✅ Methods: create, update,
│   │                             findByUser, findById]
│   │
│   └── 📄 orderItem.js           [Order item operations]
│                                 [✅ Methods: create, find]
│
├── 📁 services/
│   ├── 📄 AuthService.js         [Authentication logic]
│   │                             [Methods: register, login]
│   │
│   ├── 📄 UserService.js         [User business logic]
│   │                             [✅ Enhanced: Added delete]
│   │                             [Methods: get, update, delete]
│   │
│   ├── 📄 ProductService.js      [Product business logic]
│   │                             [✅ Enhanced: Added CRUD]
│   │                             [Methods: list, get, create,
│   │                             update, delete]
│   │
│   ├── 📄 CartService.js         [Cart business logic]
│   │                             [✅ Enhanced: Added get]
│   │                             [Methods: create, get, 
│   │                             loadCart, addItem,
│   │                             removeItem, updateItem,
│   │                             checkout]
│   │
│   └── 📄 OrderService.js        [Order business logic]
│                                 [✅ Enhanced: Added create,update]
│                                 [Methods: create, list,
│                                 findById, update]
│
├── 📁 routes/
│   ├── 📄 index.js               [Route initialization]
│   │
│   ├── 📄 auth.js                [Authentication routes]
│   │                             [✅ Endpoints:
│   │                             POST /auth/register
│   │                             POST /auth/login
│   │                             POST /auth/logout]
│   │
│   ├── 📄 user.js                [User management routes]
│   │                             [✅ Endpoints:
│   │                             GET /users/{userId}
│   │                             PUT /users/{userId}
│   │                             DELETE /users/{userId}]
│   │
│   ├── 📄 product.js             [Product management routes]
│   │                             [✅ Endpoints:
│   │                             GET /products
│   │                             GET /products/{id}
│   │                             POST /products
│   │                             PUT /products/{id}
│   │                             DELETE /products/{id}]
│   │
│   ├── 📄 cart.js                [Shopping cart routes]
│   │                             [✅ Endpoints:
│   │                             GET /carts/mine
│   │                             POST /carts/mine
│   │                             PUT /carts/mine
│   │                             POST /carts/mine/items
│   │                             PUT /carts/mine/items/{id}
│   │                             DELETE /carts/mine/items/{id}
│   │                             POST /carts/mine/checkout]
│   │
│   └── 📄 order.js               [Order routes]
│                                 [✅ Endpoints:
│                                 GET /orders
│                                 GET /orders/{id}]
│
└── 📁 docs/
    ├── 📄 README.md              [Original project README]
    ├── 📄 PROJECT_COMPLETION_REPORT.md
    ├── 📄 QUICKSTART.md
    ├── 📄 IMPLEMENTATION_SUMMARY.md
    ├── 📄 API_DOCUMENTATION.md
    └── 📄 BEST_PRACTICES.md
```

## 🔄 Request Flow Example

### Example: Creating a Product

```
1. CLIENT REQUEST
   ├─ Method: POST
   ├─ URL: http://localhost:4000/products
   ├─ Headers: Content-Type: application/json
   └─ Body: { name, price, description }
           │
           ▼
2. EXPRESS MIDDLEWARE
   ├─ CORS Check ✅
   ├─ Body Parser (parse JSON) ✅
   ├─ Session Check ✅
   └─ Pass to Route Handler
           │
           ▼
3. ROUTE HANDLER (product.js)
   ├─ Extract params/body
   ├─ Call ProductService.create(data)
   └─ Return response
           │
           ▼
4. SERVICE LAYER (ProductService.js)
   ├─ Validate input
   │  ├─ Check required fields
   │  ├─ Check data types
   │  └─ Check business rules
   │
   ├─ Call ProductModel.create(data)
   └─ Handle errors
           │
           ▼
5. MODEL LAYER (ProductModel.js)
   ├─ Build SQL query
   │  └─ INSERT INTO products (name, price, description)
   │     VALUES ($1, $2, $3) RETURNING *
   │
   ├─ Execute query via db.query()
   └─ Return created record
           │
           ▼
6. DATABASE (PostgreSQL)
   ├─ Insert row
   ├─ Return auto-generated ID
   └─ Validate constraints
           │
           ▼
7. RESPONSE CHAIN
   ├─ Model returns record
   ├─ Service returns result
   ├─ Route sends response
   │  ├─ Status: 201 (Created)
   │  └─ Body: { id, name, price, description }
   └─ Client receives data
           │
           ▼
8. CLIENT RECEIVES
   {
     "id": 1,
     "name": "Product Name",
     "price": 9999,
     "description": "Product description"
   }
   Status: 201 Created
```

## 🔗 Database Relationship Diagram

```
┌─────────────┐
│   USERS     │
│─────────────│
│ id (PK)  ◄──┼──────┐
│ email       │      │ FK
│ password    │      │
│ firstName   │      │
│ lastName    │      │
└─────────────┘      │
        │            │
        │ 1:N        │
        │            │
    ┌───┴────────────┼──────────────────┐
    │                │                  │
    ▼                ▼                  ▼
┌─────────────┐  ┌──────────────┐  ┌──────────────┐
│   CARTS     │  │   ORDERS     │  │  PRODUCTS    │
│─────────────│  │──────────────│  │──────────────│
│ id (PK)  ◄──┼──────────────┐ │ │ id (PK)   ◄──┼──┐
│ userId (FK)─┼─►            │ │ │ name        │  │
│ created     │  │            │ │ │ price       │  │
│ modified    │  │            │ │ │ description │  │
└─────────────┘  │            │ └───────────────┘  │
    │            │            │                    │
    │ 1:N        │ 1:N        │                    │
    │            │            │                    │
    ▼            ▼            ▼                    │
┌──────────────┐ ┌──────────────┐                  │
│  CARTITEMS   │ │ ORDERITEMS   │                  │
│──────────────│ │──────────────│                  │
│ id (PK)      │ │ id (PK)      │                  │
│ cartId (FK)──┼─► │ orderId (FK)──┼──────────┐   │
│ productId (FK)─┼──┬── │ productId (FK)──────┼───┤
│ qty          │ │ │ │ qty          │        │
└──────────────┘ │ │ │ price        │        │
                 │ │ │ name         │        │
                 │ │ │ description  │        │
                 │ │ └──────────────┘        │
                 │ │                         │
                 └─┴─────────────────────────┘
```

## 📊 HTTP Status Codes Used

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | GET, PUT, DELETE successful |
| 201 | Created | POST successful (resource created) |
| 400 | Bad Request | Invalid input, missing fields |
| 401 | Unauthorized | Authentication required |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (duplicate) |
| 500 | Server Error | Unexpected error |

## 🔐 Authentication Flow

```
1. USER REGISTRATION
   └─ POST /auth/register
      ├─ Send: { email, password, firstName, lastName }
      ├─ Service: Check if email exists
      ├─ Model: Create user record
      └─ Response: User created (201)

2. USER LOGIN
   └─ POST /auth/login
      ├─ Send: { username (email), password }
      ├─ Passport: Validate credentials
      ├─ Session: Create session
      └─ Response: User authenticated (200)
      └─ Cookies: Set in browser

3. REQUEST WITH AUTH
   └─ GET /carts/mine (any protected route)
      ├─ Cookies: Include session
      ├─ Session: Deserialize user
      ├─ req.user: Populated from session
      └─ Proceed with request

4. USER LOGOUT
   └─ POST /auth/logout
      ├─ Session: Destroy
      ├─ Cookies: Clear
      └─ Response: Logged out (200)
```

## 🎯 Data Flow: Complete User Journey

```
START
  │
  ▼
1. REGISTER USER
   POST /auth/register
   └─ User created in database

  │
  ▼
2. LOGIN
   POST /auth/login
   └─ Session established

  │
  ▼
3. BROWSE PRODUCTS
   GET /products
   └─ List retrieved from database

  │
  ▼
4. CREATE CART
   POST /carts/mine
   └─ Cart created and linked to user

  │
  ▼
5. ADD TO CART
   POST /carts/mine/items
   └─ Items added to cart

  │
  ▼
6. VIEW CART
   GET /carts/mine
   └─ Cart with items displayed

  │
  ▼
7. CHECKOUT
   POST /carts/mine/checkout
   ├─ Order created
   ├─ Payment processed (Stripe)
   └─ Order confirmed

  │
  ▼
8. VIEW ORDER HISTORY
   GET /orders
   └─ Orders retrieved

  │
  ▼
9. VIEW ORDER DETAILS
   GET /orders/{orderId}
   └─ Order with items displayed

  │
  ▼
10. LOGOUT
    POST /auth/logout
    └─ Session destroyed

END
```

## 📈 Scalability Considerations

```
Current Setup
├─ Single Express server
├─ PostgreSQL connection pooling (default 10 connections)
├─ Session stored in memory (not scalable)
└─ Single database instance

For Production Scaling
├─ Load balancing (multiple Express instances)
├─ Redis for session storage
├─ Connection pooling (20-50 connections)
├─ Database replication
├─ Read replicas for reporting
├─ Caching layer (Redis, Memcached)
└─ CDN for static assets
```

---

This architecture provides a solid foundation for a scalable e-commerce platform with clear separation of concerns and comprehensive API documentation.
