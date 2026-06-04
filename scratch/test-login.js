const fetch = require('node-fetch');

const query = `
  mutation LoginUser($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      user {
        id
        name
        nickname
        email
        roles {
          nodes {
            name
          }
        }
        hasAllAccess
      }
    }
  }
`;

async function testLogin() {
  try {
    const res = await fetch("http://ahlan-backend.local/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { username: "bypass@ahlan.com", password: "admin123" } })
    });
    
    console.log("Status:", res.status);
    const data = await res.text();
    console.log("Response:", data);
  } catch (err) {
    console.error(err);
  }
}

testLogin();
