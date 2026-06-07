import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import UsersIcon from "../assets/users.svg";
import SettingsIcon from "../assets/settings.svg";

export default function Profile() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("readtalk_theme") as "light" | "dark" | null;
    if (saved) setTheme(saved);
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("readtalk_theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("readtalk_token");
    navigate("/");
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-white dark:bg-gray-950">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">READTalk</h1>
        <div className="flex gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <img src={SettingsIcon} alt="Settings" className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center">
          <img src={UsersIcon} alt="Profile" className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Profile
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Halaman profil masih dalam pengembangan.
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
