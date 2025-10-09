import React from 'react';
import { usePDFStore } from '@/store/pdfStore';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export const PDFViewer: React.FC = () => {
    const { selectedPDF, selectPDF } = usePDFStore();

    if (!selectedPDF) return null;

    return (
        <div className="flex flex-col h-full p-2">
            {/* Close Button */}
            <Button
                variant="ghost"
                className="self-end mb-2"
                onClick={() => selectPDF(null)}
            >
                <X size={24} />
            </Button>

            <iframe
                src={selectedPDF?.path}
                title={selectedPDF.name}
                className="flex-1 w-full border rounded"
            />
        </div>
    );
};
