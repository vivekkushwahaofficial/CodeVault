export async function exchangeGithubCode(
  code: string
): Promise<string> {

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

    const errorMessage =
      await response.text();

    throw new Error(
      errorMessage || "Failed to exchange GitHub authorization code."
    );

  }

  const data = await response.json();

  const accessToken =
    data.accessToken ??
    data.access_token;

  if (!accessToken) {

    throw new Error(
      "Access token not received from backend."
    );

  }

  return accessToken;

}