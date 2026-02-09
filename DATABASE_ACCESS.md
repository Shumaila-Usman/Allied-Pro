# How to Access MongoDB Database

## Quick Access Methods

### 1. MongoDB Compass (GUI - Recommended)

**Install MongoDB Compass:**
- Download from: https://www.mongodb.com/try/download/compass
- Install and open MongoDB Compass

**Connect:**
- Connection String: `mongodb://localhost:27017`
- Or click "Fill in connection fields individually":
  - Host: `localhost`
  - Port: `27017`
- Click "Connect"

**View Your Database:**
- Database name: `acbs`
- Collections: `users`, `categories`, `products`

---

### 2. MongoDB Shell (mongosh) - Command Line

**Install mongosh:**
- Download from: https://www.mongodb.com/try/download/shell
- Or install via npm: `npm install -g mongosh`

**Connect:**
```bash
mongosh mongodb://localhost:27017/acbs
```

**Useful Commands:**
```javascript
// Show all databases
show dbs

// Use acbs database
use acbs

// Show all collections
show collections

// View all users
db.users.find().pretty()

// View all categories
db.categories.find().pretty()

// View all products
db.products.find().pretty()

// Count documents
db.users.countDocuments()
db.categories.countDocuments()
db.products.countDocuments()

// Find specific user by email
db.users.findOne({ email: "user@example.com" })

// Find products in a category
db.products.find({ category: ObjectId("...") })
```

---

### 3. Through Your Application (API Routes)

**View via Browser/Postman:**

1. **Get Categories:**
   ```
   GET http://localhost:3000/api/categories
   ```

2. **Get Products:**
   ```
   GET http://localhost:3000/api/products
   ```

3. **Get Single Product:**
   ```
   GET http://localhost:3000/api/products/[productId]
   ```

4. **Get User Details:**
   ```
   GET http://localhost:3000/api/user/details?email=user@example.com
   ```

---

### 4. Check if MongoDB is Running

**Windows:**
```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# Start MongoDB service
Start-Service MongoDB
```

**Or check in Task Manager:**
- Look for `mongod.exe` process

**Test Connection:**
```bash
# Try to connect
mongosh mongodb://localhost:27017
```

---

### 5. Connection String Details

**Local MongoDB:**
```
mongodb://localhost:27017/acbs
```

**MongoDB Atlas (Cloud):**
```
mongodb+srv://username:password@cluster.mongodb.net/acbs
```

**Set in `.env.local`:**
```env
MONGODB_URI=mongodb://localhost:27017/acbs
```

---

## Database Structure

### Collections Overview

**1. users Collection**
- Stores: Normal users, Dealers, Admins
- Fields: email, password (hashed), role, dealerId, company info, etc.

**2. categories Collection**
- Stores: Category hierarchy
- Fields: name, slug, parent (ObjectId), level (0, 1, 2)
- Structure: Root → Subcategory → Sub-subcategory

**3. products Collection**
- Stores: Product catalog
- Fields: name, description, prices (retail/dealer), images, stock, category (ObjectId)

---

## Quick Database Queries

### View All Users
```javascript
db.users.find().pretty()
```

### View All Dealers
```javascript
db.users.find({ role: "dealer" }).pretty()
```

### View All Admins
```javascript
db.users.find({ role: "admin" }).pretty()
```

### View Category Tree
```javascript
// Root categories
db.categories.find({ level: 0 }).pretty()

// Subcategories
db.categories.find({ level: 1 }).pretty()

// Sub-subcategories (leaf categories)
db.categories.find({ level: 2 }).pretty()
```

### View Products with Category Info
```javascript
db.products.aggregate([
  {
    $lookup: {
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "categoryInfo"
    }
  }
]).pretty()
```

### Count Products by Category
```javascript
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      count: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "categories",
      localField: "_id",
      foreignField: "_id",
      as: "categoryInfo"
    }
  }
]).pretty()
```

---

## Troubleshooting

### MongoDB Not Running
```bash
# Windows - Start MongoDB service
net start MongoDB

# Or start manually
mongod --dbpath "C:\data\db"
```

### Connection Refused
- Check if MongoDB is installed and running
- Verify port 27017 is not blocked
- Check firewall settings

### Database Not Found
- Run the seed script: `npm run seed-mongodb`
- This will create the database and collections

### Can't Connect from Application
- Check `.env.local` file exists
- Verify `MONGODB_URI` is set correctly
- Restart Next.js dev server after changing `.env.local`

---

## Useful MongoDB Compass Features

1. **Browse Collections** - Visual interface to view data
2. **Query Documents** - Filter and search data
3. **Edit Documents** - Update records directly
4. **Indexes** - View and create indexes
5. **Schema** - Analyze collection schema
6. **Aggregation Pipeline** - Build complex queries

---

## Next Steps

1. **Install MongoDB Compass** for easiest access
2. **Set up `.env.local`** with your connection string
3. **Run seed script** to populate data: `npm run seed-mongodb`
4. **Start your app**: `npm run dev`
5. **Access via Compass** or API routes

