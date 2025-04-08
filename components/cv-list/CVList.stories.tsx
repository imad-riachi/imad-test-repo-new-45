import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import CVList, { CVFile, CVListProps } from './CVList';
import { subDays } from 'date-fns';

const meta: Meta<typeof CVList> = {
  title: 'Components/CVList',
  component: CVList,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof CVList>;

// Sample CV files for the stories
const sampleFiles: CVFile[] = [
  {
    id: 1,
    fileId: 'file-1',
    filename: 'resume.docx',
    uploadedAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: 2,
    fileId: 'file-2',
    filename: 'cv-2023.doc',
    uploadedAt: subDays(new Date(), 7).toISOString(),
  },
  {
    id: 3,
    fileId: 'file-3',
    filename: 'professional-resume.docx',
    uploadedAt: subDays(new Date(), 30).toISOString(),
  },
];

export const Empty: Story = {
  args: {
    files: [],
    onDelete: fn(),
    onSelect: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The component should return null for empty files, so we verify the canvas is empty
    expect(canvas.queryByText(/Your Uploaded CVs/)).not.toBeInTheDocument();
  },
};

export const WithFiles: Story = {
  args: {
    files: sampleFiles,
    onDelete: fn(),
    onSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Verify all files are rendered
    for (const file of sampleFiles) {
      const fileElement = canvas.getByText(file.filename);
      expect(fileElement).toBeInTheDocument();
    }
  },
};

export const WithSelectedFile: Story = {
  args: {
    files: sampleFiles,
    onDelete: fn(),
    onSelect: fn(),
    selectedFileId: 'file-2',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Find the selected file element
    const selectedFileName = sampleFiles.find(
      (f) => f.fileId === 'file-2',
    )?.filename;
    if (selectedFileName) {
      const fileElement = canvas.getByText(selectedFileName);
      // Verify it's in a parent with selected styling (blue background)
      const parentElement = fileElement.closest('[class*="border-blue-500"]');
      expect(parentElement).not.toBeNull();
    }
  },
};

export const SelectingFile: Story = {
  args: {
    files: sampleFiles,
    onDelete: fn(),
    onSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on the first file
    const fileElement = canvas.getByText(sampleFiles[0].filename);
    const fileRow = fileElement.closest('[class*="flex items-center"]');

    if (fileRow) {
      await userEvent.click(fileRow);

      // Verify onSelect was called with the correct fileId
      expect(args.onSelect).toHaveBeenCalledWith(sampleFiles[0].fileId);
    }
  },
};

export const DeletingFile: Story = {
  args: {
    files: sampleFiles,
    onDelete: fn(),
    onSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Find all delete buttons (they have the trash icon)
    const deleteButtons = canvas.getAllByRole('button');

    // Click the first delete button
    await userEvent.click(deleteButtons[0]);

    // Verify onDelete was called with the correct id
    expect(args.onDelete).toHaveBeenCalledWith(sampleFiles[0].id);
  },
};
