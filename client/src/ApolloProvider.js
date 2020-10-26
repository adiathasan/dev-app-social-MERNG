import React from "react";
import App from "./App";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { useSelector, useDispatch } from "react-redux";
import { DISMISS, HANDLE_ERROR } from "./store";

export default function Apollo() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const client = new ApolloClient({
    uri: "http://localhost:5000/",
    headers: {
      Authorization: user ? `Bearer ${user.token}` : "",
    },
    onError: ({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, location, path }) => {
          console.log(
            `[GraphQL Error]: Message: ${message}  Path: ${path}  Location: ${location}`
          );
        });
      }
      if (networkError) {
        dispatch({ type: HANDLE_ERROR, payload: networkError.message });
        setTimeout(() => {
          dispatch({ type: DISMISS });
        }, 5000);
        console.log(`network error: ${networkError.message}`);
      }
    },
  });

  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}
