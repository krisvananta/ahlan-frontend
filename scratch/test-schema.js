const GET_MAGAZINE_BY_ID = `
  query GetMagazineById($id: ID!) {
    magazine(id: $id, idType: ID) {
      id
      slug
      title
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
      magazineData {
        magazinePdf {
          node {
            mediaItemUrl
            databaseId
          }
        }
      }
    }
  }
`;

async function testById() {
  try {
    const res = await fetch("http://ahlan-backend.local/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: GET_MAGAZINE_BY_ID, variables: { id: "cG9zdDoyMw==" } })
    });
    console.log(JSON.stringify(await res.json(), null, 2));
  } catch (err) {
    console.error(err);
  }
}

testById();
