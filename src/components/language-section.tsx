import {cvData} from "@/utils/cv-data";

export function LanguageSection() {
    return (
        <div className="space-y-4">
            {cvData.languages.map((language, index) => (
                <div key={index}>
                    {language.name === "Arabic" ? (
                        <div className="flex items-baseline">
                            <span className="font-semibold text-gray-800 mr-2">{language.name}</span>
                            <span className="text-gray-700">{language.level}</span>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between mb-1">
                                <span className="font-semibold text-gray-800">{language.name}</span>
                                <span className="text-gray-700">{language.level}</span>
                            </div>
                            <div className="flex space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-2 ${i < language.proficiency ? "bg-gray-800" : "bg-gray-300"} w-1/5`}
                                    ></div>
                                ))}
                            </div>
                            <div className="mt-1">
                                <span className="text-gray-700">{language.display}</span>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    )
}

