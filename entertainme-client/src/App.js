import React from 'react';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from '@apollo/react-hooks';
import {BrowserRouter as Router,
        Switch,
        Route
} from 'react-router-dom';
import Home from './views/Home';
import Navbar from './views/Navbar';
import EditForm from './views/EditForm';
import AddForm from './views/AddForm';

const client = new ApolloClient({
  uri: 'http://localhost:4000'
})

function App() {
  return (
    <Router>
    <ApolloProvider client={client}>
      <Navbar></Navbar>
        <Switch>
          <Route path="/:category/add">
            <AddForm></AddForm>
          </Route>
          <Route path="/:category/:id">
            <EditForm></EditForm>
          </Route>
          <Route path="/:category">
            <Home></Home>
          </Route>
          <Route path="/">
            <Home></Home>
          </Route>
        </Switch>
    </ApolloProvider>
    </Router>
  );
}

export default App;
