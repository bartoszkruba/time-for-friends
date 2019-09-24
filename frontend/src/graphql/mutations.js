import {gql} from "apollo-boost";

export default {
  addNewFriend: gql`
      mutation addFriend($emails: [String], $phoneNumbers: [String], $firstName: String!, $lastName: String!,
          $city: String!, $country: String!, $timezone: String!, $worksFrom: Int, $worksTo: Int, $sleepsFrom: Int,
          $sleepsTo: Int){
          addFriend(friendInput: {firstName: $firstName, lastName: $lastName,city: $city,country: $country,
              timezone: $timezone, emails: $emails, phoneNumbers: $phoneNumbers,
              workMarks: {
                  from: $worksFrom,
                  to: $worksTo
              },
              sleepMarks: {
                  from: $sleepsFrom,
                  to: $sleepsTo
              }
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
          deleteFriend(_id: $_id)
      }
  `
}