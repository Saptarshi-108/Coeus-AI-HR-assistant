import React from "react";
import "./loader.css"; // Ensure this path is correct

const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black text-white">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
