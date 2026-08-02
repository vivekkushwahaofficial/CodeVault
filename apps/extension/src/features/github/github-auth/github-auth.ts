export async function verifyGithubConnection() {

  try {

    const token =
      localStorage.getItem("github_token");


    if (!token) {

      return {
        success: false,
        message: "Token missing"
      };

    }


    const response =
      await fetch(
        "https://api.github.com/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
          },
        }
      );


    if (!response.ok) {

      return {
        success: false,
        message: "Invalid GitHub token"
      };

    }


    const user =
      await response.json();


    return {

      success: true,

      username: user.login,

    };


  } catch (error) {


    return {

      success: false,

      message: "GitHub connection failed"

    };


  }

}