"use client";

import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type PdfViewerProps = {
  file: File | string | undefined; // File upload OR URL
};

export default function PdfViewer({ file }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(600);
  const containerRef = useRef<HTMLDivElement>(null);

  const MAX_WIDTH = 600; // 👈 maximum PDF width on larger devices

  // 🔥 Automatically resize based on container width
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        setPageWidth(Math.min(width, MAX_WIDTH)); // shrink if small, cap if big
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center w-full max-w-full h-[50vh] sm:h-full overflow-y-auto rounded-xl scrollbar-none sm:scrollbar-thin"
    >
      {file ? (
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<p className="mt-auto">Loading PDF...</p>}
          error={<p className="mt-auto">Failed to load PDF</p>}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              width={pageWidth} // 👈 responsive but capped
              renderTextLayer
              renderAnnotationLayer
            />
          ))}
        </Document>
      ) : (
        <p className="text-gray-500 relative top-1/2 transform -translate-y-1/2">No PDF selected</p>
      )}
    </div>
  );
}