import React from "react";

const Testimonial = ({ quote, author }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <p className="text-lg italic text-white mb-4">"{quote}"</p>
      <p className="text-blue-400 font-semibold">- {author}</p>
    </div>
  );
};

export default Testimonial;
