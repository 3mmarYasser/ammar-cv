import React from "react"
import {cvData} from "@/utils/cv-data";

export function SkillGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cvData.skills.map((skill, index) => (
                <React.Fragment key={index}>
                    <div className="flex items-start">
                        <span className="text-gray-800 mr-2">•</span>
                        <span className="text-gray-700">{skill.left}</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-800 mr-2">•</span>
                        <span className="text-gray-700">{skill.right}</span>
                    </div>
                </React.Fragment>
            ))}
        </div>
    )
}

