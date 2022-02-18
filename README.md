# Http-api-node

E-commerce API 

# Installation

- Clone repository 
- run ```javascript npm install ``` To install all dependencies

You have to setup Postman to be able to test the API functionality

Routes available : 
- ```{{url}}/user``` Create User
- ```{{url}}/user/login``` Login user
- ```{{url}}/user/logout``` logout user
- ```{{url}}/user/me``` read user
- ```{{url}}/listing``` create listing
- ```{{url}}/listing/:id``` read listing
- ```{{url}}/listings``` read listings
- ```{{url}}/category``` get categories
- ```{{url}}/mylistings``` my listings
- ```{{url}}/category/:id``` get listings from category
- ```{{url}}/listing/:id```edit listing
- ```{{url}}/listing/:id``` delete listing
- ```{{url}}/listing/:id/:reply``` reply listing
- ```{{url}}/listing/:id/:replies``` get replies
- ```{{url}}/user/pm``` send pm
- ```{{url}}/user/messages``` load inbox
- ```{{url}}/category/:id``` delete category

Setting global authentication in Postman:

Collection settings, set type to "Bearer" and give the valiable a name, here ```{{authToken}}```
In the login and sign up requests, add 
```javascript 
if(pm.response.code === 200){
    pm.environment.set('authToken', pm.response.json().token)
}
```

Set all the other routes authentication to inherit from parents
