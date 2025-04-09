## Sprint 1: CV Upload & File Handling

### **Sprint 1 Goal**

Establish the file upload functionality so that users can upload a CV in supported formats (Word, PDF, Google Docs). The uploaded file is accepted, stored (with metadata in PostgreSQL via Drizzle ORM), and made available for further processing.

---

### **Task 1.1: Create CV Upload UI Component**

- **Title:** Implement CV Upload Component
- **Description:**  
  Develop a React component located under `app/(dashboard)/dashboard` that allows users to select and upload a CV. The component must:
  - Accept files in Word, PDF, and (if applicable) Google Docs formats.
  - Follow the styling provided in `global.css`, supporting both dark and light modes via Tailwind CSS.
  - Provide visual feedback on file selection.
- **Acceptance Criteria:**
  - [x] A file input is rendered and accepts only the specified file types.
  - [x] Visual feedback is provided upon file selection.
  - [x] The component is responsive across screen sizes.
  - [x] A fully functional Storybook story exists for the component.
  - [x] Unit tests (using vitest) achieve at least 80% coverage.
  - [x] Code includes inline documentation and comments.

---

### **Task 1.2: Implement CV Upload API Endpoint**

- **Title:** Build API Endpoint for CV Upload
- **Description:**  
  Create a POST API endpoint at `app/api/cv/upload` to:
  - Receive the file upload from the client.
  - Validate the file type and size.
  - Store the file (on disk or temporary storage).
  - Save file metadata (name, type, upload timestamp) in PostgreSQL using Drizzle ORM.
- **Acceptance Criteria:**
  - [x] Endpoint available at `POST /api/cv/upload` that accepts file uploads.
  - [x] Endpoint validates file type and size.
  - [x] File metadata is stored in the PostgreSQL database.
  - [x] Unit tests cover the API endpoint with mock file uploads.
  - [x] Inline API documentation is provided.
  - [x] Mock data is cleaned up post-tests.

---

### **Task 1.3: Integration & CI Setup for Upload Feature**

- **Title:** Integrate CV Upload Component with API & CI Configuration
- **Description:**  
  Integrate the frontend CV upload component with the backend API:
  - Ensure the component calls the upload endpoint and properly handles responses.
  - Update Continuous Integration (CI) workflows to run newly added tests and Storybook builds on every commit.
- **Acceptance Criteria:**
  - [x] The upload component successfully calls the backend API.
  - [x] Both success and error states are correctly handled and displayed.
  - [x] CI pipelines include vitest tests and Storybook builds.
  - [x] Documentation reflects the integration process.

---

### **Sprint 1 QA & Manual Testing Plan**

1. **Component Testing:**
   - Verify that the file input accepts only allowed file types.
   - Check responsiveness on various devices.
   - Confirm dark and light mode support.
2. **API Testing:**
   - Confirm file uploads are processed correctly.
   - Validate metadata storage in the database.
   - Test error scenarios (unsupported file types, oversized files).
3. **Integration Testing:**
   - Upload a valid file and verify UI feedback.
   - Simulate network failures and file corruption.
4. **Cleanup:**
   - Ensure all temporary/mock data is removed after testing.

---

## Sprint 2: Automated Data Extraction & JSON Conversion

### **Sprint 2 Goal**

Implement functionality to extract content from the uploaded CV file and convert the content into a structured JSON format.

---

### **Task 2.1: Backend Service for Data Extraction**

- **Title:** Develop Backend Service for CV Data Extraction
- **Description:**  
  Create a backend service (utility function/module) that:
  - Accepts the uploaded file.
  - Processes the file based on its type (Word, PDF, Google Docs).
  - Extracts relevant text content.
  - Converts the extracted text into a structured JSON format (e.g., keys for name, contact info, work experience, education).
- **Acceptance Criteria:**
  - [ ] Service/module is created for text extraction from supported file types.
  - [ ] Extracted data is properly formatted as JSON.
  - [ ] Unit tests cover extraction logic using sample files of each type.
  - [ ] Inline documentation is provided.

