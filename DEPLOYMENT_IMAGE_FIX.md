# 🖼️ Fixing Images Not Showing on Hosted Site

If images work on localhost but not on your hosted site, follow these steps:

## Common Issues & Solutions

### 1. **Static Files Not Deployed** ✅ MOST COMMON

**Problem:** The `public/products/` folder with all image files is not being uploaded to your hosting platform.

**Solution:**
- **Vercel/Netlify:** Make sure `public/` folder is committed to Git and pushed. These platforms automatically include the `public` folder.
- **Manual Upload:** If using FTP/cPanel, make sure to upload the entire `public/products/` folder with all image files.
- **Check:** Verify that `public/products/` folder exists on your server with all image files.

### 2. **Case Sensitivity Issues** (Linux Servers)

**Problem:** Windows is case-insensitive, but Linux servers (most hosting) are case-sensitive. File names must match exactly.

**Example:**
- Database has: `/products/image.PNG`
- Actual file: `image.png` (lowercase)
- **Result:** Image won't load on Linux server

**Solution:**
- Run the verification script: `npx tsx scripts/verify-image-paths.ts`
- Make sure all file extensions match exactly (`.PNG` vs `.png`, `.JPG` vs `.jpg`)

### 3. **Next.js Image Optimization**

**Problem:** Next.js Image component might have issues with optimization in production.

**Solution:**
- The `next.config.js` is already configured correctly
- If still having issues, you can temporarily disable optimization:
  ```js
  images: {
    unoptimized: true, // Disable optimization
  }
  ```

### 4. **Base Path Issues**

**Problem:** If your site is hosted in a subdirectory, image paths might need adjustment.

**Solution:**
- If hosted at `yoursite.com/app/`, add to `next.config.js`:
  ```js
  basePath: '/app',
  ```

### 5. **Database Connection**

**Problem:** Production database might not have the updated image links.

**Solution:**
- Make sure you've run the sync script on your production database:
  ```bash
  npx tsx scripts/sync-images-from-json.ts
  ```
- Or manually update the production MongoDB with image links from `data/products.json`

## Quick Checklist

- [ ] All image files are in `public/products/` folder
- [ ] `public/products/` folder is uploaded to hosting server
- [ ] Image file names match exactly (case-sensitive) with database paths
- [ ] Production database has updated image links
- [ ] Next.js build includes static files (check `.next/static/` after build)

## Testing After Deployment

1. **Check browser console** for 404 errors on image files
2. **Inspect network tab** to see which images are failing to load
3. **Verify file paths** - try accessing an image directly: `yoursite.com/products/image-name.PNG`
4. **Check file permissions** on server (should be readable)

## If Images Still Don't Show

1. **Check browser console** for specific error messages
2. **Verify one image manually** by accessing it directly via URL
3. **Check server logs** for 404 errors
4. **Ensure MongoDB connection** is working in production
5. **Verify environment variables** are set correctly on hosting platform

## Most Likely Fix

**90% of the time**, the issue is that the `public/products/` folder with all image files is not uploaded to your hosting server. Make sure:

1. All image files are committed to Git (if using Git-based deployment)
2. Or manually upload the entire `public/products/` folder via FTP/cPanel
3. Verify the folder exists on the server with all files

