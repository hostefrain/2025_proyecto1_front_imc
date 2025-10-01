// src/components/Dashboard/Dashboard.tsx
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "600px", borderRadius: "8px", overflow: "hidden" }}>
      <iframe
        src="http://localhost:3000/public/dashboard/0f88564d-351f-4eba-876e-0a5a4e3d3c3f"
        width="100%"
        height="100%"
        allowTransparency
        title="Metabase Dashboard"
        style={{ border: "none", borderRadius: "8px" }}
      />
    </div>
  );
};

export default Dashboard;