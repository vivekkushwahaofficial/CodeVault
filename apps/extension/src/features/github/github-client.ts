import type { GitHubFileRequest } from "./github-types";


export async function createGithubFile(
  request: GitHubFileRequest
) {

  const {
    owner,
    repo,
    path,
    content,
    message
  } = request;


  const GITHUB_TOKEN =
    import.meta.env.VITE_GITHUB_TOKEN;


  const encodedContent =
    btoa(
      unescape(
        encodeURIComponent(content)
      )
    );


  const url =
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;


  const existing = await fetch(
    url,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json"
      }
    }
  );


  let sha;


  if (existing.ok) {

    const data = await existing.json();

    sha = data.sha;

  }


  const response = await fetch(
    url,
    {
      method: "PUT",

      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        message,

        content: encodedContent,

        ...(sha && { sha })

      })

    }
  );


  const result = await response.json();


  console.log(
    "GitHub response:",
    result
  );

}