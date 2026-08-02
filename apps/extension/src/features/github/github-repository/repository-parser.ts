export interface GithubRepository {

  owner: string;

  repo: string;

}


export function parseRepositoryUrl(
  url: string
): GithubRepository | null {


  try {

    const parsed =
      new URL(url);


    if (
      parsed.hostname !== "github.com"
    ) {

      return null;

    }


    const parts =
      parsed.pathname
        .split("/")
        .filter(Boolean);


    if (parts.length < 2) {

      return null;

    }


    const owner = parts[0];
    const repo = parts[1];


    if (!owner || !repo) {

      return null;

    }


    return {

      owner,

      repo: repo.replace(".git", ""),

    };


  } catch {

    return null;

  }

}