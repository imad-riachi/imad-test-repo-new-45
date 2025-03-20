- [x] **Setup Project Structure in the `dashboard` Folder**

  - [x] Create the folder `dashboard/resume-match` (ensure all development is contained in the `dashboard` folder).
  - [x] Inside `dashboard/resume-match`, create all subfolders:
    - [x] `components` (for React components)
      - [ ] Create a subfolder `feature-name` (replace with the appropriate feature name in kebab-case, e.g., `file-upload`)
    - [x] `services` (for API and LLM integration services)
    - [x] `assets` (for images, fonts, etc.)
    - [x] `utils` (for helper functions and utilities)

- [x] **Implement the File Upload Component**

  - [x] Created FileUpload.tsx with validation and styling

- [x] **Implement JSON Conversion Utility**

  - [x] Created json-converter.ts (basic structure, needs PDF/DOCX parsing implementation)

- [x] **Implement LLM-Driven Resume Adaptation Service**

  - [x] Created llm-service.ts (needs actual LLM API integration)

- [ ] **Implement the Modal Display Component**

  - [ ] Create ResumeModal.tsx

- [ ] **Integrate Components in the Main Application**

  - [ ] Create the file `dashboard/resume-match/App.tsx` as the main entry point for the resume-match feature.
    - [ ] Import and render the `FileUpload` component.
    - [ ] Add a "Match" button that, when clicked, performs the following actions:
      - Retrieve the uploaded CV and Job Spec files.
      - Read the content of the CV file and call `convertToJsonResume` from the JSON conversion utility.
      - Call the `adaptResume` function from the LLM service to process and adapt the resume.
      - Convert the adapted resume output (if not already in Markdown) into Markdown format.
      - Open the `ResumeModal` and pass the Markdown content for display.
    - [ ] Ensure that all components interact seamlessly within the app, following a functional programming approach.
    - [ ] Use TypeScript types and maintain a clean, modular structure in line with the Next.js App Router and React Server Components guidelines (use client directives only when necessary).

- [ ] **Style and UI Enhancements**

  - [ ] Add styling using Tailwind CSS:
    - [ ] Create or update a CSS file or use Tailwind classes within the components (e.g., in `ResumeModal.tsx` and `FileUpload.tsx`).
    - [ ] Ensure the modal, buttons, and form inputs are visually appealing, accessible, and adhere to the design guidelines.
    - [ ] Follow best practices for responsive design.

- [ ] **Final Build Step**
  - [ ] From the `dashboard` folder, run the build command using pnpm (e.g., `pnpm run build`) to ensure the entire project compiles successfully.

```

```
