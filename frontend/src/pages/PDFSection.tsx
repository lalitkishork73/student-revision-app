import React, { useEffect } from "react";
import { usePDFStore } from "@/store/pdfStore";
import { PDFCard } from "@/components/PDFCard";
import { UploadPDF } from "@/components/UploadPDF";
import { PDFViewer } from "@/components/PDFViewSidebar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const PDFGrid: React.FC = () => {
  const { pdfs, selectedPDF, selectPDF, fetchPDFs, page, limit, total } =
    usePDFStore();

  useEffect(() => {
    fetchPDFs();
  }, []);

  console.log(pdfs);
  console.log(selectedPDF?.path);
  console.log(selectPDF);
  console.log(page,limit,total)

  const totalPages = Math.ceil(total / limit);
  const handleCloseViewer = () => selectPDF(null);

  return (
    <div className="relative h-full p-4 transition-all duration-300">
      {/* Grid Section */}
      <div
        className={`transition-all duration-300 flex flex-col gap-4 ${
          selectedPDF ? "lg:w-2/3" : "w-full"
        }`}
      >
        <UploadPDF />

        {/* Tile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 overflow-y-auto h-[80vh]">
          {pdfs?.map((pdf) => (
            <PDFCard key={pdf._id} pdf={pdf} onClick={selectPDF} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between mt-2">
          <Button onClick={() => fetchPDFs(page - 1)} disabled={page <= 1}>
            Previous
          </Button>
          <Button
            onClick={() => fetchPDFs(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      {selectedPDF && (
        <div
          className={`
            bg-white border rounded shadow-lg overflow-hidden
            transition-all duration-300
            ${
              window.innerWidth >= 768
                ? "absolute right-4 top-4 w-full lg:w-1/3 h-[80vh]"
                : "fixed inset-0 w-full h-full z-50"
            }
            flex flex-col
          `}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            className="absolute top-2 right-2 p-1 z-50"
            onClick={handleCloseViewer}
          >
            <X size={24} />
          </Button>

          {/* PDF Embed / Iframe */}
          {/* <iframe
                        src={selectedPDF.url}
                        className="w-full h-full"
                        title={selectedPDF.name}
                    /> */}
                  <PDFViewer url={selectedPDF?.path} />
        </div>
      )}
    </div>
  );
};

export default PDFGrid;
