import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Home } from "./routes";
import { StateProvider } from "./store.js";

function App() {
  return (
    <div className="app">
      <StateProvider>
        <Router>
          <Switch>
            <Route path="/" exact component={Home} />
          </Switch>
        </Router>
      </StateProvider>
    </div>
  );
}

export default App;
