import { describe, it, expect } from 'vitest';
import { rewriteCV } from './rewriter';
import { CvData } from '../cv-parser/cv-parser';

describe('CV Rewriter', () => {
  // Sample CV data for testing
  const sampleCvData: CvData = {
    name: 'Test User',
    contactInfo: {
      email: 'test@example.com',
      phone: '555-1234',
    },
    summary:
      'Experienced software developer with skills in JavaScript and React.',
    workExperience: [
      {
        company: 'Tech Company',
        position: 'Frontend Developer',
        period: '2020-Present',
        responsibilities: [
          'Developed web applications using React',
          'Worked with a team of 5 developers',
          'Improved website performance',
        ],
      },
    ],
    education: [
      {
        institution: 'University',
        degree: 'Computer Science',
        year: '2019',
      },
    ],
    skills: [{ name: 'JavaScript' }, { name: 'React' }, { name: 'HTML/CSS' }],
  };

  // Sample job description
  const jobDescription = `
    Frontend Developer
    
    We are looking for a skilled Frontend Developer with expertise in React and TypeScript.
    The candidate should have experience with modern JavaScript frameworks and responsive design.
    Knowledge of UI/UX principles is a plus.
  `;

  it('returns a valid RewriteResponse object', async () => {
    const result = await rewriteCV(sampleCvData, jobDescription);

    // Check structure of response
    expect(result).toHaveProperty('originalCv');
    expect(result).toHaveProperty('rewrittenCv');
    expect(result).toHaveProperty('jobDescription');
    expect(result).toHaveProperty('matches');
    expect(result).toHaveProperty('matches.skills');
    expect(result).toHaveProperty('matches.experience');
    expect(result).toHaveProperty('improvements');

    // Check that originalCv is preserved
    expect(result.originalCv).toBe(sampleCvData);

    // Check that jobDescription is preserved
    expect(result.jobDescription).toBe(jobDescription);
  });

  it('enhances the summary with relevant keywords', async () => {
    const result = await rewriteCV(sampleCvData, jobDescription);

    // The rewritten CV should have a summary that includes some job-specific terms
    expect(result.rewrittenCv.summary).toBeTruthy();
    expect(result.rewrittenCv.summary).not.toBe(sampleCvData.summary);

    // In our mock implementation, it should add keywords from the job description
    const jobKeywords = ['typescript', 'react'];

    // At least one job keyword should appear in the enhanced summary
    const summaryLowercase = result.rewrittenCv.summary!.toLowerCase();
    const hasAtLeastOneKeyword = jobKeywords.some((keyword) =>
      summaryLowercase.includes(keyword),
    );

    expect(hasAtLeastOneKeyword).toBe(true);
  });

  it('identifies matching skills correctly', async () => {
    const result = await rewriteCV(sampleCvData, jobDescription);

    // In our sample data, 'React' is both in the CV and job description
    expect(result.matches.skills).toContain('React');

    // JavaScript is also likely to be extracted
    expect(result.matches.skills).toContain('JavaScript');
  });

  it('enhances work responsibilities that match job requirements', async () => {
    const result = await rewriteCV(sampleCvData, jobDescription);

    // Compare original and rewritten responsibilities
    const originalResp =
      sampleCvData.workExperience[0].responsibilities.join(' ');
    const rewrittenResp =
      result.rewrittenCv.workExperience[0].responsibilities.join(' ');

    // Rewritten responsibilities should be different from original
    expect(rewrittenResp).not.toBe(originalResp);

    // The word 'React' should be emphasized in responsibilities
    expect(rewrittenResp.toLowerCase()).toContain('react');
  });

  it('suggests relevant improvements', async () => {
    const result = await rewriteCV(sampleCvData, jobDescription);

    // Should have at least one suggestion
    expect(result.improvements.length).toBeGreaterThan(0);

    // Each improvement should be a non-empty string
    result.improvements.forEach((improvement) => {
      expect(improvement).toBeTruthy();
      expect(typeof improvement).toBe('string');
    });
  });

  it('handles CVs without a summary by generating one', async () => {
    // Create a CV without a summary
    const cvWithoutSummary = { ...sampleCvData, summary: undefined };

    const result = await rewriteCV(cvWithoutSummary, jobDescription);

    // Should generate a new summary
    expect(result.rewrittenCv.summary).toBeTruthy();
    expect(typeof result.rewrittenCv.summary).toBe('string');
  });

  it('enhances skills that match job keywords', async () => {
    const result = await rewriteCV(sampleCvData, jobDescription);

    // Find React skill in original and rewritten CV
    const originalReactSkill = sampleCvData.skills.find(
      (s) => s.name === 'React',
    );
    const rewrittenReactSkill = result.rewrittenCv.skills.find(
      (s) => s.name === 'React',
    );

    // Original might not have level but rewritten should have
    if (originalReactSkill && !originalReactSkill.level) {
      expect(rewrittenReactSkill?.level).toBeTruthy();
    }
  });
});
