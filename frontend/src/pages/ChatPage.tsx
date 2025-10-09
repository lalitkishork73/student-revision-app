// src/pages/pdf/ChatPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { usePDFStore } from '@/store/pdfStore';

const ChatPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const selectedPDF = usePDFStore((s) => s.selectedPDF);

    const vectorId = id || selectedPDF?.pdfVectorId;

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Chat with PDF {vectorId}</h2>
            <div className="border rounded p-4 text-sm text-gray-600">
                Chat UI placeholder — integrate your chat component here.
            </div>
        </div>
    );
};

export default ChatPage;
