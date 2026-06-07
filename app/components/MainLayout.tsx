import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import useMediaQuery from "../hooks/useMediaQuery";
import ResendList from "./ResendList";
import ChatRoom from "./ChatRoom";

// Assets
import MenuDotsVertical from "../assets/menu-dots-vertical.svg";
import SearchIcon from "../assets/search.svg";
import EnvelopeIcon from "../assets/envelope.svg";
import UserAddIcon from "../assets/plus-small.svg";
import BubbleDiscussionIcon from "../assets/bubble-discussion.svg";
import CameraIcon from "../assets/at.svg";
import UsersIcon from "../assets/users.svg";
import PhoneCallIcon from "../assets/phone-call.svg";

export default function MainLayout() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUserId(params.get("userId") || "");
    setEmail(params.get("email") || "");
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("readtalk_theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#111b21" : "#ffffff");
    }
  }, [theme]);

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

  // ✅ PERBAIKAN: Hapus navigate ke /chat/:id
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    // Tidak perlu navigate, ChatRoom akan tampil di area yang sama
  };

  return (
    <div className={`app-layout ${theme}`}>
      <header className="app-header">
        <div className="app-header-left">
          <h1 className="app-header-title">READTalk</h1>
        </div>
        <div className="app-header-right">
          {userId && email && (
            <span className="app-user-info">
              {userId.slice(0, 8)}... | {email.split("@")[0]}
            </span>
          )}
          <button className="app-menu-btn" onClick={() => setShowMenu(!showMenu)}>
            <img src={MenuDotsVertical} alt="Menu" />
          </button>
          {showMenu && (
            <div className="app-dropdown">
              <button className="app-mode-toggle" onClick={toggleTheme}>
                {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              </button>
              <button className="app-dropdown-item" onClick={() => navigate("/profile")}>
                Profile
              </button>
              <button className="app-dropdown-item app-logout-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="app-search-container">
        <div className="app-search-box">
          <img src={SearchIcon} alt="Search" className="app-search-icon" />
          <input type="text" placeholder="Search name or message..." className="app-search-input" />
        </div>
      </div>

      <div className="app-main">
        {/* Sidebar: Resend List */}
        <aside className={`app-sidebar ${!isDesktop && selectedChatId ? "hidden" : ""}`}>
          <ResendList onSelectChat={handleSelectChat} />
        </aside>

        {/* Main Content */}
        <main className="app-content">
          {selectedChatId ? (
            <ChatRoom chatId={selectedChatId} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </main>
      </div>

      <nav className="app-bottom-nav">
        <button className={`app-bottom-tab ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>
          <img src={BubbleDiscussionIcon} alt="Chat" className="app-bottom-icon" />
          <span>Chat</span>
        </button>
        <button className={`app-bottom-tab ${activeTab === "updates" ? "active" : ""}`} onClick={() => setActiveTab("updates")}>
          <img src={CameraIcon} alt="Updates" className="app-bottom-icon" />
          <span>Updates</span>
        </button>
        <button className={`app-bottom-tab ${activeTab === "communities" ? "active" : ""}`} onClick={() => setActiveTab("communities")}>
          <img src={UsersIcon} alt="Communities" className="app-bottom-icon" />
          <span>Communities</span>
        </button>
        <button className={`app-bottom-tab ${activeTab === "calls" ? "active" : ""}`} onClick={() => setActiveTab("calls")}>
          <img src={PhoneCallIcon} alt="Calls" className="app-bottom-icon" />
          <span>Calls</span>
        </button>
      </nav>

      <button className="app-fab">
        <img src={UserAddIcon} alt="Add" />
      </button>
    </div>
  );
}
