# Advanced User Management API

**Version:** 1.0.0
**Author:** Your Company
**Price:** $49
**Demo:** [View Live Demo](https://demo.example.com)

---

## 📋 Overview

A comprehensive, professional-grade user management system built with modern PHP frameworks. Features robust authentication, role-based access control, and a complete RESTful API. Perfect for integrating user management into your web applications.

## ✨ Key Features

- ✅ RESTful API with 28 endpoints
- ✅ JWT Authentication & Authorization
- ✅ Role-based Access Control (RBAC)
- ✅ Multi-framework support (CodeIgniter 3/4, Laravel, Symfony)
- ✅ OpenAPI 3.0 specification included
- ✅ Middleware-based security
- ✅ Comprehensive API documentation
- ✅ Code examples in PHP, JavaScript, Python
- ✅ Easy installation and configuration
- ✅ Professional support included

## 🚀 Quick Stats

| Metric | Value |
|--------|-------|
| API Endpoints | 28 |
| Security Schemes | 10 |
| Frameworks Supported | CodeIgniter 3, Laravel |
| PHP Classes | 3 |

## 📦 Requirements

- **PHP Version:** 7.4 or higher
- **Framework:** CodeIgniter 4 / Laravel 8+ / Symfony 5+
- **Database:** MySQL 5.7+ or PostgreSQL 10+
- **PHP Extensions:**
  - pdo
  - mbstring
  - openssl
  - curl
  - json
  - xml

## 📚 Documentation Structure

1. **[Installation Guide](INSTALLATION.md)** - Step-by-step setup instructions
2. **[API Reference](API_REFERENCE.md)** - Complete API endpoint documentation
3. **[Configuration Guide](CONFIGURATION.md)** - Configuration options and settings
4. **[Examples](EXAMPLES.md)** - Code examples and use cases
5. **[FAQ](FAQ.md)** - Frequently asked questions
6. **[Changelog](CHANGELOG.md)** - Version history and updates

## 🎯 Quick Start

```bash
# 1. Extract files
unzip advanced-user-management-api.zip

# 2. Install dependencies (if using Composer)
composer install

# 3. Configure your environment
cp .env.example .env
# Edit .env with your settings

# 4. Run migrations (if applicable)
php spark migrate  # CodeIgniter 4
# or
php artisan migrate  # Laravel
```

## 💬 Support

Need help? We're here for you!

- **Email:** support@yourcompany.com
- **Response Time:** Within 24 hours
- **Support Includes:** Installation help, bug fixes, feature questions

## 📄 License

This product is licensed for single-site use. See LICENSE.txt for full details.

## ⭐ Rate Us

If you enjoy using Advanced User Management API, please consider leaving a 5-star review!

---

© 2025 Your Company. All rights reserved.


---

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


---

# API Reference

Complete API documentation for **Advanced User Management API**.

## 🔗 Base URL

```
https://demo.example.com/api/v1```

## 🔒 Authentication

### auth

**Type:** Bearer Token (JWT)

Include the token in the Authorization header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### admin

**Type:** API Key
**Location:** header
**Header Name:** X-Admin

```http
X-Admin: YOUR_API_KEY
```

### verified

**Type:** API Key
**Location:** header
**Header Name:** X-Verified

```http
X-Verified: YOUR_API_KEY
```

### signed

**Type:** API Key
**Location:** header
**Header Name:** X-Signed

```http
X-Signed: YOUR_API_KEY
```

### isGranted

**Type:** API Key
**Location:** header
**Header Name:** X-IsGranted

```http
X-IsGranted: YOUR_API_KEY
```

### session

**Type:** API Key
**Location:** header
**Header Name:** X-Session

```http
X-Session: YOUR_API_KEY
```

### ip_whitelist

**Type:** API Key
**Location:** header
**Header Name:** X-Ip_whitelist

```http
X-Ip_whitelist: YOUR_API_KEY
```

### stripe

**Type:** API Key
**Location:** header
**Header Name:** X-Stripe

```http
X-Stripe: YOUR_API_KEY
```

### billing

**Type:** API Key
**Location:** header
**Header Name:** X-Billing

```http
X-Billing: YOUR_API_KEY
```

### subscription

**Type:** API Key
**Location:** header
**Header Name:** X-Subscription

```http
X-Subscription: YOUR_API_KEY
```

## 📋 Endpoints

### UserController

#### GET /user

UserController.index

Route: /user

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/user" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### GET /user/show/id

UserController.show

Route: /user/show/id

**Parameters:**

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| id | string | path | ✅ | - |

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/user/show/id" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### GET /user/create

UserController.create

Route: /user/create

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/user/create" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### POST /user/create

UserController.create

Route: /user/create

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X POST "https://demo.example.com/api/v1/user/create" \
  -H "Content-Type: application/json"
  -d '{"key": "value"}'
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

### Users

#### GET /users

Users.index

Route: /users

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/users" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

### ApiProductController

#### GET /apiproduct

ApiProductController.index

Route: /apiproduct

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/apiproduct" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### GET /apiproduct/show/id

ApiProductController.show

Route: /apiproduct/show/id

**Parameters:**

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| id | integer | path | ✅ | - |

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/apiproduct/show/id" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### POST /apiproduct/store/request

ApiProductController.store

Route: /apiproduct/store/request

**Parameters:**

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| request | string | path | ✅ | - |

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X POST "https://demo.example.com/api/v1/apiproduct/store/request" \
  -H "Content-Type: application/json"
  -d '{"key": "value"}'
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### PUT /apiproduct/update/request/id

ApiProductController.update

Route: /apiproduct/update/request/id

**Parameters:**

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| request | string | path | ✅ | - |
| id | integer | path | ✅ | - |

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X PUT "https://demo.example.com/api/v1/apiproduct/update/request/id" \
  -H "Content-Type: application/json"
  -d '{"key": "value"}'
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### DELETE /apiproduct/destroy/id

ApiProductController.destroy

Route: /apiproduct/destroy/id

**Parameters:**

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| id | integer | path | ✅ | - |

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X DELETE "https://demo.example.com/api/v1/apiproduct/destroy/id" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

### WebProductController

#### GET /webproduct

WebProductController.index

Route: /webproduct

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/webproduct" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### GET /webproduct/show/{id}

WebProductController.show

Route: /webproduct/show/{id}

**Parameters:**

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| id | integer | path | ✅ | - |

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/webproduct/show/{id}" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### GET /webproduct/create

WebProductController.create

Route: /webproduct/create

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/webproduct/create" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### POST /webproduct/create

WebProductController.create

Route: /webproduct/create

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X POST "https://demo.example.com/api/v1/webproduct/create" \
  -H "Content-Type: application/json"
  -d '{"key": "value"}'
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### GET /webproduct/store

WebProductController.store

Route: /webproduct/store

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/webproduct/store" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### POST /webproduct/store

WebProductController.store

Route: /webproduct/store

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X POST "https://demo.example.com/api/v1/webproduct/store" \
  -H "Content-Type: application/json"
  -d '{"key": "value"}'
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### GET /webproduct/edit/{id}

WebProductController.edit

Route: /webproduct/edit/{id}

**Parameters:**

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| id | integer | path | ✅ | - |

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/webproduct/edit/{id}" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### POST /webproduct/edit/{id}

WebProductController.edit

Route: /webproduct/edit/{id}

**Parameters:**

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| id | integer | path | ✅ | - |

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X POST "https://demo.example.com/api/v1/webproduct/edit/{id}" \
  -H "Content-Type: application/json"
  -d '{"key": "value"}'
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### PUT /webproduct/edit/{id}

WebProductController.edit

Route: /webproduct/edit/{id}

**Parameters:**

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| id | integer | path | ✅ | - |

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X PUT "https://demo.example.com/api/v1/webproduct/edit/{id}" \
  -H "Content-Type: application/json"
  -d '{"key": "value"}'
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### PATCH /webproduct/edit/{id}

WebProductController.edit

Route: /webproduct/edit/{id}

**Parameters:**

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| id | integer | path | ✅ | - |

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X PATCH "https://demo.example.com/api/v1/webproduct/edit/{id}" \
  -H "Content-Type: application/json"
  -d '{"key": "value"}'
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### GET /webproduct/update/{id}

WebProductController.update

Route: /webproduct/update/{id}

**Parameters:**

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| id | integer | path | ✅ | - |

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/webproduct/update/{id}" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### POST /webproduct/update/{id}

WebProductController.update

Route: /webproduct/update/{id}

**Parameters:**

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| id | integer | path | ✅ | - |

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X POST "https://demo.example.com/api/v1/webproduct/update/{id}" \
  -H "Content-Type: application/json"
  -d '{"key": "value"}'
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### PUT /webproduct/update/{id}

WebProductController.update

Route: /webproduct/update/{id}

**Parameters:**

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| id | integer | path | ✅ | - |

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X PUT "https://demo.example.com/api/v1/webproduct/update/{id}" \
  -H "Content-Type: application/json"
  -d '{"key": "value"}'
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### PATCH /webproduct/update/{id}

WebProductController.update

Route: /webproduct/update/{id}

**Parameters:**

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| id | integer | path | ✅ | - |

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X PATCH "https://demo.example.com/api/v1/webproduct/update/{id}" \
  -H "Content-Type: application/json"
  -d '{"key": "value"}'
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### DELETE /webproduct/destroy/{id}

WebProductController.destroy

Route: /webproduct/destroy/{id}

**Parameters:**

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| id | integer | path | ✅ | - |

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X DELETE "https://demo.example.com/api/v1/webproduct/destroy/{id}" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### POST /webproduct/destroy/{id}

WebProductController.destroy

Route: /webproduct/destroy/{id}

**Parameters:**

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| id | integer | path | ✅ | - |

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X POST "https://demo.example.com/api/v1/webproduct/destroy/{id}" \
  -H "Content-Type: application/json"
  -d '{"key": "value"}'
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

### AdminController

#### GET /admin

AdminController.index

Route: /admin

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/admin" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### GET /admin/users

AdminController.users

Route: /admin/users

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/admin/users" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### GET /admin/deleteall

AdminController.deleteAll

Route: /admin/deleteall

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/admin/deleteall" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

### ApiSecureController

#### GET /apisecure/info

ApiSecureController.info

Route: /apisecure/info

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/apisecure/info" \
  -H "X-IsGranted: YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### GET /apisecure/adminstats

ApiSecureController.adminStats

Route: /apisecure/adminstats

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/apisecure/adminstats" \
  -H "X-IsGranted: YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

### CISecureController

#### GET /cisecure

CISecureController.index

Route: /cisecure

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/cisecure" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### GET /cisecure/settings

CISecureController.settings

Route: /cisecure/settings

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/cisecure/settings" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

### CI3_Legacy_Controller

#### GET /ci3_legacy

CI3_Legacy_Controller.index

Route: /ci3_legacy

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/ci3_legacy" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### GET /ci3_legacy/admin

CI3_Legacy_Controller.admin

Route: /ci3_legacy/admin

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/ci3_legacy/admin" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

### MixedController

#### GET /mixed/profile

MixedController.profile

Route: /mixed/profile

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/mixed/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### GET /mixed/edit

MixedController.edit

Route: /mixed/edit

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/mixed/edit" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### POST /mixed/edit

MixedController.edit

Route: /mixed/edit

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X POST "https://demo.example.com/api/v1/mixed/edit" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
  -d '{"key": "value"}'
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### PUT /mixed/edit

MixedController.edit

Route: /mixed/edit

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X PUT "https://demo.example.com/api/v1/mixed/edit" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
  -d '{"key": "value"}'
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### PATCH /mixed/edit

MixedController.edit

Route: /mixed/edit

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X PATCH "https://demo.example.com/api/v1/mixed/edit" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
  -d '{"key": "value"}'
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

#### GET /mixed/billing

MixedController.billing

Route: /mixed/billing

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Successful response |
| 400 | Bad request |
| 401 | Unauthorized |
| 500 | Internal server error |

**Example Request:**

```bash
curl -X GET "https://demo.example.com/api/v1/mixed/billing" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Example Response:**

```json
{
  "status": "success",
  "data": {}
}
```

---

## 📊 Response Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |


---

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



---

# Code Examples

Practical examples for **Advanced User Management API**.

## 🔐 Authentication Examples

### Login Request

```javascript
// Using fetch API
const login = async (email, password) => {
  const response = await fetch('https://demo.example.com/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  return data.token; // Store this token for authenticated requests
};
```

### Using PHP cURL

```php
<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://demo.example.com/api/v1/auth/login");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'email' => 'user@example.com',
    'password' => 'password123'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$data = json_decode($response, true);
$token = $data['token'];
curl_close($ch);
?>
```

## 📋 API Request Examples

### UserController.index

#### JavaScript/TypeScript

```typescript
const getData = async () => {
  const response = await fetch('https://demo.example.com/api/v1/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN'
    }
  });
  
  return await response.json();
};
```

#### Python

```python
import requests

