## Simple MockAPI

## Usage
### Starting http-server locally

     npm start
          
or (with 'forever' module)
          
     npm run start:forever

## Changes
1) Added simple GET requests such as - 

GET http://localhost:3333/api/1.2.0/posts - return all posts data

GET http://localhost:3333/api/1.2.0/posts/001 - return one post data

GET http://localhost:3333/api/1.2.0/users - return all users data

GET http://localhost:3333/api/1.2.0/users/001 - return one user data

2) Added simple DELETE request such as - 

DELETE http://localhost:3333/api/1.2.0/posts/001 - remove folder /001 into posts folder and all files into it

DELETE http://localhost:3333/api/1.2.0/users/001 - remove folder /001 into users folder and all files into it

3) Added simple POST request such as - 

POST http://localhost:3333/api/1.2.0/posts - added folder /003 (if it's not exist) and file get.json into it

4) Added PUT and POST request to update data such as - 

PUT http://localhost:3333/api/1.2.0/posts/001 - replace data into file (if file and/or folder exists) 