import {gql} from "apollo-boost";

export default {
  login: gql`
      query login($email: String!, $password: String!){
          login(email: $email, password: $password ){
              token
          }
      }
  `,
  isAuthenticated: gql`
      query{
          isAuthenticated
      }
  `,
  timezones: gql`
      query {
          timezones {
              name
          }
      }
  `,
  friends: gql`
      query friends($firstName: String!, $lastName: String!, $sort: String!, $from: String, $to: String){
          friends(friendQuery: {
              firstName: $firstName, lastName: $lastName, sort: $sort, from: $from, to: $to}) {
              friends{
                  _id
                  firstName
                  lastName
                  city
                  country
                  timezone {
                      name
                  }
              }
              count
          }
      }
  `
}