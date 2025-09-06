import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../utils/authAPIHandler";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    try {
      await register(username, password);
      navigate("/login");
    } catch (error: unknown) {
      console.error("Register error:", error);
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unkown error occured";
      setError(errorMessage);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-800 flex flex-col justify-center items-center text-white">
      <form
        className="w-[calc(30%)] bg-gray-700 flex flex-col rounded-lg shadow-md p-3"
        onSubmit={handleRegister}
      >
        <h1 className="text-3xl font-bold text-center">Reigster</h1>
        <label className="text-2xl text-left mt-2">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full text-lg bg-gray-600 rounded-lg p-1"
          placeholder="Enter your username"
          required
        />
        <label className="text-2xl text-left mt-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full text-lg bg-gray-600 rounded-lg p-1"
          placeholder="Enter your password"
          required
        />
        {error && <p className="text-red-500 text-lg">{error}</p>}
        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-gray-600 text-2xl p-2 hover:bg-gray-500"
        >
          Register
        </button>
        <p className="text-lg text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
