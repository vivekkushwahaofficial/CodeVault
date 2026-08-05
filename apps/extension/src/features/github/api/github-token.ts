export async function exchangeGithubCode(
  code: string
) {

  const response = await fetch(
    "https://codevault-backend-me91.onrender.com/api/github/oauth/token",
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

  const text =
    await response.text();

  const data =
    JSON.parse(text);

  const accessToken =
    data.accessToken ??
    data.access_token;

  if (!accessToken) {

    throw new Error(
      "Access token not received."
    );

  }

  return accessToken;

}