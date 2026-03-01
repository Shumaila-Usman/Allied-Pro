#!/bin/bash

# Quick VPS Image Verification Script
# Run this on your VPS to verify images are working

echo "🔍 Verifying Images on VPS"
echo "=========================="
echo ""

APP_DIR="${1:-/var/www/acbs}"
cd "$APP_DIR" || exit 1

# 1. Check file count
IMAGE_COUNT=$(ls -1 public/products/ 2>/dev/null | wc -l)
echo "✅ Found $IMAGE_COUNT image files in public/products/"
echo ""

# 2. Check file permissions
echo "🔐 Checking permissions..."
FOLDER_PERM=$(stat -c "%a" public/products/ 2>/dev/null || stat -f "%OLp" public/products/ 2>/dev/null)
echo "   Folder permissions: $FOLDER_PERM"

SAMPLE_FILE=$(ls public/products/ | head -1)
if [ -n "$SAMPLE_FILE" ]; then
    FILE_PERM=$(stat -c "%a" "public/products/$SAMPLE_FILE" 2>/dev/null || stat -f "%OLp" "public/products/$SAMPLE_FILE" 2>/dev/null)
    echo "   File permissions: $FILE_PERM"
    echo "   Sample file: $SAMPLE_FILE"
fi
echo ""

# 3. Test if Next.js can access images
echo "🌐 Testing image access..."
if [ -n "$SAMPLE_FILE" ]; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/products/$SAMPLE_FILE" 2>/dev/null)
    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✅ Image accessible via Next.js (HTTP $HTTP_CODE)"
    else
        echo "   ❌ Image NOT accessible (HTTP $HTTP_CODE)"
        echo "      Next.js might not be running or can't serve images"
    fi
else
    echo "   ⚠️  No files to test"
fi
echo ""

# 4. Check if app is running
echo "🚀 Checking application..."
if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "acbs"; then
        APP_STATUS=$(pm2 jlist | grep -A 5 '"name":"acbs"' | grep '"status"' | cut -d'"' -f4)
        echo "   ✅ PM2 process 'acbs' status: $APP_STATUS"
    else
        echo "   ⚠️  PM2 process 'acbs' not found"
    fi
else
    echo "   ℹ️  PM2 not found (app might be running differently)"
fi

# 5. Check if port is listening
if netstat -tuln 2>/dev/null | grep -q ":3000" || ss -tuln 2>/dev/null | grep -q ":3000"; then
    echo "   ✅ Port 3000 is listening"
else
    echo "   ⚠️  Port 3000 is not listening"
fi
echo ""

# 6. List a few sample files to verify
echo "📋 Sample image files:"
ls public/products/ | head -5 | while read file; do
    echo "   - $file"
done
echo ""

# 7. Check if files are readable
echo "📖 Testing file readability..."
if [ -n "$SAMPLE_FILE" ] && [ -r "public/products/$SAMPLE_FILE" ]; then
    echo "   ✅ Files are readable"
else
    echo "   ❌ Files are NOT readable (permission issue)"
fi
echo ""

echo "=========================="
echo "💡 Next Steps:"
echo ""
echo "1. If permissions are wrong, run:"
echo "   chmod -R 755 public/products/"
echo "   chmod -R 644 public/products/*"
echo ""
echo "2. If app is not running, start it:"
echo "   pm2 start npm --name acbs -- start"
echo "   # or"
echo "   npm start"
echo ""
echo "3. Test image in browser:"
echo "   http://your-domain.com/products/Hyaluronic-Acid-Gel-Mask-30ml.PNG"
echo ""
echo "4. Check database has correct image paths"
echo ""

