import { authenticateGithub } from "../../src/features/github/github-auth/github-oauth";
import { getGithubUser } from "../../src/features/github/api/github-user";

export default function App() {

  async function connectGithub() {

    try {

      console.log("Authenticating...");

      await authenticateGithub();

      console.log("Fetching GitHub user...");

      const user =
        await getGithubUser();

      alert(
        `Connected as ${user.login}`
      );

    } catch (error) {

      console.error(error);

      if (error instanceof Error) {

        alert(error.message);

      } else {

        alert("Unknown error");

      }

    }

  }

  return (

    <div
      style={{
        width: "320px",
        padding: "20px",
      }}
    >

      <h1>
        🚀 CodeVault
      </h1>

      <button
        onClick={connectGithub}
      >
        Authenticate GitHub
      </button>

    </div>

  );

}