import React, { useState } from "react";
import ReactMarkdown from "react-markdown"; // ✅ Naya package import kiya format ke liye

function App() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [time, setTime] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    if (!subject || !topic || !time) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("http://localhost:5000/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          topic,
          time,
        }),
      });

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.log("Frontend Error:", error);
      setResult("❌ Backend connection error");
    }

    setLoading(false);
  };

  return (
    <div style={styles.background}>
      {/* Container jo input aur output dono ko handle karega */}
      <div style={styles.container}>
        
        {/* Left Side: Input Form Card */}
        <div style={styles.card}>
          <h1 style={styles.title}>🤖 AI Smart Study Planner</h1>

          <input
            style={styles.input}
            placeholder="Enter Subject (e.g., Physics)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Enter Topic (e.g., Thermodynamics)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Enter Time (e.g., 5 Days)"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <button
            style={styles.button}
            disabled={loading}
            onClick={generatePlan}
          >
            {loading ? (
              <span style={styles.loadingFlex}>
                <span style={styles.spinner}></span> Generating Plan...
              </span>
            ) : (
              "Generate Plan 🚀"
            )}
          </button>
        </div>

        {/* Right Side: Beautiful Result Panel (Sirf tab dikhega jab result ya loading ho) */}
        {(result || loading) && (
          <div style={styles.resultCard}>
            <h2 style={styles.resultTitle}>📋 Your Personalized Study Plan</h2>
            <hr style={styles.divider} />
            
            {loading ? (
              <div style={styles.loadingState}>
                <div style={styles.pulseBar}></div>
                <div style={styles.pulseBar2}></div>
                <div style={styles.pulseBar3}></div>
                <p style={{color: '#94a3b8'}}>AI is drafting your perfect schedule...</p>
              </div>
            ) : (
              <div style={styles.markdownContent}>
                {/* ✅ Yeh aapke text ko heading aur bullets mein badal dega */}
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  background: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    padding: "20px",
    boxSizing: "border-box",
  },

  container: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "25px",
    justifyContent: "center",
    alignItems: "flex-start",
    maxWidth: "1100px",
    width: "100%",
  },

  card: {
    width: "400px",
    background: "#111827",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    border: "1px solid #1e293b",
  },

  title: {
    color: "#38bdf8",
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "25px",
    textAlign: "center",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "16px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#1f2937",
    color: "white",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    transition: "0.3s",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    color: "#0f172a",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0 4px 15px rgba(56, 189, 248, 0.3)",
    transition: "0.2s",
  },

  /* New Beautiful Result Card Styling */
  resultCard: {
    flex: "1",
    minWidth: "320px",
    maxWidth: "650px",
    background: "#111827",
    padding: "35px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    border: "1px solid #1e293b",
    color: "#e2e8f0",
  },

  resultTitle: {
    color: "#38bdf8",
    fontSize: "20px",
    margin: "0 0 15px 0",
  },

  divider: {
    border: "none",
    height: "1px",
    background: "#334155",
    marginBottom: "20px",
  },

  markdownContent: {
    lineHeight: "1.7",
    fontSize: "16px",
    textAlign: "left",
    // Sub-components markdown adjustments
    color: "#cbd5e1",
  },

  /* Beautiful Animations & Loading States */
  loadingFlex: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },

  spinner: {
    width: "18px",
    height: "18px",
    border: "3px solid rgba(15, 23, 42, 0.2)",
    borderTop: "3px solid #0f172a",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingState: {
    textAlign: "center",
    padding: "40px 0",
  },

  pulseBar: {
    height: "12px",
    background: "#1f2937",
    borderRadius: "6px",
    marginBottom: "12px",
    width: "80%",
  },
  pulseBar2: {
    height: "12px",
    background: "#1f2937",
    borderRadius: "6px",
    marginBottom: "12px",
    width: "95%",
  },
  pulseBar3: {
    height: "12px",
    background: "#1f2937",
    borderRadius: "6px",
    marginBottom: "25px",
    width: "60%",
  }
};

// CSS spinner keyframe setup dynamically
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .markdownContent h1, .markdownContent h2, .markdownContent h3 { color: #38bdf8; margin-top: 20px; margin-bottom: 10px; font-weight: 600; }
  .markdownContent ul, .markdownContent ol { padding-left: 20px; margin-bottom: 15px; }
  .markdownContent li { margin-bottom: 8px; color: #cbd5e1; }
  .markdownContent strong { color: #f8fafc; font-weight: 600; }
`;
document.head.appendChild(styleTag);

export default App;