url = "https://demo.example.com/api/v1/user"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_TOKEN"
}

response = requests.get(url, headers=headers)
print(response.json())
```

### UserController.show

#### JavaScript/TypeScript

```typescript
const getData = async () => {
  const response = await fetch('https://demo.example.com/api/v1/user/show/id', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN'
    }
  });
  
  return await response.json();
};
```

#### Python

```python
import requests

url = "https://demo.example.com/api/v1/user/show/id"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_TOKEN"
}

response = requests.get(url, headers=headers)
print(response.json())
```

### UserController.create

#### JavaScript/TypeScript

```typescript
const getData = async () => {
  const response = await fetch('https://demo.example.com/api/v1/user/create', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN'
    }
  });
  
  return await response.json();
};
```

#### Python

```python
import requests

url = "https://demo.example.com/api/v1/user/create"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_TOKEN"
}

response = requests.get(url, headers=headers)
print(response.json())
```

### UserController.create

#### JavaScript/TypeScript

```typescript
const postData = async () => {
  const response = await fetch('https://demo.example.com/api/v1/user/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN'
    },
    body: JSON.stringify({
      // Your data here
    })
  });
  
  return await response.json();
};
```

#### Python

```python
import requests

url = "https://demo.example.com/api/v1/user/create"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_TOKEN"
}
data = {
    # Your data here
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

## 🔄 Error Handling

```javascript
const apiCall = async () => {
  try {
    const response = await fetch('https://demo.example.com/api/v1/endpoint');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('API call failed:', error);
    // Handle error appropriately
  }
};
```



---

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



---

# Changelog

All notable changes to **Advanced User Management API** will be documented here.

## [1.0.0] - 2025-12-11

### Added
- Initial release
- RESTful API with 28 endpoints
- JWT Authentication & Authorization
- Role-based Access Control (RBAC)
- Multi-framework support (CodeIgniter 3/4, Laravel, Symfony)
- OpenAPI 3.0 specification included
- Middleware-based security
- Comprehensive API documentation
- Code examples in PHP, JavaScript, Python
- Easy installation and configuration
- Professional support included

### Security
- JWT authentication
- API rate limiting
- Input validation
- XSS protection
- CSRF protection

---

## How to Read This Changelog

- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Features that will be removed
- **Removed** - Features that were removed
- **Fixed** - Bug fixes
- **Security** - Security improvements
