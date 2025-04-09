'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CvData } from '@/lib/cv-parser/cv-parser';
import { cn } from '@/lib/utils';
import {
  Pencil,
  Save,
  X,
  Plus,
  Trash,
  Download,
  FileType,
  FileText,
} from 'lucide-react';

export interface CvEditablePreviewProps {
  /** The rewritten CV data that can be edited */
  cvData: CvData;
  /** Optional classname for styling */
  className?: string;
  /** Callback when changes are saved */
  onSave?: (updatedCv: CvData) => void;
  /** Callback to generate PDF */
  onGeneratePdf?: (cv: CvData) => Promise<void>;
  /** Callback to generate Markdown */
  onGenerateMarkdown?: (cv: CvData) => Promise<void>;
}

/**
 * Component that displays a CV in an editable format
 */
const CvEditablePreview: React.FC<CvEditablePreviewProps> = ({
  cvData,
  className,
  onSave,
  onGeneratePdf,
  onGenerateMarkdown,
}) => {
  // State for the editable CV data
  const [editableCv, setEditableCv] = useState<CvData>({ ...cvData });
  // Track which section is currently being edited
  const [editingSection, setEditingSection] = useState<string | null>(null);
  // Loading states for save and export actions
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  // Handle saving changes
  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      try {
        await onSave(editableCv);
      } catch (error) {
        console.error('Error saving CV:', error);
      } finally {
        setIsSaving(false);
        setEditingSection(null);
      }
    } else {
      setEditingSection(null);
    }
  };

  // Handle cancelling edits
  const handleCancelEdit = () => {
    setEditableCv({ ...cvData });
    setEditingSection(null);
  };

  // Handle exporting CV
  const handleExport = async (format: 'pdf' | 'markdown') => {
    setIsExporting(format);
    try {
      if (format === 'pdf' && onGeneratePdf) {
        await onGeneratePdf(editableCv);
      } else if (format === 'markdown' && onGenerateMarkdown) {
        await onGenerateMarkdown(editableCv);
      }
    } catch (error) {
      console.error(`Error generating ${format}:`, error);
    } finally {
      setIsExporting(null);
    }
  };

  // Update a specific field in the CV
  const updateField = (field: string, value: any) => {
    setEditableCv((prev) => {
      const updated = { ...prev };
      const keys = field.split('.');

      // Handle nested properties
      if (keys.length > 1) {
        let current: any = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
      } else {
        // Handle top-level properties
        (updated as any)[field] = value;
      }
      return updated;
    });
  };

  // Add a new work experience entry
  const addWorkExperience = () => {
    setEditableCv((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          company: 'Company Name',
          position: 'Position Title',
          period: 'Period',
          responsibilities: ['Add your responsibilities here'],
          location: '',
        },
      ],
    }));
    setEditingSection('workExperience.new');
  };

  // Remove a work experience entry
  const removeWorkExperience = (index: number) => {
    setEditableCv((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }));
  };

  // Add a new education entry
  const addEducation = () => {
    setEditableCv((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: 'Institution Name',
          degree: 'Degree',
          year: 'Year',
          fieldOfStudy: '',
          achievements: [],
        },
      ],
    }));
    setEditingSection('education.new');
  };

  // Remove an education entry
  const removeEducation = (index: number) => {
    setEditableCv((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Add a new skill
  const addSkill = () => {
    setEditableCv((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: 'New Skill', level: '' }],
    }));
    setEditingSection('skills.new');
  };

  // Remove a skill
  const removeSkill = (index: number) => {
    setEditableCv((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // Inline edit toolbar
  const EditToolbar = ({
    onSave,
    onCancel,
  }: {
    onSave: () => void;
    onCancel: () => void;
  }) => (
    <div className='mt-2 flex items-center space-x-2'>
      <Button size='sm' onClick={onSave} className='h-8 px-2'>
        <Save className='mr-1 h-3.5 w-3.5' />
        Save
      </Button>
      <Button
        size='sm'
        variant='outline'
        onClick={onCancel}
        className='h-8 px-2'
      >
        <X className='mr-1 h-3.5 w-3.5' />
        Cancel
      </Button>
    </div>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with export options */}
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Your Optimized CV</h2>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleExport('markdown')}
            disabled={!!isExporting}
          >
            {isExporting === 'markdown' ? (
              'Exporting...'
            ) : (
              <>
                <FileType className='mr-1 h-4 w-4' />
                Export as Markdown
              </>
            )}
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleExport('pdf')}
            disabled={!!isExporting}
          >
            {isExporting === 'pdf' ? (
              'Exporting...'
            ) : (
              <>
                <FileText className='mr-1 h-4 w-4' />
                Export as PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className='cv-content'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            {editingSection === 'name' ? (
              <div className='w-full'>
                <Input
                  value={editableCv.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder='Your Name'
                  className='text-xl font-semibold'
                />
                <EditToolbar onSave={handleSave} onCancel={handleCancelEdit} />
              </div>
            ) : (
              <CardTitle className='flex items-center text-xl font-semibold'>
                {editableCv.name}
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setEditingSection('name')}
                  className='ml-2 h-6 w-6 p-0'
                >
                  <Pencil className='h-3.5 w-3.5' />
                </Button>
              </CardTitle>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Contact Information */}
          <div>
            <div className='mb-2 flex items-center justify-between'>
              <h3 className='text-lg font-medium'>Contact Information</h3>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setEditingSection('contactInfo')}
                disabled={editingSection === 'contactInfo'}
              >
                <Pencil className='mr-1 h-3.5 w-3.5' />
                Edit
              </Button>
            </div>
            {editingSection === 'contactInfo' ? (
              <div className='space-y-3'>
                <div>
                  <label className='text-sm font-medium'>Email</label>
                  <Input
                    value={editableCv.contactInfo.email}
                    onChange={(e) =>
                      updateField('contactInfo.email', e.target.value)
                    }
                    placeholder='email@example.com'
                  />
                </div>
                <div>
                  <label className='text-sm font-medium'>Phone</label>
                  <Input
                    value={editableCv.contactInfo.phone || ''}
                    onChange={(e) =>
                      updateField('contactInfo.phone', e.target.value)
                    }
                    placeholder='Phone number'
                  />
                </div>
                <div>
                  <label className='text-sm font-medium'>LinkedIn</label>
                  <Input
                    value={editableCv.contactInfo.linkedin || ''}
                    onChange={(e) =>
                      updateField('contactInfo.linkedin', e.target.value)
                    }
                    placeholder='LinkedIn profile URL'
                  />
                </div>
                <div>
                  <label className='text-sm font-medium'>Website</label>
                  <Input
                    value={editableCv.contactInfo.website || ''}
                    onChange={(e) =>
                      updateField('contactInfo.website', e.target.value)
                    }
                    placeholder='Personal website URL'
                  />
                </div>
                <div>
                  <label className='text-sm font-medium'>Location</label>
                  <Input
                    value={editableCv.contactInfo.location || ''}
                    onChange={(e) =>
                      updateField('contactInfo.location', e.target.value)
                    }
                    placeholder='Location'
                  />
                </div>
                <EditToolbar onSave={handleSave} onCancel={handleCancelEdit} />
              </div>
            ) : (
              <div className='text-muted-foreground text-sm'>
                <p>{editableCv.contactInfo.email}</p>
                {editableCv.contactInfo.phone && (
                  <p>{editableCv.contactInfo.phone}</p>
                )}
                {editableCv.contactInfo.linkedin && (
                  <p>{editableCv.contactInfo.linkedin}</p>
                )}
                {editableCv.contactInfo.website && (
                  <p>{editableCv.contactInfo.website}</p>
                )}
                {editableCv.contactInfo.location && (
                  <p>{editableCv.contactInfo.location}</p>
                )}
              </div>
            )}
          </div>

          {/* Professional Summary */}
          <div>
            <div className='mb-2 flex items-center justify-between'>
              <h3 className='text-lg font-medium'>Professional Summary</h3>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setEditingSection('summary')}
                disabled={editingSection === 'summary'}
              >
                <Pencil className='mr-1 h-3.5 w-3.5' />
                Edit
              </Button>
            </div>
            {editingSection === 'summary' ? (
              <div>
                <Textarea
                  value={editableCv.summary || ''}
                  onChange={(e) => updateField('summary', e.target.value)}
                  placeholder='Write a professional summary...'
                  rows={4}
                />
                <EditToolbar onSave={handleSave} onCancel={handleCancelEdit} />
              </div>
            ) : (
              <p className='text-sm'>{editableCv.summary}</p>
            )}
          </div>

          {/* Work Experience */}
          <div>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-medium'>Work Experience</h3>
              <Button variant='outline' size='sm' onClick={addWorkExperience}>
                <Plus className='mr-1 h-3.5 w-3.5' />
                Add Experience
              </Button>
            </div>
            <div className='space-y-6'>
              {editableCv.workExperience.map((exp, index) => (
                <div key={index} className='relative rounded-md border p-4'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setEditingSection(`workExperience.${index}`)}
                    disabled={editingSection === `workExperience.${index}`}
                    className='absolute top-3 right-8'
                  >
                    <Pencil className='h-3.5 w-3.5' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => removeWorkExperience(index)}
                    className='text-destructive absolute top-3 right-2'
                  >
                    <Trash className='h-3.5 w-3.5' />
                  </Button>

                  {editingSection === `workExperience.${index}` ? (
                    <div className='space-y-3'>
                      <div>
                        <label className='text-sm font-medium'>Company</label>
                        <Input
                          value={exp.company}
                          onChange={(e) => {
                            const updatedExperiences = [
                              ...editableCv.workExperience,
                            ];
                            updatedExperiences[index].company = e.target.value;
                            updateField('workExperience', updatedExperiences);
                          }}
                          placeholder='Company name'
                        />
                      </div>
                      <div>
                        <label className='text-sm font-medium'>Position</label>
                        <Input
                          value={exp.position}
                          onChange={(e) => {
                            const updatedExperiences = [
                              ...editableCv.workExperience,
                            ];
                            updatedExperiences[index].position = e.target.value;
                            updateField('workExperience', updatedExperiences);
                          }}
                          placeholder='Job title'
                        />
                      </div>
                      <div>
                        <label className='text-sm font-medium'>Period</label>
                        <Input
                          value={exp.period}
                          onChange={(e) => {
                            const updatedExperiences = [
                              ...editableCv.workExperience,
                            ];
                            updatedExperiences[index].period = e.target.value;
                            updateField('workExperience', updatedExperiences);
                          }}
                          placeholder='Employment period'
                        />
                      </div>
                      <div>
                        <label className='text-sm font-medium'>
                          Responsibilities
                        </label>
                        {exp.responsibilities.map((resp, respIndex) => (
                          <div key={respIndex} className='mb-2 flex'>
                            <Input
                              value={resp}
                              onChange={(e) => {
                                const updatedExperiences = [
                                  ...editableCv.workExperience,
                                ];
                                updatedExperiences[index].responsibilities[
                                  respIndex
                                ] = e.target.value;
                                updateField(
                                  'workExperience',
                                  updatedExperiences,
                                );
                              }}
                              placeholder={`Responsibility ${respIndex + 1}`}
                              className='flex-1'
                            />
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => {
                                const updatedExperiences = [
                                  ...editableCv.workExperience,
                                ];
                                updatedExperiences[index].responsibilities =
                                  updatedExperiences[
                                    index
                                  ].responsibilities.filter(
                                    (_, i) => i !== respIndex,
                                  );
                                updateField(
                                  'workExperience',
                                  updatedExperiences,
                                );
                              }}
                              className='text-destructive ml-2 h-10 w-10 p-0'
                            >
                              <Trash className='h-3.5 w-3.5' />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            const updatedExperiences = [
                              ...editableCv.workExperience,
                            ];
                            updatedExperiences[index].responsibilities.push('');
                            updateField('workExperience', updatedExperiences);
                          }}
                          className='mt-2'
                        >
                          <Plus className='mr-1 h-3.5 w-3.5' />
                          Add Responsibility
                        </Button>
                      </div>
                      <EditToolbar
                        onSave={handleSave}
                        onCancel={handleCancelEdit}
                      />
                    </div>
                  ) : (
                    <div>
                      <h4 className='font-medium'>{exp.position}</h4>
                      <p className='text-muted-foreground text-sm'>
                        {exp.company} | {exp.period}
                      </p>
                      <ul className='mt-2 list-disc pl-5'>
                        {exp.responsibilities.map((resp, respIndex) => (
                          <li key={respIndex} className='text-sm'>
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-medium'>Education</h3>
              <Button variant='outline' size='sm' onClick={addEducation}>
                <Plus className='mr-1 h-3.5 w-3.5' />
                Add Education
              </Button>
            </div>
            <div className='space-y-4'>
              {editableCv.education.map((edu, index) => (
                <div key={index} className='relative rounded-md border p-4'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setEditingSection(`education.${index}`)}
                    disabled={editingSection === `education.${index}`}
                    className='absolute top-3 right-8'
                  >
                    <Pencil className='h-3.5 w-3.5' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => removeEducation(index)}
                    className='text-destructive absolute top-3 right-2'
                  >
                    <Trash className='h-3.5 w-3.5' />
                  </Button>

                  {editingSection === `education.${index}` ? (
                    <div className='space-y-3'>
                      <div>
                        <label className='text-sm font-medium'>
                          Institution
                        </label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => {
                            const updatedEducation = [...editableCv.education];
                            updatedEducation[index].institution =
                              e.target.value;
                            updateField('education', updatedEducation);
                          }}
                          placeholder='Institution name'
                        />
                      </div>
                      <div>
                        <label className='text-sm font-medium'>Degree</label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => {
                            const updatedEducation = [...editableCv.education];
                            updatedEducation[index].degree = e.target.value;
                            updateField('education', updatedEducation);
                          }}
                          placeholder='Degree'
                        />
                      </div>
                      <div>
                        <label className='text-sm font-medium'>Year</label>
                        <Input
                          value={edu.year}
                          onChange={(e) => {
                            const updatedEducation = [...editableCv.education];
                            updatedEducation[index].year = e.target.value;
                            updateField('education', updatedEducation);
                          }}
                          placeholder='Graduation year'
                        />
                      </div>
                      <div>
                        <label className='text-sm font-medium'>
                          Field of Study
                        </label>
                        <Input
                          value={edu.fieldOfStudy || ''}
                          onChange={(e) => {
                            const updatedEducation = [...editableCv.education];
                            updatedEducation[index].fieldOfStudy =
                              e.target.value;
                            updateField('education', updatedEducation);
                          }}
                          placeholder='Field of study'
                        />
                      </div>
                      <EditToolbar
                        onSave={handleSave}
                        onCancel={handleCancelEdit}
                      />
                    </div>
                  ) : (
                    <div>
                      <h4 className='font-medium'>{edu.degree}</h4>
                      <p className='text-muted-foreground text-sm'>
                        {edu.institution} | {edu.year}
                      </p>
                      {edu.fieldOfStudy && (
                        <p className='text-sm'>{edu.fieldOfStudy}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-medium'>Skills</h3>
              <Button variant='outline' size='sm' onClick={addSkill}>
                <Plus className='mr-1 h-3.5 w-3.5' />
                Add Skill
              </Button>
            </div>
            {editingSection === 'skills' ? (
              <div className='space-y-3'>
                {editableCv.skills.map((skill, index) => (
                  <div key={index} className='flex items-center'>
                    <Input
                      value={skill.name}
                      onChange={(e) => {
                        const updatedSkills = [...editableCv.skills];
                        updatedSkills[index].name = e.target.value;
                        updateField('skills', updatedSkills);
                      }}
                      placeholder='Skill name'
                      className='flex-1'
                    />
                    <Input
                      value={skill.level || ''}
                      onChange={(e) => {
                        const updatedSkills = [...editableCv.skills];
                        updatedSkills[index].level = e.target.value;
                        updateField('skills', updatedSkills);
                      }}
                      placeholder='Level (optional)'
                      className='ml-2 w-1/3'
                    />
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => removeSkill(index)}
                      className='text-destructive ml-2 h-10 w-10 p-0'
                    >
                      <Trash className='h-3.5 w-3.5' />
                    </Button>
                  </div>
                ))}
                <EditToolbar onSave={handleSave} onCancel={handleCancelEdit} />
              </div>
            ) : (
              <div className='flex flex-wrap gap-2'>
                {editableCv.skills.map((skill, index) => (
                  <Badge key={index} variant='secondary' className='text-sm'>
                    {skill.name}
                    {skill.level && ` (${skill.level})`}
                  </Badge>
                ))}
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setEditingSection('skills')}
                  className='h-7'
                >
                  <Pencil className='mr-1 h-3.5 w-3.5' />
                  Edit Skills
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <div className='text-muted-foreground text-sm'>
            Click on the edit buttons to make changes to your CV.
          </div>
          <div className='flex space-x-2'>
            <Button
              variant='default'
              onClick={handleSave}
              disabled={isSaving || !editingSection}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CvEditablePreview;