---

### **Task 2.2: API Endpoint Integration for Data Extraction**

- **Title:** Integrate Data Extraction Service with File Upload Workflow
- **Description:**  
  Enhance the file upload API endpoint (or create a subsequent processing endpoint) to:
  - Call the data extraction service post-upload.
  - Store or return the extracted JSON data representing the CV.
- **Acceptance Criteria:**
  - [ ] API endpoint calls the data extraction service post file upload.
  - [ ] Correct JSON structure is stored/returned.
  - [ ] Integration tests verify correct JSON output for each supported file type.
  - [ ] API documentation is updated with the JSON schema.
  - [ ] All temporary/mock data is cleaned up.

---

### **Task 2.3: Frontend Handling of Extracted Data**

- **Title:** Display Extracted CV JSON Data on the Dashboard
- **Description:**  
  Update the dashboard component so that, after a successful upload and extraction:
  - A preview of the JSON data is displayed.
  - The preview enables users (or QA) to verify that the extraction works correctly.
- **Acceptance Criteria:**
  - [ ] Dashboard receives and renders the extracted JSON data.
  - [ ] UI displays a clear summary of the extracted CV content.
  - [ ] Updated Storybook story simulates various JSON responses.
  - [ ] Unit tests validate component behavior with different JSON inputs.

---

### **Sprint 2 QA & Manual Testing Plan**

1. **Service Testing:**
   - Manually test various input file types and validate JSON outputs.
2. **API Testing:**
   - Ensure endpoint returns the expected JSON schema.
   - Test edge cases such as files with missing sections or unusual formatting.
3. **UI Testing:**
   - Confirm that the dashboard displays JSON data preview correctly.
4. **Cleanup:**
   - Remove any temporary/mock data after testing.

---

## Sprint 3: Job Description Input & CV Rewriting via LLM

### **Sprint 3 Goal**

Introduce the job description input functionality and integrate with an LLM (Language Model) to rewrite the CV based on the job specification. In this sprint, the LLM integration may be simulated or integrated with a third-party API.

---

### **Task 3.1: Implement Job Description Input Component**

- **Title:** Develop Job Description Form Component
- **Description:**  
  Create a new React component within the dashboard that:
  - Allows users to enter or paste a job description.
  - Supports validation (non-empty input) with error messages.
  - Adheres to design guidelines (Tailwind CSS, dark/light mode).
- **Acceptance Criteria:**
  - [ ] A text area form for job description input is implemented.
  - [ ] Form includes validation with user feedback.
  - [ ] Storybook story is provided for the component.
  - [ ] Unit tests cover validation and UI behavior.

---

### **Task 3.2: API Endpoint for CV Rewriting Request**

- **Title:** Build API Endpoint to Trigger CV Rewriting
- **Description:**  
  Develop a new API endpoint at `app/api/cv/rewrite` that:
  - Accepts a POST request containing the extracted CV JSON and the job description.
  - Prepares a payload for the LLM service.
  - Either simulates the LLM response or integrates with a third-party service to perform CV rewriting.
- **Acceptance Criteria:**
  - [ ] Endpoint available at `POST /api/cv/rewrite` accepting CV JSON and job description.
  - [ ] Endpoint calls an LLM service (or mock service) and returns the rewritten CV.
  - [ ] Unit tests cover typical use cases and error handling.
  - [ ] Endpoint is fully documented (request/response formats).
  - [ ] Temporary/mock data is cleaned up.

---

### **Task 3.3: Frontend Integration for CV Rewriting Request**

- **Title:** Integrate Job Description Form with CV Rewriting API
- **Description:**  
  Enhance the frontend so that:
  - Upon submission of the job description form, an API call is made to the rewriting endpoint.
  - The response (rewritten CV) is displayed in a preview panel on the dashboard.
  - Proper error handling and loading states are implemented.
- **Acceptance Criteria:**
  - [ ] Job description form triggers the API call to `/api/cv/rewrite` on submit.
  - [ ] The rewritten CV is rendered in a preview section.
  - [ ] Both loading and error states are well-handled.
  - [ ] Unit tests verify proper API integration.
  - [ ] Storybook stories simulate API responses.

