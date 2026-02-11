# Fix: Browser Shows Wrong Content (But curl Shows Correct)

## 🔍 Problem
- ✅ `curl http://tftr.alertaraqc.com` shows correct content (your login form)
- ❌ Browser shows `alertaraqc.com` content instead

## 🎯 Most Likely Causes

### 1. Browser Cache
Your browser might be caching the old content.

**Solution:**
- **Clear browser cache:** `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete` on Mac)
- **Or use Incognito/Private mode** to test
- **Hard refresh:** `Ctrl+F5` (or `Cmd+Shift+R` on Mac)

### 2. HTTPS vs HTTP
You might be visiting `https://tftr.alertaraqc.com` but SSL isn't configured, so it falls back to default server.

**Solution:**
- Visit **HTTP** instead: `http://tftr.alertaraqc.com`
- Or set up SSL: `certbot --nginx -d tftr.alertaraqc.com`

### 3. Default Server Block Catching Requests
The default server block with `server_name _;` might be catching requests before your tftr config.

**Solution:** Make sure tftr config is loaded and has priority.

### 4. DNS/Redirect Issue
There might be a redirect happening.

**Solution:** Check what URL you're actually visiting.

## ✅ Quick Fixes

### Fix 1: Clear Browser Cache
1. Open browser Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use Incognito/Private mode

### Fix 2: Check HTTP vs HTTPS
```bash
# Test HTTP
curl -I http://tftr.alertaraqc.com

# Test HTTPS
curl -I https://tftr.alertaraqc.com

# If HTTPS doesn't work, visit HTTP in browser
```

### Fix 3: Update Nginx Config Priority
Make sure your tftr config is being used. The config file looks correct, but we need to ensure it's loaded properly.

### Fix 4: Check What Server Block is Handling Requests
```bash
# Watch Nginx access log
tail -f /var/log/nginx/access.log

# Then visit the site in browser
# See which server_name appears in the log
```

## 🚀 Complete Fix Script

I've created `fix_browser_content_issue.sh` that:
1. Updates the Nginx config
2. Adds HTTPS support if SSL exists
3. Ensures proper server block priority

```bash
# Upload and run
scp fix_browser_content_issue.sh root@72.60.209.226:/root/
ssh root@72.60.209.226
chmod +x /root/fix_browser_content_issue.sh
/root/fix_browser_content_issue.sh
```

## 📋 Step-by-Step Debugging

### Step 1: Check What You're Visiting
- Are you visiting `http://` or `https://`?
- Try both and see which one works

### Step 2: Check Browser Console
- Open Developer Tools (F12)
- Go to **Network** tab
- Visit the site
- Check the **Request URL** - what does it show?
- Check the **Response** - what content does it return?

### Step 3: Check Server Logs
```bash
# See which config is handling requests
tail -f /var/log/nginx/access.log | grep tftr
```

### Step 4: Test Directly
```bash
# Test HTTP
curl -v http://tftr.alertaraqc.com 2>&1 | grep -i "server\|location"

# Test HTTPS
curl -v https://tftr.alertaraqc.com 2>&1 | grep -i "server\|location"
```

## ✅ Most Common Solution

**Try this first:**

1. **Clear browser cache** (or use Incognito mode)
2. **Visit HTTP explicitly:** `http://tftr.alertaraqc.com` (not HTTPS)
3. **Hard refresh:** `Ctrl+F5`

If that doesn't work, run the fix script above.

## 🔧 If Still Not Working

Check if there's a redirect or if default server is catching it:

```bash
# Check for redirects
curl -I http://tftr.alertaraqc.com
curl -I https://tftr.alertaraqc.com

# Check Nginx config order
ls -la /etc/nginx/sites-enabled/ | grep tftr

# Make sure tftr config is loaded
nginx -T | grep -A 10 "tftr.alertaraqc.com"
```

The issue is most likely **browser cache** or **HTTPS redirect**. Try clearing cache and visiting HTTP first!
