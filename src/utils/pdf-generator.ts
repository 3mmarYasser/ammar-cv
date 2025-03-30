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
        const topMargin = 20
        const pageWidth = 210 - leftMargin - rightMargin

        let yPos = topMargin

        doc.setFillColor(255, 255, 255)
        doc.rect(0, 0, 210, 297, "F")

        doc.setFontSize(30)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(51, 51, 51)
        doc.text(cvData.personal.firstName, leftMargin, yPos)
        yPos += 10
        doc.text(cvData.personal.lastName, leftMargin, yPos)
        yPos += 12

        doc.setFontSize(16)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(102, 102, 102)
        doc.text(cvData.personal.title, leftMargin, yPos)
        yPos += 8

        doc.setFontSize(10)
        doc.setTextColor(102, 102, 102)

        const email = cvData.personal.email
        doc.text(email, leftMargin, yPos)
        doc.link(leftMargin, yPos - 5, doc.getTextWidth(email), 5, { url: `mailto:${email}` })

        const phone = cvData.personal.phone
        doc.text(" | " + phone, leftMargin + doc.getTextWidth(email), yPos)
        doc.link(leftMargin + doc.getTextWidth(email) + doc.getTextWidth(" | "), yPos - 5, doc.getTextWidth(phone), 5, {
            url: `tel:${phone}`,
        })

        yPos += 5

        doc.text(cvData.personal.location, leftMargin, yPos)
        yPos += 5

        doc.text("WWW: ", leftMargin, yPos)
        const linkedInText = cvData.personal.linkedin
        doc.setTextColor(0, 102, 204)
        doc.text(linkedInText, leftMargin + doc.getTextWidth("WWW: "), yPos)
        doc.link(leftMargin + doc.getTextWidth("WWW: "), yPos - 5, doc.getTextWidth(linkedInText), 5, {
            url: `https://${linkedInText}`,
        })

        yPos += 5

        doc.setTextColor(102, 102, 102)
        doc.text("WWW: ", leftMargin, yPos)
        const githubText = cvData.personal.github
        doc.setTextColor(0, 102, 204)
        doc.text(githubText, leftMargin + doc.getTextWidth("WWW: "), yPos)
        doc.link(leftMargin + doc.getTextWidth("WWW: "), yPos - 5, doc.getTextWidth(githubText), 5, {
            url: `https://${githubText}`,
        })

        yPos += 5

        // Add online CV link
        doc.setTextColor(102, 102, 102)
        doc.text("Online CV: ", leftMargin, yPos)
        const onlineCVText = cvData.personal.onlineCV
        doc.setTextColor(0, 102, 204)
        doc.text(onlineCVText, leftMargin + doc.getTextWidth("Online CV: "), yPos)
        doc.link(leftMargin + doc.getTextWidth("Online CV: "), yPos - 5, doc.getTextWidth(onlineCVText), 5, {
            url: `https://${onlineCVText}`,
        })

        doc.setTextColor(0, 0, 0)

        yPos += 20 // Adjusted spacing after adding the new link

        addSectionHeader(doc, "PERSONAL SUMMARY", leftMargin, yPos)
        yPos += 12

        const summaryLines = doc.splitTextToSize(cvData.summary, pageWidth)
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(85, 85, 85)
        doc.text(summaryLines, leftMargin, yPos)
        yPos += summaryLines.length * 5 + 10

        addSectionHeader(doc, "SKILLS", leftMargin, yPos)
        yPos += 12

        const colWidth = pageWidth / 2
        cvData.skills.forEach((skill) => {
            if (yPos > 270) {
                doc.addPage()
                yPos = topMargin
            }

            doc.setFontSize(10)
            doc.setFont("helvetica", "normal")

            doc.setTextColor(51, 51, 51)
            doc.text("•", leftMargin, yPos)
            doc.setTextColor(85, 85, 85)

            const leftLines = doc.splitTextToSize(skill.left, colWidth - 10)
            doc.text(leftLines, leftMargin + 5, yPos)

            doc.setTextColor(51, 51, 51)
            doc.text("•", leftMargin + colWidth, yPos)
            doc.setTextColor(85, 85, 85)

            const rightLines = doc.splitTextToSize(skill.right, colWidth - 10)
            doc.text(rightLines, leftMargin + colWidth + 5, yPos)

            const leftHeight = leftLines.length * 5
            const rightHeight = rightLines.length * 5
            yPos += Math.max(leftHeight, rightHeight) + 3
        })

        yPos += 7

        doc.addPage()
        yPos = topMargin

        addSectionHeader(doc, "WORK HISTORY", leftMargin, yPos)
        yPos += 12

        cvData.workHistory.forEach((job) => {
            if (yPos > 230) {
                doc.addPage()
                yPos = topMargin
            }

            doc.setFontSize(14)
            doc.setFont("helvetica", "bold")
            doc.setTextColor(51, 51, 51)
            const titleLines = doc.splitTextToSize(job.title, pageWidth - 40)
            doc.text(titleLines, leftMargin, yPos)

            doc.setFont("helvetica", "normal")
            doc.setTextColor(102, 102, 102)
            doc.text(job.period, 210 - rightMargin - doc.getTextWidth(job.period), yPos)

            yPos += titleLines.length * 6 + 2

            doc.setFontSize(10)
            doc.setFont("helvetica", "normal")
            doc.setTextColor(85, 85, 85)

            job.responsibilities.forEach((resp) => {
                if (yPos > 270) {
                    doc.addPage()
                    yPos = topMargin
                }

                // Strip HTML tags for PDF
                const plainResp = resp.replace(/<\/?span[^>]*>/g, "")

                doc.setTextColor(51, 51, 51)
                doc.text("•", leftMargin, yPos)
                doc.setTextColor(85, 85, 85)

                const respLines = doc.splitTextToSize(plainResp, pageWidth - 10)
                doc.text(respLines, leftMargin + 5, yPos)

                yPos += respLines.length * 5 + 3
            })

            yPos += 10
        })

        if (yPos > 180) {
            doc.addPage()
            yPos = topMargin
        }

        addSectionHeader(doc, "EDUCATION", leftMargin, yPos)
        yPos += 12

        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(51, 51, 51)
        doc.text(cvData.education.institution, leftMargin, yPos)
        yPos += 6

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(85, 85, 85)
        doc.text(cvData.education.degree, leftMargin, yPos)
        yPos += 15

        addSectionHeader(doc, "OTHER", leftMargin, yPos)
        yPos += 12

        const otherLines = doc.splitTextToSize(cvData.other, pageWidth)
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(85, 85, 85)
        doc.text(otherLines, leftMargin, yPos)
        yPos += otherLines.length * 5 + 10

        if (yPos > 240) {
            doc.addPage()
            yPos = topMargin
        }

        addSectionHeader(doc, "LANGUAGES", leftMargin, yPos)
        yPos += 12

        for (const language of cvData.languages) {
            doc.setFontSize(11)
            doc.setFont("helvetica", "bold")
            doc.setTextColor(51, 51, 51)
            doc.text(language.name, leftMargin, yPos)
            doc.setFont("helvetica", "normal")
            doc.setTextColor(85, 85, 85)

            if (language.name === "Arabic") {
                doc.text(language.level, leftMargin + 40, yPos)
                yPos += 10
            } else {
                doc.text(language.level, 210 - rightMargin - doc.getTextWidth(language.level), yPos)
                yPos += 5

                for (let i = 0; i < 5; i++) {
                    const barX = leftMargin + i * 22
                    const barWidth = 20
                    const barHeight = 2

                    if (i < language.proficiency) {
                        doc.setFillColor(51, 51, 51)
                    } else {
                        doc.setFillColor(220, 220, 220)
                    }

                    doc.rect(barX, yPos, barWidth, barHeight, "F")
                }

                yPos += 8
                doc.setFontSize(10)
                doc.setTextColor(85, 85, 85)
                doc.text(language.display, leftMargin, yPos)
                yPos += 10
            }
        }

        // Add footer with online CV reference
        const footerText = `For the most up-to-date version, visit: ${cvData.personal.onlineCV}`
        doc.setFontSize(8)
        doc.setTextColor(128, 128, 128)
        doc.text(footerText, 105, 287, { align: "center" })
        doc.link(105 - doc.getTextWidth(footerText) / 2, 287 - 3, doc.getTextWidth(footerText), 3, {
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
    doc.setFillColor(51, 51, 51)
    doc.circle(x + 1.5, y - 1, 1.5, "F")

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(51, 51, 51)
    doc.text(title, x + 8, y)

    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    doc.line(x, y + 3, x + 170, y + 3)
}
