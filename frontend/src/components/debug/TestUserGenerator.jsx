import { useState } from "react";
import { registerTestUser } from "../../utils/registerUtils";

const TestUserGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);

  const handleGenerateUser = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const result = await registerTestUser({
        onSuccess: (data) => {
          // Add to recent users list
          setRecentUsers((prev) => [data, ...prev].slice(0, 5));
        },
      });
      setResult(result);
    } catch (error) {
      setResult({
        success: false,
        error: error.message || "Failed to create test user",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy to clipboard:", err);
      });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Test User Generator</h3>

      <div className="mb-4">
        <button
          onClick={handleGenerateUser}
          disabled={isLoading}
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Creating..." : "Generate Test User"}
        </button>
      </div>

      {result && (
        <div
          className={`p-4 mb-6 rounded-md ${
            result.success ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {result.success ? (
            <div>
              <p className="text-green-700 font-semibold">
                User created successfully!
              </p>
              <div className="mt-2">
                <p className="text-sm">
                  <span className="font-semibold">Email:</span>{" "}
                  {result.data.email}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Name:</span>{" "}
                  {result.data.firstName} {result.data.lastName}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">ID:</span> {result.data.id}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-red-700 font-semibold">
                Failed to create user
              </p>
              <p className="text-sm mt-1">{result.error}</p>
            </div>
          )}
        </div>
      )}

      {recentUsers.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-gray-700 mb-2">
            Recent Test Users
          </h4>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Password
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentUsers.map((user, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {user.credentials.email}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {user.credentials.password}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          copyToClipboard(JSON.stringify(user.credentials))
                        }
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Copy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestUserGenerator;
