const fetch = require('node-fetch');

const query = `
  {
    __type(name: "User") {
      name
      fields {
        name
        type {
          name
          kind
        }
      }
    }
  }
`;

async function testIntrospection() {
  try {
    const res = await fetch("http://ahlan-backend.local/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    console.log(JSON.stringify(data.data.__type.fields.map(f => f.name), null, 2));
  } catch (err) {
    console.error(err);
  }
}

testIntrospection();
