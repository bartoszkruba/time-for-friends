# Time For Friends

"Time For Friends" is a web application that allows you to track your friends local time live.

#### Tech stack:  
- MongoDB 
- Node.js
- Express.js 
- GraphQL 
- React.js


## Backend

Docker image for backend application can be found on [DockerHub](https://cloud.docker.com/u/nawajo/repository/docker/nawajo/time_for_friends)

### Running backend:

Cleanup database and generate test data:  
```
npm run init
```

Start server in development setup (with nodemon):
  
```
npm run dev
```

Start server in production setup (without nodemon):
  
```
npm run start
```

Run through docker (from existing dockerimage on DockerHub):

```
docker run -e INIT_DATA=true -e MONGO_URI=<your databse uri> -p 8080:<your choosen port> -d nawajo/time_for_friends
```

### Environment Variables (Terminal commands for Linux machine):

Server port (default 8080):
  
```
PORT=<your port> npm run start 
```

MongoDB URI (default mongodb://localhost/time_for_friends)  

```
MONGO_URI=<your uri> npm run start
```

Data initialization - should 'init-data' script run at server start (default false)  
```
INIT_DATA=true npm run dev
```

### Dockerizing backend:
To create docker image for backend run following commands:
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


## Frontend

### Running frontend:

Start development server:  
```
npm start
```

Build application for production:  
```
npm run build
```

### Environment Variables (Terminal commands for Linux machine):  

Backend URI (default http://localhost:8080/graphql)  

```
REACT_APP_BACKEND_URI=<your backend uri> npm start
```


Google Maps API (map will not work without this variable)

```
REACT_APP_GOOGLE_MAPS_API_KEY=<your api key> npm start
```

### Dockerizing frontend:

Navigate to frontend folder

```
cd frontend
```

Edit *Dockerfile* and add ENV variables for backend URI and Gogle Maps API Key

To create Docker image run:
```
docker build -t <your tag> .
```
Then you can run your container with following command:
```
docker run -p 80:80 -d <your tag>
```

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




