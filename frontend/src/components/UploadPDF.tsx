import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePDFStore } from '@/store/pdfStore';
import { UploadCloud } from 'lucide-react';
import {toast} from 'sonner'; // You can install this via `npm i react-hot-toast`

export const UploadPDF: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const addPDF = usePDFStore((state) => state.addPDF);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        toast.loading('Uploading PDF...', { id: 'uploadToast' });

        try {
            await addPDF(file); // waiting until API returns
            toast.success('PDF uploaded successfully!', { id: 'uploadToast' });
            setFile(null);
        } catch (err) {
            console.error(err);
            toast.error('Failed to upload PDF', { id: 'uploadToast' });
        } finally {
            setLoading(false);
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
                title="Select PDF"
            />

            {/* Upload Button */}
            <Button
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleButtonClick}
                disabled={loading}
            >
                <UploadCloud size={20} />
                {file ? file.name : 'Select PDF'}
            </Button>

            {/* Upload Now Button */}
            {file && (
                <Button
  className="flex items-center justify-center gap-2 
             bg-blue-600 text-white 
             hover:bg-blue-700 active:bg-blue-800 
             shadow-md hover:shadow-lg transition-all"
  onClick={handleButtonClick}
  disabled={loading}
>
  <UploadCloud size={20} />
  {file ? file.name : 'Select PDF'}
</Button>

            )}
        </div>
    );
};
