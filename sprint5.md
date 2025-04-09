### Sprint 5 Plan: Job Description Management

**Project Summary:**  
As part of Sprint 5, we aim to enhance the job description functionality, allowing users to store, edit, delete, and select job descriptions for generating updated CVs.

---

### User Stories

#### 1. **Store Job Descriptions**

- **As a user**, I should be able to store job descriptions I provide, so that I can reuse them later for multiple CV rewrites.
- **Acceptance Criteria**:
  - User can input and store job descriptions in the system.
  - Job descriptions are saved in the database with a unique ID and timestamp.
  - A confirmation message is displayed once the job description is successfully saved.
  - Error handling for invalid job descriptions (e.g., empty input).
  - Mocked data is used for testing until the API is integrated.
  - Unit tests for saving and error handling are added.
  - Storybook entry for the input field with validation.

#### 2. **Edit Stored Job Descriptions**

- **As a user**, I should be able to edit previously saved job descriptions, so that I can update or modify them as needed.
- **Acceptance Criteria**:
  - User can select a job description from a list of stored descriptions.
  - User can modify and save changes to the selected job description.
  - A confirmation message is displayed once the job description is successfully updated.
  - A cancel option is available to discard changes.
  - The edit form is pre-populated with the selected job description.
  - Unit tests for editing functionality and edge cases are added.
  - Storybook entry for the edit form component.

#### 3. **Delete Stored Job Descriptions**

- **As a user**, I should be able to delete job descriptions that I no longer need, so that I can manage my saved descriptions effectively.
- **Acceptance Criteria**:
  - User can delete a job description from the list of saved descriptions.
  - A confirmation dialog is shown before deletion to prevent accidental removal.
  - A success message is displayed once the job description is deleted.
  - Deletion updates the database and UI immediately.
  - Unit tests for delete functionality and confirmation flow are added.
  - Storybook entry for the delete action confirmation dialog.

#### 4. **Select Job Description for CV Rewrite**

- **As a user**, I should be able to select which stored job description to use for my CV rewrite, so that I can ensure the CV matches the job I’m applying for.
- **Acceptance Criteria**:
  - User can view a list of stored job descriptions.
  - User can select one job description from the list to apply to the CV rewrite.
  - The selected job description is highlighted in the UI.
  - User can confirm the selection and proceed to rewrite the CV using the selected description.
  - A success message is displayed once the selection is made.
  - Unit tests for selecting a job description and validation are added.
  - Storybook entry for the job description selection dropdown.

---

### Sprint Breakdown

#### **1. Implement Job Description Storage**

- **Description**: Create a UI component to allow users to input and save job descriptions. Store the job descriptions in the PostgreSQL database using Drizzle ORM.
- **Acceptance Criteria**:
  - Create input component for job description.
  - Implement API endpoint `POST /api/job-description` to save data.
  - Store job descriptions in the database with unique IDs and timestamps.
  - Include validation to ensure job descriptions are not empty.
  - Unit tests for input component and API integration.

#### **2. Implement Edit Job Description Functionality**

- **Description**: Build the functionality to edit a previously stored job description. The user should be able to modify the description and save changes.
- **Acceptance Criteria**:
  - Create an "Edit" button next to each stored job description.
  - Build UI to edit job descriptions with pre-filled values.
  - Implement API endpoint `PUT /api/job-description/{id}` for updating job descriptions.
  - Ensure successful update is reflected in the database.
  - Unit tests for editing functionality and API endpoint.

#### **3. Implement Delete Job Description Functionality**

- **Description**: Implement the ability for users to delete stored job descriptions. Ensure deletion is confirmed before being executed.
- **Acceptance Criteria**:
  - Create a "Delete" button next to each stored job description.
  - Show a confirmation dialog before deletion.
  - Implement API endpoint `DELETE /api/job-description/{id}` for deleting job descriptions.
  - Update the UI after deletion.
  - Unit tests for delete functionality and confirmation flow.

#### **4. Implement Job Description Selection for Rewrite**

