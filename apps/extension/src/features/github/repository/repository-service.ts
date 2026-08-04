import {
  createGithubRepository,
  type CreateGithubRepositoryRequest,
  type GithubRepository,
} from "../api/github-create-repository";


import { getGithubRepositories } from "../api/github-repositories";


import { saveSelectedRepository } 
from "../github-auth/github-storage";



export async function loadRepositories()
: Promise<GithubRepository[]> {

  return await getGithubRepositories();

}



export async function createRepository(
  request: CreateGithubRepositoryRequest
): Promise<GithubRepository> {


  const repository =
    await createGithubRepository(request);



  await saveSelectedRepository(

    repository.owner.login,

    repository.name,

    repository.default_branch,

  );



  return repository;

}