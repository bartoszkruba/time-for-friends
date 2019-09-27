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

  cityTimezone: gql`
      query cityTimezone($city: String!, $country: String!){
          cityTimezone(city: $city, country: $country)
      }
  `,
  friend: gql`
      query friend($_id: ID!){
          friend(_id: $_id) {
              _id
              firstName
              lastName
              city
              country
              timezone {
                  name
              }
              emails
              phoneNumbers
              workMarks {
                  from
                  to
              }
              sleepMarks {
                  from
                  to
              }
          }
      }
  `,
  friendsLocations: gql`
      query friendsLocations{
          allFriends {
              _id
              firstName
              lastName
              lat
              lng
          }
      }
  `,
  friends: gql`
      query friends($firstName: String!, $lastName: String!, $sort: String!, $from: String, $to: String, $page: Int!){
          friends(friendQuery: {
              firstName: $firstName, lastName: $lastName, sort: $sort, from: $from, to: $to, page: $page}) {
              friends{
                  _id
                  firstName
                  lastName
                  city
                  country
                  timezone {
                      name
                  }
                  workMarks {
                      from
                      to
                  }
                  sleepMarks {
                      from
                      to
                  }
              }
              count
          }
      }
  `
}