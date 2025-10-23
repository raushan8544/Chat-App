import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../database/cloudinary.js";
import { getReceiverSocketId ,io } from "../database/socket.io.js";

export const getUserForSidebar = async (req ,res)=>{

    try{
        const loggedInId = req.user._id;
        const filteredUser = await User.find({_id: {$ne:loggedInId}}).select("-password");
        
        res.status(200).json(filteredUser);
    }
    catch(error){
        console.error("Error in getUserForSiderbar",error.message);
        res.status(500).json({
            error:"Internal server error"
        });

    }
    
}


export const  getMessage = async(req ,res)=>{
    try{
        const {id:userToChatId} = req.params
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId , receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages)


    }
    catch(error){

        console.log("Error in getMessages controller",error.message);
        res.status(500).json({error:"Internal Server error"})

    }
}

export const sendMessage  = async (req,res) => {
    try{

        const {text,image}= req.body;
        const {id:receiverId}=req.params;
        const senderId = req.user._id;

        let imageUrl;

        if(image){
            //uploade on cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMassage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        })

        await newMassage.save();

        //emit socket event to receiver
        const receiverSocketId = getReceiverSocketId(receiverId);
         if(receiverSocketId){
            //emit event to receiverSocketId
            io.to(receiverSocketId).emit("newMessage", newMassage);
         }

        res.status(201).json(newMassage);


    }
    catch(error){

        console.log("Error in sendMessages controller",error.message);
        res.status(500).json({error:"Internal Server error"})

    }

}

// deleteMessageController
export const deleteMessageController = async (req, res) => {
    try {
        const messageId = req.params.id;
        console.log("deleteMessageController called for id:", messageId);
        const deleted = await Message.findByIdAndDelete(messageId);
        if (!deleted) {
            console.log("deleteMessageController: message not found", messageId);
            return res.status(404).json({ message: "Message not found" });
        }
        console.log("deleteMessageController: deleted message", deleted._id);
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (err) {
        console.error("deleteMessageController error", err);
        res.status(500).json({ message: "Error deleting message" });
    }
};

// DEV-ONLY: delete without auth for debugging (only use locally)
export const debugDeleteMessageController = async (req, res) => {
    try {
        const messageId = req.params.id;
        console.log("debugDeleteMessageController called for id:", messageId);
        const deleted = await Message.findByIdAndDelete(messageId);
        if (!deleted) {
            console.log("debugDeleteMessageController: message not found", messageId);
            return res.status(404).json({ message: "Message not found" });
        }
        console.log("debugDeleteMessageController: deleted message", deleted._id);
        res.status(200).json({ message: "Message deleted successfully (debug)" });
    } catch (err) {
        console.error("debugDeleteMessageController error", err);
        res.status(500).json({ message: "Error deleting message (debug)" });
    }
};

// DEV-ONLY: return cookies received in the request so frontend can confirm cookie sending
export const debugCookiesController = async (req, res) => {
    try {
        console.log('debugCookiesController: cookies received', req.cookies);
        res.status(200).json({ cookies: req.cookies });
    } catch (err) {
        console.error('debugCookiesController error', err);
        res.status(500).json({ message: 'Error reading cookies' });
    }
};

// AI assistant endpoint: POST /api/messages/ai/:id
// Sends `prompt` in req.body to OpenAI (if OPENAI_API_KEY set) and returns AI reply.
export const askAIController = async (req, res) => {
    try {
        const { id: receiverId } = req.params; // not strictly used, but kept for parity
        const { prompt } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        // If OPENAI_API_KEY present, call OpenAI Chat Completions API (gpt-3.5-turbo)
            if (process.env.OPENAI_API_KEY) {
            const apiKey = process.env.OPENAI_API_KEY;
            // Use fetch (Node 18+) to call the OpenAI API
                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                            messages: [{ role: 'user', content: prompt }],
                            max_tokens: 120,
                    temperature: 0.8,
                }),
            });

                    if (!response.ok) {
                        const text = await response.text();
                        console.error('OpenAI error', response.status, text);
                        // include status and body for dev debugging (do not leak in production logs)
                        return res.status(502).json({ message: 'OpenAI API error', status: response.status, details: text });
                    }

            const data = await response.json();
            const aiReply = data?.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

                    return res.status(200).json({ reply: aiReply });
        }

        // Fallback: return a simple canned transformation if no API key
        const fallback = `AI Assistant (fallback): I received your prompt: "${prompt.slice(0, 120)}". (Set OPENAI_API_KEY in environment to enable real AI responses.)`;
        res.status(200).json({ reply: fallback });
    } catch (err) {
        console.error('askAIController error', err);
        res.status(500).json({ message: 'Error generating AI response' });
    }
};

// Dev/test endpoint to verify OPENAI_API_KEY connectivity. Protected.
export const aiTestController = async (req, res) => {
    try {
        if (!process.env.OPENAI_API_KEY) return res.status(200).json({ ok: false, message: 'OPENAI_API_KEY not set' });
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        });
        const text = await response.text();
        if (!response.ok) {
            console.error('OpenAI test error', response.status, text);
            return res.status(502).json({ ok: false, status: response.status, details: text });
        }
        return res.status(200).json({ ok: true, details: JSON.parse(text) });
    } catch (err) {
        console.error('aiTestController error', err);
        return res.status(500).json({ ok: false, message: 'Error testing OpenAI key' });
    }
};



