export default function Dashboard() {

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
        🚀 CodeVault
      </h2>

      <div
        style={{
          marginTop: "20px",
          padding: "12px",
          borderRadius: "10px",
          background: "#1f2937",
          border: "1px solid #374151",
        }}
      >

        <strong
          style={{
            color: "#22c55e",
          }}
        >
          🟢 Ready to Sync
        </strong>

      </div>

      <div
        style={{
          marginTop: "20px",
        }}
      >

        <p
          style={{
            color: "#9ca3af",
            marginBottom: "4px",
          }}
        >
          GitHub
        </p>

        <strong>
          vivekkushwahaofficial
        </strong>

      </div>

      <div
        style={{
          marginTop: "18px",
        }}
      >

        <p
          style={{
            color: "#9ca3af",
            marginBottom: "4px",
          }}
        >
          Repository
        </p>

        <strong>
          codevault-solutions
        </strong>

      </div>

      <hr
        style={{
          margin: "24px 0",
          border: "none",
          borderTop: "1px solid #444",
        }}
      />

      <div
        style={{
          textAlign: "center",
        }}
      >

        <p
          style={{
            marginBottom: "6px",
          }}
        >
          ⏳ Waiting for accepted
        </p>

        <p>
          LeetCode submissions...
        </p>

      </div>

    </div>

  );

}