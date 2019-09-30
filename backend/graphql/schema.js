const {buildSchema} = require('graphql');

module.exports = buildSchema(`
   
   type User {
      _id: ID!
      email: String!
      password: String
   }
   
   type RangeMarks {
      from: Int!
      to: Int!
   }
   
   type Friend {
      _id: ID!
      firstName: String!
      lastName: String!
      city: String!
      country: String!
      lat: String!
      lng: String!
      emails: [String]
      phoneNumbers: [String]
      timezone: Timezone
      workMarks: RangeMarks
      sleepMarks: RangeMarks
   }
   
   type FriendList {
      friends: [Friend]!
      count: Int!
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
   
   input RangeInput {
      from: Int
      to: Int
   }
   
   input FriendInputData {
      firstName: String!
      lastName: String!
      city: String!
      country: String!
      emails: [String]
      phoneNumbers: [String]
      timezone: String!
      workMarks: RangeInput
      sleepMarks: RangeInput
   }
   
   input FriendQuery {
      firstName: String!
      lastName: String!
      sort: String!
      from: String
      to: String
      page: Int!
   }
   
   type RootQuery {
     login(email: String! password: String!): AuthData!
     timezones: [Timezone]!
     cityTimezone(city: String! country: String!): String!
     friends(friendQuery: FriendQuery): FriendList!
     allFriends: [Friend]!
     friend(_id: ID!): Friend!
     isAuthenticated: Boolean!
   }

   type RootMutation {
      register(userInput: UserInputData): User!
      addFriend(friendInput: FriendInputData): Friend!
      deleteFriend(_id: ID!): Boolean!
   }

   schema {
      query: RootQuery
      mutation: RootMutation
   }
`);