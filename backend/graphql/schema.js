const {buildSchema} = require('graphql');

module.exports = buildSchema(`
   
   type User {
      _id: ID!
      email: String!
      password: String
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
   
   type RootQuery {
     login(email: String! password: String!): AuthData
     timezones: [Timezone]
   }

   type RootMutation {
      register(userInput: UserInputData): User!
   }

   schema {
      query: RootQuery
      mutation: RootMutation
   }
`);