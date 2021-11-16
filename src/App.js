import { useEffect, createContext, useContext, useState } from "react";
import netlifyIdentity from "netlify-identity-widget";
import {Router, Link} from "@reach/router"
let UserContext = createContext({
  authUser: null,
  setAuthUser: (user) => {},
});

export default function App(){
  const [user,setUser] = useState(null);
  //const { authUser,setAuthUser } = useContext(UserContext);
  useEffect(() => {
    netlifyIdentity.on("init", (user) => {
      console.log("init ran, doing nothing");
      setUser(user);
    });
    netlifyIdentity.on("login", (user) => {
      console.log("login ran");
      //listTasks(user.token.access_token);
      setUser(user);
      //setIsLoggedIn(true);
      netlifyIdentity.refresh().then((jwt) => {
        //console.log(jwt)
      });
    });
    netlifyIdentity.on("logout", () => {
      console.log("logout ran");
      setUser(null);
      //setIsLoggedIn();
    });
    //apparently, register eventlisteners before init
    netlifyIdentity.init();
    console.log("init");
  }, [setUser]);

  netlifyIdentity.on("error", (err) => console.error("Error", err));
  netlifyIdentity.on("open", () => console.log("Widget opened"));
  netlifyIdentity.on("close", () => console.log("Widget closed"));
  return (
    <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <Home path="/" />
          <About path="/about" />
          <PrivateRoute as={Dashboard} path="/dashboard" />
          
        </Router>
      </UserContext.Provider>
  )
}

function PrivateRoute({ as: Comp, ...props }){
    const {user} = useContext(UserContext);
    //console.log(user)
    return user ? <Comp {...props} /> : <Login />;
}

function Login(){
  function handleLoginButton() {  
      netlifyIdentity.open();
  }
  return (
    <div>
  <Nav />
  <button onClick={handleLoginButton}>
        Log In
      </button>
  </div>)
}


function Home() {
  return (
    <>
    <Nav />
    <div>home</div>
    </>
  );
}

function About() {
  return <><Nav /><div>about</div></>;
}

function Dashboard() {
  const {user} = useContext(UserContext);
  return <><Nav /><div>Protected dashboard {user.user_metadata.full_name}</div></>;
}
function Nav(){
  const {user} = useContext(UserContext)
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      
      <Link to="/about">about</Link>
      {user && <button onClick={()=>netlifyIdentity.logout()}>Log Out</button>}
    </nav>
  )
}