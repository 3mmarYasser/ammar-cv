import { jsPDF } from "jspdf"
import {cvData} from "@/utils/cv-data";

export async function generatePDF() {
    const downloadButton = document.querySelector(".fixed.top-4.right-4") as HTMLElement
    if (downloadButton) {
        downloadButton.style.display = "none"
    }

    try {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
            compress: true,
        })

        const leftMargin = 20
        const rightMargin = 20
        const topMargin = 25
        const pageWidth = 210 - leftMargin - rightMargin
        const pageHeight = 297
        const bottomMargin = 35

        let yPos = topMargin
        let currentPage = 1

        // Function to add page header
        const addPageHeader = (pageNum: number) => {
            // Header accent bar
            doc.setFillColor(51, 51, 51)
            doc.rect(0, 0, 210, 3, "F")
            
            // Page number
            doc.setFontSize(8)
            doc.setFont("helvetica", "normal")
            doc.setTextColor(128, 128, 128)
            doc.text(`Page ${pageNum}`, 210 - rightMargin - 20, 8)
            
            // Reset yPos for content
            yPos = topMargin
        }

        // Function to check and add new page
        const checkAndAddPage = () => {
            if (yPos > pageHeight - bottomMargin) {
                doc.addPage()
                currentPage++
                addPageHeader(currentPage)
                return true
            }
            return false
        }

        // Set white background
        doc.setFillColor(255, 255, 255)
        doc.rect(0, 0, 210, 297, "F")

        // Add first page header
        addPageHeader(currentPage)

        // Header Section with better visual hierarchy
        doc.setFontSize(26)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(51, 51, 51)
        doc.text(cvData.personal.firstName, leftMargin, yPos)
        yPos += 7
        doc.text(cvData.personal.lastName, leftMargin, yPos)
        yPos += 8

        doc.setFontSize(13)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(102, 102, 102)
        doc.text(cvData.personal.title, leftMargin, yPos)
        yPos += 6

        // Contact Information - Professional layout
        doc.setFontSize(8)
        doc.setTextColor(102, 102, 102)

        const email = cvData.personal.email
        doc.text(email, leftMargin, yPos)
        doc.link(leftMargin, yPos - 3, doc.getTextWidth(email), 3, { url: `mailto:${email}` })

        const phone = cvData.personal.phone
        doc.text(" | " + phone, leftMargin + doc.getTextWidth(email), yPos)
        doc.link(leftMargin + doc.getTextWidth(email) + doc.getTextWidth(" | "), yPos - 3, doc.getTextWidth(phone), 3, {
            url: `tel:${phone}`,
        })

        yPos += 3

        doc.text(cvData.personal.location, leftMargin, yPos)
        yPos += 4

        // Links in a compact, organized format
        const links = [
            { label: "LinkedIn", url: cvData.personal.linkedin },
            { label: "GitHub", url: cvData.personal.github },
            { label: "Online CV", url: cvData.personal.onlineCV },
            { label: "Portfolio", url: cvData.personal.portfolio }
        ]

        links.forEach((link) => {
            doc.setTextColor(102, 102, 102)
            doc.text(`${link.label}: `, leftMargin, yPos)
            doc.setTextColor(0, 102, 204)
            doc.text(link.url, leftMargin + doc.getTextWidth(`${link.label}: `), yPos)
            doc.link(leftMargin + doc.getTextWidth(`${link.label}: `), yPos - 3, doc.getTextWidth(link.url), 3, {
                url: `https://${link.url}`,
            })
            yPos += 2.5
        })

        doc.setTextColor(0, 0, 0)
        yPos += 12

        // Personal Summary with better spacing
        addSectionHeader(doc, "PERSONAL SUMMARY", leftMargin, yPos)
        yPos += 8

        const summaryLines = doc.splitTextToSize(cvData.summary, pageWidth)
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(85, 85, 85)
        doc.text(summaryLines, leftMargin, yPos)
        yPos += summaryLines.length * 3.5 + 6

        // Skills Section - Enhanced layout
        addSectionHeader(doc, "SKILLS", leftMargin, yPos)
        yPos += 8

        const colWidth = pageWidth / 2
        cvData.skills.forEach((skill) => {
            checkAndAddPage()

            doc.setFontSize(8)
            doc.setFont("helvetica", "normal")

            doc.setTextColor(51, 51, 51)
            doc.text("•", leftMargin, yPos)
            doc.setTextColor(85, 85, 85)

            const leftLines = doc.splitTextToSize(skill.left, colWidth - 6)
            doc.text(leftLines, leftMargin + 3, yPos)

            doc.setTextColor(51, 51, 51)
            doc.text("•", leftMargin + colWidth, yPos)
            doc.setTextColor(85, 85, 85)

            const rightLines = doc.splitTextToSize(skill.right, colWidth - 6)
            doc.text(rightLines, leftMargin + colWidth + 3, yPos)

            const leftHeight = leftLines.length * 3.5
            const rightHeight = rightLines.length * 3.5
            yPos += Math.max(leftHeight, rightHeight) + 1.5
        })

        yPos += 4

        // Work History - New page with professional layout
        doc.addPage()
        currentPage++
        addPageHeader(currentPage)

        addSectionHeader(doc, "WORK HISTORY", leftMargin, yPos)
        yPos += 8

        cvData.workHistory.forEach((job) => {
            if (yPos > pageHeight - bottomMargin - 60) {
                doc.addPage()
                currentPage++
                addPageHeader(currentPage)
            }

            // Job title with enhanced styling
            doc.setFontSize(11)
            doc.setFont("helvetica", "bold")
            doc.setTextColor(51, 51, 51)
            const titleLines = doc.splitTextToSize(job.title, pageWidth - 30)
            doc.text(titleLines, leftMargin, yPos)

            // Period with right alignment
            doc.setFont("helvetica", "normal")
            doc.setTextColor(102, 102, 102)
            doc.text(job.period, 210 - rightMargin - doc.getTextWidth(job.period), yPos)

            yPos += titleLines.length * 4 + 2

            // Responsibilities with better organization
            doc.setFontSize(8)
            doc.setFont("helvetica", "normal")
            doc.setTextColor(85, 85, 85)

            job.responsibilities.forEach((resp) => {
                checkAndAddPage()

                // Strip HTML tags for PDF
                const plainResp = resp.replace(/<\/?span[^>]*>/g, "")

                doc.setTextColor(51, 51, 51)
                doc.text("•", leftMargin, yPos)
                doc.setTextColor(85, 85, 85)

                const respLines = doc.splitTextToSize(plainResp, pageWidth - 6)
                doc.text(respLines, leftMargin + 3, yPos)

                yPos += respLines.length * 3.5 + 1.5
            })

            yPos += 6
        })

        // Education and Other sections - New page for better organization
        if (yPos > pageHeight - bottomMargin - 120) {
            doc.addPage()
            currentPage++
            addPageHeader(currentPage)
        }

        addSectionHeader(doc, "EDUCATION", leftMargin, yPos)
        yPos += 8

        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(51, 51, 51)
        doc.text(cvData.education.institution, leftMargin, yPos)
        yPos += 4

        doc.setFontSize(8)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(85, 85, 85)
        doc.text(cvData.education.degree, leftMargin, yPos)
        yPos += 10

        // Other section - Enhanced layout for longer content
        addSectionHeader(doc, "OTHER", leftMargin, yPos)
        yPos += 8

        const otherLines = doc.splitTextToSize(cvData.other, pageWidth)
        doc.setFontSize(8)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(85, 85, 85)
        
        // Check if we need a new page for the "OTHER" section
        const otherHeight = otherLines.length * 3.5
        if (yPos + otherHeight > pageHeight - bottomMargin) {
            doc.addPage()
            currentPage++
            addPageHeader(currentPage)
        }
        
        doc.text(otherLines, leftMargin, yPos)
        yPos += otherLines.length * 3.5 + 6

        // Languages section - Enhanced layout
        if (yPos > pageHeight - bottomMargin - 100) {
            doc.addPage()
            currentPage++
            addPageHeader(currentPage)
        }

        addSectionHeader(doc, "LANGUAGES", leftMargin, yPos)
        yPos += 8

        for (const language of cvData.languages) {
            doc.setFontSize(9)
            doc.setFont("helvetica", "bold")
            doc.setTextColor(51, 51, 51)
            doc.text(language.name, leftMargin, yPos)
            doc.setFont("helvetica", "normal")
            doc.setTextColor(85, 85, 85)

            if (language.name === "Arabic") {
                doc.text(language.level, leftMargin + 30, yPos)
                yPos += 6
            } else {
                doc.text(language.level, 210 - rightMargin - doc.getTextWidth(language.level), yPos)
                yPos += 3

                // Enhanced proficiency bars
                for (let i = 0; i < 5; i++) {
                    const barX = leftMargin + i * 18
                    const barWidth = 16
                    const barHeight = 2.5

                    if (i < language.proficiency) {
                        doc.setFillColor(51, 51, 51)
                    } else {
                        doc.setFillColor(220, 220, 220)
                    }

                    doc.rect(barX, yPos, barWidth, barHeight, "F")
                }

                yPos += 5
                doc.setFontSize(8)
                doc.setTextColor(85, 85, 85)
                doc.text(language.display, leftMargin, yPos)
                yPos += 6
            }
        }

        // Enhanced footer with better positioning
        const footerText = `For the most up-to-date version, visit: ${cvData.personal.onlineCV}`
        doc.setFontSize(7)
        doc.setTextColor(128, 128, 128)
        doc.text(footerText, 105, pageHeight - 15, { align: "center" })
        doc.link(105 - doc.getTextWidth(footerText) / 2, pageHeight - 18, doc.getTextWidth(footerText), 3, {
            url: `https://${cvData.personal.onlineCV}`,
        })

        doc.save(`${cvData.personal.firstName}_${cvData.personal.lastName}_CV.pdf`)
    } catch (error) {
        console.error("PDF generation error:", error)
        alert("There was an error generating the PDF. Please try again.")
        throw error
    } finally {
        if (downloadButton) {
            downloadButton.style.display = "block"
        }
    }
}

function addSectionHeader(doc: jsPDF, title: string, x: number, y: number) {
    // Enhanced section header with better visual design
    doc.setFillColor(51, 51, 51)
    doc.circle(x + 1.5, y - 1, 1.5, "F")

    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(51, 51, 51)
    doc.text(title, x + 8, y)

    // Enhanced underline
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.8)
    doc.line(x, y + 1.5, x + 170, y + 1.5)
}
