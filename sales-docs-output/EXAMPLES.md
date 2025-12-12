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

