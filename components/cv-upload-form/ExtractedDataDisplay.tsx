import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface CvData {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  summary?: string;
  workExperience?: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  education?: {
    institution: string;
    degree: string;
    date: string;
  }[];
  skills?: string[];
  [key: string]: any;
}

interface ExtractedDataDisplayProps {
  data: CvData;
  className?: string;
  onEdit?: (data: CvData) => void;
}

export function ExtractedDataDisplay({
  data,
  className,
  onEdit,
}: ExtractedDataDisplayProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<CvData>(data);

  const handleSave = () => {
    setEditMode(false);
    if (onEdit) {
      onEdit(editedData);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          Extracted CV Data
          {onEdit && (
            <Button
              variant={editMode ? 'default' : 'outline'}
              onClick={() => (editMode ? handleSave() : setEditMode(true))}
            >
              {editMode ? 'Save Changes' : 'Edit Data'}
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          The system has automatically extracted the following information from
          your CV
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='structured'>
          <TabsList className='mb-4'>
            <TabsTrigger value='structured'>Structured View</TabsTrigger>
            <TabsTrigger value='json'>JSON Data</TabsTrigger>
          </TabsList>

          <TabsContent value='structured'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <h3 className='text-lg font-semibold'>Personal Information</h3>
                <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
                  <div className='flex flex-col'>
                    <span className='text-muted-foreground text-sm'>Name</span>
                    <span>{data.name || 'Not detected'}</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-muted-foreground text-sm'>Email</span>
                    <span>{data.email || 'Not detected'}</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-muted-foreground text-sm'>Phone</span>
                    <span>{data.phone || 'Not detected'}</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-muted-foreground text-sm'>
                      LinkedIn
                    </span>
                    <span>{data.linkedin || 'Not detected'}</span>
                  </div>
                </div>
              </div>

              {data.summary && (
                <div className='space-y-2'>
                  <h3 className='text-lg font-semibold'>Summary</h3>
                  <p className='text-sm'>{data.summary}</p>
                </div>
              )}

              {data.workExperience && data.workExperience.length > 0 && (
                <div className='space-y-2'>
                  <h3 className='text-lg font-semibold'>Work Experience</h3>
                  <Accordion type='multiple' className='w-full'>
                    {data.workExperience.map((exp, index) => (
                      <AccordionItem key={index} value={`work-${index}`}>
                        <AccordionTrigger>
                          <div className='flex flex-col items-start text-left'>
                            <div>
                              {exp.position} at {exp.company}
                            </div>
                            <div className='text-muted-foreground text-sm'>
                              {exp.duration}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className='text-sm'>{exp.description}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {data.education && data.education.length > 0 && (
                <div className='space-y-2'>
                  <h3 className='text-lg font-semibold'>Education</h3>
                  <Accordion type='multiple' className='w-full'>
                    {data.education.map((edu, index) => (
                      <AccordionItem key={index} value={`edu-${index}`}>
                        <AccordionTrigger>
                          <div className='flex flex-col items-start text-left'>
                            <div>{edu.degree}</div>
                            <div className='text-muted-foreground text-sm'>
                              {edu.institution}, {edu.date}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className='text-sm'>{edu.institution}</p>
                          <p className='text-muted-foreground text-sm'>
                            {edu.date}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {data.skills && data.skills.length > 0 && (
                <div className='space-y-2'>
                  <h3 className='text-lg font-semibold'>Skills</h3>
                  <div className='flex flex-wrap gap-2'>
                    {data.skills.map((skill, index) => (
                      <Badge key={index} variant='secondary'>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value='json'>
            <pre className='bg-muted max-h-[400px] overflow-auto rounded-md p-4 text-xs'>
              {JSON.stringify(data, null, 2)}
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
