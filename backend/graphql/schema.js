const {buildSchema} = require('graphql');

module.exports = buildSchema(`
   
   type User {
      _id: ID!
      email: String!
      password: String
   }
   
   type Friend {
      _id: ID!
      firstName: String!
      lastName: String!
      city: String!
      country: String!
      emails: [String]
      phoneNumbers: [String]
      timezone: Timezone
   }
   
   type Timezone {
      _id: ID!
      name: String!
      currentTime: String!
   }
   
   type AuthData {
      token: String!
      userId: String!
   }
   
   input UserInputData {
      email: String!
      password: String!
   }
   
   input FriendInputData {
      firstName: String!
      lastName: String!
      city: String!
      country: String!
      emails: [String]
      phoneNumbers: [String]
      timezone: String!
   }
   
   type RootQuery {
     login(email: String! password: String!): AuthData
     timezones: [Timezone]
   }

   type RootMutation {
      register(userInput: UserInputData): User!
      addFriend(friendInput: FriendInputData): Friend!
   }

   schema {
      query: RootQuery
      mutation: RootMutation
   }
`);