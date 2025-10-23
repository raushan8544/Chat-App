import React from "react";
import { X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import avatar from "../assets/avatar.png";

const ChatHeader = () => {
  const {
    selectedUser,
    setSelectedUser,
    selectedMessage,
    clearSelectedMessage,
    deleteMessage,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) {
    // When no user is selected the header shows a simple placeholder to avoid runtime errors
    return (
      <div className="p-2.5 border-b border-base-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative bg-base-200" />
          </div>
          <div>
            <h3 className="font-medium header-accent">Select a user</h3>
          </div>
        </div>
        <div />
      </div>
    );
  }

  const handleDelete = async () => {
    if (!selectedMessage) {
      toast("Select a message first", { icon: "ℹ️" });
      return;
    }
    console.debug("Attempting to delete message", selectedMessage._id);
    const ok = await deleteMessage(selectedMessage._id);
    console.debug("Delete result", ok);
    if (ok) {
      clearSelectedMessage();
    }
  };

  return (
    <div className="p-2.5 border-b border-base-300 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="avatar">
          <div className="size-10 rounded-full relative">
            <img
              src={selectedUser.profilePic || avatar}
              alt={selectedUser.fullName}
            />
          </div>
        </div>

        <div>
          <h3 className="font-medium header-accent">{selectedUser.fullName}</h3>
          <p className="text-sm text-base-content/70 text-hover-gradient">
            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleDelete}
          title={selectedMessage ? "Delete selected message" : "Select a message to delete"}
          className={`p-2 rounded-md flex items-center gap-2 ${selectedMessage ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-base-200 text-base-content/70"}`}
        >
          <Trash2 size={18} />
          <span className="text-sm hidden sm:inline">Delete</span>
        </button>
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
