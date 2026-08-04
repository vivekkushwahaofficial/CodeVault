export interface GithubSettings {

  owner: string;

  repo: string;

  token: string;

  branch: string;

}


const STORAGE_KEY = "github_settings";


export async function saveGithubSettings(
  settings: GithubSettings
) {

  await browser.storage.local.set({

    [STORAGE_KEY]: settings,

  });

}


export async function getGithubSettings()
: Promise<GithubSettings | null> {

  const result =
    await browser.storage.local.get(
      STORAGE_KEY
    );


  const settings =
    result[STORAGE_KEY] as GithubSettings | undefined;


  return settings ?? null;

}


export async function clearGithubSettings() {

  await browser.storage.local.remove(
    STORAGE_KEY
  );

}


/**
 * Updates repository information
 * while keeping existing token and branch.
 */
export async function saveSelectedRepository(
  owner: string,
  repo: string,
  branch: string,
) {

  const settings =
    await getGithubSettings();


  if (!settings) {

    throw new Error(
      "GitHub settings not found."
    );

  }


  await saveGithubSettings({

    ...settings,

    owner,

    repo,

    branch,

  });

}