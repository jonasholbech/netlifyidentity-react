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
    const data = await response.json();
    console.log(data);
    setSwCharacter(data);
  }
  useEffect(() => {
    netlifyIdentity.on("init", (user) => {
      console.log("init ran, doing nothing");
      /*if (user) {
        listTasks(user.token.access_token);
        setUser(user);

        setIsLoggedIn(true);
      }*/
    });
    netlifyIdentity.on("login", (user) => {
      console.log("login ran");
      listTasks(user.token.access_token);
      setUser(user);
      setIsLoggedIn(true);
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
      {isLoggedIn && <Secret data={swCharacter} />}
    </div>
  );
}
function Secret(props) {
  return <pre>{JSON.stringify(props.data, null, 2)}</pre>;
}
export default App;
