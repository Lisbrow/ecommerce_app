# E-commerce REST API - Best Practices & Troubleshooting

## 🎯 Best Practices

### 1. Database Management

**Connection Pooling**
- The application uses pg (node-postgres) with connection pooling
- Default pool size handles multiple concurrent requests
- Connections are automatically returned to the pool

**Query Best Practices**
- Use parameterized queries to prevent SQL injection
- The pg-promise library handles this automatically
- Always use `$1`, `$2` placeholders for values

```javascript
// ✅ CORRECT - Parameterized query
const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

// ❌ WRONG - String concatenation
const result = await db.query(`SELECT * FROM users WHERE id = ${userId}`);
```

### 2. Authentication & Security

**Session Management**
- Sessions expire after 24 hours
- Cookies are HTTP-only (cannot be accessed by JavaScript)
- Secure flag should be set to true in production (HTTPS)

**Password Security**
- ⚠️ Current implementation: Passwords stored in plain text
- 🔒 Recommended: Use bcrypt for password hashing

```javascript
// Install bcrypt
npm install bcrypt

// Hash password on registration
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);

// Compare password on login
const isValid = await bcrypt.compare(password, hashedPassword);
```

**API Keys**
- Store Stripe API keys in .env file
- Never commit .env to version control
- Use different keys for development and production

### 3. Input Validation

**Validate on Every Endpoint**
```javascript
// Always validate required fields
if (!email || !password) {
  throw createError(400, 'Email and password are required');
}

// Validate data types
if (typeof price !== 'number' || price <= 0) {
  throw createError(400, 'Price must be a positive number');
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  throw createError(400, 'Invalid email format');
}
```

### 4. Error Handling

**Consistent Error Responses**
```javascript
// All errors should follow this pattern
{
  "message": "Description of error"
  // Optional: "status": 400
}
```

