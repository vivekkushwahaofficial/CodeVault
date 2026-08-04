import { useEffect, useState } from "react";

import Dashboard from "./components/Dashboard";
import RepositorySetup from "./components/RepositorySetup";

import { authenticateGithub } from "../../src/features/github/github-auth/github-oauth";
import {
  getGithubSettings,
} from "../../src/features/github/github-auth/github-storage";

export default function App() {

  const [loading, setLoading] =
    useState(true);

  const [githubConnected, setGithubConnected] =
    useState(false);

  const [repositoryConfigured, setRepositoryConfigured] =
    useState(false);

  useEffect(() => {

    async function loadSettings() {

      const settings =
        await getGithubSettings();

      setGithubConnected(
        !!settings?.token
      );

      setRepositoryConfigured(
        !!settings?.repo
      );

      setLoading(false);

    }

    loadSettings();

  }, []);

  async function connectGithub() {

    try {

      await authenticateGithub();

      setGithubConnected(true);

    } catch (error) {

      console.error(error);

      if (error instanceof Error) {

        alert(error.message);

      }

    }

  }

  if (loading) {

    return (

      <div
        style={{
          width: "340px",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >

        Loading...

      </div>

    );

  }

  if (!githubConnected) {

    return (

      <div
        style={{
          width: "340px",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >

        <h2>
          🚀 Welcome to CodeVault
        </h2>

        <p>
          Connect your GitHub account to continue.
        </p>

        <button
          onClick={connectGithub}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "10px",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
          }}
        >
          Connect GitHub
        </button>

      </div>

    );

  }

  if (!repositoryConfigured) {

    return (

      <RepositorySetup
        onRepositoryConfigured={() =>
          setRepositoryConfigured(true)
        }
      />

    );

  }

  return <Dashboard />;

}