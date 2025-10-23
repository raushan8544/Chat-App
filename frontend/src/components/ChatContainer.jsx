import React, { useEffect, useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMassageLoading,
    selectedUser,
    subscribeToNewMessages,
    unSubcibeFromNewMessages,
    selectedMessage,
    setSelectedMessage,
    selectedMessages,
    toggleSelectedMessage,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(selectedUser._id);
    if (typeof subscribeToNewMessages === "function") subscribeToNewMessages();
    return () => {
      if (typeof unSubcibeFromNewMessages === "function") unSubcibeFromNewMessages();
    };
  }, [selectedUser?._id, getMessages, subscribeToNewMessages, unSubcibeFromNewMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMassageLoading) {
    return (
      <div>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const handleDoubleClick = (e, message) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupPosition({ x: rect.right + 10, y: rect.top });
    if (typeof setSelectedMessage === "function") setSelectedMessage(message);
  };

  return (
    <div className="flex-1 flex flex-col relative panel-bg">
      <div className="flex-none z-20">
        <ChatHeader />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        <div className="chat-blobs" aria-hidden>
          <div className="chat-blob b1" />
          <div className="chat-blob b2" />
        </div>
  <AnimatePresence>
          {messages.map((message, idx) => (
            <Motion.div
              key={message._id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`chat ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              }`}
              ref={idx === messages.length - 1 ? messageEndRef : null}
            >
              <Motion.div
                className="chat-image avatar"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="size-10 rounded-full border overflow-hidden">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </Motion.div>

              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <Motion.div
                onDoubleClick={(e) => {
                  if (message.deleted) return;
                  handleDoubleClick(e, message);
                }}
                onClick={(e) => {
                  if (message.deleted) return;
                  // Ctrl/Cmd click toggles selection for multi-select
                  const rect = e.currentTarget.getBoundingClientRect();
                  setPopupPosition({ x: rect.right + 10, y: rect.top });
                  const isMod = e.ctrlKey || e.metaKey;
                  if (isMod && typeof toggleSelectedMessage === "function") {
                    toggleSelectedMessage(message);
                    return;
                  }
                  if (typeof setSelectedMessage === "function") {
                    setSelectedMessage(message);
                    console.debug("Message selected", message._id);
                  }
                }}
                className={`chat-bubble flex flex-col shadow-md transition-all duration-200 animated-bubble ${
                  message.senderId === authUser._id ? 'sent' : 'received'
                } ${message.deleted ? "opacity-70 cursor-default italic text-gray-400" : "cursor-pointer"} ${selectedMessages.includes(String(message._id)) ? "ring-2 ring-blue-400 scale-105" : ""}`}
                whileHover={message.deleted ? {} : { scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {message.deleted ? (
                  <div className="px-3 py-2 text-sm text-center text-gray-400">message was delete</div>
                ) : (
                  <>
                    {message.image && (
                      <Motion.img
                        src={message.image}
                        alt="message pic"
                        className="max-h-60 rounded-lg mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      />
                    )}

                    {message.text && (
                      <Motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {message.text}
                      </Motion.p>
                    )}
                  </>
                )}
              </Motion.div>
            </Motion.div>
          ))}
        </AnimatePresence>

        {/* Popup menu */}
        {selectedMessage && (
          <div
            className="absolute bg-white shadow-lg rounded-lg px-3 py-2 flex gap-3 items-center z-50 border"
            style={{ top: popupPosition.y, left: popupPosition.x }}
          >
            <button title="Add Emoji">😊</button>
            <button title="Forward">📤</button>
            <button
              title="Close"
              onClick={() => typeof setSelectedMessage === "function" && setSelectedMessage(null)}
              className="text-red-500"
            >
              ✖
            </button>
          </div>
        )}
      </div>

      <div className="flex-none z-20">
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MessageInput />
        </Motion.div>
      </div>
    </div>
  );
};

export default ChatContainer;
