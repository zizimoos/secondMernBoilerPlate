import React from "react";
import { Switch, Route } from "react-router-dom";
import HOME from "./home";
import About from "./about";
import Login from "./RegisterLogin";
import Register from "./RegisterLogin/register";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact component={HOME}></Route>
        <Route path="/about" component={About}></Route>
        <Route path="/login" component={Login}></Route>
        <Route path="/register" component={Register}></Route>
      </Switch>
    </div>
  );
}

export default App;
