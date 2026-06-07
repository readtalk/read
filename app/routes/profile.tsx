import UsersIcon from "../assets/users.svg";

export default function Profile() {
  return (
    <div className="text-center">
      <img src={UsersIcon} alt="Profile" className="w-16 h-16 mx-auto mb-4 opacity-50" />
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Profile
      </h2>
      <p className="text-gray-500 dark:text-gray-400">
        Halaman profil sedang dikembangkan.
      </p>
    </div>
  );
}
