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

        // Page 1: Header and Personal Information
        doc.setFillColor(255, 255, 255)
        doc.rect(0, 0, 210, 297, "F")

        // Add header accent bar
        doc.setFillColor(51, 51, 51)
        doc.rect(0, 0, 210, 8, "F")

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
        yPos += 5

        // Contact Information - Organized in a grid layout
        doc.setFontSize(9)
        doc.setTextColor(102, 102, 102)

        // First row: Email and Phone
        const email = cvData.personal.email
        doc.text(email, leftMargin, yPos)
        doc.link(leftMargin, yPos - 4, doc.getTextWidth(email), 4, { url: `mailto:${email}` })

        const phone = cvData.personal.phone
        doc.text(" | " + phone, leftMargin + doc.getTextWidth(email), yPos)
        doc.link(leftMargin + doc.getTextWidth(email) + doc.getTextWidth(" | "), yPos - 4, doc.getTextWidth(phone), 4, {
            url: `tel:${phone}`,
        })

        yPos += 4

        // Second row: Location
        doc.text(cvData.personal.location, leftMargin, yPos)
        yPos += 4

        // Links in organized format
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
            doc.link(leftMargin + doc.getTextWidth(`${link.label}: `), yPos - 4, doc.getTextWidth(link.url), 4, {
                url: `https://${link.url}`,
            })
            yPos += 3
        })

        doc.setTextColor(0, 0, 0)
        yPos += 12

        // Personal Summary with enhanced styling
        addEnhancedSectionHeader(doc, "PERSONAL SUMMARY", leftMargin, yPos)
        yPos += 8

        const summaryLines = doc.splitTextToSize(cvData.summary, pageWidth)
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(85, 85, 85)
        doc.text(summaryLines, leftMargin, yPos)
        yPos += summaryLines.length * 4 + 10

        // Skills Section - Better organized with visual separation
        addEnhancedSectionHeader(doc, "TECHNICAL SKILLS", leftMargin, yPos)
        yPos += 8

        const colWidth = pageWidth / 2
        cvData.skills.forEach((skill) => {
            if (yPos > pageHeight - bottomMargin) {
                doc.addPage()
                yPos = topMargin
                addPageHeader(doc)
                yPos += 15
            }

            doc.setFontSize(9)
            doc.setFont("helvetica", "normal")

            // Add subtle background for alternating rows
            const skillIndex = cvData.skills.indexOf(skill)
            if (skillIndex % 2 === 0) {
                doc.setFillColor(248, 248, 248)
                doc.rect(leftMargin - 2, yPos - 2, pageWidth + 4, 8, "F")
            }

            doc.setTextColor(51, 51, 51)
            doc.text("•", leftMargin, yPos)
            doc.setTextColor(85, 85, 85)

            const leftLines = doc.splitTextToSize(skill.left, colWidth - 8)
            doc.text(leftLines, leftMargin + 4, yPos)

            doc.setTextColor(51, 51, 51)
            doc.text("•", leftMargin + colWidth, yPos)
            doc.setTextColor(85, 85, 85)

            const rightLines = doc.splitTextToSize(skill.right, colWidth - 8)
            doc.text(rightLines, leftMargin + colWidth + 4, yPos)

            const leftHeight = leftLines.length * 4
            const rightHeight = rightLines.length * 4
            yPos += Math.max(leftHeight, rightHeight) + 3
        })

        yPos += 8

        // Page 2: Work History with enhanced layout
        doc.addPage()
        yPos = topMargin
        addPageHeader(doc)
        yPos += 15

        addEnhancedSectionHeader(doc, "PROFESSIONAL EXPERIENCE", leftMargin, yPos)
        yPos += 8

        cvData.workHistory.forEach((job, jobIndex) => {
            if (yPos > pageHeight - bottomMargin - 60) {
                doc.addPage()
                yPos = topMargin
                addPageHeader(doc)
                yPos += 15
            }

            // Job title with enhanced styling
            doc.setFontSize(11)
            doc.setFont("helvetica", "bold")
            doc.setTextColor(51, 51, 51)
            const titleLines = doc.splitTextToSize(job.title, pageWidth - 35)
            doc.text(titleLines, leftMargin, yPos)

            // Period with right alignment
            doc.setFont("helvetica", "normal")
            doc.setTextColor(102, 102, 102)
            doc.text(job.period, 210 - rightMargin - doc.getTextWidth(job.period), yPos)

            yPos += titleLines.length * 5 + 3

            // Add subtle separator line
            doc.setDrawColor(220, 220, 220)
            doc.setLineWidth(0.3)
            doc.line(leftMargin, yPos, leftMargin + pageWidth, yPos)
            yPos += 4

            doc.setFontSize(9)
            doc.setFont("helvetica", "normal")
            doc.setTextColor(85, 85, 85)

            job.responsibilities.forEach((resp) => {
                if (yPos > pageHeight - bottomMargin) {
                    doc.addPage()
                    yPos = topMargin
                    addPageHeader(doc)
                    yPos += 15
                }

                // Strip HTML tags for PDF
                const plainResp = resp.replace(/<\/?span[^>]*>/g, "")

                doc.setTextColor(51, 51, 51)
                doc.text("•", leftMargin, yPos)
                doc.setTextColor(85, 85, 85)

                const respLines = doc.splitTextToSize(plainResp, pageWidth - 8)
                doc.text(respLines, leftMargin + 4, yPos)

                yPos += respLines.length * 4 + 2
            })

            yPos += 8

            // Add space between jobs
            if (jobIndex < cvData.workHistory.length - 1) {
                yPos += 4
            }
        })

        // Page 3: Education, Other, and Languages
        if (yPos > pageHeight - bottomMargin - 120) {
            doc.addPage()
            yPos = topMargin
            addPageHeader(doc)
            yPos += 15
        }

        addEnhancedSectionHeader(doc, "EDUCATION", leftMargin, yPos)
        yPos += 8

        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(51, 51, 51)
        doc.text(cvData.education.institution, leftMargin, yPos)
        yPos += 5

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(85, 85, 85)
        doc.text(cvData.education.degree, leftMargin, yPos)
        yPos += 12

        // Other section with better formatting
        addEnhancedSectionHeader(doc, "ADDITIONAL ACHIEVEMENTS", leftMargin, yPos)
        yPos += 8

        const otherLines = doc.splitTextToSize(cvData.other, pageWidth)
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(85, 85, 85)
        
        // Check if we need a new page for the "OTHER" section
        const otherHeight = otherLines.length * 4
        if (yPos + otherHeight > pageHeight - bottomMargin) {
            doc.addPage()
            yPos = topMargin
            addPageHeader(doc)
            yPos += 15
        }
        
        doc.text(otherLines, leftMargin, yPos)
        yPos += otherLines.length * 4 + 10

        // Languages section with enhanced visual
        if (yPos > pageHeight - bottomMargin - 100) {
            doc.addPage()
            yPos = topMargin
            addPageHeader(doc)
            yPos += 15
        }

        addEnhancedSectionHeader(doc, "LANGUAGES", leftMargin, yPos)
        yPos += 8

        for (const language of cvData.languages) {
            doc.setFontSize(10)
            doc.setFont("helvetica", "bold")
            doc.setTextColor(51, 51, 51)
            doc.text(language.name, leftMargin, yPos)
            doc.setFont("helvetica", "normal")
            doc.setTextColor(85, 85, 85)

            if (language.name === "Arabic") {
                doc.text(language.level, leftMargin + 35, yPos)
                yPos += 8
            } else {
                doc.text(language.level, 210 - rightMargin - doc.getTextWidth(language.level), yPos)
                yPos += 4

                // Enhanced proficiency bars
                for (let i = 0; i < 5; i++) {
                    const barX = leftMargin + i * 20
                    const barWidth = 18
                    const barHeight = 3

                    if (i < language.proficiency) {
                        doc.setFillColor(51, 51, 51)
                    } else {
                        doc.setFillColor(220, 220, 220)
                    }

                    doc.rect(barX, yPos, barWidth, barHeight, "F")
                }

                yPos += 6
                doc.setFontSize(9)
                doc.setTextColor(85, 85, 85)
                doc.text(language.display, leftMargin, yPos)
                yPos += 8
            }
        }

        // Enhanced footer
        addEnhancedFooter(doc, cvData.personal.onlineCV, pageHeight)

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

