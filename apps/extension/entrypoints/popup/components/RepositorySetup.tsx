import { useState } from "react";
import { createRepository } from "../../../src/features/github/repository/repository-service";

interface RepositorySetupProps {

  onRepositoryConfigured: () => void;

}

export default function RepositorySetup({
  onRepositoryConfigured,
}: RepositorySetupProps) {

  const [mode, setMode] =
    useState<"create" | "existing">("create");

  const [repositoryName, setRepositoryName] =
    useState("codevault-solutions");

  const [loading, setLoading] =
    useState(false);

 const username =
    "vivekkushwahaofficial"; 

async function handleContinue() {

  try {

    if (mode === "existing") {

      alert(
        "Existing repository feature coming next."
      );

      return;

    }

    setLoading(true);

    const repository =
      await createRepository({

        name: repositoryName,

        description:
          "Repository created by CodeVault",

        private: true,

      });

    console.log(repository);

    onRepositoryConfigured();

  } catch (error) {

    console.error(error);

    if (error instanceof Error) {

      alert(error.message);

    } else {

      alert("Unknown error");

    }

  } finally {

    setLoading(false);

  }

}

  return (

    <div
      style={{
        width: "340px",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >

      <h2
        style={{
          margin: 0,
        }}
      >
        🚀 Welcome to CodeVault
      </h2>

      <p
        style={{
          marginTop: "12px",
          marginBottom: "4px",
          fontSize: "13px",
          color: "#888",
        }}
      >
        Connected as
      </p>

      <p
        style={{
          margin: 0,
          marginBottom: "20px",
          color: "#22c55e",
          fontWeight: "bold",
        }}
      >
        {username} ✅
      </p>

      <div
        onClick={() => setMode("create")}
        style={{
          border:
            mode === "create"
              ? "2px solid #2563eb"
              : "1px solid #444",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "15px",
          cursor: "pointer",
          background:
            mode === "create"
              ? "#eff6ff"
              : "#2a2a2a",
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >

          <strong
            style={{
              color:
                mode === "create"
                  ? "#1d4ed8"
                  : "#ffffff",
            }}
          >
            📦 Create New Repository
          </strong>

          {mode === "create" && (
            <span
              style={{
                color: "#2563eb",
                fontWeight: "bold",
              }}
            >
              ✓
            </span>
          )}

        </div>

        <p
          style={{
            marginTop: "10px",
            marginBottom: 0,
            color:
              mode === "create"
                ? "#444"
                : "#cfcfcf",
            fontSize: "13px",
          }}
        >
          Create a dedicated GitHub repository
          for your coding solutions.
        </p>

      </div>

      <div
        onClick={() => setMode("existing")}
        style={{
          border:
            mode === "existing"
              ? "2px solid #2563eb"
              : "1px solid #444",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "20px",
          cursor: "pointer",
          background:
            mode === "existing"
              ? "#eff6ff"
              : "#2a2a2a",
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >

          <strong
            style={{
              color:
                mode === "existing"
                  ? "#1d4ed8"
                  : "#ffffff",
            }}
          >
            🔗 Use Existing Repository
          </strong>

          {mode === "existing" && (
            <span
              style={{
                color: "#2563eb",
                fontWeight: "bold",
              }}
            >
              ✓
            </span>
          )}

        </div>

        <p
          style={{
            marginTop: "10px",
            marginBottom: 0,
            color:
              mode === "existing"
                ? "#444"
                : "#cfcfcf",
            fontSize: "13px",
          }}
        >
          Connect one of your existing GitHub repositories.
        </p>

      </div>

      {mode === "create" && (

        <div
          style={{
            marginBottom: "20px",
          }}
        >

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Repository Name
          </label>

          <input
            type="text"
            value={repositoryName}
            onChange={(event) =>
              setRepositoryName(event.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #555",
              boxSizing: "border-box",
            }}
          />

        </div>

      )}

      {mode === "existing" && (

        <div
          style={{
            marginBottom: "20px",
          }}
        >

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Select Repository
          </label>

          <select
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #555",
              boxSizing: "border-box",
            }}
          >

            <option>CodeVault</option>
            <option>LeetCode</option>
            <option>DSA</option>

          </select>

        </div>

      )}

      <button
        onClick={handleContinue}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          border: "none",
          borderRadius: "10px",
          background: "#2563eb",
          color: "white",
          fontWeight: "bold",
          cursor:
            loading
              ? "not-allowed"
              : "pointer",
          opacity:
            loading
              ? 0.7
              : 1,
        }}
      >

        {loading
          ? "Please wait..."
          : mode === "create"
            ? "Create Repository →"
            : "Connect Repository →"}

      </button>

    </div>

  );

}