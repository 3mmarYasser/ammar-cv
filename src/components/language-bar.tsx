interface LanguageBarProps {
    language: string
    level: string
    percentage: number
}

export function LanguageBar({ language, level, percentage }: LanguageBarProps) {
    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="font-semibold text-gray-700">{language}</span>
                <span className="text-sm text-gray-600">{level}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-gray-800 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    )
}

