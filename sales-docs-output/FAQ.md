# Frequently Asked Questions

Common questions about **Advanced User Management API**.

## 📦 General Questions

### What PHP version is required?

Advanced User Management API requires PHP 7.4 or higher.

### Can I use this on multiple domains?

The regular license allows usage on a single domain. For multiple domains, please purchase additional licenses.

### Is the source code included?

Yes! Full source code is included with your purchase.

### Do you provide updates?

Yes, all updates are free for 6 months. Extended support is available.

## 🔧 Technical Questions

### How do I enable HTTPS?

1. Install an SSL certificate (Let's Encrypt is free)
2. Update your `.env` file to use `https://` URLs
3. Configure your web server to redirect HTTP to HTTPS

### How do I change the database?

Edit the database credentials in your `.env` file:

```ini
DB_HOST=your_host
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### How do I reset my admin password?

Use the password reset feature or run the password reset command:

```bash
php artisan user:reset-password admin@example.com
```

### Can I customize the design?

Absolutely! All views and templates are fully customizable. Edit the files in the `views/` or `resources/views/` directory.

## 🐛 Troubleshooting

### "500 Internal Server Error"

**Common causes:**
- Incorrect file permissions
- Missing .htaccess file
- PHP version too old

**Solutions:**
- Check error logs: `tail -f storage/logs/laravel.log`
- Verify file permissions: `chmod -R 775 storage`
- Enable display_errors in development

### "Database connection failed"

**Solutions:**
- Verify database credentials in `.env`
- Ensure database server is running
- Check if database user has proper permissions

### "Class not found" errors

**Solution:**
```bash
composer dump-autoload
```

## 💬 Support

### How do I get support?

Email us at support@yourcompany.com with:
- Detailed description of the issue
- Error messages (if any)
- Steps to reproduce
- Your purchase code

### What's your support response time?

We typically respond within 24 hours on business days.

### Is customization service available?

Yes! We offer custom development services. Contact us for a quote.

