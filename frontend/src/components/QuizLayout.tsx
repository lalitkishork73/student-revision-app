import { Button } from "@/components/ui/button";

export const QuizLayout = ({ pdfId, onBack }: { pdfId: string; onBack: () => void }) => {
    return (
        <div className="container mx-auto p-4">
            <Button onClick={onBack} variant="outline" className="mb-4">
                Back
            </Button>
            <h3>Quiz for PDF ID: {pdfId}</h3>
            {/* Quiz rendering goes here */}
        </div>
    );
};
