import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import config from "../config";

function Profile() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    try {
      const response = await fetch(`${config.API_URL}/api/v1/changePassword`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to change password");
      setSuccess("Password changed successfully");
      setIsPasswordModalOpen(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError("Failed to change password");
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.API_URL}/api/v1/changeEmail`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to change email");
      setSuccess("Email changed successfully");
      setIsEmailModalOpen(false);
      setNewEmail("");
    } catch (err) {
      setError("Failed to change email");
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/v1/signout`, {
        method: "POST",
      });
      dispatch(signoutSuccess());
      localStorage.clear();
      if (!response.ok) throw new Error("Failed to sign out");
      window.location.href = "/login";
    } catch (err) {
      setError("Failed to sign out");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex-col justify-center items-center gap-2 flex">
        <div className="text-slate-800 text-[40px] font-semibold font-['Inter']">
          Profile
        </div>

        <div className="text-gray-500 text-base font-normal font-['Inter']">
          {email}
        </div>
      </div>
      <div className="max-w-2xl flex-wrap mx-auto bg-white flex justify-evenly shadow-md rounded px-8 mt-[80px] pb-8 mb-4">
        <button
          onClick={() => setIsPasswordModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Change Password
        </button>
        <button
          onClick={() => setIsEmailModalOpen(true)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Change Email
        </button>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign Out
        </button>
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full"
          onClick={() => setIsPasswordModalOpen(false)}
        >
          <div
            className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Change Password
            </h3>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Current Password"
                className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
                className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm New Password"
                className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Change Modal */}
      {isEmailModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full"
          onClick={() => setIsEmailModalOpen(false)}
        >
          <div
            className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Change Email
            </h3>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="New Email"
                className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Change Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Displaying error and success messages */}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      {success && (
        <div className="text-green-500 text-center mt-4">{success}</div>
      )}
    </div>
  );
}

export default Profile;
