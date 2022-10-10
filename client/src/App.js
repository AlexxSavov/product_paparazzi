import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";

import Header from "./components/Header";
import Footer from "./components/Footer";


import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Incentives from "./pages/Incentives";
import UploadCandid from './pages/UploadCandid';
import ProtectedRoute from "./components/ProtectedRoute";


// const httpLink = createHttpLink({
//   uri:
//     process.env.NODE_ENV === "development"
//       ? "http://localhost:3001/graphql"
//       : "/graphql",
// });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
// });

const client = new ApolloClient({
  link: authLink.concat(
      createUploadLink({
          headers: { "Apollo-Require-Preflight": "true" },
          uri:
              process.env.NODE_ENV === "development"
                  ? "http://localhost:3001/graphql"
                  : "/graphql",
      })
  ),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            <Routes>
              <Route 
                path="/" 
                element={<Home />} 
              />
              <Route 
                path="/login" 
                element={<Login />} 
              />
              <Route 
                path="/signup" 
                element={<Signup />} 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/incentives" 
                element={ 
                  <ProtectedRoute>
                    <Incentives />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/upload-candid" 
                element={
                  <ProtectedRoute>
                    <UploadCandid />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="*" 
                element={<NoMatch />} 
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
