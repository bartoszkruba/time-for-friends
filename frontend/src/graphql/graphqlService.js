import ApolloClient, {gql} from 'apollo-boost';

const URI = "http://localhost:8080/graphql";

export default {

  addNewFriend: async (friend) => {
    const client = new ApolloClient({
      uri: URI,
      request: async operation => {
        const token = localStorage.getItem('token');
        operation.setContext({
          headers: {
            authorization: token ? `Bearer ${token}` : ''
          }
        });
      }
    });

    return await client.mutate({
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
    });
  },

  register: async (email, password) => {
    const client = await new ApolloClient({uri: URI});

    return await client.mutate({
      mutation: gql`
          mutation {
              register(userInput: {email: "${email}", password: "${password}" }){
                  _id
                  email
              }
          }
      `,
      errorPolicy: "all"
    })
  },
  login: async (email, password) => {
    const client = await new ApolloClient({uri: URI});

    return await client.query({
      query: gql`
          query {
              login(email: "${email}", password: "${password}" ){
                  token
              }
          }
      `,
      errorPolicy: "all"
    })
  },

  isAuthenticated: async () => {
    const client = new ApolloClient({
      uri: URI,
      request: async operation => {
        const token = localStorage.getItem('token');
        operation.setContext({
          headers: {
            authorization: token ? `Bearer ${token}` : ''
          }
        });
      }
    });

    return await client.query({
      query: gql`
          query{
              isAuthenticated
          }
      `
    })
  },
  timezones: async () => {
    const client = await new ApolloClient({uri: URI});

    return await client.query({
      query: gql`
          query {
              timezones {
                  name
              }
          }
      `
    })
  },
  friends:
  async () => {
    const client = new ApolloClient({
      uri: URI,
      request: async operation => {
        const token = localStorage.getItem('token');
        operation.setContext({
          headers: {
            authorization: token ? `Bearer ${token}` : ''
          }
        });
      }
    });

    return await client.query({
      query: gql`
          query {
              friends {
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
    });
  }
}