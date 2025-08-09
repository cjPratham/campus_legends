import FileUpload from "../components/FileUpload";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleReset = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://campus-legends.onrender.com/api/admin/reset-changes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Reset failed");
      }

      alert("Reset successful");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteAll = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to DELETE ALL student data? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://campus-legends.onrender.com/api/admin/reset-data", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete data");
      }

      alert("All student data deleted successfully.");
      // Optionally refresh or redirect here
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📂 Admin CSV Upload</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <FileUpload onSuccess={() => console.log("Upload complete, refresh leaderboard")} />

      <button
        onClick={handleReset}
        className="mt-6 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      >
        Reset Admin Data
      </button>

      <button
        onClick={handleDeleteAll}
        className="mt-4 mr-5 bg-red-700 px- py-2 rounded hover:bg-red-800"
      >
        Delete All Student Data
      </button>
    </div>
  );
}
