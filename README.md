# passworder-server
Server side of passworder app

Base API url : **http://localhost:3000**

## Home
Route | Method | Description
---|----|---
`/` | GET | Show `Welcome to passworder server. For further information, please contact Us at nafies1` in a JSON format

----	
  Home route for test server status. It's return message `Welcome to passworder server. For further information, please contact Us at nafies1`

* **URL**	

  /

* **Method:**	

  `GET`	

* **Success Response:**	

  * **Code:** 200 <br />	
  *  **Content :** `Welcome to passworder server. For further information, please contact Us at nafies1`

--------------


## **User** :

Route | Method | Description
---|---|---
`/auth/register` | POST | Create a user
`/auth/login` | POST | Sign in a user 

**Register**	
----	
  Register User endpoints. 

* **URL**	

  /auth/register

* **Method:**	

  `POST`	

* **Body**	

  name : `string`  
  email : `string`    
  password : `string`

* **Success Response:**	

  * **Code:** 201 <br />	
  *  **Content :** 	
      ```json	
      {
        "msg": "Register success",
        "id": 99,
        "name": "nafies",
        "email": "nafies1@nafies.tech",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTgxNzMxMTIyfQ.Rmemzd4-SYiMcMcAPxB14QZXQWdgm-2d_M829gWc5sk"
      }
      ```	

* **Error Response:**	

  * **Code:** 500 <br />	
  *  **Content:** 
     ```json
      { "msg" : "Internal Server Error" }
     ```	

  OR	

  * **Code:** 400 <br />	
  *  **Content:** 
      ```json
      {
        "msg": "Email has been registered. Please login or register with another email",
      }
      ```	
  OR	

  * **Code:** 400 <br />	
  *  **Content:** 
      ```json
      {
        "msg": "email is not valid. please use a valid email"
      }
      ```	
--------------

**Login**	
----	
  Login User endpoints.	

* **URL**	

  /auth/login/	

* **Method:**	

  `POST`	

* **Data Params**	

  email : `string`    
  password : `string`

* **Success Response:**	

  * **Code:** 200 <br />	
  *  **Content :** 	
      ```json	
      {
        "msg": "Login success",
        "id": 2,
        "name": "Nafies",
        "email": "nafies1@nafies.tech",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTgxNzMwNjY5fQ.GkMi1N_llcF7QV7E2BGSOjNMqVpW42mE1hcyLigv9Ls"
      }
      ```	

* **Error Response:**	

  * **Code:** 500 <br />	
  *  **Content:** 
     ```json
      { "msg" : "Internal Server Error" }
     ```	

  OR	

  * **Code:** 400 <br />	
  *  **Content:** 
      ```json
        {
          "name": "invalid email/password",
          "msg": "Email / Password is wrong"
        }
      ```	
--------------

### Undefined Route :

Route | Method | Request(s) | Response(s) | Description
---|---|---|---|---
`/*` | any | any | **Error**<br>`404` <br>Route not found | Show result if route not found


