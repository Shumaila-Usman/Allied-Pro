# 🚀 Hostinger VPS Deployment Guide - Fix Images Not Showing

## VPS Setup for Next.js

Since you're using **Hostinger VPS**, you have full control. Here's how to properly deploy:

---

## Step 1: Connect to Your VPS

### Via SSH:
```bash
ssh root@your-vps-ip
# or
ssh username@your-vps-ip
```

### Via Hostinger Panel:
- Use the built-in terminal/SSH access

---

## Step 2: Install Required Software

### Install Node.js (if not already installed):
```bash
# Check if Node.js is installed
node --version

# If not installed, install Node.js 18+ (using nvm recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

### Install PM2 (Process Manager):
```bash
npm install -g pm2
```

### Install Git (if not installed):
```bash
# Ubuntu/Debian
apt update && apt install git -y

# CentOS/RHEL
yum install git -y
```

---

## Step 3: Deploy Your Application

### Option A: Upload via Git (Recommended)

1. **Push your code to Git repository** (GitHub, GitLab, etc.)

2. **On VPS, clone the repository:**
```bash
cd /var/www  # or your preferred directory
git clone https://github.com/yourusername/your-repo.git acbs
cd acbs
```

3. **Install dependencies:**
```bash
npm install
```

4. **Build the application:**
```bash
npm run build
```

5. **Create production .env file:**
```bash
nano .env.production
# Add your MongoDB connection string and other env variables
```

### Option B: Upload via FTP/SFTP

1. **On your local machine, build the app:**
```bash
npm run build
```

2. **Upload files to VPS via SFTP:**
   - Upload entire project folder
   - **CRITICAL:** Make sure `public/products/` folder with all 197 images is uploaded
   - Upload `.env.production` file

3. **On VPS, install dependencies:**
```bash
cd /path/to/your/app
npm install --production
```

---

## Step 4: ⚠️ CRITICAL - Upload Images

**This is the #1 reason images don't show!**

### Verify Images Are Uploaded:

```bash
# On VPS, check if images folder exists
ls -la /path/to/your/app/public/products/

# Count image files (should be 197)
ls /path/to/your/app/public/products/ | wc -l
```

### If Images Are Missing:

1. **Via SFTP/FTP:**
   - Upload entire `public/products/` folder from local to VPS
   - Ensure all 197 image files are transferred

2. **Via Git:**
   - Make sure `public/products/` is committed to Git (not in .gitignore)
   - Pull latest changes on VPS

3. **Via SCP (from local machine):**
```bash
scp -r public/products/ root@your-vps-ip:/path/to/your/app/public/
```

### Verify Image Access:

```bash
# Test if images are accessible
curl http://localhost:3000/products/Hyaluronic-Acid-Gel-Mask-30ml.PNG
# Should return image data, not 404
```

---

## Step 5: Set Up Environment Variables

```bash
# Create .env.production file
nano .env.production
```

Add:
```env
MONGODB_URI=your-production-mongodb-connection-string
NODE_ENV=production
# Add any other environment variables
```

---

## Step 6: Start the Application

### Using PM2 (Recommended):

```bash
# Start the app
pm2 start npm --name "acbs" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the instructions it gives you
```

### Or using npm directly:

```bash
npm start
```

### Check if app is running:

```bash
# Check PM2 status
pm2 status

# Check if port 3000 is listening
netstat -tulpn | grep 3000
# or
ss -tulpn | grep 3000
```

---

## Step 7: Set Up Nginx Reverse Proxy (Recommended)

### Install Nginx:
```bash
# Ubuntu/Debian
apt install nginx -y

