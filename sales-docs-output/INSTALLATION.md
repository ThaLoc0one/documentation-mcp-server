# Installation Guide

Complete installation instructions for **Advanced User Management API**.

## 📋 Prerequisites

Before installing, ensure you have:

- ✅ PHP 7.4 or higher
- ✅ MySQL 5.7+ or PostgreSQL 10+
- ✅ CodeIgniter 4 / Laravel 8+ / Symfony 5+
- ✅ Web server (Apache/Nginx)
- ✅ Composer (for dependency management)

## 🚀 Installation Steps

### Step 1: Extract Files

Extract the downloaded ZIP file to your web server directory:

```bash
unzip advanced-user-management-api.zip -d /var/www/html/
cd /var/www/html/advanced-user-management-api
```

### Step 2: Install Dependencies

Install required PHP packages using Composer:

```bash
composer install --no-dev
```

### Step 3: Configure Environment

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```ini
# Database Configuration
database.default.hostname = localhost
database.default.database = your_database
database.default.username = your_username
database.default.password = your_password
database.default.DBDriver = MySQLi

# Base URL
app.baseURL = 'http://yourdomain.com/'
```

### Step 4: Database Setup

Create your database and run migrations:

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE your_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run migrations
php spark migrate

# Seed data (optional)
php spark db:seed DatabaseSeeder
```

### Step 5: Set Permissions

Set appropriate file permissions:

```bash
# Make writable directories
chmod -R 777 writable/
```

### Step 6: Configure Web Server

#### Apache (.htaccess)

The included `.htaccess` file should work out of the box. Ensure `mod_rewrite` is enabled:

```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

#### Nginx

Add this to your Nginx configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html/advanced-user-management-api/public;

    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### Step 7: Verify Installation

Visit your domain in a web browser:

```
http://yourdomain.com/
```

You should see the application homepage.

## ✅ Post-Installation

After successful installation:

1. **Change Default Credentials** - Update any default admin passwords
2. **Configure Email** - Set up SMTP settings for email notifications
3. **Enable HTTPS** - Install SSL certificate for production use
4. **Backup Database** - Set up regular database backups
5. **Review Security** - Check file permissions and security settings

## 🔧 Troubleshooting

### Common Issues

**Issue:** "500 Internal Server Error"
- **Solution:** Check file permissions and .htaccess configuration

**Issue:** "Database connection failed"
- **Solution:** Verify database credentials in .env file

**Issue:** "Class not found"
- **Solution:** Run `composer dump-autoload`


### Need Help?

Contact support at support@yourcompany.com
