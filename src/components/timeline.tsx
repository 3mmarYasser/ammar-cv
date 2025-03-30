import type React from "react"

interface TimelineProps {
    title: string
    children: React.ReactNode
}

export function Timeline({ title, children }: TimelineProps) {
    return (
        <div className="relative">
            <div className="flex items-center mb-3">
                <div className="w-3 h-3 rounded-full bg-gray-800 mr-3"></div>
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
            </div>
            <div className="ml-1.5 pl-4 border-l-2 border-gray-300">{children}</div>
        </div>
    )
}

