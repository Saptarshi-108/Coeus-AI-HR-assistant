// src/components/CoeusTyper.jsx
import React from "react";
import Typewriter from "typewriter-effect";

const Typer = () => {
  return (
    <div
      className="absolute bottom-3 right-9 text-right bg-gradient-to-r from-slate-500 to-slate-50 bg-clip-text text-transparent max-w-4xl mb-30 mr-30 text-8xl"
      style={{ fontFamily: "var(--font-1)" }}
    >
      <Typewriter
        options={{
          strings: [
            "Meet Coeus , your intelligent HR ally.",
            "Simplifying hiring, onboarding, and policies with precision.",
            "Say goodbye to paperwork. Say hello to smart HR.",
          ],
          autoStart: true,
          loop: true,
          delay: 60,
          deleteSpeed: 40,
          pauseFor: 2000,
        }}
      />
    </div>
  );
};

export default Typer;
