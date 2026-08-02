import { authenticateGithub } from "../../src/features/github/github-auth/github-oauth";


export default function App() {

  async function connectGithub() {

    console.log("1. Button clicked");


    try {

      console.log("2. Calling authenticateGithub");


      const token =
        await authenticateGithub();


      console.log(
        "3. OAuth Completed:",
        token
      );


    } catch(error) {

      console.error(
        "4. OAuth Error:",
        error
      );

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