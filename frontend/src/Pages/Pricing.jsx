import React from "react";

const plans = [
  {
    title: "Basic",
    price: "Free Tier",
    description: "Ideal for individuals exploring Coeus.ai.",
    features: [
      "Access Resume Scanner",
      "Use Interview Scheduler (limited)",
      "Community Support",
    ],
  },
  {
    title: "Pro",
    price: "$29/month",
    description: "Perfect for growing teams and startups.",
    features: [
      "Unlimited Resume Scanning",
      "Advanced Interview Scheduler",
      "Priority Support",
    ],
  },
  {
    title: "Enterprise",
    price: "$49/month",
    description: "Tailored solutions for large organizations.",
    features: [
      "All Pro Features",
      "Custom Integrations",
      "Dedicated Account Manager",
    ],
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 text-blue-500">
          Pricing Plans
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
          Choose a plan that fits your needs.
        </p>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className="relative group p-8 bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-400/30 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-cyan-500/50 hover:scale-[1.03]"
            >
              {/* Animated Glow Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-transparent to-cyan-400/30 blur-md opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none z-0" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <h3 className="text-2xl font-bold text-blue-300 mb-2">
                  {plan.title}
                </h3>
                <p className="text-3xl font-semibold text-cyan-100 mb-4">
                  {plan.price}
                </p>
                <p className="mb-4 text-gray-300">{plan.description}</p>
                <ul className="text-left space-y-2 mb-6 text-cyan-100">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="bg-blue-500 hover:bg-blue-600 text-black font-semibold px-6 py-2 rounded shadow transition">
                  {plan.title === "Enterprise" ? "Contact Us" : "Get Started"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
