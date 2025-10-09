import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePDFStore } from '@/store/pdfStore';
import { UploadCloud } from 'lucide-react';

export const UploadPDF: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const addPDF = usePDFStore((state) => state.addPDF);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Trigger hidden input click
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (file) {
            await addPDF(file);
            setFile(null);
        }
    };

    return (
        <div className="flex gap-2 items-center mb-4">
            {/* Hidden Input */}
            <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                title="input"
            />

            {/* Upload Button */}
            <Button
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleButtonClick}
            >
                <UploadCloud size={20} /> {file ? file.name : 'Select PDF'}
            </Button>

            {/* Upload Now Button */}
            {file && (
                <Button onClick={handleUpload} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    Upload
                </Button>
            )}
        </div>
    );
};
