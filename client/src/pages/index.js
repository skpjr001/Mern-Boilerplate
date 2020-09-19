import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import About from './About'
import Dashboard from './Dashboard'
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} exact></Route>
        <Route path="/login" component={Login} exact></Route>
        <Route path="/register" component={Register} exact></Route>
        <Route path="/about" component={About} exact></Route>
        <Route path="/dashboard" component={Dashboard} exact></Route>
      </Switch>
    </Router>
  );
}

export default App;
