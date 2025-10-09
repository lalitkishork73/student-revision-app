
import { PDF } from '@/store/pdfStore';
import React from 'react';
import { PDFCard } from '../PDFCard';

// PDFCard.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";

// PDFCard.test.tsx
// Mock classes for Card and CardContent
class MockCard extends React.Component<any> {
    render() {
        // Simulate the Card by rendering a div with the same children and props
        const { className, onClick, children } = this.props;
        return (
            <div data-testid="mock-card" className={className} onClick={onClick}>
                {children}
            </div>
        );
    }
}

class MockCardContent extends React.Component<any> {
    render() {
        // Simulate the CardContent by rendering a div with the same children and props
        const { className, children } = this.props;
        return (
            <div data-testid="mock-card-content" className={className}>
                {children}
            </div>
        );
    }
}

// Mock the imports of Card and CardContent in PDFCard
jest.mock("@/components/ui/card", () => ({
    Card: MockCard as any,
    CardContent: MockCardContent as any,
}));

// PDF interface for test
interface PDF {
    name: string;
    createdAt: string;
}

describe('PDFCard() PDFCard method', () => {
    // Happy Path Tests
    describe('Happy Paths', () => {
        it('renders PDF name and formatted date, and handles click event', () => {
            // This test ensures the PDF name and formatted date are rendered, and click triggers onClick
            const mockPDF: PDF = {
                name: 'Test Document',
                createdAt: '2023-12-01T10:00:00.000Z',
            };
            const onClickMock = jest.mocked(jest.fn());

            render(
                <PDFCard pdf={mockPDF as any} onClick={onClickMock as any} />
            );

            // PDF name should be visible
            expect(screen.getByText('Test Document')).toBeInTheDocument();

            // Date should be formatted as per locale (simulate en-US)
            const formattedDate = new Date(mockPDF.createdAt).toLocaleDateString();
            expect(screen.getByText(formattedDate)).toBeInTheDocument();

            // Simulate click on the card
            fireEvent.click(screen.getByTestId('mock-card'));
            expect(onClickMock).toHaveBeenCalledTimes(1);
            expect(onClickMock).toHaveBeenCalledWith(mockPDF as any);
        });

        it('renders correctly with a different PDF name and date', () => {
            // This test checks rendering with a different PDF object
            const mockPDF: PDF = {
                name: 'Another File.pdf',
                createdAt: '2022-01-15T08:30:00.000Z',
            };
            const onClickMock = jest.mocked(jest.fn());

            render(
                <PDFCard pdf={mockPDF as any} onClick={onClickMock as any} />
            );

            expect(screen.getByText('Another File.pdf')).toBeInTheDocument();
            const formattedDate = new Date(mockPDF.createdAt).toLocaleDateString();
            expect(screen.getByText(formattedDate)).toBeInTheDocument();
        });

        it('applies the correct class names to Card and CardContent', () => {
            // This test ensures the correct class names are passed to the mocks
            const mockPDF: PDF = {
                name: 'Styled PDF',
                createdAt: '2024-06-01T12:00:00.000Z',
            };
            const onClickMock = jest.mocked(jest.fn());

            render(
                <PDFCard pdf={mockPDF as any} onClick={onClickMock as any} />
            );

            const card = screen.getByTestId('mock-card');
            expect(card).toHaveClass('cursor-pointer');
            expect(card).toHaveClass('hover:shadow-lg');
            expect(card).toHaveClass('flex');
            expect(card).toHaveClass('flex-col');
            expect(card).toHaveClass('items-center');
            expect(card).toHaveClass('h-44');

            const cardContent = screen.getByTestId('mock-card-content');
            expect(cardContent).toHaveClass('flex');
            expect(cardContent).toHaveClass('flex-col');
            expect(cardContent).toHaveClass('items-center');
            expect(cardContent).toHaveClass('p-2');
        });

        it('renders the PDF name inside the icon area', () => {
            // This test checks that the PDF name is rendered inside the icon area
            const mockPDF: PDF = {
                name: 'IconName.pdf',
                createdAt: '2024-05-20T09:00:00.000Z',
            };
            const onClickMock = jest.mocked(jest.fn());

            render(
                <PDFCard pdf={mockPDF as any} onClick={onClickMock as any} />
            );

            // The PDF name should be inside a div with the icon area classes
            const iconArea = screen.getByText('IconName.pdf').parentElement;
            expect(iconArea).toHaveClass('w-20');
            expect(iconArea).toHaveClass('h-28');
            expect(iconArea).toHaveClass('bg-gray-100');
            expect(iconArea).toHaveClass('flex');
            expect(iconArea).toHaveClass('items-center');
            expect(iconArea).toHaveClass('justify-center');
            expect(iconArea).toHaveClass('rounded-md');
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        it('renders with an empty PDF name', () => {
            // This test checks rendering when the PDF name is an empty string
            const mockPDF: PDF = {
                name: '',
                createdAt: '2024-01-01T00:00:00.000Z',
            };
            const onClickMock = jest.mocked(jest.fn());

            render(
                <PDFCard pdf={mockPDF as any} onClick={onClickMock as any} />
            );

            // The icon area should still be present, but empty
            const iconArea = screen.getByTestId('mock-card-content').querySelector('.w-20.h-28');
            expect(screen.getByText('')).toBeInTheDocument();
            expect(iconArea).toBeInTheDocument();
        });

        it('renders with a very long PDF name', () => {
            // This test checks rendering when the PDF name is very long
            const longName = 'A'.repeat(200);
            const mockPDF: PDF = {
                name: longName,
                createdAt: '2024-01-01T00:00:00.000Z',
            };
            const onClickMock = jest.mocked(jest.fn());

            render(
                <PDFCard pdf={mockPDF as any} onClick={onClickMock as any} />
            );

            expect(screen.getByText(longName)).toBeInTheDocument();
        });

        it('renders with a createdAt date in the far past', () => {
            // This test checks rendering with a very old date
            const mockPDF: PDF = {
                name: 'Old File',
                createdAt: '1900-01-01T00:00:00.000Z',
            };
            const onClickMock = jest.mocked(jest.fn());

            render(
                <PDFCard pdf={mockPDF as any} onClick={onClickMock as any} />
            );

            const formattedDate = new Date(mockPDF.createdAt).toLocaleDateString();
            expect(screen.getByText(formattedDate)).toBeInTheDocument();
        });

        it('renders with a createdAt date in the far future', () => {
            // This test checks rendering with a future date
            const mockPDF: PDF = {
                name: 'Future File',
                createdAt: '2999-12-31T23:59:59.000Z',
            };
            const onClickMock = jest.mocked(jest.fn());

            render(
                <PDFCard pdf={mockPDF as any} onClick={onClickMock as any} />
            );

            const formattedDate = new Date(mockPDF.createdAt).toLocaleDateString();
            expect(screen.getByText(formattedDate)).toBeInTheDocument();
        });

        it('handles onClick prop that throws an error', () => {
            // This test checks that errors thrown in onClick do not break rendering
            const mockPDF: PDF = {
                name: 'Error File',
                createdAt: '2024-01-01T00:00:00.000Z',
            };
            const onClickMock = jest.mocked(jest.fn(() => { throw new Error('Test error'); }));

            render(
                <PDFCard pdf={mockPDF as any} onClick={onClickMock as any} />
            );

            // Simulate click and expect the error to be thrown
            expect(() => {
                fireEvent.click(screen.getByTestId('mock-card'));
            }).toThrow('Test error');
        });

        it('renders with a non-ISO date string for createdAt', () => {
            // This test checks rendering with a non-ISO date string
            const mockPDF: PDF = {
                name: 'Non-ISO Date',
                createdAt: 'June 1, 2024 12:00:00',
            };
            const onClickMock = jest.mocked(jest.fn());

            render(
                <PDFCard pdf={mockPDF as any} onClick={onClickMock as any} />
            );

            const formattedDate = new Date(mockPDF.createdAt).toLocaleDateString();
            expect(screen.getByText(formattedDate)).toBeInTheDocument();
        });

        it('renders with a numeric timestamp for createdAt', () => {
            // This test checks rendering with a numeric timestamp
            const timestamp = Date.UTC(2024, 5, 1, 12, 0, 0); // June 1, 2024
            const mockPDF: PDF = {
                name: 'Timestamp Date',
                createdAt: timestamp.toString(),
            };
            const onClickMock = jest.mocked(jest.fn());

            render(
                <PDFCard pdf={mockPDF as any} onClick={onClickMock as any} />
            );

            const formattedDate = new Date(Number(mockPDF.createdAt)).toLocaleDateString();
            expect(screen.getByText(formattedDate)).toBeInTheDocument();
        });
    });
});