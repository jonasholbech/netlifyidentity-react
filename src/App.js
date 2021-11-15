import "./App.css";
import { useEffect, useState } from "react";
import netlifyIdentity from "netlify-identity-widget";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  useEffect(() => {
    async function setup() {
      netlifyIdentity.init();
      console.log("init");
      netlifyIdentity.on("init", async (user) => {
        console.log("init ran");
        if (user) {
          //await listTasks()//or similar
          setToken(user.token.access_token);
          setIsLoggedIn(true);
        }
      });
      netlifyIdentity.on("login", async (user) => {
        console.log("login ran");
        //await listTasks()//or similar
        setToken(user.token.access_token);
        setIsLoggedIn(true);
      });
      netlifyIdentity.on("logout", () => {
        console.log("logout ran");
        setToken("");
        setIsLoggedIn();
      });
    }
    setup();

    //created event, useEffect, onMount etc
  }, []);
  return (
    <div className="App">
      <button onClick={() => netlifyIdentity.open()}>Login</button>
      {token}
    </div>
  );
}

export default App;
