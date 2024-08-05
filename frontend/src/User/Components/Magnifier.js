import React, { useState } from "react";

const Magnifier = ({ src }) => {
  const [magnifiedPosition, setMagnifiedPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 110;
    const y = ((e.clientY - top) / height) * 110;
    setMagnifiedPosition({ x, y });
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div
      className="relative border-r-2 "
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={src}
        alt="Product"
        className="w-[460px] h-[350px] mx-auto rounded-lg object-contain "
      />
    </div>
  );
};

export default Magnifier;
