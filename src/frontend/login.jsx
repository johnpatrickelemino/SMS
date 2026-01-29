import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../backend/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    setIsLoading(true);

    try {
      const user = await loginUser(email, password);

      sessionStorage.setItem("FirstName", user.firstName);
      sessionStorage.setItem("LastName", user.lastName);
      sessionStorage.setItem("Email", user.email);
      sessionStorage.setItem("Role", user.role);
      sessionStorage.setItem("IsAuthenticated", "true");

      setSuccessMessage("Login successful!");

      if (user.role === "Admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "Student") {
        navigate("/student/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.code === "auth/user-not-found") {
        setErrorMessage("User not found. Please check your email.");
      } else if (err.code === "auth/wrong-password") {
        setErrorMessage("Invalid password. Please try again.");
      } else if (err.code === "auth/invalid-email") {
        setErrorMessage("Invalid email format.");
      } else {
        setErrorMessage("Invalid email or password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#3a5a40' }}>
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            CDM HR Profiling System
          </h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm border border-red-300">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm border border-green-300">
              {successMessage}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-600 focus:border-transparent sm:text-sm text-gray-900"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-600 focus:border-transparent sm:text-sm text-gray-900"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-lg text-white font-semibold transition duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#3a5a40' }}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-auto mx-auto px-6 py-2 rounded-lg text-white font-semibold border border-black transition duration-300 hover:bg-gray-100 block"
          >
            Cancel
          </button>

          <div className="text-center mt-6 pt-6 border-t border-gray-300">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Register here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
