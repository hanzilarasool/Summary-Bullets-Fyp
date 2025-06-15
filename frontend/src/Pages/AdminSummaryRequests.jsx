
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Copy, MailCheck, SquarePen, Download, Loader2 } from "lucide-react";
import config from "../config";

const API_URL = config.API_URL;

// Utility for copying
function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}

// Utility for CSV download
function exportCSV(requests) {
  if (!requests.length) return;
  const header = ["User Email", "Book Name", "Status", "Requested At"];
  const rows = requests.map(r => [
    `"${r.userEmail}"`,
    `"${r.bookName}"`,
    `"${r.status}"`,
    `"${new Date(r.createdAt).toLocaleString()}"`
  ]);
  const csv = [header, ...rows].map(e => e.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "summary-requests.csv";
  a.click();
  window.URL.revokeObjectURL(url);
}

function AdminSummaryRequests() {
  const { currentUser } = useSelector((state) => state.user);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false); // Only for modal actions!
  const [statusModal, setStatusModal] = useState({ open: false, req: null });
  const [sendModal, setSendModal] = useState({ open: false, req: null, email: "", message: "" });
  const [statusUpdate, setStatusUpdate] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch summary requests for admin
  useEffect(() => {
    if (currentUser?.user?.role !== "admin") return;
    setLoading(true);
    axios
      .get(`${API_URL}/api/v1/admin/summary-requests`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      })
      .then((res) => setRequests(res.data.requests))
      .catch((err) => setError("Failed to load requests"))
      .finally(() => setLoading(false));
  }, [currentUser]);

  // Update status
  const handleStatusUpdate = async () => {
    if (!statusModal.req || !statusUpdate) return;
    try {
      setModalLoading(true);
      await axios.patch(
        `${API_URL}/api/v1/admin/summary-requests/${statusModal.req._id}`,
        { status: statusUpdate },
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      setSuccessMsg("Status updated");
      setRequests((prev) =>
        prev.map((r) => (r._id === statusModal.req._id ? { ...r, status: statusUpdate } : r))
      );
      setStatusModal({ open: false, req: null });
    } catch {
      setError("Failed to update status");
    } finally {
      setModalLoading(false);
    }
  };

  // Send fulfillment email (and set status to fulfilled/processed)
  const handleSendSummary = async () => {
    if (!sendModal.email || !sendModal.message || !sendModal.req) return;
    try {
      setModalLoading(true);
      await axios.post(
        `${API_URL}/api/v1/admin/send-summary-fulfilled`,
        {
          requestId: sendModal.req._id,
          email: sendModal.email,
          message: sendModal.message,
        },
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      setSuccessMsg("Reader is informed successfully");
      setRequests((prev) =>
        prev.map((r) =>
          r._id === sendModal.req._id ? { ...r, status: "processed" } : r
        )
      );
      setSendModal({ open: false, req: null, email: "", message: "" });
    } catch {
      setError("Failed to send summary email");
    } finally {
      setModalLoading(false);
    }
  };

  // Filtered requests
  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((r) => r.status === filter);

  // UI
  return (
    <div className="s-req-ad-pg-main min-h-screen bg-[rgb(252,252,252)] py-8 px-2 sm:px-6">
      <div className="s-req-ad-pg-header max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="s-req-ad-pg-title text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
          Summary Requests
        </h1>
        <div className="flex gap-3 items-center flex-wrap">
          <select
            className="s-req-ad-pg-filter px-3 py-2 rounded border bg-gray-50 text-gray-900 font-medium"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="processed">Processed</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            className="s-req-ad-pg-download flex items-center gap-1 px-3 py-2 rounded bg-gray-900 text-white font-semibold hover:bg-gray-800 transition"
            onClick={() => exportCSV(filteredRequests)}
            disabled={!filteredRequests.length}
          >
            <Download size={16} /> Download CSV
          </button>
        </div>
      </div>
      {(successMsg || error) && (
        <div className="max-w-5xl mx-auto mb-4">
          {successMsg && (
            <div className="s-req-ad-pg-success px-4 py-2 bg-green-50 text-green-900 rounded font-medium text-sm shadow mb-2">
              {successMsg}
            </div>
          )}
          {error && (
            <div className="s-req-ad-pg-error px-4 py-2 bg-red-50 text-red-900 rounded font-medium text-sm shadow">
              {error}
            </div>
          )}
        </div>
      )}

      {/* TABLE FOR DESKTOP */}
      <div className="s-req-ad-pg-table max-w-5xl mx-auto hidden lg:block bg-white shadow-xl rounded-2xl overflow-x-auto">
        <table className="s-req-ad-pg-table-inner min-w-full divide-y divide-gray-200">
          <thead className="bg-[rgb(252,252,252)]">
            <tr>
              <th className="s-req-ad-pg-th px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                User Email
              </th>
              <th className="s-req-ad-pg-th px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Book Name
              </th>
              <th className="s-req-ad-pg-th px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="s-req-ad-pg-th px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Requested At
              </th>
              <th className="s-req-ad-pg-th px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="s-req-ad-pg-tbody bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="s-req-ad-pg-td px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={5} className="s-req-ad-pg-td px-6 py-4 text-center">
                  No summary requests found.
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => (
                <tr key={req._id}>
                  <td className="s-req-ad-pg-td px-6 py-4 flex items-center gap-2">
                    <span className="s-req-ad-pg-email text-blue-900 font-medium break-all">
                      {req.userEmail}
                    </span>
                    <button
                      className="s-req-ad-pg-copy-btn p-1 rounded hover:bg-blue-50"
                      title="Copy Email"
                      onClick={() => copyToClipboard(req.userEmail)}
                    >
                      <Copy size={16} />
                    </button>
                  </td>
                  <td className="s-req-ad-pg-td px-6 py-4">{req.bookName}</td>
                  <td className="s-req-ad-pg-td px-6 py-4">
                    <span
                      className={`s-req-ad-pg-status px-2 py-1 rounded-full text-xs font-semibold ${
                        req.status === "pending"
                          ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                          : req.status === "processed"
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </td>
                  <td className="s-req-ad-pg-td px-6 py-4">
                    {new Date(req.createdAt).toLocaleString()}
                  </td>
                  <td className="s-req-ad-pg-td px-6 py-4 text-center flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      className="s-req-ad-pg-edit-btn flex items-center gap-1 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold border border-gray-200"
                      onClick={() => {
                        setStatusModal({ open: true, req });
                        setStatusUpdate(req.status);
                        setSuccessMsg("");
                        setError("");
                      }}
                    >
                      <SquarePen size={14} /> Update
                    </button>
                    <button
                      className="s-req-ad-pg-send-btn flex items-center gap-1 px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold border border-blue-200"
                      onClick={() => {
                        setSendModal({ open: true, req, email: req.userEmail, message: "" });
                        setSuccessMsg("");
                        setError("");
                      }}
                    >
                      <MailCheck size={14} /> Send
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CARD VIEW FOR MOBILE/TABLET */}
      <div className="s-req-ad-pg-cardlist lg:hidden max-w-2xl mx-auto flex flex-col gap-5">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No summary requests found.</div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req._id}
              className="s-req-ad-pg-card bg-white border border-gray-200 rounded-xl shadow px-4 py-4 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <div className="font-bold text-gray-800 flex-1">User Email:</div>
                <span className="text-blue-900 font-medium break-all">{req.userEmail}</span>
                <button
                  className="p-1 rounded hover:bg-blue-50"
                  onClick={() => copyToClipboard(req.userEmail)}
                  title="Copy"
                >
                  <Copy size={16} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-bold text-gray-800 flex-1">Book Name:</div>
                <span>{req.bookName}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-bold text-gray-800 flex-1">Status:</div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    req.status === "pending"
                      ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                      : req.status === "processed"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-bold text-gray-800 flex-1">Requested At:</div>
                <span>{new Date(req.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="flex-1 flex items-center gap-1 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold border border-gray-200 justify-center"
                  onClick={() => {
                    setStatusModal({ open: true, req });
                    setStatusUpdate(req.status);
                    setSuccessMsg("");
                    setError("");
                  }}
                >
                  <SquarePen size={14} /> Update
                </button>
                <button
                  className="flex-1 flex items-center gap-1 px-3 py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold border border-blue-200 justify-center"
                  onClick={() => {
                    setSendModal({ open: true, req, email: req.userEmail, message: "" });
                    setSuccessMsg("");
                    setError("");
                  }}
                >
                  <MailCheck size={14} /> Send
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Status Modal */}
      {statusModal.open && (
        <div className="s-req-ad-pg-modal fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-30">
          <div className="s-req-ad-pg-modal-content bg-white px-6 py-8 rounded-2xl shadow-2xl max-w-xs w-full">
            <h2 className="s-req-ad-pg-modal-title text-xl font-bold mb-4">Update Status</h2>
            <select
              className="s-req-ad-pg-modal-select w-full p-2 rounded border bg-gray-50 mb-4"
              value={statusUpdate}
              onChange={(e) => setStatusUpdate(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="flex gap-2">
              <button
                className="s-req-ad-pg-modal-cancel flex-1 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                onClick={() => setStatusModal({ open: false, req: null })}
                disabled={modalLoading}
              >
                Cancel
              </button>
              <button
                className={`s-req-ad-pg-modal-submit flex-1 px-4 py-2 rounded bg-green-700 hover:bg-green-800 text-white font-semibold transition ${modalLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={handleStatusUpdate}
                disabled={modalLoading}
              >
                {modalLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Updating...
                  </span>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Fulfillment Modal */}
      {sendModal.open && (
        <div className="s-req-ad-pg-modal fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-30">
          <div className="s-req-ad-pg-modal-content bg-white px-6 py-8 rounded-2xl shadow-2xl max-w-md w-full">
            <h2 className="s-req-ad-pg-modal-title text-xl font-bold mb-4 flex items-center gap-2">
              <MailCheck size={20} /> Send Summary to User
            </h2>
            <label className="s-req-ad-pg-modal-label block mb-2 font-semibold text-gray-800">
              Email
              <div className="flex items-center gap-2 mt-1">
                <input
                  className="s-req-ad-pg-modal-input flex-1 p-2 rounded border bg-gray-50"
                  type="email"
                  value={sendModal.email}
                  onChange={(e) =>
                    setSendModal((s) => ({ ...s, email: e.target.value }))
                  }
                  readOnly
                />
                <button
                  className="s-req-ad-pg-modal-copy px-2 py-1 rounded hover:bg-blue-50"
                  title="Copy Email"
                  onClick={() => copyToClipboard(sendModal.email)}
                >
                  <Copy size={16} />
                </button>
              </div>
            </label>
            <label className="s-req-ad-pg-modal-label block mb-2 font-semibold text-gray-800 mt-4">
              Message
              <textarea
                className="s-req-ad-pg-modal-textarea w-full p-2 rounded border bg-gray-50 mt-1"
                rows={4}
                placeholder="Enter your message to the user..."
                value={sendModal.message}
                onChange={(e) =>
                  setSendModal((s) => ({ ...s, message: e.target.value }))
                }
              />
            </label>
            <div className="flex gap-2 mt-4">
              <button
                className="s-req-ad-pg-modal-cancel flex-1 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                onClick={() => setSendModal({ open: false, req: null, email: "", message: "" })}
                disabled={modalLoading}
              >
                Cancel
              </button>
              <button
                className={`s-req-ad-pg-modal-submit flex-1 px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold transition ${modalLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={handleSendSummary}
                disabled={modalLoading}
              >
                {modalLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Sending...
                  </span>
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSummaryRequests;