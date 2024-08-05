import React, { useState } from "react";

const Page = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleComponent = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: isOpen ? "20%" : "5%", transition: "width 0.5s" }}>
        {/* First Component */}
        <div
          style={{
            backgroundColor: "lightblue",
            height: "100%",
            padding: "10px",
          }}
        >
          {isOpen ? "First Component Open" : "First Component Closed"}
        </div>
      </div>
      <div style={{ width: isOpen ? "80%" : "95%", transition: "width 0.5s" }}>
        {/* Second Component */}
        <div
          style={{
            backgroundColor: "lightgreen",
            height: "100%",
            padding: "10px",
          }}
        >
          Second Component
        </div>
      </div>
      <button
        style={{ position: "absolute", top: "10px", right: "10px" }}
        onClick={toggleComponent}
      >
        {isOpen ? "Close First Component" : "Open First Component"}
      </button>
    </div>
  );
};

export default Page;
