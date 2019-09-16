import ApolloClient, {gql} from 'apollo-boost';

const URI = "http://localhost:8080/graphql";

let client;

const getClient = () => {
  if (!client) {
    client = new ApolloClient({
      uri: URI, request: async operation => {
        const token = localStorage.getItem('token');
        operation.setContext({headers: {authorization: token ? `Bearer ${token}` : ''}});
      }
    });
  }
  return client;
};

const mutations = {
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
  `
};

const queries = {
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
  `
};


export default {
  addNewFriend: async friend => await getClient().mutate({
    mutation: mutations.addNewFriend, errorPolicy: "all", variables: {...friend}
  }),

  register: async (email, password) => await getClient().mutate({
    mutation: mutations.register, errorPolicy: "all", variables: {email, password}
  }),

  login: async (email, password) => await getClient().query({
    query: queries.login, errorPolicy: "all", variables: {email, password}
  }),

  isAuthenticated: async () => await getClient().query({
    query: queries.isAuthenticated
  }),

  timezones: async () => await getClient().query({
    query: queries.timezones
  }),

  friends: async query => await getClient().query({
    query: gql`
        query {
            friends(friendQuery: {
                firstName: "${query.firstName}",
                lastName: "${query.lastName}",
                sort: "${query.sort}"
            ${(query.from && query.to) ? `, from: "${query.from}", to: "${query.to}"`: ''}
            }) {
                _id
                firstName
                lastName
                city
                country
                timezone {
                    name
                }
            }
        }
    `
  })
}