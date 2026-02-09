# MongoDB Migration Guide

This project has been migrated from file-based JSON storage to MongoDB using Mongoose.

## Setup

### 1. Install MongoDB

Make sure MongoDB is installed and running on your system, or use MongoDB Atlas (cloud).

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/acbs
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/acbs
```

### 3. Install Dependencies

Mongoose is already installed. If needed:
```bash
npm install mongoose
```

### 4. Seed the Database

Run the seed script to migrate all existing data from JSON files to MongoDB:

```bash
npm run seed-mongodb
```

This will:
- Create all categories (root, subcategories, sub-subcategories) with proper parent-child relationships
- Migrate all products to MongoDB, ensuring they're only assigned to leaf categories
- Migrate all users (normal users, dealers, admins) to MongoDB

## Database Structure

### Collections

1. **users** - All user accounts (normal, dealer, admin)
2. **categories** - Category hierarchy with parent-child relationships
3. **products** - Products linked to leaf categories only

### Models

- **User** (`lib/models/User.ts`) - User accounts with role-based access
- **Category** (`lib/models/Category.ts`) - Hierarchical categories (level 0, 1, 2)
- **Product** (`lib/models/Product.ts`) - Products with retail/dealer pricing

## API Routes Updated

All API routes now use MongoDB:

- `/api/categories` - Returns nested category tree
- `/api/products` - GET (with filtering) and POST (admin only)
- `/api/products/[id]` - GET, PUT, DELETE
- `/api/auth/*` - All authentication routes
- `/api/user/*` - All user management routes

## Important Notes

1. **Products must be assigned to LEAF categories only** - Categories that have children cannot have products directly assigned.

2. **Category Structure**:
   - Level 0: Root categories (Skincare, Spa Products, etc.)
   - Level 1: Subcategories
   - Level 2: Sub-subcategories (leaf categories where products can be assigned)

3. **Price Structure**:
   - `prices.retail` - Visible to all users
   - `prices.dealer` - Visible only to dealers

4. **Frontend Unchanged**: The frontend code remains unchanged - all API responses maintain the same structure for backward compatibility.

## Troubleshooting

### Connection Issues

If you get connection errors:
1. Verify MongoDB is running: `mongosh` or check MongoDB Compass
2. Check your `MONGODB_URI` in `.env.local`
3. Ensure the database name is correct

### Seed Script Issues

If the seed script fails:
1. Check that `data/categories.json`, `data/products.json`, and `data/users.json` exist
2. Verify MongoDB connection
3. Check console output for specific errors

### Data Migration

The seed script is idempotent - it won't create duplicates. If you need to re-seed:
- The script checks for existing records and skips them
- To force re-seeding, you can manually clear collections (not recommended in production)

## Development

The MongoDB connection is cached globally to prevent multiple connections in development mode (Next.js hot reload).

## Production

For production deployment:
1. Use MongoDB Atlas or a managed MongoDB service
2. Set `MONGODB_URI` in your hosting environment variables
3. Run the seed script once during initial deployment
4. Ensure proper backup and monitoring

