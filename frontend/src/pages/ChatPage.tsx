// src/pages/pdf/ChatPage.tsx
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePDFStore } from "@/store/pdfStore";
import { ask } from "@/api/askService";

interface ChatMessage {
    sender: "user" | "pdf";
    text: string;
}

const ChatPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const selectedPDF = usePDFStore((s) => s.selectedPDF);
    const selectPDF = usePDFStore((s) => s.selectPDF);

    const vectorId = id || selectedPDF?.pdfVectorId;
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !vectorId) return;

        const question = input.trim();
        setMessages((prev) => [...prev, { sender: "user", text: question }]);
        setInput("");
        setLoading(true);

        try {
            const response:any = await ask(question, vectorId);
console.log(response)
            // Extract answer from structured response
            const answerText = response?.answer || "No response from PDF.";


            setMessages((prev) => [...prev, { sender: "pdf", text: answerText }]);
        } catch (err) {
            setMessages((prev) => [...prev, { sender: "pdf", text: "Error fetching response." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className="flex flex-col border rounded shadow-lg w-full h-full">
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Chat with PDF {vectorId}</h2>
                {selectedPDF && (
                    <button
                        className="text-gray-500 hover:text-red-500"
                        onClick={() => selectPDF(null)}
                    >
                        Close
                    </button>
                )}
            </div>

            {/* Chat messages */}
            <div
                ref={scrollRef}
                className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200"
            >
                {messages.length === 0 && (
                    <div className="text-gray-400 text-center mt-8">
                        Ask a question to start chatting with this PDF.
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[70%] px-4 py-2 rounded-lg text-sm break-words
                ${msg.sender === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"}`}
                        >
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="text-gray-500 text-sm">PDF is thinking...</div>
                )}
            </div>

            {/* Input box */}
            <div className="p-3 border-t flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Type your question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || !vectorId}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatPage;
