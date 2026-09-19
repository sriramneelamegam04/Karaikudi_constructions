import React from "react";
import HorizontalYearScroll from "../components/sections/HorizontalYearScroll";

export default function HorizontalYearScrollTest() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#100B08",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Top Navigation Bar to Easily Return to Main Site */}
      <div
        style={{
          position: "fixed",
          top: "16px",
          right: "16px",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backgroundColor: "rgba(24, 14, 10, 0.88)",
          color: "#FAF7F2",
          padding: "8px 16px",
          borderRadius: "999px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          fontSize: "13px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        <span style={{ opacity: 0.8 }}>🧪 Test: HorizontalYearScroll</span>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = "";
            window.history.pushState(null, "", "/");
            window.dispatchEvent(new Event("popstate"));
          }}
          style={{
            backgroundColor: "#FAF7F2",
            color: "#100B08",
            padding: "4px 12px",
            borderRadius: "999px",
            fontWeight: 600,
            textDecoration: "none",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          ← Return to Landing Page
        </a>
      </div>

      <HorizontalYearScroll />
    </main>
  );
}
