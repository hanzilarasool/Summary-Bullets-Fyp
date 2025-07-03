
import React, { useState, useCallback } from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import downloadIcon from "../assets/downloadIcon.svg";
import pdf from "../assets/pdf.png";
import html2pdf from 'html2pdf.js';
// import downloadIcon from "../assets/downloadIcon.svg";

const PDFdownload = ({ bookName, content, onDownload }) => {
    const editor = useCreateBlockNote();
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePDF = useCallback(async () => {
        if (isGenerating) return;
        setIsGenerating(true);

        try {
            const blocks = JSON.parse(content);
            editor.replaceBlocks(editor.document, blocks);
            const htmlContent = await editor.blocksToFullHTML(editor.document);

            const element = document.createElement('div');
            element.innerHTML = `
        <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
          .cover-image { max-width: 100%; max-height: 300px; object-fit: contain; margin-bottom: 20px; }
          h1 { text-align: center; color: #2c3e50; font-size: 24px; margin-bottom: 30px; }
          .content { margin: 0 auto; max-width: 800px; }
        </style>
        <h1>${bookName}</h1>
        <div class="content">${htmlContent}</div>
      `;

            const opt = {
                margin: [15, 15],
                filename: `${bookName}.pdf`,
                image: { type: 'jpeg', quality: 0.95 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            await html2pdf().from(element).set(opt).save();
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("There was an error generating the PDF. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    }, [bookName, content, editor, isGenerating]);

    // Trigger the parent callback when clicked
    const handleClick = () => {
        if (onDownload) {
            onDownload(generatePDF); // Pass the generatePDF function to the parent
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isGenerating}
            className={`w-[210px] h-[50px] lg:w-[255px] py-2 px-3 sm:py-2 sm:px-2 mb-6 ${isGenerating ? 'cursor-not-allowed' : ''} rounded-lg shadow transition duration-300 ease-in-out w-full sm:w-[180px] py-[10px] px-[16px] mb-[24px] bg-white border border-gray-300 justify-center items-center inline-flex`}
        >
            <img src={pdf} alt="pdf" className="w-6 h-6" />
            <span className="mx-2 text-sm sm:text-base font-medium">
                {isGenerating ? 'Generating PDF...' : 'Download PDF'}
            </span>
            {!isGenerating && (
                <img src={downloadIcon} alt="download" className="w-5 h-5 sm:flex hidden" />
            )}
        </button>
    );
};

export default PDFdownload;