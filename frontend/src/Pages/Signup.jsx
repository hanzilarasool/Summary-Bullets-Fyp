import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import config from "../config";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    setErrorMessage(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      return setErrorMessage("Please fill all the fields.");
    }

    try {
      const res = await fetch(`${config.API_URL}/api/v1/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (data.success === false) {
        return setErrorMessage(data.message);
      }

      if (res.ok) {
        navigate("/login");
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div>
      <div className="text-center mt-24">
        <div className="flex items-center justify-center">
          {/* <svg
            fill="none"
            viewBox="0 0 24 24"
            className="w-12 h-12 text-green-500"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 21v-2a4 4 0 00-8 0v2M12 7a4 4 0 110-8 4 4 0 010 8zM12 14v.01M6 18v.01M18 18v.01"
            />
          </svg> */}
        </div>
        <h2 className="text-4xl tracking-tight">Create an account</h2>
      </div>
      <div className="flex justify-center my-2 mx-4 md:mx-0">
        <form
          className="w-full max-w-xl bg-white rounded-lg shadow-md p-6"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-wrap -mx-3 mb-6">
            {/* Username */}
            <div className="w-full px-3 mb-6">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
                type="text"
                id="username"
                placeholder="john_doe"
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="w-full px-3 mb-6">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="email"
              >
                Email address
              </label>
              <input
                className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
                type="email"
                id="email"
                placeholder="name@company.com"
                onChange={handleChange}
              />
            </div>

            {/* Password with Toggle */}
            <div className="w-full px-3 mb-6 relative">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="**********"
                onChange={handleChange}
              />
              <div
                className="absolute right-4 top-[42px] cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            {/* Error */}
            {errorMessage && (
              <p className="text-red-500 text-xs italic pl-[20px] pb-[10px]">
                {errorMessage}
              </p>
            )}

            {/* Button */}
            <div className="w-full px-3 mb-6">
              <button
                className="appearance-none block w-full bg-green-600 text-white font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight hover:bg-green-500 focus:outline-none"
                type="submit"
              >
                Sign up
              </button>
              <div className="text-center mt-2">
                <span className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-green-600 hover:underline font-semibold"
                  >
                    Login
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