# CentOS/RHEL
yum install nginx -y
```

### Configure Nginx:

```bash
nano /etc/nginx/sites-available/acbs
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve static files directly (IMPORTANT for images)
    location /products/ {
        alias /path/to/your/app/public/products/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Serve other public files
    location /_next/static/ {
        alias /path/to/your/app/.next/static/;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}
```

**Important:** Replace `/path/to/your/app/` with your actual app path!

### Enable the site:
```bash
# Ubuntu/Debian
ln -s /etc/nginx/sites-available/acbs /etc/nginx/sites-enabled/
nginx -t  # Test configuration
systemctl restart nginx

# CentOS/RHEL
# Create symlink and restart similarly
```

---

## Step 8: Set Up SSL (HTTPS)

### Using Let's Encrypt (Free SSL):
```bash
# Install certbot
apt install certbot python3-certbot-nginx -y
# or for CentOS
yum install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## Step 9: Verify Images Are Working

### 1. Check Image Files Exist:
```bash
# On VPS
ls -la /path/to/your/app/public/products/ | head -20
# Should show image files
```

### 2. Test Direct Image Access:
```bash
# From VPS
curl -I http://localhost:3000/products/Hyaluronic-Acid-Gel-Mask-30ml.PNG
# Should return 200 OK, not 404
```

### 3. Test from Browser:
```
https://your-domain.com/products/Hyaluronic-Acid-Gel-Mask-30ml.PNG
```
Should show the image directly.

### 4. Check Application Logs:
```bash
# PM2 logs
pm2 logs acbs

# Or if using npm directly
# Check terminal output
```

---

## Common VPS Issues & Fixes

### Issue 1: Images Return 404

**Check:**
```bash
# Verify files exist
ls -la public/products/

# Check file permissions
chmod -R 755 public/products/
chmod -R 644 public/products/*

# Verify Nginx/Apache can read files
# Files should be readable by web server user (www-data, nginx, etc.)
```

**Fix:**
```bash
# Set correct permissions
chown -R www-data:www-data public/products/  # For Apache
# or
chown -R nginx:nginx public/products/  # For Nginx
chmod -R 755 public/products/
```

### Issue 2: Next.js Can't Find Images

**Check:**
- Images are in `public/products/` (not `public/public/products/`)
- Next.js is serving from correct directory
- Check `next.config.js` is correct

**Fix:**
```bash
# Verify structure
cd /path/to/your/app
ls public/products/  # Should show images
```

### Issue 3: Database Connection Issues

**Check:**
```bash
# Verify .env.production exists and has correct MongoDB URI
cat .env.production

# Test MongoDB connection
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(e => console.error(e))"
```

### Issue 4: Port Not Accessible

**Check firewall:**
```bash
# Ubuntu/Debian (UFW)
ufw allow 3000/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# CentOS/RHEL (firewalld)
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --reload
```

---

## Quick Diagnostic Commands

```bash
# Check if app is running
pm2 status

# Check if images folder exists
ls -la public/products/ | wc -l  # Should be 197+

# Check file permissions
ls -la public/products/ | head -5

# Check if port is listening
netstat -tulpn | grep 3000

# Check Nginx status
systemctl status nginx

# Check application logs
pm2 logs acbs --lines 50

# Test MongoDB connection
node -e "require('./lib/mongodb').default().then(() => console.log('DB OK')).catch(e => console.error(e))"
```

---

## Step-by-Step: Fix Images Not Showing

### 1. Verify Images Are Uploaded:
```bash
cd /path/to/your/app
ls public/products/ | wc -l  # Should show 197
```

### 2. Check File Permissions:
```bash
chmod -R 755 public/products/
chmod -R 644 public/products/*
```

### 3. Verify Nginx Configuration:
```bash
# Check if Nginx is serving static files correctly
nginx -t
systemctl restart nginx
```

### 4. Check Application Logs:
```bash
pm2 logs acbs
# Look for any errors related to images or static files
```

### 5. Test Image Access:
```bash
# From VPS
curl -I http://localhost:3000/products/Hyaluronic-Acid-Gel-Mask-30ml.PNG

# Should return:
# HTTP/1.1 200 OK
# Content-Type: image/png
```

### 6. Verify Database Has Image Links:
```bash
# Connect to MongoDB and check a product
# Or run the sync script on production database
```

---

## Most Common Fix for VPS

**90% of the time:** Images folder is not uploaded or has wrong permissions.

**Solution:**
```bash
# 1. Upload public/products/ folder to VPS
# 2. Set correct permissions
chmod -R 755 public/products/
chmod -R 644 public/products/*

# 3. Set correct ownership (adjust user as needed)
chown -R www-data:www-data public/products/  # For Apache
# or
chown -R nginx:nginx public/products/  # For Nginx

# 4. Restart application
pm2 restart acbs
```

---

## Maintenance Commands

```bash
# View logs
pm2 logs acbs

# Restart app
pm2 restart acbs

# Stop app
pm2 stop acbs

# Start app
pm2 start acbs

# Monitor app
pm2 monit

# Update app (after git pull)
pm2 stop acbs
npm install
npm run build
pm2 start acbs
```

---

## Need Help?

If images still don't show:

1. **Check PM2 logs:** `pm2 logs acbs`
2. **Check Nginx logs:** `tail -f /var/log/nginx/error.log`
3. **Verify files exist:** `ls -la public/products/`
4. **Test image directly:** `curl -I http://localhost:3000/products/image.PNG`
5. **Check file permissions:** `ls -la public/products/ | head -5`

