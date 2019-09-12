import ApolloClient, {gql} from 'apollo-boost';

const URI = "http://localhost:8080/graphql";

export default {
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
  }
}