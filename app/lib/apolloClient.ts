import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3006/graphql',
  cache: new InMemoryCache(),
});

export default client;