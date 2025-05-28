import { useEffect } from "react";
import RegistrationDebugger from "../components/debug/RegistrationDebugger";
import TestUserGenerator from "../components/debug/TestUserGenerator";
import useDocumentTitle from "../hooks/useDocumentTitle";

const DebugPage = () => {
  useDocumentTitle("Debug Tools");

  useEffect(() => {
    // Log environment info
    console.log("Environment:", import.meta.env.MODE);
    console.log(
      "API URL:",
      import.meta.env.VITE_API_URL || "http://localhost:8000/api"
    );
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              This page contains developer tools and should not be accessible in
              production.
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Development Debugging Tools
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-xl font-medium text-gray-800">
              Registration Debugger
            </h2>
            <p className="text-gray-600 text-sm">
              Custom testing of registration API with advanced options
            </p>
          </div>
          <div className="p-4">
            <RegistrationDebugger />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-xl font-medium text-gray-800">
              Quick Test User Generator
            </h2>
            <p className="text-gray-600 text-sm">
              Generate test accounts with one click
            </p>
          </div>
          <div className="p-4">
            <TestUserGenerator />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden md:col-span-2">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-xl font-medium text-gray-800">
              API Test Examples
            </h2>
            <p className="text-gray-600 text-sm">
              Example curl commands for testing the API
            </p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2">
              Registration (Backend Format)
            </h3>
            <pre className="bg-gray-800 text-green-400 p-3 rounded-md overflow-auto text-sm">
              curl -X POST http://localhost:8000/api/auth/register -H
              "Content-Type: application/json" -d {`{`}
              "email":"user@example.com","password":"password123","first_name":"Test","last_name":"User"
              {`}`}
            </pre>

            <h3 className="font-semibold mt-4 mb-2">Login</h3>
            <pre className="bg-gray-800 text-green-400 p-3 rounded-md overflow-auto text-sm">
              curl -X POST http://localhost:8000/api/auth/login -H
              "Content-Type: application/json" -d {`{`}
              "email":"user@example.com","password":"password123"{`}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
