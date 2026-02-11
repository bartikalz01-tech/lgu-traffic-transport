# Nginx-Specific Deployment Notes

## 🚀 Nginx Configuration

Your Hostinger server uses **Nginx** as the web server. Here are important notes:

### Key Differences from Apache

1. **No .htaccess files**
   - Nginx doesn't use `.htaccess` files (Apache feature)
   - Configuration is done in Nginx server blocks
   - Usually managed by Hostinger hPanel

2. **PHP Processing**
   - PHP is handled via **PHP-FPM** (FastCGI Process Manager)
   - Nginx passes PHP requests to PHP-FPM via socket or TCP

3. **Configuration Files**
   - Nginx config: `/etc/nginx/nginx.conf`
   - Server blocks: `/etc/nginx/sites-available/` or `/etc/nginx/conf.d/`
   - Usually managed by Hostinger, but you can check if needed

### File Permissions for Nginx

Nginx typically runs as `www-data` or `nginx` user:

```bash
# Check Nginx user
ps aux | grep nginx

# Set permissions (Nginx needs read access)
chmod -R 755 /var/www/html/tftr/lgu-traffic-transport
chmod -R 644 /var/www/html/tftr/lgu-traffic-transport/*.php

# If you have sudo access (usually not needed on Hostinger)
# chown -R www-data:www-data /var/www/html/tftr/lgu-traffic-transport
```

### Common Nginx Commands

```bash
# Test Nginx configuration
nginx -t

# Reload Nginx (applies config changes without downtime)
systemctl reload nginx
# OR
service nginx reload

# Restart Nginx (full restart)
systemctl restart nginx
# OR
service nginx restart

# Check Nginx status
systemctl status nginx

# View Nginx error logs
tail -f /var/log/nginx/error.log

# View Nginx access logs
tail -f /var/log/nginx/access.log
```

### PHP-FPM Commands

```bash
# Check PHP-FPM status
systemctl status php-fpm
# OR
service php-fpm status

# Restart PHP-FPM
systemctl restart php-fpm
# OR
service php-fpm restart

# Reload PHP-FPM (graceful reload)
systemctl reload php-fpm

# Check PHP-FPM error logs
tail -f /var/log/php-fpm/error.log
# OR (depending on PHP version)
tail -f /var/log/php8.2-fpm.log
```

### Typical Nginx Server Block (for reference)

Your Hostinger subdomain `tftr.alertaraqc.com` should have a server block like this (usually auto-configured by Hostinger):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name tftr.alertaraqc.com;
    
    root /var/www/html/tftr/lgu-traffic-transport;
    index index.php index.html index.htm;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;  # Adjust PHP version
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    location ~ /\.ht {
        deny all;
    }
}
```

**Note:** Hostinger usually manages this automatically. You typically don't need to edit it manually.

### Troubleshooting Checklist

✅ **Page shows 502 Bad Gateway?**
- PHP-FPM might not be running: `systemctl restart php-fpm`
- Check PHP-FPM socket path matches Nginx config
- Check PHP-FPM error logs

✅ **Page shows 403 Forbidden?**
- Check file permissions: `ls -la /var/www/html/tftr/lgu-traffic-transport`
- Verify Nginx user can read files
- Check directory permissions (should be 755)

✅ **PHP files download instead of executing?**
- PHP-FPM not configured correctly
- Check Nginx `location ~ \.php$` block
- Verify PHP-FPM is running

✅ **404 errors?**
- Check `root` directive in Nginx config
- Verify `index` directive includes `index.php`
- Check if `try_files` directive is correct

### Log Locations

- **Nginx error log:** `/var/log/nginx/error.log`
- **Nginx access log:** `/var/log/nginx/access.log`
- **PHP-FPM error log:** `/var/log/php-fpm/error.log` or `/var/log/php8.x-fpm.log`
- **PHP error log:** Check `php.ini` for `error_log` directive, or check Hostinger hPanel

### SSL/HTTPS (Let's Encrypt)

If you need to set up SSL for `tftr.alertaraqc.com`:

1. Use Hostinger hPanel → **SSL** section
2. Or use Let's Encrypt via command line (if you have access)
3. Nginx will automatically serve HTTPS on port 443

### Performance Tips

- Nginx is already very efficient
- Make sure PHP-FPM pool settings are optimized
- Enable OPcache for PHP (usually enabled by default)
- Consider enabling gzip compression in Nginx (check if already enabled)

---

**Remember:** Most Nginx configuration is handled by Hostinger automatically. You typically only need to:
1. Deploy your files
2. Set correct permissions
3. Configure your database connection
4. Test your application
