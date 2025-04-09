import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import CvEditablePreview from './CvEditablePreview';

// Sample CV data for testing
const sampleCvData = {
  name: 'Jane Smith',
  contactInfo: {
    email: 'jane.smith@example.com',
    phone: '555-123-4567',
    linkedin: 'linkedin.com/in/janesmith',
    website: 'janesmith.com',
    location: 'New York, NY',
  },
  summary:
    'Experienced software developer with 5+ years of experience in web development using React and Node.js. Passionate about creating efficient and user-friendly applications.',
  workExperience: [
    {
      company: 'Tech Solutions Inc.',
      position: 'Senior Frontend Developer',
      period: 'Jan 2020 - Present',
      responsibilities: [
        'Developed and maintained React applications for enterprise clients',
        'Implemented responsive designs using Tailwind CSS',
        'Collaborated with UX designers to improve user experience',
      ],
      location: 'New York, NY',
    },
    {
      company: 'Digital Innovations',
      position: 'Web Developer',
      period: 'Mar 2018 - Dec 2019',
      responsibilities: [
        'Built interactive web applications using JavaScript and React',
        'Worked with backend developers to integrate APIs',
        'Participated in code reviews and agile development processes',
      ],
      location: 'Boston, MA',
    },
  ],
  education: [
    {
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      year: '2018',
      fieldOfStudy: 'Computer Science',
      achievements: [],
    },
  ],
  skills: [
    { name: 'React', level: 'Advanced' },
    { name: 'JavaScript', level: 'Advanced' },
    { name: 'TypeScript', level: 'Intermediate' },
    { name: 'Node.js', level: 'Intermediate' },
    { name: 'Tailwind CSS', level: 'Advanced' },
  ],
};

/**
 * CvEditablePreview component allows users to view and edit their CV
 */
const meta: Meta<typeof CvEditablePreview> = {
  title: 'Components/CvEditablePreview',
  component: CvEditablePreview,
  parameters: {
    layout: 'padded',
  },
  args: {
    cvData: sampleCvData,
    onSave: async (updatedCv) => {
      console.log('Saving CV:', updatedCv);
      return Promise.resolve();
    },
    onGeneratePdf: async (cv) => {
      console.log('Generating PDF for CV:', cv);
      return Promise.resolve();
    },
    onGenerateMarkdown: async (cv) => {
      console.log('Generating Markdown for CV:', cv);
      return Promise.resolve();
    },
  },
  argTypes: {
    onSave: { action: 'onSave' },
    onGeneratePdf: { action: 'onGeneratePdf' },
    onGenerateMarkdown: { action: 'onGenerateMarkdown' },
  },
};

export default meta;
type Story = StoryObj<typeof CvEditablePreview>;

/**
 * Default view of the CV with no edits
 */
export const Default: Story = {};

/**
 * Edit the name of the CV
 */
export const EditName: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Find and click the edit button next to the name
    const editNameButton = canvas.getByRole('button', {
      name: /pencil/i,
      hidden: true,
    });
    await userEvent.click(editNameButton);

    // Find the input field and change the name
    const nameInput = canvas.getByRole('textbox');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'John Doe');

    // Save the changes
    const saveButton = canvas.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    // Check if onSave was called
    expect(args.onSave).toHaveBeenCalled();
  },
};

/**
 * Edit the contact information
 */
export const EditContactInfo: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and click the edit button for contact info
    const editContactButton = canvas.getByRole('button', { name: /edit/i });
    await userEvent.click(editContactButton);

    // Find the email input field and change it
    const emailInput = canvas.getByLabelText('Email');
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'john.doe@example.com');

    // Find the phone input field and change it
    const phoneInput = canvas.getByLabelText('Phone');
    await userEvent.clear(phoneInput);
    await userEvent.type(phoneInput, '555-987-6543');

    // Save the changes
    const saveButton = canvas.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);
  },
};

/**
 * Edit the summary
 */
export const EditSummary: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find all edit buttons
    const editButtons = canvas.getAllByRole('button', { name: /edit/i });

    // Click the edit button for the summary (second one)
    await userEvent.click(editButtons[1]);

    // Find the textarea and change the summary
    const summaryTextarea = canvas.getByRole('textbox');
    await userEvent.clear(summaryTextarea);
    await userEvent.type(
      summaryTextarea,
      'Software engineer with expertise in React and Node.js, focused on building scalable web applications.',
    );

    // Save the changes
    const saveButton = canvas.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);
  },
};

/**
 * Add a new skill
 */
export const AddSkill: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and click the add skill button
    const addSkillButton = canvas.getByRole('button', { name: /add skill/i });
    await userEvent.click(addSkillButton);

    // Find the edit skill section
    const editSection = canvas.getByText(/edit skills/i).closest('div');
    const skillInputs = within(editSection as HTMLElement).getAllByRole(
      'textbox',
    );

    // Edit the new skill
    await userEvent.type(skillInputs[0], 'GraphQL');
    await userEvent.type(skillInputs[1], 'Intermediate');

    // Save the changes
    const saveButton = canvas.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);
  },
};

/**
 * Export as PDF and Markdown
 */
export const ExportOptions: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Find and click export as markdown button
    const exportMarkdownButton = canvas.getByRole('button', {
      name: /export as markdown/i,
    });
    await userEvent.click(exportMarkdownButton);

    // Check if the export function was called
    expect(args.onGenerateMarkdown).toHaveBeenCalled();

    // Find and click export as PDF button
    const exportPdfButton = canvas.getByRole('button', {
      name: /export as pdf/i,
    });
    await userEvent.click(exportPdfButton);

    // Check if the export function was called
    expect(args.onGeneratePdf).toHaveBeenCalled();
  },
};

/**
 * Add work experience
 */
export const AddWorkExperience: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find and click add experience button
    const addExperienceButton = canvas.getByRole('button', {
      name: /add experience/i,
    });
    await userEvent.click(addExperienceButton);

    // Fill in the new experience details
    const companyInput = canvas.getByLabelText('Company');
    await userEvent.type(companyInput, 'New Tech Company');

    const positionInput = canvas.getByLabelText('Position');
    await userEvent.type(positionInput, 'Full Stack Developer');

    const periodInput = canvas.getByLabelText('Period');
    await userEvent.type(periodInput, 'Jan 2023 - Present');

    // Find and click the save button
    const saveButton = canvas.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);
  },
};
