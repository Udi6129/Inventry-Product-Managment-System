import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const placeholderAvatar = "https://via.placeholder.com/150";

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  if (!user) {
    return <p className="p-6 text-center text-gray-500">No profile data found. Please login again.</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
    setStatus("Profile updated successfully.");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-md p-8">
      <div className="flex flex-col items-center">
        <img
          src={formData.avatar || placeholderAvatar}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-purple-200"
        />
        <h2 className="text-2xl font-bold mt-4 text-gray-800">{formData.name || "Update your name"}</h2>
        <p className="text-gray-500">{user.role?.toUpperCase() || "USER"}</p>
      </div>

      {status && (
        <p className="mt-4 text-center text-sm text-green-600 bg-green-50 py-2 rounded-lg">
          {status}
        </p>
      )}

      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {["name", "email", "phone", "address", "avatar"].map((field) => (
            <div key={field} className="bg-purple-50 rounded-xl p-4">
              <label className="block text-gray-500 capitalize mb-1" htmlFor={field}>
                {field}
              </label>
              {isEditing ? (
                <input
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border border-purple-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              ) : (
                <p className="font-semibold text-gray-800 break-words">
                  {formData[field] || `Add ${field}`}
                </p>
              )}
            </div>
          ))}
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-gray-500">Status</p>
            <p className="font-semibold text-green-600">Active</p>
          </div>
        </div>

        <div className="flex justify-center mt-6 gap-4">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setStatus("");
                  setFormData({
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    address: user.address || "",
                    avatar: user.avatar || "",
                  });
                }}
                className="px-6 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              type="button"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
