//.netlify/functions/addtask.js
require("isomorphic-fetch");
exports.handler = async (evt, ctx) => {
  //const service = someDBservice()
  //let task = JSON.parse(evt.body);
  console.log(ctx.clientContext);
  const user = ctx.clientContext.user;
  //task.userId = user.sub;
  //TODO: return function instead of duplicate
  //TODO: hvad hvis swapi fejler?
  console.log(user);
  if (!user) {
    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Not authorized" }),
    };
  }
  const response = await fetch("https://swapi.dev/api/people/1/");
  const tasks = await response.json();
  // https://swapi.dev/api/people/1/
  //user.sub is our user id
  //let tasks = await someDBservice("tasks", {filter:user.sub})

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tasks),
  };
};
