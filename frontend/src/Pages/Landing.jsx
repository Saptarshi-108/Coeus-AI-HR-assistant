import React, { useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
// ChatbotButton is now managed at App.jsx level to be fixed across pages
import Typer from "../components/Typer";
import FeatureCard from "../components/FeatureCard"; // New import
import Testimonial from "../components/Testimonial"; // New import

const Landing = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.3; // Fast-forward
    }
  }, []);

  return (
    <div className="hide-scrollbar">
      <div className="w-full relative">
        {/* Hero section with video background */}
        <section className="relative w-full h-screen overflow-hidden">
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            src="/3126361-uhd_3840_2160_25fps.mp4" // Path changed for public folder
            autoPlay
            loop
            muted
            playsInline
          />

          {/* Overlay content */}
          <div className="relative z-10 flex items-center justify-center h-full text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-center">
              {/* Typer component already uses GradientText internally */}
              <Typer />
            </h1>
          </div>
        </section>

        {/* About the Platform Section - Enhanced */}
        <section className="w-full bg-black font-bold text-white p-10 py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-semibold mb-6 text-center text-blue-400 ">
              About Coeus: Your Intelligent HR Ally
            </h2>
            <p className="mb-8 text-lg text-center text-gray-300">
              Coeus streamlines the entire hiring lifecycle, from intelligent
              candidate screening to seamless onboarding and policy management.
              Leverage cutting-edge AI to optimize your HR processes and empower
              your team.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-10">
              <FeatureCard
                title="AI-Powered Resume Scanning"
                description="Automatically analyze resumes, rank candidates, and match skills to job descriptions with unparalleled accuracy."
                icon="📄"
              />
              <FeatureCard
                title="Automated Interview Scheduling"
                description="Effortlessly find optimal time slots, send invites, and integrate with Google Meet and email for smooth interviews."
                icon="📅"
              />
              <FeatureCard
                title="Personalized Resume Optimization"
                description="Provide job seekers with AI-driven insights to tailor their resumes, significantly boosting their chances."
                icon="✨"
              />
              {/* Add more feature cards as needed */}
            </div>
          </div>
        </section>

        {/* Testimonials Section - New */}
        <section className="w-full bg-gray-900 font-bold text-white p-10 py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-semibold mb-8 text-center text-blue-400">
              What Our Users Say
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Testimonial
                quote="Coeus has revolutionized our recruitment. The resume scanner is incredibly accurate, saving us hundreds of hours."
                author="Sarah Chen, HR Director at InnovateTech"
              />
              <Testimonial
                quote="Scheduling interviews used to be a nightmare. Now, it's seamless and takes minutes, thanks to Coeus!"
                author="Mark Johnson, Talent Acquisition Lead"
              />
              <Testimonial
                quote="The policy bot is a lifesaver for our employees. Instant answers to HR queries reduce friction and improve satisfaction."
                author="Emily White, Employee Relations Manager"
              />
            </div>
          </div>
        </section>

        {/* Call to Action Section - New */}
        <section className="w-full bg-gradient-to-r from-blue-700 to-purple-800 text-white p-10 text-center py-20">
          <h2 className="text-3xl font-semibold mb-4">
            Ready to Transform Your HR Operations?
          </h2>
          <p className="mb-8 text-lg text-gray-200">
            Join forward-thinking companies that are leveraging AI for smarter,
            faster, and more efficient human resources.
          </p>
          <button className="bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50">
            Get Started Today
          </button>
        </section>

        {/* ChatbotButton is now in App.jsx to be fixed */}
      </div>
    </div>
  );
};

export default Landing;
