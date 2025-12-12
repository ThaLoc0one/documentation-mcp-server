# Configuration Guide

Complete configuration options for **Advanced User Management API**.

## 🔧 Environment Configuration

All configuration is done through the `.env` file.

### Application Settings

```ini
# Application Name
APP_NAME="Advanced User Management API"

# Environment (development, production)
APP_ENV=production

# Debug Mode (true for development, false for production)
APP_DEBUG=false

# Application URL
APP_URL=http://yourdomain.com
```

### Database Configuration

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Security Settings

```ini
# JWT Secret Key (generate with: openssl rand -base64 32)
JWT_SECRET=your_secret_key_here

# JWT Expiration (in minutes)
JWT_EXPIRATION=60

# API Rate Limiting (requests per minute)
API_RATE_LIMIT=60
```

### Email Configuration

```ini
MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="Advanced User Management API"
```

### Cache Configuration

```ini
CACHE_DRIVER=file  # Options: file, redis, memcached
CACHE_TTL=3600     # Cache time-to-live in seconds
```

## 🔒 Security Best Practices

1. **Change Default Secrets** - Generate new JWT secrets and encryption keys
2. **Use HTTPS** - Always use SSL in production
3. **Restrict File Permissions** - Set proper permissions on sensitive files
4. **Enable Rate Limiting** - Protect against API abuse
5. **Regular Updates** - Keep dependencies up to date
6. **Backup Database** - Set up automated backups

## 🚀 Performance Optimization

### Enable Caching

```bash
# Clear cache
php artisan cache:clear

# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache
```

### Database Optimization

- Add indexes to frequently queried columns
- Use database query caching
- Optimize your database tables regularly

### Enable OPcache

Add to your `php.ini`:

```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
opcache.revalidate_freq=60
```

