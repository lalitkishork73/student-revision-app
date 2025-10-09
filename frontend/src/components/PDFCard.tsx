import React from 'react';
import { PDF } from '@/store/pdfStore';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
    pdf: PDF;
    onClick: (pdf: PDF) => void;
}

export const PDFCard: React.FC<Props> = ({ pdf, onClick }) => {
    return (
        <Card
            className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center h-44"
            onClick={() => onClick(pdf)}
        >
            <CardContent className="flex flex-col items-center p-2">
                {/* PDF Icon */}
                <div className="w-20 h-28 bg-gray-100 flex items-center justify-center rounded-md">
                    <span className="text-gray-500 text-xs text-center">{pdf.name}</span>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                    {new Date(pdf.createdAt).toLocaleDateString()}
                </div>
            </CardContent>
        </Card>
    );
};
