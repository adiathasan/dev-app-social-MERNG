import React from "react";
import App from "./App";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  uri: "http://localhost:5000/",
});

export default () => {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};
