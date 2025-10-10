// src/components/ResponsivePDFSection.tsx
import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PDFViewer } from "@/components/PDFViewSidebar";
import { PDFCard } from "@/components/PDFCard";
import { UploadPDF } from "@/components/UploadPDF";
import { Button } from "@/components/ui/button";
import { usePDFStore } from "@/store/pdfStore";
import { X } from "lucide-react";

const ResponsivePDFSection: React.FC = () => {
    const { pdfs, selectedPDF, selectPDF, fetchPDFs, page, limit, total } =
        usePDFStore();

    const [viewerOpen, setViewerOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const totalPages = Math.ceil(total / limit);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPDFs();
    }, [fetchPDFs]);

    // Open modal if route is quiz/chat
    useEffect(() => {
        if (
            location.pathname.includes("/quiz") ||
            location.pathname.includes("/chat")
        ) {
            setModalOpen(true);
        } else {
            setModalOpen(false);
        }
    }, [location]);

    // open viewer when PDF is selected
    useEffect(() => {
        if (selectedPDF) setViewerOpen(true);
        else setViewerOpen(false);
    }, [selectedPDF]);

    return (
        <div className="flex flex-col min-h-[100%] overflow-hidden relative p-4">
            {/* PDF Upload */}
            <UploadPDF />

            {/* PDF Grid */}
            <div className="mt-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {pdfs?.map((pdf) => (
                        <PDFCard
                            key={pdf._id}
                            pdf={pdf}
                            onClick={(p) => {
                                selectPDF(p);
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6">
                {/* Previous Button */}
                <Button
                    onClick={() => fetchPDFs(page - 1)}
                    disabled={page <= 1}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 
               hover:from-gray-300 hover:to-gray-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                >
                    ⬅ Previous
                </Button>

                {/* Page Info */}
                <div className="px-6 py-2 rounded-full bg-gray-100 text-gray-700 shadow-sm text-sm font-medium">
                    Page <span className="font-bold">{page}</span> of{" "}
                    <span className="font-bold">{totalPages}</span> | Items:{" "}
                    <span className="font-bold">{total}</span>
                </div>

                {/* Next Button */}
                <Button
                    onClick={() => fetchPDFs(page + 1)}
                    disabled={page >= totalPages}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white 
               hover:from-blue-600 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                >
                    Next ➡
                </Button>
            </div>


            {/* PDF Viewer Drawer (from right side) */}
            <div
                className={`
          fixed inset-y-0 right-0 w-full lg:w-1/2 shadow-2xl z-40
          transform transition-transform duration-500 ease-in-out
          flex flex-col
          ${viewerOpen ? "translate-x-0" : "translate-x-full"}
        `}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-3 border-b bg-gray-100">
                    <h2 className="font-semibold">PDF Viewer</h2>
                    <Button variant="ghost" onClick={() => selectPDF(null)}>
                        <X size={20} />
                    </Button>
                </div>

                {/* Scrollable PDF */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2">
                    <PDFViewer />
                </div>
            </div>

            {/* Modal for Outlet */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-black rounded-xl shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b text-white">
                            <h2 className="text-lg font-semibold">Content</h2>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setModalOpen(false);
                                    navigate(-1); // go back
                                }}
                            >
                                <X size={20} />
                            </Button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-4 text-white">
                            <Outlet />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResponsivePDFSection;
