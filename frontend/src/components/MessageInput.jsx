import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { Cpu } from 'lucide-react';

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const aiUnavailable = useChatStore((s) => s.aiUnavailable);
  const [aiLoading, setAiLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleAskAI = async () => {
    if (aiUnavailable) {
      toast.error('AI is temporarily unavailable (quota or billing). Check backend / OpenAI billing.');
      return;
    }
    const prompt = text.trim();
    if (!prompt) {
      toast.error('Type a question or prompt for the AI');
      return;
    }
    try {
  setAiLoading(true);
      const ai = useChatStore.getState().askAI;
      const res = await ai(prompt);
      setAiLoading(false);
      if (!res) {
        toast.error('No response from AI');
        return;
      }
      if (res.ok) {
        // success: clear input
        setText('');
        toast.success('AI replied');
        return;
      }
      // show detailed error (err object or message)
      const detail = res.error?.details || res.error?.message || JSON.stringify(res.error);
      toast.error(`AI error: ${detail}`);
    } catch (err) {
      setAiLoading(false);
      console.error('AI request failed', err);
      toast.error('AI request failed');
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md input-glow"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Ask AI"
            onClick={handleAskAI}
            className="btn btn-sm btn-circle btn-ghost"
            aria-label="Ask AI"
            disabled={aiLoading || aiUnavailable}
          >
            {aiLoading ? <Loader className="animate-spin" size={16} /> : <Cpu size={18} />}
          </button>
          <button
            type="submit"
            className="btn btn-sm btn-circle bg-gradient-to-r from-violet-500 to-cyan-400 shadow-lg"
            disabled={!text.trim() && !imagePreview}
          >
            <Send size={22} />
          </button>
        </div>
      </form>
    </div>
  );
};
export default MessageInput;