function addPageHeader(doc: jsPDF) {
    // Add header accent bar for each page
    doc.setFillColor(51, 51, 51)
    doc.rect(0, 0, 210, 8, "F")
}

function addEnhancedSectionHeader(doc: jsPDF, title: string, x: number, y: number) {
    // Enhanced section header with better visual design
    doc.setFillColor(51, 51, 51)
    doc.circle(x + 2, y - 1, 2, "F")

    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(51, 51, 51)
    doc.text(title, x + 10, y)

    // Enhanced underline
    doc.setDrawColor(51, 51, 51)
    doc.setLineWidth(1)
    doc.line(x, y + 2, x + 170, y + 2)
    
    // Add subtle background
    doc.setFillColor(248, 248, 248)
    doc.rect(x - 2, y - 3, 180, 8, "F")
}

function addEnhancedFooter(doc: jsPDF, onlineCV: string, pageHeight: number) {
    // Enhanced footer with better styling
    const footerText = `For the most up-to-date version, visit: ${onlineCV}`
    
    // Footer background
    doc.setFillColor(248, 248, 248)
    doc.rect(0, pageHeight - 15, 210, 15, "F")
    
    // Footer text
    doc.setFontSize(8)
    doc.setTextColor(102, 102, 102)
    doc.text(footerText, 105, pageHeight - 8, { align: "center" })
    doc.link(105 - doc.getTextWidth(footerText) / 2, pageHeight - 11, doc.getTextWidth(footerText), 3, {
        url: `https://${onlineCV}`,
    })
}
