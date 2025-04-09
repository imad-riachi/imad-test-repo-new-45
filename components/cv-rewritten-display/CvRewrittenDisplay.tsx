'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { cn } from '@/lib/utils';
import { CvData } from '@/lib/cv-parser/cv-parser';
import { RewriteResponse } from '@/lib/cv-rewriter/rewriter';
import { Badge } from '../ui/badge';
import { CheckCircle2, Info } from 'lucide-react';

export interface CvRewrittenDisplayProps {
  rewriteResponse: RewriteResponse;
  className?: string;
}

const CvRewrittenDisplay: React.FC<CvRewrittenDisplayProps> = ({
  rewriteResponse,
  className,
}) => {
  const { originalCv, rewrittenCv, jobDescription, matches, improvements } =
    rewriteResponse;

  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h2 className='mb-2 text-2xl font-semibold'>CV Optimization Results</h2>
        <p className='text-muted-foreground'>
          We&apos;ve optimized your CV for the job description you provided.
        </p>
      </div>

      {/* Matches and Improvements */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CheckCircle2 className='h-5 w-5 text-green-500' />
              <span>Matching Skills</span>
            </CardTitle>
            <CardDescription>
              Skills in your CV that match the job requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {matches.skills.length > 0 ? (
              <div className='flex flex-wrap gap-2'>
                {matches.skills.map((skill, index) => (
                  <Badge key={index} variant='secondary'>
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className='text-muted-foreground text-sm'>
                No direct skill matches found.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Info className='h-5 w-5 text-blue-500' />
              <span>Suggested Improvements</span>
            </CardTitle>
            <CardDescription>
              Ways to further improve your CV for this role
            </CardDescription>
          </CardHeader>
          <CardContent>
            {improvements.length > 0 ? (
              <ul className='list-disc space-y-1 pl-5'>
                {improvements.map((improvement, index) => (
                  <li key={index} className='text-sm'>
                    {improvement}
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-muted-foreground text-sm'>
                No additional improvements suggested.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CV Comparison */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Original CV */}
        <Card>
          <CardHeader>
            <CardTitle>Original CV</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Name and Contact */}
            <div>
              <h3 className='text-xl font-semibold'>{originalCv.name}</h3>
              <div className='text-muted-foreground space-y-1 text-sm'>
                {originalCv.contactInfo.email && (
                  <p>{originalCv.contactInfo.email}</p>
                )}
                {originalCv.contactInfo.phone && (
                  <p>{originalCv.contactInfo.phone}</p>
                )}
                {originalCv.contactInfo.linkedin && (
                  <p>{originalCv.contactInfo.linkedin}</p>
                )}
              </div>
            </div>

            {/* Summary */}
            {originalCv.summary && (
              <div>
                <h4 className='mb-2 text-lg font-semibold'>
                  Professional Summary
                </h4>
                <p className='text-sm'>{originalCv.summary}</p>
              </div>
            )}

            {/* Work Experience */}
            {originalCv.workExperience.length > 0 && (
              <div>
                <h4 className='mb-2 text-lg font-semibold'>Work Experience</h4>
                {originalCv.workExperience.map((exp, index) => (
                  <div key={index} className='mb-4'>
                    <h5 className='font-medium'>{exp.position}</h5>
                    <p className='text-sm'>
                      {exp.company} | {exp.period}
                    </p>
                    <ul className='mt-2 list-disc space-y-1 pl-5'>
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className='text-sm'>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {originalCv.skills.length > 0 && (
              <div>
                <h4 className='mb-2 text-lg font-semibold'>Skills</h4>
                <div className='flex flex-wrap gap-2'>
                  {originalCv.skills.map((skill, index) => (
                    <Badge key={index} variant='outline'>
                      {skill.name}
                      {skill.level && ` (${skill.level})`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rewritten CV */}
        <Card className='bg-primary/5 border-primary/50'>
          <CardHeader>
            <CardTitle>Optimized CV</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Name and Contact */}
            <div>
              <h3 className='text-xl font-semibold'>{rewrittenCv.name}</h3>
              <div className='text-muted-foreground space-y-1 text-sm'>
                {rewrittenCv.contactInfo.email && (
                  <p>{rewrittenCv.contactInfo.email}</p>
                )}
                {rewrittenCv.contactInfo.phone && (
                  <p>{rewrittenCv.contactInfo.phone}</p>
                )}
                {rewrittenCv.contactInfo.linkedin && (
                  <p>{rewrittenCv.contactInfo.linkedin}</p>
                )}
              </div>
            </div>

            {/* Summary */}
            {rewrittenCv.summary && (
              <div>
                <h4 className='mb-2 text-lg font-semibold'>
                  Professional Summary
                </h4>
                <p className='text-sm'>{rewrittenCv.summary}</p>
              </div>
            )}

            {/* Work Experience */}
            {rewrittenCv.workExperience.length > 0 && (
              <div>
                <h4 className='mb-2 text-lg font-semibold'>Work Experience</h4>
                {rewrittenCv.workExperience.map((exp, index) => (
                  <div key={index} className='mb-4'>
                    <h5 className='font-medium'>{exp.position}</h5>
                    <p className='text-sm'>
                      {exp.company} | {exp.period}
                    </p>
                    <ul className='mt-2 list-disc space-y-1 pl-5'>
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className='text-sm'>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {rewrittenCv.skills.length > 0 && (
              <div>
                <h4 className='mb-2 text-lg font-semibold'>Skills</h4>
                <div className='flex flex-wrap gap-2'>
                  {rewrittenCv.skills.map((skill, index) => {
                    const isMatched = matches.skills.includes(skill.name);
                    return (
                      <Badge
                        key={index}
                        variant={isMatched ? 'default' : 'outline'}
                        className={isMatched ? 'bg-green-600' : ''}
                      >
                        {skill.name}
                        {skill.level && ` (${skill.level})`}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Job Description */}
      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm whitespace-pre-line'>{jobDescription}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CvRewrittenDisplay;
