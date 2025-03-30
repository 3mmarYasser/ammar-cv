"use client"

import { Download } from "lucide-react"
import { useState } from "react"
import {generatePDF} from "@/utils/pdf-generator";

export function DownloadButton() {
    const [isGenerating, setIsGenerating] = useState(false)

    const handleDownload = async () => {
        setIsGenerating(true)
        try {
            await generatePDF()
        } catch (error) {
            console.error("PDF generation failed:", error)
            alert("There was an error generating the PDF. Please try again.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isGenerating ? (
                <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating PDF...
                </>
            ) : (
                <>
                    <Download className="h-4 w-4" />
                    Download CV
                </>
            )}
        </button>
    )
}

