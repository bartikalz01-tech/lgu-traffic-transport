# Fix Git "Dubious Ownership" Error

## 🔍 Problem
```
fatal: detected dubious ownership in repository at '/var/www/html/tftr/lgu-traffic-transport'
```

This happens because:
- The repository is owned by `www-data` (for Nginx)
- You're running git commands as `root`
- Git is being cautious about this security issue

## ✅ Solution

### Option 1: Add Safe Directory (Quick Fix - Recommended)

Run this command to tell Git it's safe:

```bash
git config --global --add safe.directory /var/www/html/tftr/lgu-traffic-transport
```

Then you can use git commands normally:
```bash
git stash
git pull
git stash pop
```

### Option 2: Fix Ownership (Alternative)

If you want to change ownership to root:

```bash
# Change ownership to root
chown -R root:root /var/www/html/tftr/lgu-traffic-transport

# But keep www-data for web files
chown -R www-data:www-data /var/www/html/tftr/lgu-traffic-transport/*.php
chown -R www-data:www-data /var/www/html/tftr/lgu-traffic-transport/backend/
chown -R www-data:www-data /var/www/html/tftr/lgu-traffic-transport/api/
```

**Note:** Option 1 is better because it keeps web files owned by www-data (more secure for Nginx).

### Option 3: Use www-data User (Most Secure)

Run git commands as www-data user:

```bash
sudo -u www-data git stash
sudo -u www-data git pull
sudo -u www-data git stash pop
```

## 🚀 Quick Fix Command

Just run this one command:

```bash
git config --global --add safe.directory /var/www/html/tftr/lgu-traffic-transport
```

Then continue with your git commands!

## 📋 After Fixing

Once you've added the safe directory, you can:

```bash
# These will now work
git stash
git pull
git stash pop
git status
git log
# etc.
```

## ⚠️ Security Note

Adding a directory as "safe" tells Git to trust it even if ownership doesn't match. This is fine for your deployment directory, but be cautious about adding random directories.
