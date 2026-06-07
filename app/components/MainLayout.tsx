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
  
  // ========== PWA INSTALL PROMPT ==========
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallUI, setShowInstallUI] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallUI(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then(() => {
        setShowInstallUI(false);
        setInstallPrompt(null);
      });
    }
  };

  const dismissInstall = () => {
    setShowInstallUI(false);
  };

  // ========== END PWA INSTALL PROMPT ==========

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

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
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
        <aside className={`app-sidebar ${!isDesktop && selectedChatId ? "hidden" : ""}`}>
          <ResendList onSelectChat={handleSelectChat} />
        </aside>

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

      {/* ========== CUSTOM PWA INSTALL PROMPT ========== */}
      {showInstallUI && (
        <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 z-50 border border-gray-200 dark:border-gray-700 animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="text-3xl">📁</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Install READTalk
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Add to home screen for easy access
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleInstall}
                  className="px-4 py-1.5 bg-red-600 text-white text-sm font-medium rounded-full hover:bg-red-700 transition-colors"
                >
                  Install
                </button>
                <button
                  onClick={dismissInstall}
                  className="px-4 py-1.5 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
            <button
              onClick={dismissInstall}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
