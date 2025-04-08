Below is the revised project plan with tasks written as clear, developer-friendly JIRA stories. Each ticket includes a description and acceptance criteria in tick-box format so that developers can verify when each task is complete.

---

## **Sprint 1: Dashboard Shell & Navigation**

### **Ticket 1.1 – Create Main Dashboard Page**

**Description:**  
Create a new dashboard landing page under `app/(dashboard)/dashboard` that serves as the entry point for the CV rewriting service. This page should integrate with the existing authentication and follow our brand styling using Tailwind CSS and `global.css`.

**Acceptance Criteria:**

- [x] A new page is created at `app/(dashboard)/dashboard/index.tsx` that loads without errors.
- [x] The page displays a basic layout (header, footer, content area) consistent with the company branding.
- [x] Page renders correctly on multiple screen sizes.
- [x] Vitest tests are written to verify that the page renders without error.
- [x] A Storybook story is available to simulate the dashboard page.

---

### **Ticket 1.2 – Implement Dashboard Navigation Menu**

**Description:**  
Develop a responsive navigation menu within the dashboard that links to "Upload CV", "Job Description", and "Review & Download" sections. Ensure that the navigation menu adheres to the styling rules defined in `global.css` and uses Tailwind CSS.

**Acceptance Criteria:**

- [x] Navigation menu component is created in the `components/` folder (e.g., `DashboardNav.tsx`).
- [x] The navigation includes clearly labeled links to "Upload CV", "Job Description", and "Review & Download" sections.
- [x] Active, hover, and default states of menu items conform to the design guidelines.
- [x] Vitest tests are written to verify navigation link functionality.
- [x] A Storybook story is created showcasing the navigation in different states.

---

### **Ticket 1.3 – Establish Consistent Layout & Styling**

**Description:**  
Develop or update layout components to ensure a consistent design across all new pages. This includes implementing common components (like headers, footers, and sidebars) that follow our Tailwind CSS and `global.css` guidelines.

**Acceptance Criteria:**

- [x] Layout components are created/updated to be reusable across the dashboard.
- [x] All new pages (Dashboard, CV Upload, Job Description, CV Review) use these layout components.
- [x] Manual tests confirm the layout renders correctly on various devices.
- [x] Unit tests verify that layout components render without errors.
- [x] Storybook stories document and demonstrate layout usage.

---

## **Sprint 2: CV Upload & Data Extraction**

### **Ticket 2.1 – Develop CV Upload Component**

**Description:**  
Create a file upload component (`CVUpload.tsx`) that allows users to upload their CV files. The component must accept only Word and Google Doc files. It should provide immediate client-side validation and error handling.

**Acceptance Criteria:**

- [x] A React component is created that only accepts valid Word and Google Doc file types.
- [x] Client-side validation prevents unsupported file types from being submitted.
- [x] The component displays clear error messages on invalid file upload attempts.
- [x] Vitest tests cover file type validation and error display.
- [x] A Storybook story is available to demonstrate the upload component with interactive play functions.

---

### **Ticket 2.2 – Build CV Extraction Module**

**Description:**  
Develop a module that extracts all content from the uploaded CV files (Word and Google Doc) and converts it into a JSON format. This module should integrate open-source libraries (ensuring no package downgrades) and handle various edge cases.

**Acceptance Criteria:**

- [x] A dedicated extraction module is created (e.g., `cvExtractor.ts`).
- [x] The module can process both Word and Google Doc file formats.
- [x] The output is a complete JSON representation of the CV's content.
- [x] Unit tests cover multiple file types and edge cases.
- [x] Code reviews confirm that no package downgrades are introduced.

---

### **Ticket 2.3 – Create API Endpoint for CV Processing**

**Description:**  
Develop an API endpoint under `app/api/cv` that accepts the uploaded file, processes it using the extraction module, and stores the resulting JSON in PostgreSQL using Drizzle ORM. Ensure proper error handling and logging as per best practices.

**Acceptance Criteria:**

- [x] API endpoint (e.g., `app/api/cv/upload.ts`) is implemented.
- [x] The endpoint accepts file uploads and passes them to the extraction module.
- [x] The extracted JSON is successfully stored in the database.
- [x] Integration tests validate the complete upload-to-storage flow.
- [x] Appropriate error handling is implemented and tested.

---

### **Ticket 2.4 – Define and Implement Database Schema**

**Description:**  
Define the database schema (or extend existing models) for storing the extracted CV data. Write migration scripts or create models using Drizzle ORM and ensure that insertion and retrieval processes are tested.

**Acceptance Criteria:**

- [x] A new database table or model for CV data is defined.
- [x] Migration scripts (if applicable) are created and documented.
- [x] Drizzle ORM models are implemented correctly.
- [x] Integration tests verify that data can be inserted and retrieved without issues.
- [x] Documentation is updated with the schema design.

---

## **Sprint 3: Job Description Input & LLM Integration**

### **Ticket 3.1 – Develop Job Description Input Component**

**Description:**  
Build a UI component (`JobDescriptionInput.tsx`) that allows users to enter a job description. The component should validate the input and integrate seamlessly with the dashboard layout.

**Acceptance Criteria:**

