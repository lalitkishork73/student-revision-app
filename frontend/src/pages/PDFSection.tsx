// src/pages/PDFSection.tsx
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import PDFGrid from '@/components/PDFGrid';
import { usePDFStore } from '@/store/pdfStore';

const PDFSection: React.FC = () => {
    const fetchPDFs = usePDFStore((s) => s.fetchPDFs);

    useEffect(() => {
        fetchPDFs();
    }, [fetchPDFs]);

    return (
        <div className="flex h-full">
            {/* left column: grid */}
            <div className="flex-1">
                <PDFGrid />
            </div>

            {/* right column: router children (quiz/chat) will mount here */}
            <div className="w-1/3 border-l">
                <Outlet />
            </div>
        </div>
    );
};

export default PDFSection;
