import {gql} from "apollo-boost";

export default {
  addNewFriend: gql`
      mutation addFriend($emails: [String], $phoneNumbers: [String], $firstName: String!, $lastName: String!,
          $city: String!, $country: String!, $timezone: String!){
          addFriend(friendInput: {firstName: $firstName, lastName: $lastName,city: $city,country: $country,
              timezone: $timezone, emails: $emails,phoneNumbers: $phoneNumbers
          }){
              firstName
          }
      }
  `,
  register: gql`
      mutation register($email: String!, $password: String! ){
          register(userInput: {email: $email, password: $password }){
              _id
              email
          }
      }
  `,
  deleteFriend: gql`
      mutation deleteFriend($_id: ID!) {
          deleteFriend(id: $_id)
      }
  `
}