'use client';

import React from 'react';

export type CVData = {
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

export type CVDisplayProps = {
  cv: CVData | null;
  isLoading?: boolean;
};

const CVDisplay: React.FC<CVDisplayProps> = ({ cv, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className='flex h-48 items-center justify-center'>
        <p className='text-gray-400 italic'>Loading your optimized CV...</p>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className='flex h-48 items-center justify-center'>
        <p className='text-gray-400 italic'>No CV data available</p>
      </div>
    );
  }

  return (
    <div className='space-y-6 dark:text-gray-100'>
      {cv.summary && (
        <div>
          <h3 className='text-lg font-medium dark:text-gray-100'>
            Professional Summary
          </h3>
          <p className='mt-1'>{cv.summary}</p>
        </div>
      )}

      {cv.experience && cv.experience.length > 0 && (
        <div>
          <h3 className='text-lg font-medium dark:text-gray-100'>Experience</h3>
          {cv.experience.map((exp, index) => (
            <div
              key={index}
              className='mt-2 border-l-2 border-gray-200 pl-4 dark:border-gray-700'
            >
              <div className='font-medium'>
                {exp.position} at {exp.company}
              </div>
              {exp.date && (
                <div className='text-sm text-gray-500 dark:text-gray-400'>
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
                  <div className='mt-1 font-medium'>Achievements:</div>
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

      {cv.skills && cv.skills.length > 0 && (
        <div>
          <h3 className='text-lg font-medium dark:text-gray-100'>Skills</h3>
          <div className='mt-1 flex flex-wrap gap-2'>
            {cv.skills.map((skill, index) => (
              <span
                key={index}
                className='rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-100'
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {cv.education && cv.education.length > 0 && (
        <div>
          <h3 className='text-lg font-medium dark:text-gray-100'>Education</h3>
          {cv.education.map((edu, index) => (
            <div key={index} className='mt-2'>
              <div className='font-medium'>{edu.degree}</div>
              <div>
                {edu.institution} {edu.date && `(${edu.date})`}
              </div>
              {edu.description && <p className='mt-1'>{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {cv.projects && cv.projects.length > 0 && (
        <div>
          <h3 className='text-lg font-medium dark:text-gray-100'>Projects</h3>
          {cv.projects.map((project, index) => (
            <div
              key={index}
              className='mt-2 border-l-2 border-gray-200 pl-4 dark:border-gray-700'
            >
              <div className='font-medium'>{project.name}</div>
              <p className='mt-1'>{project.description}</p>
              {project.technologies && project.technologies.length > 0 && (
                <div className='mt-1'>
                  <span className='font-medium'>Technologies: </span>
                  {project.technologies.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CVDisplay;
