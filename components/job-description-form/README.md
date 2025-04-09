# Job Description Form Component

This component allows users to enter job descriptions to optimize their CV for specific job applications.

## Features

- Input form for job descriptions
- Word count display with validation feedback
- Form validation (min. 10 words required)
- API integration with error handling
- Loading state management

## Testing

The component is tested using Vitest and Testing Library. Due to issues with path aliases in the testing environment, we've created two versions:

1. **Original Component** (`JobDescriptionForm.tsx`):
   - Uses path aliases (@/components/ui/...)
   - Depends on shadcn UI components
2. **Test Component** (`JobDescriptionFormForTest.tsx`):
   - Simplified version for testing
   - No path aliases, all dependencies are mocked inline
   - Same functionality as the original

### Running Tests

To run the component tests:

```bash
# Run the standalone tests
pnpm vitest run --config vitest.standalone.config.ts
```

### Test Coverage

The tests cover:

- Rendering of form elements
- Validation for empty submissions
- Validation for short job descriptions (< 10 words)
- Word count display
- Successful form submission
- API error handling

## Integration

To use this component in your app:

```tsx
import JobDescriptionForm from '@/components/job-description-form';

// Sample CV data
const cvData = {
  name: 'User Name',
  contactInfo: { email: 'user@example.com' },
  workExperience: [],
  education: [],
  skills: [],
};

// Render component
<JobDescriptionForm
  cvData={cvData}
  onRewriteComplete={(response) => {
    // Handle successful rewrite
    console.log('CV rewritten:', response);
  }}
  onRewriteError={(error) => {
    // Handle error
    console.error('Error:', error);
  }}
/>;
```
