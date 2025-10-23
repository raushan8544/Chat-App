import {create} from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance} from '../lib/axios';
import { useAuthStore } from './useAuthStore';


export const useChatStore = create((set,get) => ({
    messages: [],
   aiUnavailable: false,
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMassageLoading: false,
    selectedMessage: null, 
  selectedMessages: [],

    getUsers: async () => {
        set({isUserLoading: true});

        try {
            const res = await axiosInstance.get('/messages/users');
            set({users: res.data});


        }
        catch (error){
            toast.error(error.response.data.messages);
            console.log("Error in getting users", error);

        }
        finally {
            set({isUserLoading: false});
        }
    },

    getMessages: async (userId) => {
        set({isMassageLoading: true});

        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data})

        }
        catch (error){
            toast.error(error.response.data.message);
            console.log("Error in getting messages", error);

        }
        finally {
            set({isMassageLoading: false});

        }
    },

    sendMessage: async (messageData) => {
    const {  selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToNewMessages: () => {
    const { selectedUser} = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage" , (newMessage) => {
        if(newMessage.senderId !== selectedUser._id) return;
        set({
            messages: [...get().messages, newMessage]
        });
    });

  },

  unSubcibeFromNewMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },


   deleteMessage: async (messageId) => {
    try {
      console.debug("deleteMessage: sending DELETE to", `/messages/delete/${messageId}`);
      const res = await axiosInstance.delete(`/messages/delete/${messageId}`); // ✅ correct route
      console.debug("deleteMessage: response", res.status, res.data);
      // mark the message as deleted in client state instead of removing it
      set((state) => ({
        messages: state.messages.map((m) =>
          String(m._id) === String(messageId)
            ? { ...m, text: "message was delete", image: null, deleted: true }
            : m
        ),
      }));
      toast.success(res?.data?.message || "Message deleted");
      return true;
    } catch (error) {
      console.debug("deleteMessage: error", error?.response?.status, error?.response?.data);
      toast.error(error.response?.data?.message || "Failed to delete message");
      console.error("Error deleting message", error);
      return false;
    }
  },

  // Ask the AI assistant for a reply to the current prompt. The reply will be appended
  // to the conversation as if sent by the selectedUser (assistant persona).
  askAI: async (prompt) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      toast.error('Select a user before asking the AI.');
      return null;
    }
    try {
      const res = await axiosInstance.post(`/messages/ai/${selectedUser._id}`, { prompt });
      const replyText = res?.data?.reply;
      if (!replyText) throw new Error('No reply from AI');

      const aiMessage = {
        _id: `ai-${Date.now()}`,
        senderId: selectedUser._id,
        receiverId: useAuthStore.getState().authUser._id,
        text: replyText,
        createdAt: new Date().toISOString(),
        image: null,
      };

      // append locally
      set({ messages: [...messages, aiMessage] });

      // Optionally, emit to socket so other clients see it
      const socket = useAuthStore.getState().socket;
      if (socket) socket.emit('newMessage', aiMessage);

      return { ok: true, message: aiMessage };
    } catch (err) {
      console.error('askAI error', err);
      const details = err?.response?.data || err.message || 'Unknown';
      // If OpenAI indicates insufficient_quota, set aiUnavailable flag
      const code = err?.response?.data?.error?.code || err?.response?.data?.code || null;
      if (code === 'insufficient_quota' || err?.response?.status === 429) {
        set({ aiUnavailable: true });
      }
      // Return structured error so UI can display details
      return { ok: false, error: details, code };
    }
  },

  clearSelectedMessage: () => set({ selectedMessage: null, selectedMessages: [] }),

    setSelectedMessage: (message) => set({ selectedMessage: message, selectedMessages: message ? [String(message._id)] : [] }),

    setSelectedMessages: (ids) => set({ selectedMessages: ids.map(String) }),

    toggleSelectedMessage: (message) => {
      const id = String(message._id);
      const { selectedMessages } = get();
      if (selectedMessages.includes(id)) {
        set({ selectedMessages: selectedMessages.filter((s) => s !== id) });
        // update primary selectedMessage if it was the one removed
        const { selectedMessage } = get();
        if (selectedMessage && String(selectedMessage._id) === id) {
          set({ selectedMessage: null });
        }
      } else {
        set({ selectedMessages: [...selectedMessages, id], selectedMessage: message });
      }
    },

    deleteMessages: async (ids) => {
      // delete multiple messages sequentially to keep server load predictable
      for (const id of ids) {
        await get().deleteMessage(id);
      }
      // clear selection after delete
      set({ selectedMessages: [], selectedMessage: null });
      return true;
    },






  
    
    setSelectedUser: (selectedUser) => set({selectedUser}) 

  ,setAiUnavailable: (v) => set({ aiUnavailable: v })






}))