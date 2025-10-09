// src/components/PDFCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, MessageCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePDFStore } from "@/store/pdfStore";

interface Props {
    pdf: any;
    onClick?: (pdf: any) => void;
}

export const PDFCard: React.FC<Props> = ({ pdf, onClick }) => {
    const navigate = useNavigate();
    const selectPDF = usePDFStore((s) => s.selectPDF);

    const handleOpenPDF = () => {
        selectPDF(pdf);
        onClick?.(pdf);
        const id = pdf.pdfVectorId || pdf._id;
        navigate(`/pdf/${id}`);
    };

    const openQuiz = (e: React.MouseEvent) => {
        e.stopPropagation(); // 🚫 stop upper click
        selectPDF(pdf);
        const id = pdf.pdfVectorId || pdf._id;
        navigate(`/pdf/${id}/quiz`);
    };

    const openChat = (e: React.MouseEvent) => {
        e.stopPropagation(); // 🚫 stop upper click
        selectPDF(pdf);
        const id = pdf.pdfVectorId || pdf._id;
        navigate(`/pdf/${id}/chat`);
    };

    return (
        <Card className="hover:shadow-lg transition-shadow flex flex-col items-center w-56 h-56">
            <CardContent className="flex flex-col items-center p-2 w-full h-full justify-between">
                {/* Upper Section → opens PDF */}
                <div
                    className="flex flex-col items-center cursor-pointer w-full"
                    onClick={handleOpenPDF}
                >
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full">
                        <FileText className="w-8 h-8 text-red-600" />
                    </div>

                    <div className="mt-2 text-sm font-medium text-center truncate w-full px-2">
                        {pdf.name}
                    </div>

                    <div className="mt-1 text-xs text-gray-400">
                        {new Date(pdf.createdAt).toLocaleDateString()}
                    </div>
                </div>

                {/* Buttons → only Chat/Quiz */}
                <div className="flex flex-col    sm:flex-row gap-2 mt-3 w-full">
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={openChat}
                    >
                        <MessageCircle className="w-4 h-4 mr-1" /> Chat
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={openQuiz}
                    >
                        <Edit className="w-4 h-4 mr-1" /> Quiz
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default PDFCard;