**Error Status Codes**
- 400: Bad Request (invalid input)
- 401: Unauthorized (missing auth)
- 404: Not Found (resource doesn't exist)
- 409: Conflict (duplicate, e.g., email exists)
- 500: Server Error (unexpected issue)

### 5. API Response Format

**Successful Responses**
```javascript
// GET request
res.status(200).send({
  id: 1,
  name: "Product",
  price: 9999
});

// POST request (creation)
res.status(201).send({
  id: 1,
  name: "Product",
  price: 9999
});
```

**Error Responses**
```javascript
// Use consistent error format
throw createError(404, 'Product not found');
// Becomes: { "message": "Product not found" }
```

## 🔍 Troubleshooting Guide

### Database Connection Issues

**Problem: "Error connecting to the database"**

```bash
# 1. Check if PostgreSQL is running
psql -U postgres -c "SELECT 1"

# 2. Verify .env file has correct credentials
cat .env

# 3. Test connection manually
psql -h localhost -U postgres -d ecommerce_project -c "SELECT 1"

# 4. Check if database exists
psql -U postgres -l | grep ecommerce
```

**Problem: "ECONNREFUSED 127.0.0.1:5432"**
- PostgreSQL is not running
- Check PGPORT in .env (default: 5432)
- Check PGHOST is correct (default: localhost)

**Solution:**
```bash
# Start PostgreSQL
# Windows with pgAdmin
# Click the server and start it

# Or use terminal
pg_ctl -D "C:\Program Files\PostgreSQL\13\data" start

# Linux
sudo service postgresql start

# macOS
brew services start postgresql
```

### Database Tables Not Created

**Problem: Tables don't exist after running npm run create-db**

```bash
# Check what tables exist
psql -U postgres -d ecommerce_project -c "\dt"

# If no tables, run setup again
npm run create-db

# If error, check setupDatabase.js for SQL syntax errors
```

### Port Already in Use

**Problem: "Error: listen EADDRINUSE :::4000"**

```bash
# Find process using port 4000
# Windows
netstat -ano | findstr :4000

# Kill the process
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=4001
```

### Authentication Issues

**Problem: "User not authenticated" or "req.user is undefined"**

```javascript
// Make sure passport middleware is loaded in this order:
app.use(session(...));          // 1. Session
app.use(passport.initialize()); // 2. Passport init
app.use(passport.session());    // 3. Passport session

// And serializers are defined
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Load user from database
  done(null, user);
});
```

**Solution:** Check `loaders/passport.js` configuration

### Cors Issues

**Problem: "Access to XMLHttpRequest blocked by CORS policy"**

```javascript
// Check cors is enabled in express.js loader
const cors = require('cors');
app.use(cors()); // Should be early in middleware chain
```

**To restrict CORS in production:**
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### Payment/Stripe Issues

**Problem: "Stripe API key not valid" or "Charge failed"**

```javascript
// Verify Stripe key in .env
echo $STRIPE_SECRET_KEY

// Check Stripe test key format
// Should start with: sk_test_

// Use Stripe test card: 4242 4242 4242 4242
```

## 📋 Testing Checklist

### Authentication Flow
- [ ] Register new user with valid email
- [ ] Cannot register with existing email
- [ ] Login with correct credentials
- [ ] Cannot login with wrong password
- [ ] Logout clears session

### Product Management
- [ ] Can list all products
- [ ] Can get specific product
- [ ] Can create new product with all required fields
- [ ] Cannot create product without name/price/description
- [ ] Can update product details
- [ ] Can delete product

### Cart Operations
- [ ] Can create cart
- [ ] Can add items to cart
- [ ] Can view cart contents
- [ ] Can update item quantities
- [ ] Can remove items from cart
- [ ] Cart totals calculate correctly

### Order Management
- [ ] Can checkout cart to create order
- [ ] Cannot checkout empty cart
- [ ] Orders contain correct items and totals
- [ ] Can retrieve order history
- [ ] Can get specific order details

### Error Scenarios
- [ ] Missing required fields return 400
- [ ] Non-existent resources return 404
- [ ] Duplicate email returns 409
- [ ] Server errors return 500

## 📊 Performance Optimization

### 1. Query Optimization

```javascript
// ✅ GOOD - Specific fields
SELECT id, name, price FROM products WHERE id = $1

// ❌ BAD - All fields
SELECT * FROM products WHERE id = $1
```

### 2. Connection Pooling

Currently configured in `db/index.js`:
```javascript
const pool = new Pool({
  user: DB.PGUSER,
  host: DB.PGHOST,
  database: DB.PGDATABASE,
  password: DB.PGPASSWORD,
  port: DB.PGPORT
  // Adjust these for better performance:
  // max: 20,                // Max connections
  // idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: 2000
});
```

### 3. Caching (Future Enhancement)

```javascript
// Add Redis for caching products
npm install redis

// Cache frequently accessed products
const redis = require('redis');
const cache = redis.createClient();

// Before database query
const cached = await cache.get(`product:${id}`);
if (cached) return JSON.parse(cached);
```

### 4. Database Indexing (Future Enhancement)

```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_userId ON orders(userId);
CREATE INDEX idx_carts_userId ON carts(userId);
CREATE INDEX idx_cartItems_cartId ON cartItems(cartId);
```

## 🔐 Security Enhancements

### Implement These for Production

1. **Password Hashing**
   ```bash
   npm install bcrypt
   ```

2. **JWT Authentication**
   ```bash
   npm install jsonwebtoken
   ```

3. **Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```

4. **Input Sanitization**
   ```bash
   npm install express-validator
   ```

5. **Helmet.js** (Security Headers)
   ```bash
   npm install helmet
   app.use(helmet());
   ```

6. **HTTPS** (Production only)
   ```javascript
   const https = require('https');
   const fs = require('fs');
   
   const options = {
     key: fs.readFileSync('key.pem'),
     cert: fs.readFileSync('cert.pem')
   };
   
   https.createServer(options, app).listen(443);
   ```

## 📈 Monitoring & Logging

### Add Logging (Recommended)

```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Use in handlers
logger.info('User registered', { email });
logger.error('Database error', error);
```

## 🚀 Deployment Checklist

- [ ] All dependencies installed: `npm install --production`
- [ ] Environment variables set for production
- [ ] Database credentials secured
- [ ] Stripe keys configured
- [ ] CORS properly configured
- [ ] HTTPS enabled
- [ ] Rate limiting implemented
- [ ] Input validation complete
- [ ] Error handling comprehensive
- [ ] Logging configured
- [ ] Database backups configured
- [ ] Monitoring set up
- [ ] Documentation complete
- [ ] Tests passing

## 📞 Support Resources

- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Express.js Docs**: https://expressjs.com/
- **Passport.js Docs**: http://www.passportjs.org/
- **Stripe Docs**: https://stripe.com/docs
- **Swagger Docs**: https://swagger.io/
- **Node.js Docs**: https://nodejs.org/docs/

---

**Last Updated**: November 2025
