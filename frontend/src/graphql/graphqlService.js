import ApolloClient from 'apollo-boost';
import queries from "./queries";
import mutations from './mutations'

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
    mutation: mutations.addNewFriend, errorPolicy: "all", variables: {...friend}
  }),

  register: async (email, password) => await getClient().mutate({
    mutation: mutations.register, errorPolicy: "all", variables: {email, password}
  }),

  login: async (email, password) => await getClient().query({
    query: queries.login, errorPolicy: "all", variables: {email, password}
  }),

  isAuthenticated: async () => await getClient().query({
    query: queries.isAuthenticated, errorPolicy: "all"
  }),

  timezones: async () => await getClient().query({
    query: queries.timezones, errorPolicy: "all"
  }),

  friends: async query => await getClient().query({
    query: queries.friends, errorPolicy: "all", variables: {...query}
  })
}