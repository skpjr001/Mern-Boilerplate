import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import ProtectedRoute from '../component/ProtectedRoute.js'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import About from './About'
import Dashboard from './Dashboard'
import Settings from './Settings'
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} exact></Route>
        <Route path="/login" component={Login} exact></Route>
        <Route path="/register" component={Register} exact></Route>
        <Route path="/about" component={About} exact></Route>
        <ProtectedRoute path="/dashboard" component={Dashboard} exact></ProtectedRoute>
        <ProtectedRoute path="/settings" component={Settings} exact></ProtectedRoute>
        <ProtectedRoute  component={Dashboard}></ProtectedRoute>
      </Switch>
    </Router>
  );
}

export default App;
