export async function exchangeGithubCode(
  code: string
) {

  const response = await fetch(
    "http://localhost:8080/api/github/oauth/token",
    {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        code,
      }),

    }
  );

  if (!response.ok) {

    throw new Error(
      "Failed to exchange GitHub authorization code."
    );

  }

  const data =
    await response.json();

  console.log(
    "Backend Response:",
    data
  );

  if (!data.accessToken) {

    throw new Error(
      "Access token not received."
    );

  }

  return data.accessToken;

}