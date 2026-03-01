# 🚀 Hostinger Deployment Guide - Fix Images Not Showing

## Important: Hostinger Setup for Next.js

Hostinger offers different hosting types. Follow the guide based on your plan:

---

## Option 1: Hostinger Node.js Hosting (Recommended)

If you have **Node.js hosting** on Hostinger:

### Step 1: Build Your Next.js App Locally

```bash
# Install dependencies
npm install

# Build the production version
npm run build
```

### Step 2: Upload Files via FTP/cPanel File Manager

**Critical:** You need to upload these folders/files:

1. **`.next` folder** - The built Next.js app
2. **`public` folder** - ⚠️ **MUST INCLUDE** `public/products/` with all images
3. **`node_modules` folder** - Or install on server
4. **`package.json`** - Required for dependencies
5. **`.env` or `.env.production`** - Your environment variables (MongoDB URI, etc.)

### Step 3: Upload Structure

```
your-domain.com/
├── .next/              ← Built Next.js app
├── public/             ← ⚠️ MUST INCLUDE THIS
│   └── products/       ← ⚠️ ALL YOUR IMAGES HERE (197 files)
│       ├── Hyaluronic-Acid-Gel-Mask-30ml.PNG
│       ├── Golden-Firming-Gel-Mask-30ml.PNG
│       └── ... (all 197 image files)
├── node_modules/       ← Or install on server
├── package.json
├── .env                ← Your MongoDB connection string
└── server.js           ← If using custom server
```

### Step 4: Install Dependencies on Server

Via SSH or cPanel Terminal:
```bash
npm install --production
```

### Step 5: Start the App

```bash
npm start
```

Or set up PM2 for process management:
```bash
npm install -g pm2
pm2 start npm --name "acbs" -- start
pm2 save
pm2 startup
```

---

## Option 2: Static Export (If No Node.js Support)

If Hostinger doesn't support Node.js, you need to export as static files:

### Step 1: Update `next.config.js`

Add this to your `next.config.js`:

```js
const nextConfig = {
  output: 'export',  // Enable static export
  images: {
    unoptimized: true,  // Required for static export
  },
  // ... rest of config
}
```

### Step 2: Build Static Export

```bash
npm run build
```

This creates an `out/` folder with all static files.

### Step 3: Upload `out/` Folder Contents

Upload **everything inside** the `out/` folder to your `public_html/` directory on Hostinger.

**Important:** The `out/` folder already includes the `public/` folder contents, so images should be at:
```
public_html/products/image-name.PNG
```

---

## ⚠️ CRITICAL: Image Files Upload

**This is the #1 reason images don't show on Hostinger:**

### Method 1: Via cPanel File Manager

1. Log into Hostinger cPanel
2. Go to **File Manager**
3. Navigate to `public_html/` (or your domain folder)
4. **Upload the entire `public/products/` folder**
   - Make sure all 197 image files are uploaded
   - Keep the exact folder structure: `public/products/`

### Method 2: Via FTP (FileZilla, WinSCP, etc.)

1. Connect to your Hostinger FTP
2. Navigate to `public_html/` (or your domain root)
3. **Upload the `public/products/` folder** with all files
4. Ensure folder structure is: `public/products/`

### Verify Upload

After uploading, check:
- ✅ `public/products/` folder exists
- ✅ All 197 image files are present
- ✅ File names match exactly (case-sensitive on Linux)
- ✅ File permissions are readable (644 or 755)

---

## Step-by-Step: Fix Images Not Showing

### 1. Check Current Setup

**Via cPanel File Manager or FTP:**
- Navigate to your domain root folder
- Check if `public/products/` folder exists
- Count the files - should be 197 images

### 2. Upload Missing Images

If the folder is missing or incomplete:

1. **On your local computer:**
   - Go to `D:\acbs (3)\acbs\public\products\`
   - Select all 197 image files

2. **Upload to Hostinger:**
   - Via FTP: Upload to `public_html/public/products/`
   - Via cPanel: Upload to `public_html/public/products/`

3. **Verify:**
   - Check file count matches (197 files)
   - Try accessing one image directly: `yoursite.com/public/products/Hyaluronic-Acid-Gel-Mask-30ml.PNG`

### 3. Check File Permissions

Via cPanel File Manager:
- Right-click on `public/products/` folder
- Select "Change Permissions"
- Set to **755** (folders) and **644** (files)

### 4. Verify Database Connection

Make sure your production MongoDB has the image links:
- Check MongoDB connection string in `.env` on server
- Run sync script on production database if needed

### 5. Test Image Access

Try accessing an image directly in browser:
```
https://yoursite.com/public/products/Hyaluronic-Acid-Gel-Mask-30ml.PNG
```

If this works, images are uploaded correctly.
If this gives 404, images are not uploaded or path is wrong.

---

## Common Hostinger Issues & Fixes

### Issue 1: Images 404 Error

**Problem:** Images return 404 Not Found

**Solutions:**
- ✅ Upload `public/products/` folder to server
- ✅ Check file paths match exactly (case-sensitive)
- ✅ Verify folder structure: `public/products/image.PNG`

### Issue 2: Images Load But Don't Show

**Problem:** Images load but appear broken

**Solutions:**
- ✅ Check file permissions (should be 644)
- ✅ Verify image files aren't corrupted
- ✅ Check Next.js Image component configuration

### Issue 3: Wrong Image Paths

**Problem:** Database has different paths than server

**Solutions:**
- ✅ Run sync script on production database
- ✅ Verify MongoDB connection string in production `.env`
- ✅ Check image paths in database match file structure

---

## Quick Checklist

Before deploying:
- [ ] Built the app: `npm run build`
- [ ] All 197 images in `public/products/` folder
- [ ] `.env` file with production MongoDB URI
- [ ] Tested locally: images show correctly

After deploying:
- [ ] `public/products/` folder uploaded to server
- [ ] All 197 image files present on server
- [ ] File permissions set correctly (644/755)
- [ ] Can access image directly via URL
- [ ] Production database has updated image links
- [ ] MongoDB connection working in production

---

## Testing After Deployment

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to Network tab
   - Refresh products page
   - Look for 404 errors on image files

2. **Test Direct Image Access:**
   ```
   https://yoursite.com/public/products/Hyaluronic-Acid-Gel-Mask-30ml.PNG
   ```
   Should show the image directly

3. **Verify Database:**
   - Check production MongoDB
   - Verify products have `images` array with correct paths

---

## Need Help?

If images still don't show:

1. **Check browser console** for specific error messages
2. **Verify one image manually** by accessing URL directly
3. **Check Hostinger error logs** in cPanel
4. **Confirm MongoDB connection** is working in production
5. **Verify environment variables** are set correctly

---

## Most Common Fix

**90% of the time:** The `public/products/` folder with all 197 image files is not uploaded to Hostinger.

**Solution:** Upload the entire `public/products/` folder via cPanel File Manager or FTP to your `public_html/` directory.

