"use client"

import { Timeline } from "@/components/timeline"
import { SkillGrid } from "@/components/skill-grid"
import { LanguageSection } from "@/components/language-section"
import { DownloadButton } from "@/components/download-button"
import {cvData} from "@/utils/cv-data";

export default function Resume() {
  return (
      <main className="min-h-screen bg-gray-50">
        <div className="fixed top-4 right-4 z-50 print:hidden">
          <DownloadButton />
        </div>

        <div className="max-w-[21cm] mx-auto p-8 md:p-[1.5cm] my-8 bg-white shadow-md print:p-[1cm] print:shadow-none print:my-0 print:max-w-none">
          <header className="mb-8 avoid-break">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
              {cvData.personal.firstName}
              <br />
              {cvData.personal.lastName}
            </h1>
            <h2 className="text-xl text-gray-600 mt-2">{cvData.personal.title}</h2>
            <div className="mt-2 text-gray-600">
              <p>
                <a href={`mailto:${cvData.personal.email}`} className="hover:underline print:text-gray-800">
                  {cvData.personal.email}
                </a>{" "}
                |{" "}
                <a href={`tel:${cvData.personal.phone}`} className="hover:underline print:text-gray-800">
                  {cvData.personal.phone}
                </a>
              </p>
              <p>{cvData.personal.location}</p>
              <p>
                <span className="font-semibold">WWW:</span>{" "}
                <a
                    href={`https://${cvData.personal.linkedin}`}
                    className="text-blue-600 hover:underline print:text-gray-800"
                >
                  {cvData.personal.linkedin}
                </a>
              </p>
              <p>
                <span className="font-semibold">WWW:</span>{" "}
                <a
                    href={`https://${cvData.personal.github}`}
                    className="text-blue-600 hover:underline print:text-gray-800"
                >
                  {cvData.personal.github}
                </a>
              </p>
              <p>
                <span className="font-semibold">WWW:</span>{" "}
                <a
                    href={`https://${cvData.personal.portfolio}`}
                    className="text-blue-600 hover:underline print:text-gray-800"
                >
                  {cvData.personal.portfolio}
                </a>
              </p>
            </div>
          </header>

          <section className="mb-8 avoid-break">
            <Timeline title="PERSONAL SUMMARY">
              <p className="text-gray-700">{cvData.summary}</p>
            </Timeline>
          </section>

          <section className="mb-8 avoid-break">
            <Timeline title="SKILLS">
              <SkillGrid />
            </Timeline>
          </section>

          <section className="mb-8">
            <Timeline title="WORK HISTORY">
              {cvData.workHistory.map((job, index) => (
                  <div key={index} className={`mb-6 avoid-break ${index === 1 ? "page-break-before" : ""}`}>
                    <div className="flex flex-col md:flex-row md:justify-between mb-2">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <span className="text-gray-600">{job.period}</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                      {job.responsibilities.map((resp, respIndex) => (
                          <li key={respIndex} dangerouslySetInnerHTML={{ __html: resp }} />
                      ))}
                    </ul>
                  </div>
              ))}
            </Timeline>
          </section>

          <section className="mb-8 avoid-break">
            <Timeline title="EDUCATION">
              <div className="flex flex-col md:flex-row md:justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{cvData.education.institution}</h3>
                  <p className="text-gray-700">{cvData.education.degree}</p>
                </div>
              </div>
            </Timeline>
          </section>

          <section className="mb-8 avoid-break">
            <Timeline title="OTHER">
              <p className="text-gray-700">
                <span className="font-semibold">Key Projects:</span> {cvData.other}
              </p>
            </Timeline>
          </section>

          <section className="mb-8 avoid-break">
            <Timeline title="LANGUAGES">
              <LanguageSection />
            </Timeline>
          </section>
        </div>
      </main>
  )
}

