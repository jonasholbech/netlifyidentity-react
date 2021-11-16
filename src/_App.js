import "./App.css";
import { useEffect, useState } from "react";
import netlifyIdentity from "netlify-identity-widget";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [swCharacter, setSwCharacter] = useState(null);
  async function listTasks(token) {
    let response = await fetch("/.netlify/functions/addTask", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.ok); //TODO: gør noget med den, pt kan den vel godt fejle, skal kun kaldes ved login
    const data = await response.json();
    //console.log(data);
    setSwCharacter(data);
  }
  useEffect(() => {
    netlifyIdentity.on("init", (user) => {
      console.log("init ran, doing nothing");
    });
    netlifyIdentity.on("login", (user) => {
      console.log("login ran");
      listTasks(user.token.access_token);
      setUser(user);
      setIsLoggedIn(true);
      netlifyIdentity.refresh().then((jwt) => console.log(jwt));
    });
    netlifyIdentity.on("logout", () => {
      console.log("logout ran");
      setUser(null);
      setIsLoggedIn();
    });
    //apparently, register eventlisteners before init
    netlifyIdentity.init();
    console.log("init");
  }, []);

  netlifyIdentity.on("error", (err) => console.error("Error", err));
  netlifyIdentity.on("open", () => console.log("Widget opened"));
  netlifyIdentity.on("close", () => console.log("Widget closed"));
  function handleLoginButton() {
    if (isLoggedIn) {
      netlifyIdentity.logout();
    } else {
      netlifyIdentity.open();
    }
  }
  return (
    <div className="App">
      <button onClick={handleLoginButton}>
        {isLoggedIn ? "Log Out" : "Log In"}
      </button>
      <TestAPI user={user} listTasks={listTasks} />
      {isLoggedIn && <Secret data={swCharacter} user={user} />}
    </div>
  );
}
function Secret(props) {
  return (
    <section>
      <h1>Welcome {props.user.user_metadata.full_name}</h1>
      <p>Here's some information around a SW character</p>
      <pre>{JSON.stringify(props.data, null, 2)}</pre>
    </section>
  );
}
//TODO: ok approach to 401 etc? https://itnext.io/centralizing-api-error-handling-in-react-apps-810b2be1d39d
function TestAPI(props) {
  return (
    <div>
      <button onClick={() => props.listTasks(props.user?.token?.access_token)}>
        GET SW Char
      </button>
    </div>
  );
}
export default App;
