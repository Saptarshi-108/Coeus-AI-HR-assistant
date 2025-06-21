import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-4 text-blue-600 dark:text-blue-400">
          Get in Touch
        </h2>
        <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-10">
          We'd love to hear from you. Fill out the form below or reach out
          directly.
        </p>

        <form className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-semibold">Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Subject</label>
            <input
              type="text"
              name="subject"
              required
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Message</label>
            <textarea
              name="message"
              rows="5"
              required
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow transition"
            >
              Send Message
            </button>
          </div>
        </form>

        <div className="mt-10 text-center text-gray-500 dark:text-gray-400 text-sm">
          Or email us directly at{" "}
          <a
            href="mailto:support@coeus.ai"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            support@coeus.ai
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
