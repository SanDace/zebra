import React, { useState } from "react";

const Magnifier = ({ src }) => {
  const [magnifiedPosition, setMagnifiedPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMagnifiedPosition({ x, y });
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={src}
        alt="Product"
        className="w-full h-auto rounded-lg object-cover"
      />
      {showMagnifier && (
        <div
          className="absolute border-gray-300 shadow-lg border-2 border-blue-400"
          style={{
            width: "500px",
            height: "300px",
            left: "200px",
            top: "100px",
            transform: "translate(50%, -50%)",
            backgroundImage: `url(${src})`,
            backgroundSize: "200% 200%",
            backgroundPosition: `${magnifiedPosition.x}% ${magnifiedPosition.y}%`,
            backgroundRepeat: "no-repeat",
            // padding: "5rem",
          }}
        ></div>
      )}
    </div>
  );
};

export default Magnifier;
