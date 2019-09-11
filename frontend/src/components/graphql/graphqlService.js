import ApolloClient, {gql} from 'apollo-boost';

export default {
  register: async (email, password) => {
    const client = await new ApolloClient({
      uri: "http://localhost:8080/graphql"
    });

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

  }
}