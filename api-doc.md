# passworder-server

List of available endpoints:
- `POST /auth/register`
- `POST /auth/login`

Manage logged in user data:
- `GET /passwords`
- `GET /passwords/:id`
- `POST /passwords`
- `DELETE /passwords/:id`

Error response format:

Status: `4xx` or `5xx`  

```json
{
  "errors": [
    "...",
    "..."
  ]
}
```

## Users

### POST /auth/register

- Request Header(s):
  - `Content-Type`: `application/x-www-form-urlencoded` or `application/json`
- Request Body:
  - `name`: `String (required, min length: 3 )`
  - `email`: `String (required, unique)`
  - `password`: `String (required, min length: 6)`
- Response:
  - `status`: `201`
  - `body`:
    ```json
    {
      "msg": "Register success",
      "id": "...",
      "name": "...",
      "email": "...",
      "token": "...",
    }
    ```

### POST /auth/login

- Request Header(s):
  - `Content-Type`: `application/x-www-form-urlencoded` or `application/json`
- Request Body:
  - `email`: `String (unique)`
  - `password`: `String`
- Response:
  - `status`: `200`
  - `body`:
    ```json
    {
      "msg": "Login success",
      "id": "...",
      "name": "...",
      "email": "...",
      "token": "..."
    }
    ```

## Passwords

### GET /passwords

- Request Header(s):
  - `access_token`: `<token>`  
    *replace `<token>` with your actual token from `POST /auth/login` response*
- Response:
  - `status`: `200`
  - `body`:
    ```json
    [
      {
        "_id": "...",
        "account": "...",
        "username": "...",
        "password": "...",
      }
    ]
    ```

### GET /passwords/:id

- Request Header(s):
  - `access_token`: `<token>`  
    *replace `<token>` with your actual token from `POST /auth/login` response*
- Request Param(s):..
  - `id`: `String`
- Response:
  - `status`: `200`
  - `body`:
    ```json
    {
      "_id": "...",
      "account": "...",
      "username": "...",
      "password": "...",
    }
    ```

### POST /passwords

- Request Header(s):
  - `access_token`: `<token>`  
    *replace `<token>` with your actual token from `POST /auth/login` response*
  - `Content-Type`: `application/x-www-form-urlencoded` or `application/json`
- Request Body:
  - `account`: `String (required)`
  - `username`: `String (required)`
  - `password`: `String (required)`
- Response:
  - `status`: `201`
  - `body`:
    ```json
    {
      "_id": "...",
      "account": "...",
      "username": "...",
      "password": "...",
    }
    ```

### DELETE /passwords/:id

- Request Header(s):
  - `access_token`: `<token>`  
    *replace `<token>` with your actual token from `POST /auth/login` response*
- Request Param(s):
  - `id`: `String`
- Response:
  - `status`: `200`
  - `body`:
    ```json
    {
      "_id": "...",
      "account": "...",
      "username": "...",
      "password": "...",
    }
    ```