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
        e.stopPropagation();
        selectPDF(pdf);
        const id = pdf.pdfVectorId || pdf._id;
        navigate(`/pdf/${id}/quiz`);
    };

    const openChat = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectPDF(pdf);
        const id = pdf.pdfVectorId || pdf._id;
        navigate(`/pdf/${id}/chat`);
    };

    return (
        <Card
            className="group hover:shadow-md hover:border-gray-400 transition-all duration-300 
                 flex flex-col w-full h-auto rounded-xl border border-gray-300 
                 bg-card dark:border-gray-700"
        >
            <CardContent className="flex flex-col items-center p-4 w-full h-full justify-between">
                {/* Thumbnail + Title → Click to Open */}
                <div
                    className="flex flex-col items-center justify-center cursor-pointer w-full"
                    onClick={handleOpenPDF}
                >
                    {/* Thumbnail Icon */}
                    <div className="w-14 h-14 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg mb-2">
                        <FileText className="w-7 h-7 text-gray-600 dark:text-gray-300" />
                    </div>

                    {/* Title */}
                    <div
                        className="text-sm font-medium text-center truncate w-full px-2 text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white"
                        title={pdf.title}
                    >
                        {pdf.title}
                    </div>

                    {/* Date */}
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {new Date(pdf.createdAt).toLocaleDateString()}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse gap-3 mt-4 w-full">
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-lg border-gray-400 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={openChat}
                        title="Chat"
                    >
                        <MessageCircle className="w-4 h-4 mr-1" /> Chat
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-lg border-gray-400 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={openQuiz}
                        title="Quiz"
                    >
                        <Edit className="w-4 h-4 mr-1" /> Quiz
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default PDFCard;
