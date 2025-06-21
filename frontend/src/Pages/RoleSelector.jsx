import React from "react";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    title: "HR",
    description: "Manage interviews, schedule slots, and track candidates.",
    features: ["Schedule Interviews", "Send Invites", "Track Status"],
    buttonText: "Enter HR Portal",
    path: "/home",
  },
  {
    title: "Candidate",
    description: "Ask questions about company policies via PolicyBot.",
    features: [
      "Ask HR Policy Questions",
      "24/7 Availability",
      "Anonymous Chat",
    ],
    buttonText: "Ask PolicyBot",
    path: "/candidate",
  },
];

const RoleSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 text-blue-500">
          Select Your Role
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
          Choose how you want to interact with the AI HR Assistant.
        </p>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
          {roles.map((role) => (
            <div
              key={role.title}
              className="relative group p-8 bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-400/30 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-cyan-500/50 hover:scale-[1.03] cursor-pointer"
              onClick={() => {
                localStorage.setItem("userRole", role.title);
                navigate(role.path);
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-transparent to-cyan-400/30 blur-md opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none z-0" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <h3 className="text-2xl font-bold text-blue-300 mb-2">
                  {role.title}
                </h3>
                <p className="mb-4 text-gray-300">{role.description}</p>
                <ul className="text-left space-y-2 mb-6 text-cyan-100">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="bg-blue-500 hover:bg-blue-600 text-black font-semibold px-6 py-2 rounded shadow transition">
                  {role.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
