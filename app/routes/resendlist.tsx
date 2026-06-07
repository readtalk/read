import { useNavigate } from 'react-router';

export default function ResendList() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('readtalk_token');
    localStorage.removeItem('readtalk_refresh_token');
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] bg-white dark:bg-gray-950">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Resend List
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Halaman ini masih dalam pengembangan.
        </p>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
