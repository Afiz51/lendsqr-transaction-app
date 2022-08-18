# TRANSACTION APP WITH mySQL


## TECHNOLOGIES: 

 - Nodejs 16.16.0: Runtime environment for javascript

 - mySQL: A relational database fro development

 - javaScript: A programming language for for development
 
 - Express: A framework usedto develop APIs
 
 - Knexjs: An ORM used to perform CRUD operations with an SQL Database
 
 
 ## Description
 
 ## Getting Started
  1. After cloning the project, run the command npm install to install all
  the packages.
  
  2. MySQL workbench or any other GUI desktop app that can help with interaction with the database
  
  3. Check the sample.env file and fill out the keys with your details
  
  4. create a database to connect to on mySQL workbench
  
  5. To run the app, cd into src and run node index.js 

  
  ## Routes that can be run
   
   ### Login Route: Using postman, send a POST request to the route below
   
   #### localhost:5000/api/auth/login
   
       { 
       "email": "string",
       "password": "string"
       } 
       
       a jwt token will be generated for you to be able to perform certain transactions.
       
  ### Create Account:  To create an account, send a POST request to the route below  with postman
  #### localhost:5000/api/users/create
  
      {
      "name": string,
      "email": string,
      "password": string
      }
       
  ### Fund Account: 
  #### Send a Post request with the data below to this route
  ##### localhost:7000/api/users/fund-account
     
      {
      "accountNumber": string,
      "amount": number
      }
      
      This funds the account you type in
      
  ### Transfer: Send a Post route to the route below to transfer from your account to another person's. 
      Note that for this route to work, you need to put the token you get from login in.
      
      Attach a key value pair that looks like this:
        x-auth-token:  your token
        
      to the headers section in the request
      
      {
      "senderAccount": "89146451956",
      "recieverAccount": "71928636208",
      "amount": 2000
      }
      
      
      This will allow the transaction be successful
      
      
  ### Widthraw: Send a post request to this route
  ####  localhost:7000/api/users/withdraw 
       to be able to withdraw. You need to send in a jwt token from your login to be able to widthraw
      your money.
       {
       "accountNumber": string,
       "amount": number
       }
      
     
     
        
  



