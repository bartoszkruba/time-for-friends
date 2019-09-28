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


## Frontend

### Environment Variables (Terminal commands for Linux machine):  

Backend URI (default http://localhost:8080/graphql)  

`
REACT_APP_BACKEND_URI=YOUR_URI npm start`



Google Maps API 

`
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY npm start
`




