import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Callback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");

    // 1. Cek error dari OpenAuth
    if (error) {
      setStatus("error");
      setErrorMessage(error);
      return;
    }

    // 2. Cek ada code
    if (!code) {
      setStatus("error");
      setErrorMessage("No authorization code received");
      return;
    }

    // 3. Verifikasi state (CSRF protection)
    const savedState = sessionStorage.getItem("oauth_state");
    if (state && savedState && state !== savedState) {
      setStatus("error");
      setErrorMessage("State mismatch. Possible CSRF attack.");
      return;
    }

    // 4. Tukar code dengan access_token
    const exchangeCode = async () => {
      try {
        const redirectUri = window.location.origin + "/callback";
        
        const response = await fetch("https://auth.readtalk.workers.dev/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: "readtalk",
            code: code,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Token exchange failed");
        }

        // Simpan token
        if (data.access_token) {
          localStorage.setItem("readtalk_token", data.access_token);
          if (data.refresh_token) {
            localStorage.setItem("readtalk_refresh_token", data.refresh_token);
          }
          if (data.expires_in) {
            localStorage.setItem("readtalk_token_expiry", Date.now() + data.expires_in * 1000);
          }
          
          // Bersihkan state
          sessionStorage.removeItem("oauth_state");
          
          setStatus("success");
          setTimeout(() => {
            navigate("/resendlist");
          }, 1000);
        } else {
          throw new Error("No access token received");
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Failed to exchange code");
      }
    };

    exchangeCode();
  }, [navigate]);

  // Tampilan loading
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] bg-white dark:bg-gray-950">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Logging in...</p>
      </div>
    );
  }

  // Tampilan sukses
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] bg-white dark:bg-gray-950">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Login successful! Redirecting...</p>
      </div>
    );
  }

  // Tampilan error
  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] bg-white dark:bg-gray-950 px-4">
      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Login Failed</h2>
      <p className="text-gray-600 dark:text-gray-400 text-center">{errorMessage}</p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Back to Home
      </button>
    </div>
  );
}
