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

export default {

  addNewFriend: async friend => await getClient().mutate({
    mutation: gql`
        mutation addFriend($emails: [String], $phoneNumbers: [String]){
            addFriend(friendInput: {
                firstName: "${friend.firstName}",
                lastName: "${friend.lastName}",
                city: "${friend.city}",
                country: "${friend.country}",
                timezone: "${friend.timezone}",
                emails: $emails,
                phoneNumbers: $phoneNumbers
            }){
                firstName
            }
        }
    `, variables: {
      emails: friend.emails,
      phoneNumbers: friend.phoneNumbers
    }
  }),

  register: async (email, password) => await getClient().mutate({
    mutation: gql`
        mutation {
            register(userInput: {email: "${email}", password: "${password}" }){
                _id
                email
            }
        }
    `,
    errorPolicy: "all"
  }),

  login: async (email, password) => await getClient().query({
    query: gql`
        query {
            login(email: "${email}", password: "${password}" ){
                token
            }
        }
    `,
    errorPolicy: "all"
  }),

  isAuthenticated: async () => await getClient().query({
    query: gql`
        query{
            isAuthenticated
        }
    `
  }),

  timezones: async () => await getClient().query({
    query: gql`
        query {
            timezones {
                name
            }
        }
    `
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