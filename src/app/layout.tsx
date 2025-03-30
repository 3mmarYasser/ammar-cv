import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import {cvData} from "@/utils/cv-data";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: `${cvData.personal.firstName} ${cvData.personal.lastName} - ${cvData.personal.title}`,
    description: `Professional resume for ${cvData.personal.firstName} ${cvData.personal.lastName}, ${cvData.personal.title}`,
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>{children}</body>
        </html>
    )
}

