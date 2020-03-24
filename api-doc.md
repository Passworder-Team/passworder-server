# passworder-server

List of available endpoints:

**Auth**

- `POST /auth/register`
- `POST /auth/login`

**Password**

- `GET /passwords`
- `GET /passwords/:id`
- `GET /passwords/link/:account`
- `POST /passwords`
- `PUT /passwords/:id`
- `DELETE /passwords/:id`

**OTP**

- `GET /otp/:passId`
- `POST /otp`

Error response format:

Status: `4xx` or `5xx`

```json
{
  "errors": ["...", "..."]
}
```

or

```json
{
  "msg": "..."
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
      "user": {
        "id": "...",
        "name": "...",
        "email": "...",
        "phoneNumber": "..."
      },
      "token": "..."
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
      "user": {
        "id": "...",
        "name": "...",
        "email": "...",
        "phoneNumber": "..."
      },
      "token": "..."
    }
    ```

## Passwords

### GET /passwords

- Request Header(s):
  - `token`: `<token>`  
    _replace `<token>` with your actual token from `POST /auth/login` response_
- Response:
  - `status`: `200`
  - `body`:
    ```json
    [
      {
        "id": "...",
        "account": "...",
        "email": "...",
        "UserId": "..."
      }
    ]
    ```

### GET /passwords/:id

- Request Header(s):
  - `token`: `<token>`  
    _replace `<token>` with your actual token from `POST /auth/login` response_
- Request Param(s):..
  - `id`: `String`
- Response:
  - `status`: `200`
  - `body`:
    ```json
    {
      "id": "...",
      "account": "...",
      "email": "...",
      "password": "encrypted password",
      "UserId": "..."
    }
    ```

### GET /passwords/link/:account

- Request Header(s):
  - `token`: `<token>`  
    _replace `<token>` with your actual token from `POST /auth/login` response_
- Request Param(s):..
  - `account`: `String`
- Response:
  - `status`: `200`
  - `body`:
    ```json
    {
      "id": "...",
      "account": "...",
      "email": "...",
      "password": "....",
      "UserId": "..."
    }
    ```

### POST /passwords

- Request Header(s):
  - `token`: `<token>`  
    _replace `<token>` with your actual token from `POST /auth/login` response_
  - `Content-Type`: `application/x-www-form-urlencoded` or `application/json`
- Request Body:
  - `account`: `String (required)`
  - `email`: `String (required)`
  - `password`: `String (required)`
- Response:
  - `status`: `201`
  - `body`:
    ```json
    {
      "data": {
        "id": "...",
        "account": "...",
        "email": "...",
        "UserId": "..."
      },
      "msg": "Succesfully input new password"
    }
    ```

### PUT /passwords/:id

- Request Header(s):
  - `token`: `<token>`  
    _replace `<token>` with your actual token from `POST /auth/login` response_
  - `Content-Type`: `application/x-www-form-urlencoded` or `application/json`
- Request Body:
  - `account`: `String (required)`
  - `email`: `String (required)`
  - `password`: `String (required)`
- Response:
  - `status`: `200`
  - `body`:
    ```json
    {
      "msg": "Update password success"
    }
    ```

### DELETE /passwords/:id

- Request Header(s):
  - `token`: `<token>`  
    _replace `<token>` with your actual token from `POST /auth/login` response_
- Request Param(s):
  - `id`: `String`
- Response:
  - `status`: `200`
  - `body`:
    ```json
    {
      "msg": "Delete password success"
    }
    ```

## OTP

### GET /otp/:passId

- Request Header(s):
  - `token`: `<token>`  
    _replace `<token>` with your actual token from `POST /auth/login` response_
- Request Param(s):
  - `passId`: `String`  
    _Password Id from `GET /passwords/:id` response_
- Response:
  - `status`: `200`
  - `body`:
    ```json
    {
      "msg": "Send OTP success. Please check Your phone and input otp number.",
      "result": "MessageID is ..."
    }
    ```

### POST /otp

- Request Header(s):
  - `token`: `<token>`  
    _replace `<token>` with your actual token from `POST /auth/login` response_
  - `Content-Type`: `application/x-www-form-urlencoded` or `application/json`
- Request Body:
  - `otp`: `String (required)`
  - `passId`: `String (required)`
- Response:
  - `status`: `200`
  - `body`:
    ```json
    {
      "msg": "success, Otp matched",
      "secret": "..."
    }
    ```