- [x] A React component is created to capture the job description input.
- [x] Input validation is implemented to ensure appropriate job description length and format.
- [x] Vitest tests verify that the input component functions as expected.
- [x] A Storybook story is created to demonstrate the job description input with interactive play functions.

---

### **Ticket 3.2 – Implement LLM Service Module for Claude Integration**

**Description:**  
Develop a service module that integrates with the latest version of Claude. This module should send the CV JSON along with the job description as a prompt. It must follow best practices for prompt engineering and include robust error handling.

**Acceptance Criteria:**

- [x] A service module (e.g., `llmService.ts`) is created to communicate with Claude.
- [x] The module builds a prompt that includes the CV JSON and job description.
- [x] Error handling is implemented according to current best practices.
- [x] Unit tests using mocks simulate Claude API responses.
- [x] Code reviews ensure no package version conflicts are introduced.

---

### **Ticket 3.3 – Create API Endpoint for CV Rewriting**

**Description:**  
Create an API endpoint under `app/api/llm` that accepts the job description and corresponding CV JSON, forwards the request to the Claude API via the service module, and returns the rewritten CV to the client.

**Acceptance Criteria:**

- [x] An API endpoint (e.g., `app/api/llm/rewrite.ts`) is implemented.
- [x] The endpoint correctly forwards requests to the Claude API using the service module.
- [x] The rewritten CV is returned as a response.
- [x] Integration tests validate the full flow from job description input to rewritten CV retrieval.
- [x] Proper error handling is confirmed through testing.

---

### **Ticket 3.4 – Integrate Job Description Flow with LLM API**

**Description:**  
Connect the job description UI component with the LLM API endpoint. Ensure that when a user submits a job description, a loading state is shown, and the rewritten CV is displayed upon success.

**Acceptance Criteria:**

- [x] The job description input triggers an API call to the new endpoint.
- [x] A loading spinner or similar indicator is displayed during the API call.
- [x] The rewritten CV is rendered in the UI upon a successful API response.
- [x] End-to-end tests simulate the complete user flow and verify correct state transitions.
- [x] Error messages are displayed appropriately if the API call fails.

---

## **Sprint 4: Final Display & Download Functionality**

### **Ticket 4.1 – Create Rewritten CV Display Component**

**Description:**  
Develop a UI component (`CVDisplay.tsx`) that displays the rewritten CV in a clear and branded format. The component should be easy to read and align with the company's styling guidelines.

**Acceptance Criteria:**

- [x] A display component is created that renders the rewritten CV.
- [x] The component's design follows the styling defined in `global.css` and Tailwind CSS.
- [x] Vitest tests ensure the component renders correctly with various CV data.
- [x] A Storybook story is created to showcase the component with sample data.

---

### **Ticket 4.2 – Implement Markdown Conversion & Download**

**Description:**  
Develop a function that converts the rewritten CV into Markdown format and integrate a download button on the dashboard. This should allow users to download their CV in Markdown format.

**Acceptance Criteria:**

- [x] A function (e.g., `convertToMarkdown()`) is created to convert CV data to Markdown.
- [x] Unit tests verify the conversion logic is correct.
- [x] A download button is added to the UI that triggers the Markdown conversion and download.
- [x] Manual testing confirms the Markdown file downloads correctly.

---

### **Ticket 4.3 – Implement PDF Generation & Download**

**Description:**  
Integrate an open-source library (e.g., pdf-lib or jsPDF) to generate a PDF version of the rewritten CV. Create a download button in the dashboard that allows users to download the PDF version.

**Acceptance Criteria:**

- [x] A PDF generation function (e.g., `generatePDF()`) is implemented.
- [x] The PDF output reflects the styling of the CV display component.
- [x] Vitest tests are created for PDF generation logic.
- [x] A download button for the PDF is added to the dashboard.
- [x] Manual testing confirms the PDF downloads and opens correctly.

---

### **Ticket 4.4 – Final End-to-End Integration & Testing**

**Description:**  
Combine all components and endpoints to complete the full user journey: upload CV → extract JSON → enter job description → generate rewritten CV → review → download in Markdown or PDF. Comprehensive end-to-end testing should be performed to ensure a smooth workflow.

**Acceptance Criteria:**

- [ ] The entire flow is manually tested from dashboard to download.
- [ ] End-to-end tests (using available testing frameworks) cover the complete journey.
- [ ] All error states (e.g., failed file upload, LLM call failures) are handled gracefully.
- [ ] Documentation is updated with the final user journey and troubleshooting tips.

---

### **Ticket 4.5 – Final Documentation & Storybook Updates**

**Description:**  
Update the project documentation and Storybook entries to reflect the final state of the CV rewriting service. Include usage guides, component documentation, and developer notes.

**Acceptance Criteria:**

- [ ] All new components have updated Storybook stories with play functionality.
- [ ] Project documentation includes detailed instructions for the new features and APIs.
- [ ] Documentation clearly outlines how to run tests, generate builds, and troubleshoot common issues.
- [ ] Team review confirms that documentation is complete and accurate.

---

This plan provides clear, actionable tasks for developers with step-by-step instructions and acceptance criteria that can be checked off upon completion. Each ticket is designed to be small enough to be completed within a sprint, and together they deliver a fully functional, end-to-end CV rewriting service.