- **Description**: Build a UI component for users to select which job description to use for their CV rewrite.
- **Acceptance Criteria**:
  - Create a dropdown or list view for stored job descriptions.
  - Allow users to select a job description to apply for the CV rewrite.
  - Implement API endpoint `POST /api/job-description/select/{id}` to select the job description.
  - Display confirmation after successful selection.
  - Unit tests for selection functionality and API validation.

---

### Task Sequencing

1. **Job Description Storage (Task 1)** should be implemented first, as it is the foundation for both editing and deleting functionality.
2. **Edit Job Description (Task 2)** and **Delete Job Description (Task 3)** can be implemented in parallel after storage.
3. **Job Description Selection for Rewrite (Task 4)** should be done last, as it depends on the ability to store, edit, and delete job descriptions.

---

### QA Testing Plan

#### **Testing Requirements**

- **Test Case 1**: Verify that the user can store a job description and that it appears in the list of saved job descriptions.
- **Test Case 2**: Verify that the user can edit an existing job description and save the changes.
- **Test Case 3**: Verify that the user can delete a job description and that it is removed from the UI and the database.
- **Test Case 4**: Verify that the user can select a job description for CV rewrite and that the selected description is used in the rewrite process.
- **Test Case 5**: Verify that the UI displays appropriate error messages for invalid inputs (e.g., empty job description).
- **Edge Case 1**: Verify that the job description input field prevents saving empty or invalid input.
- **Edge Case 2**: Verify that deleting a job description requires confirmation and that the deletion is reflected immediately.

---

### Documentation and Code Quality

- **Code Documentation**: Ensure each new component, function, and API endpoint is well-documented with clear inline comments.
- **API Documentation**: Provide endpoint structure and request/response format for new API endpoints (Job Description storage, edit, delete, and selection).
- **Storybook Entries**: All new UI components (job description input, edit form, delete dialog, and selection dropdown) must have fully functional and accessible Storybook stories.

---

### Sprint Review Checklist

- A demo of the job description storage, editing, deletion, and selection functionality.
- Manual test cases for QA, covering the above scenarios.
- Cleaned-up mock data for testing purposes, ensuring only production-ready data remains.
- Updated Storybook entries and component tests.

Sure! Below is the detailed breakdown of the user stories and tasks for Sprint 5, formatted in the JIRA-style acceptance criteria, as you requested.

---

### **Ticket 1.1 – Create Job Description Storage Model**

**Description:**  
Create a model for storing user-provided job descriptions in the database. This includes designing the necessary database schema, writing migrations, and integrating it with the Drizzle ORM to enable the saving, editing, and deleting of job descriptions.

**Acceptance Criteria:**

- [ ] A new `JobDescription` table is created in the PostgreSQL database via a Drizzle migration.
- [ ] The table includes fields for storing job description text, the associated user ID, and timestamp information.
- [ ] A Drizzle model is created for interacting with the `JobDescription` table.
- [ ] Migrations are tested to ensure the table is correctly created.
- [ ] Ensure the table is cleaned of any mock data used during testing.

---

### **Ticket 1.2 – Implement API Endpoints for Job Description Management**

**Description:**  
Implement API endpoints to create, update, retrieve, and delete job descriptions. These endpoints will interact with the `JobDescription` model and should be accessible only to authenticated users.

**Acceptance Criteria:**

- [ ] A new POST `/api/job-descriptions` endpoint is created to allow users to save new job descriptions.
- [ ] A new PUT `/api/job-descriptions/:id` endpoint is created to allow users to update existing job descriptions.
- [ ] A new GET `/api/job-descriptions` endpoint is created to allow users to fetch their list of job descriptions.
- [ ] A new DELETE `/api/job-descriptions/:id` endpoint is created to allow users to delete their job descriptions.
- [ ] Endpoints require authentication, ensuring that users can only interact with their own job descriptions.
- [ ] The endpoints return appropriate error messages for validation failures (e.g., missing required fields or unauthorized actions).
- [ ] Ensure unit tests are written for each endpoint with at least 80% coverage.

