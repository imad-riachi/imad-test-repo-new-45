'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CvOptimizationRecommendations } from '@/lib/api/anthropic';
import { CvData } from '@/lib/cv-parser/cv-parser';
import { Loader2 } from 'lucide-react';

export type CvOptimizationPanelProps = {
  cvData: CvData;
};

const CvOptimizationPanel: React.FC<CvOptimizationPanelProps> = ({
  cvData,
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] =
    useState<CvOptimizationRecommendations | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cv/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvData,
          jobDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to optimize CV');
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>CV Optimization</CardTitle>
          <CardDescription>
            Enter a job description to get personalized recommendations for
            improving your CV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder='Paste the job description here...'
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className='min-h-[200px]'
          />
          {error && <p className='mt-2 text-sm text-red-500'>{error}</p>}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleOptimize}
            disabled={isLoading || !jobDescription.trim()}
            className='w-full'
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Analyzing...
              </>
            ) : (
              'Optimize for This Job'
            )}
          </Button>
        </CardFooter>
      </Card>

      {recommendations && (
        <Card>
          <CardHeader>
            <CardTitle>Optimization Recommendations</CardTitle>
            <CardDescription>
              AI-powered suggestions to improve your CV for the job
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue='summary'>
              <TabsList className='grid w-full grid-cols-4'>
                <TabsTrigger value='summary'>Summary</TabsTrigger>
                <TabsTrigger value='experience'>Experience</TabsTrigger>
                <TabsTrigger value='skills'>Skills</TabsTrigger>
                <TabsTrigger value='overall'>Overall</TabsTrigger>
              </TabsList>

              <TabsContent value='summary' className='mt-4 space-y-4'>
                <h3 className='font-medium'>Summary Improvement</h3>
                <p className='text-sm'>{recommendations.summaryImprovement}</p>
              </TabsContent>

              <TabsContent value='experience' className='mt-4 space-y-4'>
                <h3 className='font-medium'>Work Experience Recommendations</h3>
                {recommendations.workExperienceRecommendations.length > 0 ? (
                  recommendations.workExperienceRecommendations.map(
                    (rec, index) => (
                      <div key={index} className='mt-4 rounded-lg border p-4'>
                        <div className='font-medium'>
                          {rec.position} at {rec.company}
                        </div>
                        <ul className='mt-2 list-inside list-disc'>
                          {rec.improvements.map((improvement, i) => (
                            <li key={i} className='mt-1 text-sm'>
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ),
                  )
                ) : (
                  <p className='text-sm text-gray-500'>
                    No specific work experience recommendations
                  </p>
                )}
              </TabsContent>

              <TabsContent value='skills' className='mt-4 space-y-4'>
                <h3 className='font-medium'>Skills to Add</h3>
                <div className='flex flex-wrap gap-2'>
                  {recommendations.skillsRecommendations.add.length > 0 ? (
                    recommendations.skillsRecommendations.add.map(
                      (skill, index) => (
                        <Badge
                          key={index}
                          variant='outline'
                          className='bg-green-50'
                        >
                          {skill}
                        </Badge>
                      ),
                    )
                  ) : (
                    <p className='text-sm text-gray-500'>No skills to add</p>
                  )}
                </div>

                <h3 className='mt-4 font-medium'>Skills to Emphasize</h3>
                <div className='flex flex-wrap gap-2'>
                  {recommendations.skillsRecommendations.emphasize.length >
                  0 ? (
                    recommendations.skillsRecommendations.emphasize.map(
                      (skill, index) => (
                        <Badge
                          key={index}
                          variant='outline'
                          className='bg-blue-50'
                        >
                          {skill}
                        </Badge>
                      ),
                    )
                  ) : (
                    <p className='text-sm text-gray-500'>
                      No skills to emphasize
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value='overall' className='mt-4 space-y-4'>
                <h3 className='font-medium'>Overall Suggestions</h3>
                <ul className='list-inside list-disc'>
                  {recommendations.overallSuggestions.map(
                    (suggestion, index) => (
                      <li key={index} className='mt-2 text-sm'>
                        {suggestion}
                      </li>
                    ),
                  )}
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CvOptimizationPanel;
