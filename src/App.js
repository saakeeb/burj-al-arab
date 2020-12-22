import React, { createContext, useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Book from './components/Book/Book';
import Header from './components/Header/Header';
import firebase from "firebase/app";
import "firebase/analytics";
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Register from './components/Login/Register';


firebase.analytics();
firebase.analytics().logEvent('notification_received');
export const UserContext = createContext();

function App() {
  const [loggedInUser, setLoggedInUser] = useState({});
  return (
    <UserContext.Provider value= {[loggedInUser, setLoggedInUser]}>
      <p>Name: {loggedInUser.name}</p>
      <p>Email: {loggedInUser.email}</p>
      <Router>
          <Header/>
          <Switch>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <PrivateRoute path="/book">
              <Book />
            </PrivateRoute>
            <PrivateRoute path="/book/:bedType">
              <Book />
            </PrivateRoute>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="*">
              <p style={{textAlign:'center', color:'red'}}>Nothing Found 404! Error</p>
            </Route>
          </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
