'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CvUploadForm from '@/components/cv-upload-form/CvUploadForm';
import { ExtractedDataDisplay } from '@/components/cv-upload-form/ExtractedDataDisplay';
import JobDescriptionForm from '@/components/job-description-form/JobDescriptionForm';
import CvEditablePreview from '@/components/cv-editable-preview';
import { downloadCvAsMarkdown, downloadCvAsPdf } from '@/lib/cv-export';
import { CvData } from '@/lib/cv-parser/cv-parser';
import { RewriteResponse } from '@/lib/cv-rewriter/rewriter';
import { CheckCircle2, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Utility function to convert CvData from parser format to extractor format
const convertCvDataForExport = (cv: CvData) => {
  return {
    personalInfo: {
      name: cv.name,
      email: cv.contactInfo.email,
      phone: cv.contactInfo.phone || '',
      location: cv.contactInfo.location || '',
      linkedIn: cv.contactInfo.linkedin,
      portfolio: cv.contactInfo.website,
    },
    summary: cv.summary || '',
    workExperience: cv.workExperience.map((job) => ({
      company: job.company,
      position: job.position,
      startDate: job.period.split('-')[0].trim(),
      endDate:
        job.period.split('-').length > 1
          ? job.period.split('-')[1].trim()
          : 'Present',
      description: job.responsibilities.join('\n'),
      achievements: [],
    })),
    education: cv.education.map((edu) => ({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.fieldOfStudy || '',
      graduationDate: edu.year,
      gpa: '',
    })),
    skills: {
      technical: cv.skills.map((skill) => skill.name),
      languages: cv.languages?.map((lang) => lang.name) || [],
    },
  };
};

export default function Dashboard() {
  // State for tracking the current step in the workflow
  const [currentStep, setCurrentStep] = useState<
    'upload' | 'optimize' | 'results'
  >('upload');

  // State for storing the extracted CV data
  const [extractedCV, setExtractedCV] = useState<CvData | null>(null);

  // State for storing the rewritten CV data
  const [rewriteResponse, setRewriteResponse] =
    useState<RewriteResponse | null>(null);

  // Handle successful CV extraction
  const handleCvExtracted = (cvData: CvData) => {
    setExtractedCV(cvData);
    setCurrentStep('optimize');
  };

  // Handle successful CV rewrite
  const handleRewriteComplete = (response: RewriteResponse) => {
    setRewriteResponse(response);
    setCurrentStep('results');
  };

  // Handle CV rewrite error
  const handleRewriteError = (message: string) => {
    console.error('Error rewriting CV:', message);
    // You could add a toast notification here
  };

  // Handle PDF download
  const handleGeneratePdf = async (cv: CvData) => {
    try {
      // For PDF we use the browser print functionality directly
      // This doesn't require the CvData conversion since it prints the current view
      downloadCvAsPdf('optimized-cv.pdf');
      return Promise.resolve();
    } catch (error) {
      console.error('Error generating PDF:', error);
      return Promise.reject(error);
    }
  };

  // Handle Markdown download
  const handleGenerateMarkdown = async (cv: CvData) => {
    try {
      // Convert CvData from parser format to extractor format
      const convertedCv = convertCvDataForExport(cv);
      downloadCvAsMarkdown(convertedCv, 'optimized-cv.md');
      return Promise.resolve();
    } catch (error) {
      console.error('Error generating Markdown:', error);
      return Promise.reject(error);
    }
  };

  // Handle saving CV edits
  const handleSaveCvEdits = (updatedCv: CvData) => {
    // In a real application, you might want to save the updated CV to the backend
    if (rewriteResponse) {
      setRewriteResponse({
        ...rewriteResponse,
        rewrittenCv: updatedCv,
      });
    }
  };

  // Handle going back to a previous step
  const handleBack = () => {
    if (currentStep === 'results') {
      setCurrentStep('optimize');
    } else if (currentStep === 'optimize') {
      setCurrentStep('upload');
      setExtractedCV(null);
    }
  };

  // Restart the entire process
  const handleReset = () => {
    setCurrentStep('upload');
    setExtractedCV(null);
    setRewriteResponse(null);
  };

  return (
    <div className='container mx-auto px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mb-8 flex flex-col'>
        <h1 className='mb-2 text-3xl font-bold'>CV Optimizer</h1>
        <p className='text-muted-foreground'>
          Enhance your CV for specific job descriptions using AI
        </p>
      </div>

      {/* Workflow Steps */}
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                currentStep === 'upload'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              1. Upload CV
            </div>
            <div className='bg-border h-px w-5'></div>
            <div
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                currentStep === 'optimize'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              2. Add Job Description
            </div>
            <div className='bg-border h-px w-5'></div>
            <div
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                currentStep === 'results'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              3. View & Export Results
            </div>
          </div>

          {currentStep !== 'upload' && (
            <Button variant='ghost' onClick={handleBack}>
              Back
            </Button>
          )}
        </div>
      </div>

      {/* CV Upload Step */}
      {currentStep === 'upload' && (
        <div className='grid gap-6 md:grid-cols-2'>
          <CvUploadForm
            onUploadComplete={(fileData) => {
              if (fileData.data) {
                handleCvExtracted(fileData.data);
              }
            }}
            extractData={true}
          />

          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
              <CardDescription>
                Optimize your CV for each job application in 3 simple steps
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <h3 className='font-medium'>1. Upload your CV</h3>
                <p className='text-muted-foreground text-sm'>
                  Upload your existing CV in PDF, Word, or plain text format.
                  Our system will extract and analyze the content.
                </p>
              </div>
              <div>
                <h3 className='font-medium'>2. Paste the job description</h3>
                <p className='text-muted-foreground text-sm'>
                  Provide the job description you&apos;re applying for, and our
                  AI will identify key requirements.
                </p>
              </div>
              <div>
                <h3 className='font-medium'>3. Get your optimized CV</h3>
                <p className='text-muted-foreground text-sm'>
                  Our AI will analyze your CV and job description to create a
                  tailored CV with highlighted relevant skills. You can edit the
                  results and download in Markdown or PDF format.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Job Description Step */}
      {currentStep === 'optimize' && extractedCV && (
        <div className='grid gap-6 md:grid-cols-2'>
          <JobDescriptionForm
            cvData={extractedCV}
            onRewriteComplete={handleRewriteComplete}
            onRewriteError={handleRewriteError}
          />

          <div className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Your Extracted CV Data</CardTitle>
                <CardDescription>
                  Review the information extracted from your CV
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExtractedDataDisplay
                  data={{
                    name: extractedCV.name,
                    email: extractedCV.contactInfo?.email || '',
                    phone: extractedCV.contactInfo?.phone || '',
                    linkedin: extractedCV.contactInfo?.linkedin || '',
                    summary: extractedCV.summary || '',
                    workExperience:
                      extractedCV.workExperience?.map((exp) => ({
                        company: exp.company,
                        position: exp.position,
                        duration: exp.period || '',
                        description: Array.isArray(exp.responsibilities)
                          ? exp.responsibilities.join('\n')
                          : '',
                      })) || [],
                    education:
                      extractedCV.education?.map((edu) => ({
                        institution: edu.institution,
                        degree: edu.degree,
                        date: edu.year || '',
                      })) || [],
                    skills:
                      extractedCV.skills?.map((skill) => skill.name) || [],
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground mb-4 text-sm'>
                  Paste a job description in the form to the left. Our AI will
                  analyze both your CV and the job description to create an
                  optimized version.
                </p>
                <p className='text-muted-foreground text-sm'>
                  The optimized CV will highlight relevant skills and experience
                  that match the job requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Results Step */}
      {currentStep === 'results' && rewriteResponse && (
        <div className='space-y-6'>
          <div className='grid gap-6 md:grid-cols-2'>
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
                {rewriteResponse.matches.skills.length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {rewriteResponse.matches.skills.map((skill, index) => (
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
                {rewriteResponse.improvements.length > 0 ? (
                  <ul className='list-disc space-y-1 pl-5'>
                    {rewriteResponse.improvements.map((improvement, index) => (
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

          <Card className='mb-6'>
            <CardHeader>
              <CardTitle>Edit and Export Your Optimized CV</CardTitle>
              <CardDescription>
                Make changes to your CV and download it in your preferred format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CvEditablePreview
                cvData={rewriteResponse.rewrittenCv}
                onSave={handleSaveCvEdits}
                onGeneratePdf={handleGeneratePdf}
                onGenerateMarkdown={handleGenerateMarkdown}
              />
            </CardContent>
          </Card>

          <div className='flex justify-center'>
            <Button onClick={handleReset}>Start New Optimization</Button>
          </div>
        </div>
      )}
    </div>
  );
}
