// app/components/ResendList.tsx
import UsersIcon from "../assets/users.svg";

const dummyChats = [
  { id: "1", name: "Budi", lastMessage: "Halo, apa kabar?", time: "10:30", avatar: UsersIcon },
  { id: "2", name: "Siti", lastMessage: "Besok jadi jam 3?", time: "09:15", avatar: UsersIcon },
  { id: "3", name: "Laura AI", lastMessage: "Saya asisten virtual Anda", time: "Kemarin", avatar: UsersIcon },
];

export default function ResendList({ onSelectChat }: { onSelectChat: (id: string) => void }) {
  return (
    <div className="resend-list">
      {dummyChats.map((chat) => (
        <div key={chat.id} className="resend-item" onClick={() => onSelectChat(chat.id)}>
          <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full" />
          <div className="flex-1 ml-3">
            <h4 className="font-medium text-gray-800 dark:text-white">{chat.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{chat.lastMessage}</p>
          </div>
          <span className="text-xs text-gray-400">{chat.time}</span>
        </div>
      ))}
    </div>
  );
}
