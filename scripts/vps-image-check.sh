#!/bin/bash

# VPS Image Verification Script
# Run this on your Hostinger VPS to check if images are properly set up

echo "🔍 Hostinger VPS Image Check"
echo "============================"
echo ""

# Get the app directory (adjust if needed)
APP_DIR="${1:-/var/www/acbs}"

if [ ! -d "$APP_DIR" ]; then
    echo "❌ App directory not found: $APP_DIR"
    echo "Usage: ./vps-image-check.sh /path/to/your/app"
    exit 1
fi

cd "$APP_DIR" || exit 1

echo "📁 Checking app directory: $APP_DIR"
echo ""

# Check if public/products exists
if [ -d "public/products" ]; then
    IMAGE_COUNT=$(ls -1 public/products/ 2>/dev/null | wc -l)
    echo "✅ public/products/ folder exists"
    echo "   Found $IMAGE_COUNT image files"
    
    if [ "$IMAGE_COUNT" -lt 150 ]; then
        echo "   ⚠️  WARNING: Expected ~197 files, found only $IMAGE_COUNT"
    else
        echo "   ✅ Image count looks good"
    fi
else
    echo "❌ public/products/ folder NOT FOUND!"
    echo "   This is why images aren't showing!"
    exit 1
fi

echo ""

# Check file permissions
echo "🔐 Checking file permissions..."
PERM_ISSUES=0

# Check folder permissions
FOLDER_PERM=$(stat -c "%a" public/products/ 2>/dev/null || stat -f "%OLp" public/products/ 2>/dev/null)
if [ "$FOLDER_PERM" != "755" ] && [ "$FOLDER_PERM" != "775" ]; then
    echo "   ⚠️  Folder permissions: $FOLDER_PERM (should be 755 or 775)"
    PERM_ISSUES=1
else
    echo "   ✅ Folder permissions: $FOLDER_PERM"
fi

# Check a few file permissions
SAMPLE_FILE=$(ls public/products/ | head -1)
if [ -n "$SAMPLE_FILE" ]; then
    FILE_PERM=$(stat -c "%a" "public/products/$SAMPLE_FILE" 2>/dev/null || stat -f "%OLp" "public/products/$SAMPLE_FILE" 2>/dev/null)
    if [ "$FILE_PERM" != "644" ] && [ "$FILE_PERM" != "664" ]; then
        echo "   ⚠️  File permissions: $FILE_PERM (should be 644 or 664)"
        PERM_ISSUES=1
    else
        echo "   ✅ File permissions: $FILE_PERM"
    fi
fi

echo ""

# Check if Next.js app is running
echo "🚀 Checking application status..."
if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "acbs"; then
        echo "   ✅ PM2 process 'acbs' is running"
        pm2 show acbs | grep -E "status|uptime|memory"
    else
        echo "   ⚠️  PM2 process 'acbs' not found"
    fi
else
    echo "   ℹ️  PM2 not installed or not in PATH"
fi

echo ""

# Check if port 3000 is listening
echo "🌐 Checking network..."
if netstat -tuln 2>/dev/null | grep -q ":3000" || ss -tuln 2>/dev/null | grep -q ":3000"; then
    echo "   ✅ Port 3000 is listening"
else
    echo "   ⚠️  Port 3000 is not listening (app might not be running)"
fi

echo ""

# Test image access
echo "🖼️  Testing image access..."
SAMPLE_IMAGE=$(ls public/products/ | head -1)
if [ -n "$SAMPLE_IMAGE" ]; then
    if curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/products/$SAMPLE_IMAGE" | grep -q "200"; then
        echo "   ✅ Image accessible via localhost:3000"
    else
        echo "   ❌ Image NOT accessible via localhost:3000"
        echo "      This means Next.js can't serve the image"
    fi
else
    echo "   ⚠️  No images found to test"
fi

echo ""

# Summary
echo "============================"
echo "📊 Summary:"
echo ""

if [ "$IMAGE_COUNT" -ge 150 ] && [ "$PERM_ISSUES" -eq 0 ]; then
    echo "✅ Images setup looks good!"
    echo ""
    echo "If images still don't show on website:"
    echo "1. Check Nginx/Apache configuration"
    echo "2. Verify MongoDB connection in production"
    echo "3. Check browser console for errors"
    echo "4. Verify domain points to correct server"
else
    echo "⚠️  Issues found:"
    [ "$IMAGE_COUNT" -lt 150 ] && echo "   - Missing image files"
    [ "$PERM_ISSUES" -eq 1 ] && echo "   - File permission issues"
    echo ""
    echo "Fix commands:"
    echo "  chmod -R 755 public/products/"
    echo "  chmod -R 644 public/products/*"
    echo "  chown -R www-data:www-data public/products/  # or nginx:nginx"
fi

echo ""

