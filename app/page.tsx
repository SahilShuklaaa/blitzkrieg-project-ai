"use client";

import { useState, useEffect } from "react";
import { getAISuggestion } from "./ai";

export default function Home() {
  const ai = getAISuggestion();

  const [version, setVersion] = useState("A");
  const [clicksA, setClicksA] = useState(0);
  const [clicksB, setClicksB] = useState(0);
  const [improvementType, setImprovementType] = useState("none");

  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedA = localStorage.getItem("clicksA");
    const savedB = localStorage.getItem("clicksB");

    if (savedA) setClicksA(parseInt(savedA));
    if (savedB) setClicksB(parseInt(savedB));

    const rand = Math.random();

    if (rand < 0.5) {
      setVersion("A");
      setImprovementType("none");
    } else {
      setVersion("B");

      const types = ["discount", "urgency", "color", "size"];
      const randomType = types[Math.floor(Math.random() * types.length)];
      setImprovementType(randomType);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("clicksA", String(clicksA));
    localStorage.setItem("clicksB", String(clicksB));
  }, [clicksA, clicksB]);

  const handleClick = () => {
    if (version === "A") {
      setClicksA((prev) => prev + 1);
    } else {
      setClicksB((prev) => prev + 1);
    }
  };

  const getAIInsights = async () => {
    setLoading(true);
    setAiResponse("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          clicksA,
          clicksB
        })
      });

      const data = await res.json();
      setAiResponse(data.text || "No AI response");
    } catch (error) {
      setAiResponse("AI request failed");
    }

    setLoading(false);
  };

  const improvement =
    clicksA > 0
      ? (((clicksB - clicksA) / clicksA) * 100).toFixed(2)
      : 0;

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* HERO IMAGE */}
      <div style={{ position: "relative" }}>
        <img
          src="/lemonade1.png"
          alt="Lemonade Stall"
          style={{
            width: "100%",
            height: "100vh",
            objectFit: "cover"
          }}
        />

        {/* HERO OVERLAY */}
        <div
          style={{
            position: "absolute",
            top: "80%",
            left: "90%",
            transform: "translate(-80%, -90%)",
            textAlign: "center",
            background: "rgba(0,0,0,0.6)",
            padding: "25px",
            borderRadius: "12px",
            color: "white",
            minWidth: "250px"
          }}
        >
          <h1>🍋 AI Lemonade Shop</h1>

          {version === "A" ? (
            <>
              <p style={{ fontSize: "22px" }}>$2</p>

              <button
                onClick={handleClick}
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Buy Now
              </button>
            </>
          ) : (
            <>
              {improvementType === "discount" && (
                <p>
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "red"
                    }}
                  >
                    $3
                  </span>{" "}
                  <span
                    style={{
                      color: "#4ade80",
                      fontWeight: "bold",
                      fontSize: "22px"
                    }}
                  >
                    $1.5
                  </span>
                </p>
              )}

              {improvementType === "urgency" && (
                <>
                  <p style={{ fontSize: "22px" }}>$2</p>
                  <p style={{ color: "yellow" }}>Only 30 mins left ⏳</p>
                </>
              )}

              {improvementType === "color" && (
                <p style={{ fontSize: "22px", color: "#4ade80" }}>
                  $2 Special Offer
                </p>
              )}

              {improvementType === "size" && (
                <p style={{ fontSize: "28px", fontWeight: "bold" }}>
                  $2
                </p>
              )}

              <button
                onClick={handleClick}
                style={{
                  backgroundColor:
                    improvementType === "color" ? "#22c55e" : "#3b82f6",
                  color: "white",
                  fontSize:
                    improvementType === "size" ? "22px" : "18px",
                  padding: "14px 28px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Buy Now
              </button>
            </>
          )}
        </div>
      </div>

      {/* A/B TABLE */}
      <div style={{ padding: "30px" }}>
        <h2 style={{ textAlign: "center" }}>📊 A/B Comparison</h2>

        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse",
            textAlign: "center"
          }}
        >
          <thead>
            <tr>
              <th>Metric</th>
              <th style={{ color: "pink" }}>Version A</th>
              <th style={{ color: "#3b82f6" }}>Version B</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Clicks</td>
              <td>{clicksA}</td>
              <td>{clicksB}</td>
            </tr>

            <tr>
              <td>Strategy</td>
              <td>Static Pricing</td>
              <td>AI Dynamic Optimization</td>
            </tr>

            <tr>
              <td>Improvement</td>
              <td>-</td>
              <td style={{ color: "green" }}>{improvement}%</td>
            </tr>
          </tbody>
        </table>

        {/* REAL AI BUTTON */}
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            onClick={getAIInsights}
            style={{
              backgroundColor: "#111827",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer"
            }}
          >
            {loading ? "Analyzing..." : "Generate Real AI Insights"}
          </button>
        </div>

        {/* REAL AI RESPONSE */}
        {aiResponse && (
          <div
            style={{
              marginTop: "30px",
              textAlign: "center",
              background: "#f3f4f6",
              padding: "20px",
              borderRadius: "10px",
              color: "black"
            }}
          >
            <h2>🤖 Real AI Insights</h2>
            <p style={{ whiteSpace: "pre-line" }}>{aiResponse}</p>
          </div>
        )}

        {/* EXISTING AI INSIGHTS */}
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <h2>🤖 AI Insights</h2>
          <p>{ai.problem}</p>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {ai.suggestions.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>

        {/* TAGLINE */}
        <div
          style={{
            marginTop: "40px",
            textAlign: "center",
            color: "gray"
          }}
        >
          Real-time AI optimizing pricing & UI
        </div>
      </div>
    </div>
  );
}