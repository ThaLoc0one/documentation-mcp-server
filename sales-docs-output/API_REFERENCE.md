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
