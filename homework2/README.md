## Simple MockAPI

## Usage
### Starting http-server locally

     npm start
          
or (with 'forever' module)
          
     npm start:forever

## Changes
1) Added simple GET requests such us - 

GET http://localhost:3333/api/1.2.0/posts - respond all posts data

GET http://localhost:3333/api/1.2.0/posts/001 - respond one post data

GET http://localhost:3333/api/1.2.0/users - respond all users data

GET http://localhost:3333/api/1.2.0/users/001 - respond one user data

2) Added simple DELETE request such us - 

DELETE http://localhost:3333/api/1.2.0/posts/001 - remove folder /001 into posts folder and all files into it

DELETE http://localhost:3333/api/1.2.0/users/001 - remove folder /001 into users folder and all files into it

3) Added simple POST request such us - 

POST http://localhost:3333/api/1.2.0/posts/003 - added folder /003 (if it's not exist) and file get.json into it