import ApolloClient from 'apollo-boost';
import queries from "./queries";
import mutations from './mutations'

const URI = process.env.REACT_APP_BACKEND_URI || "http://localhost:8080/graphql";

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
    mutation: mutations.addNewFriend, errorPolicy: "all", variables: {...friend}, fetchPolicy: "no-cache"
  }),

  deleteFriend: async _id => await getClient().mutate({
    mutation: mutations.deleteFriend, errorPolicy: "all", variables: {_id}, fetchPolicy: "no-cache"
  }),

  register: async (email, password) => await getClient().mutate({
    mutation: mutations.register, errorPolicy: "all", variables: {email, password}, fetchPolicy: "no-cache"
  }),

  login: async (email, password) => await getClient().query({
    query: queries.login, errorPolicy: "all", variables: {email, password}, fetchPolicy: "no-cache"
  }),

  isAuthenticated: async () => await getClient().query({
    query: queries.isAuthenticated, errorPolicy: "all", fetchPolicy: "no-cache",
  }),

  timezones: async () => await getClient().query({
    query: queries.timezones, errorPolicy: "all"
  }),

  cityTimezone: async (city, country) => await getClient().query({
    query: queries.cityTimezone, errorPolicy: "all", variables: {city, country}
  }),

  friendsLocations: async () => await getClient().query({
    query: queries.friendsLocations, errorPolicy: "all", fetchPolicy: "no-cache"
  }),

  friends: async query => await getClient().query({
    query: queries.friends, errorPolicy: "all", variables: {...query}, fetchPolicy: "no-cache"
  }),

  friend: async _id => await getClient().query({
    query: queries.friend, errorPolicy: "all", variables: {_id}, fetchPolicy: "no-cache"
  })
}