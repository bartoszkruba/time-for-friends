# Time For Friends
School project


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

### Environment Variables (On Linux):

Server port (default 8080):
  
`
PORT=YOUR_PORT node run start `

MongoDB URI (default mongodb://localhost/time_for_friends)  

`
MONGO_URI=YOUR_URI node run start
`

Geocode API key (server won't run without this variable)  
`
GEOCODE_API_KEY=YOU_API_KEY npm start
`



## Frontend

### Environment Variables (On Linux):  

Google Maps API 

`
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY npm start
`