---

### **Ticket 1.3 – Job Description List UI Component**

**Description:**  
Create a UI component that allows users to view and manage their saved job descriptions. This should include displaying a list of job descriptions with options to edit, delete, and select a job description to use for the CV rewrite process.

**Acceptance Criteria:**

- [ ] A new `JobDescriptionList` component is created to display a list of job descriptions retrieved from the `/api/job-descriptions` endpoint.
- [ ] Each job description in the list should display the title (if provided) or a snippet of the text, along with options to edit, delete, or select it.
- [ ] The component is responsive and works in both dark and light modes.
- [ ] When a user selects a job description, it is highlighted and marked as the active description for use in the CV rewrite process.
- [ ] A Storybook story is created for the `JobDescriptionList` component.
- [ ] Vitest tests are written to verify that the component renders correctly and handles interactions properly.
- [ ] Ensure mock data is removed once the component is fully developed and tested.

---

### **Ticket 1.4 – Job Description Edit & Delete Functionality**

**Description:**  
Implement the functionality that allows users to edit or delete their job descriptions. This includes adding forms for editing job descriptions and confirming deletion actions.

**Acceptance Criteria:**

- [ ] An `Edit` button is added next to each job description in the `JobDescriptionList` that opens a form pre-populated with the current job description.
- [ ] A `Delete` button is added next to each job description that prompts the user to confirm the deletion before removing it from the database.
- [ ] The edit form allows the user to update the job description text and save the changes.
- [ ] When a job description is deleted, it is removed from the list and the database.
- [ ] The edit and delete actions are handled through the `/api/job-descriptions/:id` endpoints (PUT and DELETE).
- [ ] Ensure unit tests are written for both the edit and delete functionalities, covering edge cases like empty input or unauthorized actions.

---

### **Ticket 1.5 – Implement Job Description Selection for CV Rewrite**

**Description:**  
Allow users to select which job description to use for the CV rewrite. The selected job description should be passed to the LLM API when the user initiates the CV rewriting process.

**Acceptance Criteria:**

- [ ] A selection mechanism is added to the `JobDescriptionList` that marks one job description as the active description.
- [ ] When a user selects a job description, the selected description is saved in the application state and used as input for the CV rewrite request.
- [ ] The `JobDescriptionList` component should visually indicate which job description is selected.
- [ ] The `rewrite CV` button on the CV rewrite page uses the selected job description when making the `/api/llm/rewrite` request.
- [ ] Ensure the correct job description is passed to the LLM API in the request payload.
- [ ] Ensure that users cannot proceed with the CV rewrite unless they have selected a job description.
- [ ] Unit tests are written for this functionality, ensuring the selected job description is passed correctly.

---

### **Ticket 1.6 – QA Testing & End-to-End Flow Testing**

**Description:**  
Conduct thorough QA testing of all the new functionality, ensuring that the job description management, selection, and CV rewriting flow works as expected.

**Acceptance Criteria:**

- [ ] QA verifies that users can successfully add, edit, delete, and view their job descriptions.
- [ ] QA tests the selection mechanism to ensure the right job description is used during the CV rewriting process.
- [ ] Verify that all form fields (for adding and editing job descriptions) are validated and that errors are properly handled.
- [ ] Test edge cases, such as selecting an empty or deleted job description.
- [ ] Verify that the UI properly handles dark mode and responsive behavior.
- [ ] Manual test cases are written, covering scenarios such as:
  - Adding a job description.
  - Editing an existing job description.
  - Deleting a job description.
  - Selecting a job description and initiating a CV rewrite.
  - Ensuring the app behaves properly with no job descriptions or when the user is logged out.

---

This detailed breakdown provides a solid plan for Sprint 5, with clear user stories, tasks, and acceptance criteria for each ticket. It will help ensure that all functionalities related to job description management and selection are implemented efficiently and tested thoroughly.
