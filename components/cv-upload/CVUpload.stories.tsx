import type { Meta, StoryObj } from '@storybook/react';
import { fn, expect } from '@storybook/test';
import { userEvent, within } from '@storybook/test';
import CVUpload from './index';

const meta: Meta<typeof CVUpload> = {
  title: 'Components/CVUpload',
  component: CVUpload,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onFileAccepted: { action: 'File accepted' },
  },
};

export default meta;
type Story = StoryObj<typeof CVUpload>;

export const Default: Story = {
  args: {
    onFileAccepted: fn(),
  },
};

export const FileSelection: Story = {
  args: {
    onFileAccepted: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click the select file button
    const selectButton = canvas.getByRole('button', { name: /select file/i });
    await userEvent.click(selectButton);
  },
};

export const DragAndDrop: Story = {
  args: {
    onFileAccepted: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dropZone = canvas.getByText(
      /drag and drop your cv file/i,
    ).parentElement;

    if (!dropZone) return;

    // Simulate drag enter
    await userEvent.hover(dropZone);

    // Simulate drag over
    const dragOverEvent = new DragEvent('dragover', {
      bubbles: true,
      cancelable: true,
    });
    dropZone.dispatchEvent(dragOverEvent);

    // Simulate drop
    const dropEvent = new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
    });

    // Create a mock DataTransfer object
    const file = new File([''], 'test.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    const fileList = {
      length: 1,
      item: (index: number) => file,
      [Symbol.iterator]: function* () {
        yield file;
      },
    } as FileList;

    const dataTransfer = {
      files: fileList,
      dropEffect: 'none',
      effectAllowed: 'none',
      items: [],
      types: [],
      clearData: () => {},
      getData: () => '',
      setData: () => {},
      setDragImage: () => {},
    } as unknown as DataTransfer;

    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: dataTransfer,
    });

    dropZone.dispatchEvent(dropEvent);
  },
};

export const FileRemoval: Story = {
  args: {
    onFileAccepted: fn(),
    initialFile: new File([''], 'test.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The remove button should be immediately available since we provided an initial file
    const removeButton = canvas.getByRole('button', { name: /remove file/i });

    // Click the remove button
    await userEvent.click(removeButton);

    // Verify the file was removed by checking for the upload UI
    await canvas.findByText(/drag and drop your cv file/i);
  },
};

export const FileTypeError: Story = {
  args: {
    onFileAccepted: fn(),
    initialFile: new File([''], 'test.jpg', {
      type: 'image/jpeg',
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the error message within the paragraph element
    const errorMessage = await canvas.findByText(/Invalid file type/i, {
      selector: 'p.text-sm.font-medium',
    });
  },
};

export const FileTypeErrorOnReplace: Story = {
  args: {
    onFileAccepted: fn(),
    initialFile: new File([''], 'test.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // First verify we have the valid file
    const fileName = canvas.getByText('test.docx');
    expect(fileName).toBeInTheDocument();

    // Click the remove button to clear the current file
    const removeButton = canvas.getByRole('button', { name: /remove file/i });
    await userEvent.click(removeButton);

    // Create a mock file with invalid type
    const invalidFile = new File([''], 'test.jpg', {
      type: 'image/jpeg',
    });

    // Find the input element using a broader, more direct query
    // This searches in the entire canvas element
    const fileInput = canvasElement.querySelector('input[type="file"]');
    if (!fileInput) {
      console.error('DOM structure:', canvasElement.innerHTML);
      throw new Error('Could not find file input');
    }

    // Create a proper mock FileList
    const fileList = {
      0: invalidFile,
      length: 1,
      item: (index: number) => (index === 0 ? invalidFile : null),
    } as unknown as FileList;

    // Use Object.defineProperty to set files on the input element directly
    Object.defineProperty(fileInput, 'files', {
      configurable: true,
      value: fileList,
    });

    // Create a proper change event that React will recognize
    const changeEvent = new Event('change', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });

    // Dispatch the event with React's synthetic event system in mind
    fileInput.dispatchEvent(changeEvent);

    // Verify error message appears
    const errorMessage = await canvas.findByText(/Invalid file type/i, {
      selector: 'p.text-sm.font-medium',
    });
    expect(errorMessage).toBeInTheDocument();
  },
};
