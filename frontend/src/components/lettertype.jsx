// src/components/ScrollFadeIn.jsx
import React, { useEffect, useRef, useState } from "react";

const ScrollFadeIn = ({ children, className = "", stagger = 50 }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  const renderAnimatedLetters = (text) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className={`inline-block ${isVisible ? "animate-letter" : "opacity-0"}`}
        style={{ animationDelay: `${index * stagger}ms` }}
      >
        {char}
      </span>
    ));
  };

  return (
    <div ref={ref} className={`inline-block ${className}`}>
      {typeof children === "string"
        ? renderAnimatedLetters(children)
        : children}
    </div>
  );
};

export default ScrollFadeIn;
