


import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import config from "../config";

const Signup = () => {
  const [step, setStep] = useState(1); // 1: details, 2: otp
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  // Handle input changes for signup form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    setErrorMessage("");
  };

  // Handle input changes for OTP
  const handleOTPChange = (e, idx) => {
    const val = e.target.value;
    if (/^[0-9]?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[idx] = val;
      setOtp(newOtp);
      // Move focus
      if (val && idx < 5) otpRefs.current[idx + 1].focus();
      if (!val && idx > 0) otpRefs.current[idx - 1].focus();
      setErrorMessage("");
    }
  };

  const handleOTPKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1].focus();
    }
  };

  // Step 1: Send signup info to get OTP
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;
    if (!username || !email || !password) {
      setErrorMessage("Please fill all the fields.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${config.API_URL}/api/v1/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "Failed to send OTP.");
        setLoading(false);
      } else {
        setMessage("OTP sent to your email. Please enter the OTP to verify.");
        setStep(2);
        setLoading(false);
      }
    } catch (err) {
      setErrorMessage(err.message || "Network error");
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and complete registration
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setErrorMessage("Please enter the 6-digit OTP.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${config.API_URL}/api/v1/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, otp: otpValue }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "OTP verification failed.");
        setLoading(false);
      } else {
        setMessage("Signup successful! Redirecting to login...");
        setLoading(false);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setErrorMessage(err.message || "Network error");
      setLoading(false);
    }
  };

  // Autofocus first OTP box on OTP step
  useEffect(() => {
    if (step === 2 && otpRefs.current[0]) otpRefs.current[0].focus();
  }, [step]);

  return (
    <div>
      <div className="text-center mt-24">
        <h2 className="text-4xl tracking-tight">
          {step === 1 ? "Create an account" : "Email Verification"}
        </h2>
      </div>
      <div className="flex justify-center my-2 mx-4 md:mx-0">
        <form
          className="w-full max-w-xl bg-white rounded-lg shadow-md p-6"
          onSubmit={step === 1 ? handleSignupSubmit : handleOTPSubmit}
        >
          <div className="flex flex-wrap -mx-3 mb-6">
            {step === 1 ? (
              <>
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                  <div
                    className="absolute right-4 top-[42px] cursor-pointer text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-full px-3 mb-6">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="otp"
                  >
                    Enter 6-digit OTP sent to your email
                  </label>
                  <div className="flex space-x-2 justify-center">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength="1"
                        className="w-12 h-12 text-center text-xl border border-gray-400 rounded-lg focus:outline-none"
                        value={otp[idx]}
                        onChange={(e) => handleOTPChange(e, idx)}
                        onKeyDown={(e) => handleOTPKeyDown(e, idx)}
                        ref={(el) => (otpRefs.current[idx] = el)}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        disabled={loading}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
            {/* Error */}
            {errorMessage && (
              <p className="text-red-500 text-xs italic pl-[20px] pb-[10px]">{errorMessage}</p>
            )}
            {/* Success */}
            {message && (
              <p className="text-green-600 text-xs italic pl-[20px] pb-[10px]">{message}</p>
            )}
            {/* Button */}
            <div className="w-full px-3 mb-6">
              <button
                className={`appearance-none block w-full ${
                  step === 1 ? "bg-blue-600" : "bg-blue-600"
                } text-white font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight hover:bg-blue-500 focus:outline-none flex items-center justify-center`}
                type="submit"
                disabled={loading}
              >
                {loading && (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                )}
                {loading
                  ? step === 1
                    ? "Signing up..."
                    : "Verifying..."
                  : step === 1
                  ? "Sign up"
                  : "Verify OTP"}
              </button>
              <div className="text-center mt-2">
                <span className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:underline font-semibold"
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