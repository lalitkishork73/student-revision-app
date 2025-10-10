import React, { useState } from "react";
import { useQuizStore } from "../store/quizStore";
import { usePDFStore } from "../store/pdfStore";

const QuizPage = () => {
    const { selectedPDF, selectPDF } = usePDFStore();
    const { questions, fetchQuiz, selectAnswer, submit, loading, reset } = useQuizStore();
    const [quizType, setQuizType] = useState("MCQ");
    const [submitted, setSubmitted] = useState(false);

    const handleGenerate = () => {
        if (!selectedPDF?.pdfVectorId) {
            alert("Please select a PDF first!");
            return;
        }
        fetchQuiz(selectedPDF.pdfVectorId, quizType);
    };

    const handleSubmit = async () => {
        try {
            const res = await submit();
            console.log("Quiz Submitted ✅", res.data);
            setSubmitted(true);

            // Close sidebar by deselecting PDF
            selectPDF(null);

            // Reset quiz store for next quiz
            reset();
        } catch (err) {
            console.error("Error submitting quiz:", err);
            alert("Failed to submit quiz. Please try again.");
        }
    };

    return (
        <div className="p-4h-full ">
            <h2 className="text-xl font-bold mb-4">Quiz Generator</h2>

            {!submitted && (
                <div className="mb-4 flex gap-2">
                    <select
                        value={quizType}
                        onChange={(e) => setQuizType(e.target.value)}
                        className="border p-2"
                        title="Select Quiz Type"
                    >
                        <option value="MCQ">MCQ</option>
                        <option value="SAQ">SAQ</option>
                        <option value="LAQ">LAQ</option>
                    </select>
                    <button
                        onClick={handleGenerate}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Generate Quiz
                    </button>
                </div>
            )}

            {loading && <p>Loading...</p>}

            {questions.length > 0 && !submitted && (
                <div>
                    {questions.map((q) => (
                        <div key={q._id} className="mb-4 border-b pb-2">
                            <p className="font-medium">{q.question}</p>
                            {q.options?.map((opt: string) => (
                                <label key={opt} className="block">
                                    <input
                                        type="radio"
                                        name={q._id}
                                        value={opt}
                                        onChange={() => selectAnswer(q._id, opt)}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    ))}
                    <button
                        onClick={handleSubmit}
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Submit Quiz
                    </button>
                </div>
            )}

            {submitted && (
                <div className="p-4 bg-green-100 text-green-800 rounded">
                    ✅ Quiz submitted successfully!
                </div>
            )}
        </div>
    );
};

export default QuizPage;
