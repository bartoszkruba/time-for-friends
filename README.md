# Time For Friends
School project

"Time For Friends" is a web application that allows you to track your friends local time live.

#### Tech stack:  
- MongoDB 
- Node.js
- Express.js 
- GraphQL 
- React.js


## Backend

### Running backend

Cleanup database and generate test data:  
`
npm run init`

Start server in development setup (with nodemon):
  
`
npm run dev`  

Start server in production setup (without nodemon):
  
`
npm run start`

### Environment Variables (Terminal command for Linux machine):

Server port (default 8080):
  
`
PORT=YOUR_PORT node run start `

MongoDB URI (default mongodb://localhost/time_for_friends)  

`
MONGO_URI=YOUR_URI node run start
`

### Dockerizing backend:
To create docker image for backend app run following commands:
```
cd backend
docker build -t <your tag> .
```

Then you can run your image with following command:

```
docker run -e MONGO_URI=<your database URI> -p 8080:8080 -d <your tag>
```

You can link created container with existing mongodb container on your machine:
```
docker run --link <your mongodb container>:mongodb -e MONGO_URI='mongodb://mongodb/time_for_friends' -p 8080:8080 -d <your_tag>
```


## Frontend

### Environment Variables (Terminal commands for Linux machine):  

Backend URI (default http://localhost:8080/graphql)  

`
REACT_APP_BACKEND_URI=YOUR_URI npm start`


Google Maps API 

`
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY npm start
`

You can also link created container to existing mongodbconatainer 

#### Pushing image to dockerhub:
Login to your dockerhub account:
```
docker login
```
Tag your image:
```
docker tag <image id> <repository name>:latest
```
Push image to dockerhub:
```
docker push <repository name>
```




