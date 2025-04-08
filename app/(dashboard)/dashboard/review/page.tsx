'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type CVData = {
  summary?: string;
  experience?: Array<{
    company: string;
    position: string;
    date?: string;
    description: string[];
    achievements?: string[];
  }>;
  skills?: string[];
  education?: Array<{
    institution: string;
    degree: string;
    date?: string;
    description?: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies?: string[];
  }>;
};

const ReviewPage = () => {
  const [rewrittenCV, setRewrittenCV] = useState<CVData | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Retrieve the rewritten CV and job description from sessionStorage
    const storedCV = sessionStorage.getItem('rewrittenCV');
    const storedJobDescription = sessionStorage.getItem('jobDescription');

    console.log('Attempting to retrieve stored CV data');
    console.log('Stored CV exists:', !!storedCV);

    setIsLoading(false);

    if (!storedCV) {
      toast.error('No optimized CV found', {
        description: 'Please go back and complete the optimization process.',
      });
      router.push('/dashboard/job-description');
      return;
    }

    try {
      const parsedCV = JSON.parse(storedCV);
      console.log('Successfully parsed CV data:', parsedCV);
      setRewrittenCV(parsedCV);

      if (storedJobDescription) {
        setJobDescription(storedJobDescription);
      }
    } catch (error) {
      console.error('Error parsing stored CV data:', error);
      toast.error('Error loading CV data', {
        description: 'There was a problem loading your optimized CV.',
      });
    }
  }, [router]);

  const handleDownloadMarkdown = () => {
    if (!rewrittenCV) return;

    // Convert CV data to markdown format
    const markdown = generateMarkdown(rewrittenCV);

    // Create a blob and download link
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized_cv.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateMarkdown = (cv: CVData): string => {
    let markdown = '# Professional CV\n\n';

    if (cv.summary) {
      markdown += `## Summary\n${cv.summary}\n\n`;
    }

    if (cv.experience && cv.experience.length > 0) {
      markdown += '## Professional Experience\n\n';
      cv.experience.forEach((exp) => {
        markdown += `### ${exp.position} at ${exp.company}\n`;
        if (exp.date) markdown += `${exp.date}\n\n`;

        exp.description.forEach((desc) => {
          markdown += `- ${desc}\n`;
        });

        if (exp.achievements && exp.achievements.length > 0) {
          markdown += '\n**Achievements:**\n';
          exp.achievements.forEach((achievement) => {
            markdown += `- ${achievement}\n`;
          });
        }
        markdown += '\n';
      });
    }

    if (cv.skills && cv.skills.length > 0) {
      markdown += '## Skills\n\n';
      cv.skills.forEach((skill) => {
        markdown += `- ${skill}\n`;
      });
      markdown += '\n';
    }

    if (cv.education && cv.education.length > 0) {
      markdown += '## Education\n\n';
      cv.education.forEach((edu) => {
        markdown += `### ${edu.degree}\n`;
        markdown += `${edu.institution}`;
        if (edu.date) markdown += ` (${edu.date})`;
        markdown += '\n\n';
        if (edu.description) markdown += `${edu.description}\n\n`;
      });
    }

    if (cv.projects && cv.projects.length > 0) {
      markdown += '## Projects\n\n';
      cv.projects.forEach((project) => {
        markdown += `### ${project.name}\n\n`;
        markdown += `${project.description}\n\n`;

        if (project.technologies && project.technologies.length > 0) {
          markdown += `**Technologies:** ${project.technologies.join(', ')}\n\n`;
        }
      });
    }

    return markdown;
  };

  // Function to generate PDF (placeholder for now)
  const handleDownloadPDF = () => {
    toast.info('PDF Download', {
      description: 'PDF generation will be implemented in Sprint 4.3',
    });
  };

  return (
    <div className='mx-auto w-full max-w-4xl py-8'>
      <h1 className='mb-6 text-3xl font-bold tracking-tight'>
        Review & Download Your CV
      </h1>
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <p className='mb-6 text-gray-600'>
          Your CV has been optimized based on the job description.
        </p>

        <div className='mb-8 rounded-md border border-gray-200 p-4'>
          <h2 className='mb-4 text-xl font-semibold'>Optimized CV Preview</h2>
          <div className='max-h-96 overflow-y-auto rounded-md bg-gray-50 p-4'>
            {isLoading ? (
              <p className='text-gray-400 italic'>
                Loading your optimized CV...
              </p>
            ) : !rewrittenCV ? (
              <p className='text-gray-400 italic'>No CV data available</p>
            ) : (
              <div className='space-y-6'>
                {rewrittenCV.summary && (
                  <div>
                    <h3 className='text-lg font-medium'>
                      Professional Summary
                    </h3>
                    <p className='mt-1'>{rewrittenCV.summary}</p>
                  </div>
                )}

                {rewrittenCV.experience &&
                  rewrittenCV.experience.length > 0 && (
                    <div>
                      <h3 className='text-lg font-medium'>Experience</h3>
                      {rewrittenCV.experience.map((exp, index) => (
                        <div
                          key={index}
                          className='mt-2 border-l-2 border-gray-200 pl-4'
                        >
                          <div className='font-medium'>
                            {exp.position} at {exp.company}
                          </div>
                          {exp.date && (
                            <div className='text-sm text-gray-500'>
                              {exp.date}
                            </div>
                          )}
                          <ul className='mt-1 list-disc pl-5'>
                            {exp.description.map((desc, i) => (
                              <li key={i}>{desc}</li>
                            ))}
                          </ul>
                          {exp.achievements && exp.achievements.length > 0 && (
                            <>
                              <div className='mt-1 font-medium'>
                                Achievements:
                              </div>
                              <ul className='list-disc pl-5'>
                                {exp.achievements.map((achievement, i) => (
                                  <li key={i}>{achievement}</li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                {rewrittenCV.skills && rewrittenCV.skills.length > 0 && (
                  <div>
                    <h3 className='text-lg font-medium'>Skills</h3>
                    <div className='mt-1 flex flex-wrap gap-2'>
                      {rewrittenCV.skills.map((skill, index) => (
                        <span
                          key={index}
                          className='rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800'
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {rewrittenCV.education && rewrittenCV.education.length > 0 && (
                  <div>
                    <h3 className='text-lg font-medium'>Education</h3>
                    {rewrittenCV.education.map((edu, index) => (
                      <div key={index} className='mt-2'>
                        <div className='font-medium'>{edu.degree}</div>
                        <div>
                          {edu.institution} {edu.date && `(${edu.date})`}
                        </div>
                        {edu.description && (
                          <p className='mt-1'>{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {rewrittenCV.projects && rewrittenCV.projects.length > 0 && (
                  <div>
                    <h3 className='text-lg font-medium'>Projects</h3>
                    {rewrittenCV.projects.map((project, index) => (
                      <div
                        key={index}
                        className='mt-2 border-l-2 border-gray-200 pl-4'
                      >
                        <div className='font-medium'>{project.name}</div>
                        <p className='mt-1'>{project.description}</p>
                        {project.technologies &&
                          project.technologies.length > 0 && (
                            <div className='mt-1'>
                              <span className='font-medium'>
                                Technologies:{' '}
                              </span>
                              {project.technologies.join(', ')}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row sm:justify-end'>
          <button
            onClick={handleDownloadMarkdown}
            disabled={!rewrittenCV}
            className='rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Download as Markdown
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={!rewrittenCV}
            className='rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