---

### **Sprint 3 QA & Manual Testing Plan**

1. **Component Testing:**
   - Confirm job description input accepts and validates text correctly.
2. **API Testing:**
   - Verify the rewriting endpoint with various payloads (valid, invalid, error cases).
3. **Integration Testing:**
   - Run an end-to-end test: upload → extract JSON → input job description → receive rewritten CV.
4. **Edge Case Testing:**
   - Test for slow network responses and unexpected API replies.
5. **Cleanup:**
   - Ensure removal of all temporary/mock data post-testing.

---

## Sprint 4: View, Edit, and Download Rewritten CV

### **Sprint 4 Goal**

Develop the final user interactions including:

- Displaying the rewritten CV in an editable format.
- Allowing users to download the final CV in Markdown and PDF formats.
- Completing the end-to-end workflow and cleanup.

---

### **Task 4.1: Implement Rewritten CV Display & Edit Component**

- **Title:** Create Editable CV Preview Component
- **Description:**  
  Build a React component that:
  - Displays the rewritten CV.
  - Allows inline editing for review or adjustments.
  - Holds changes in the component state until saved.
  - Adheres to the company's branding and Tailwind CSS guidelines (responsive, dark/light mode).
- **Acceptance Criteria:**
  - [ ] A component is created to display the rewritten CV.
  - [ ] Inline editing functionality is available.
  - [ ] Changes persist correctly in component state until final save.
  - [ ] A Storybook story demonstrates the component states.
  - [ ] Unit tests cover both editing and save operations.

---

### **Task 4.2: Implement Download Functionality**

- **Title:** Build Download Options for Final CV
- **Description:**  
  Develop functionality within the CV preview/edit component to:
  - Allow users to download the final CV in **Markdown** format.
  - Allow users to download the final CV in **PDF** format.
  - Utilize popular libraries (e.g., Markdown converter, PDF generation) to streamline development.
- **Acceptance Criteria:**
  - [ ] Markdown download option is implemented and functional.
  - [ ] PDF download option is implemented and functional.
  - [ ] Files maintain the styling as shown in the dashboard.
  - [ ] Unit tests validate file generation and download processes.
  - [ ] Storybook is updated with download component scenarios.

---

### **Task 4.3: Final Integration and Cleanup**

- **Title:** End-to-End Integration & Cleanup for Rewritten CV Flow
- **Description:**  
  Integrate all components of the workflow:
  - Ensure the complete flow works from CV upload → JSON extraction → job description input → CV rewriting → edit → download.
  - Remove all mock data and temporary files.
  - Update CI pipelines with full integration tests.
- **Acceptance Criteria:**
  - [ ] Full end-to-end workflow is fully integrated.
  - [ ] No temporary mock data persists post-testing.
  - [ ] CI/CD pipelines pass all unit, integration, and Storybook tests.
  - [ ] Documentation is updated detailing the end-to-end process, including any manual testing steps.

---

### **Sprint 4 QA & Manual Testing Plan**

1. **End-to-End Testing:**
   - Validate the complete workflow from CV upload to final download.
   - Confirm inline editing functions as expected.
2. **Download Testing:**
   - Verify that the Markdown file opens correctly in editors.
   - Verify that the PDF file is generated properly and renders across platforms.
3. **Edge Case Testing:**
   - Test cancelling edits before download.
   - Validate error handling during file generation failures.
4. **Final Cleanup:**
   - Ensure removal of any temporary files or mock data.

---

# Documentation & Continuous Integration

- **Inline Code Documentation:**
  - Each function and module must include clear inline comments.
- **API Documentation:**
  - New API endpoints should be documented with sample request and response formats.
- **Storybook:**
  - Each new React component must have a dedicated Storybook story illustrating various states and interactions.
- **CI Integration:**
  - Update CI configuration to include vitest test runs and Storybook builds on every push/PR.
  - Ensure comprehensive regression testing with each integration.
