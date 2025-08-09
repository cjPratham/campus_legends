import { useState } from "react";
import axios from "axios";

export default function FileUpload({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in as admin");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      // const res = await axios.post("https://campus-legends.onrender.com/api/upload", formData, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      const res = await axios.post("/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message);
      setFile(null);
      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
      } else {
        alert("Upload failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragging ? "border-pink-500 bg-pink-50" : "border-gray-400"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <p className="mb-2">Drag & Drop CSV here or</p>
      <input
        type="file"
        accept=".csv"
        className="hidden"
        id="csvInput"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <label
        htmlFor="csvInput"
        className="cursor-pointer bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
      >
        Browse File
      </label>

      {file && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">{file.name}</p>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}
    </div>
  );
}
