import { useState } from "react";
import { testRegistrationAPI } from "../../utils/testRegistration";

const RegistrationDebugger = () => {
  const [userData, setUserData] = useState({
    firstName: "Test",
    lastName: "User",
    email: `test${Date.now()}@example.com`,
    password: "password123",
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateEmail = () => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    setUserData((prev) => ({
      ...prev,
      email: `test${timestamp}${randomStr}@example.com`,
    }));
  };

  const handleTest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await testRegistrationAPI(userData);
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        error: error.message || "Unknown error",
        details: error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Registration Debugger
      </h2>

      <form onSubmit={handleTest} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <div className="flex">
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              type="button"
              onClick={handleGenerateEmail}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r"
            >
              Generate
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="text" // Plain text for debugging purposes
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Testing..." : "Test Registration"}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Result:</h3>
          <div
            className={`p-3 rounded ${
              result.success ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <p
              className={`font-bold ${
                result.success ? "text-green-800" : "text-red-800"
              }`}
            >
              {result.success ? "Success" : "Failed"}
            </p>
            {result.message && <p className="text-sm">{result.message}</p>}
            {result.error && (
              <p className="text-sm text-red-600">{result.error}</p>
            )}

            {result.data && (
              <div className="mt-2">
                <p className="text-sm font-bold">Response data:</p>
                <pre className="text-xs bg-gray-800 text-white p-2 rounded mt-1 overflow-auto max-h-40">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}

            {result.details && (
              <div className="mt-2">
                <p className="text-sm font-bold">Error details:</p>
                <pre className="text-xs bg-gray-800 text-white p-2 rounded mt-1 overflow-auto max-h-40">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationDebugger;
