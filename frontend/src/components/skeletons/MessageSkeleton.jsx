import React from "react";
//import { motion } from "framer-motion";
import { motion as Motion } from "framer-motion";

const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  // Animation variants for staggered fade-slide-in
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
  <Motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex-1 overflow-y-auto p-4 space-y-6 bg-base-100"
    >
      {skeletonMessages.map((_, idx) => (
  <Motion.div
          key={idx}
          variants={item}
          className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"} transition-transform duration-500 hover:scale-[1.02]`}
        >
          {/* Avatar */}
          <div className="chat-image avatar">
                        <Motion.div
              className="size-10 rounded-full overflow-hidden relative"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <div className="skeleton w-full h-full rounded-full" />
            </Motion.div>
          </div>

          {/* Header */}
                    <Motion.div
            className="chat-header mb-1"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="skeleton h-4 w-16 rounded-md" />
          </Motion.div>

          {/* Message bubble */}
                    <Motion.div
            className="chat-bubble  bg-transparent p-0"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="skeleton h-16 w-[200px] rounded-xl relative overflow-hidden">
              {/* shimmer effect */}
              <Motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear",
                }}
              />
            </div>
              </Motion.div>
  </Motion.div>
      ))}
  </Motion.div>
  );
};

export default MessageSkeleton;
