// src/components/ResponsivePDFSection.tsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { PDFViewer } from "@/components/PDFViewSidebar";
import { PDFCard } from "@/components/PDFCard";
import { UploadPDF } from "@/components/UploadPDF";
import { Button } from "@/components/ui/button";
import { usePDFStore } from "@/store/pdfStore";
import { Sidebar, X } from "lucide-react";

const ResponsivePDFSection: React.FC = () => {
    const { pdfs, selectedPDF, selectPDF, fetchPDFs, page, limit, total } =
        usePDFStore();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const totalPages = Math.ceil(total / limit);

    useEffect(() => {
        fetchPDFs();
    }, [fetchPDFs]);

    return (
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden relative">
            {/* Floating drawer button */}
            <Button
                className="fixed top-1/2 right-2 z-50 transform -translate-y-1/2
    lg:hidden bg-blue-600 text-white hover:bg-blue-700
    p-3 rounded-full shadow-lg flex items-center justify-center"
                onClick={() => setDrawerOpen(prev => !prev)} // toggle drawer
                title={drawerOpen ? "Close PDF List" : "Open PDF List"}
            >
                {drawerOpen ? <X size={24} /> : <Sidebar size={24} />}
            </Button>

            {/* PDF List Drawer */}
            <div
                className={`
          fixed top-0 left-0 z-40 transform transition-transform duration-300
          w-72 h-screen p-4 bg-black/70 backdrop-blur-md text-white
          rounded-r-lg shadow-lg flex flex-col
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:w-1/4 lg:h-screen  lg:text-black lg:backdrop-blur-0
        `}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">PDFs</h2>
                    <Button
                        variant="ghost"
                        className="lg:hidden text-white"
                        onClick={() => setDrawerOpen(false)}
                    >
                        <X size={20} />
                    </Button>
                </div>

                <UploadPDF />

                {/* Scrollable PDF list */}
                <div className="flex-1 mt-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-900/20">
                    {pdfs?.map((pdf) => (
                        <PDFCard
                            key={pdf._id}
                            pdf={pdf}
                            onClick={(p) => {
                                selectPDF(p);
                                setDrawerOpen(false);
                            }}
                            
                        />
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-between mt-2">
                    <Button onClick={() => fetchPDFs(page - 1)} disabled={page <= 1}>
                        Previous
                    </Button>
                    <Button onClick={() => fetchPDFs(page + 1)} disabled={page >= totalPages}>
                        Next
                    </Button>
                </div>
            </div>

            {/* Middle column: Outlet */}
            <div className="flex-1 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 px-4 flex flex-col items-center justify-center">
                <Outlet />
                {/* Placeholder message if no route is matched */}
                {!window.location.pathname.includes("/quiz") &&
                    !window.location.pathname.includes("/chat") && (
                        <div className="text-gray-500 text-center p-4">
                            <h2 className="text-lg font-semibold mb-2">No Quiz or Chat Selected</h2>
                            <p>Please select a quiz or chat from the menu to start.</p>
                        </div>
                    )}
            </div>

            {/* PDF Viewer */}
            {selectedPDF && (
                <div
                    className={`
            w-full lg:w-1/4
            h-64 lg:h-screen
            border-t lg:border-t-0 lg:border-l
            bg-white shadow-lg flex flex-col overflow-hidden
            mt-auto lg:mt-0
          `}
                >
                    {/* Close button for mobile */}
                    <div className="flex justify-between items-center p-2 border-b lg:hidden">
                        <span>PDF Viewer</span>
                        <Button variant="ghost" onClick={() => selectPDF(null)}>
                            <X size={20} />
                        </Button>
                    </div>

                    {/* Scrollable PDF area */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2">
                        <PDFViewer />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResponsivePDFSection;
