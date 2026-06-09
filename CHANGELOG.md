# Changelog

All notable changes to the HR Internship Management System (HRIMS) frontend will be documented in this file.

## [1.0.0-frontend-fixes] - 2026-06-08

### Added
- **Manual Intern Registration**: Added `AddInternModal` component in My Recruitment tab to allow direct creation and persistent save of intern profiles to local storage.
- **Performance Report Configurator**: Added `GenerateReportModal` component under Reports & Analytics. Supports dynamic timeframe filtering (Today, Week, Month, Year), statistics compiling, PDF printing, and CSV spreadsheet exporting.
- **Staff Management Department Creation**: Integrated `AddDepartmentModal` modal in Staff Management to allow creating new departments with custom titles and managers, persisting directly to local storage.
- **Staff Management Details Filtering**: Added dropdown filters to employee lists under departments, allowing filtering by Type (Office/Remote) and Employment Status.
- **Document Vault Navigation & Filters**:
  * Added route path `:folderId` to the HR Staff document vault portal.
  * Replaced flat tab list in HR Staff with standard folder grids for UI consistency.
  * Added status filter dropdown in the shared folder overview grid to filter by active, expiring soon, and expired records.
- **Settings RBAC Save Action**: Added a "Save Changes" action button under Settings -> RBAC permissions tab with Sonner success toast feedback.

### Changed / Refactored
- **Sidebar Collapse & Persistence**:
  * Added dedicated arrow collapse/expand button with Chevron icons in the sidebar header.
  * Persisted collapsed sidebar state in `localStorage` across page refreshes and portal switches.
  * Restyled link icons and user profile card paddings to prevent overflow when collapsed (width set to `w-20`).
  * Updated main content margins dynamically based on collapse state.
- **Sidebar Navigation Highlights**: Refactored link matching logic in `Sidebar.jsx` to match route path prefixes, ensuring tabs remain highlighted when browsing subpages or filter parameters.
- **Document Vault Renaming**: Renamed components to prevent casing conflicts and improve code readability:
  * `documentVault.jsx` (shared grid) -> `DocumentVaultFolderGrid.jsx`
  * `DocumentVault.jsx` (staff page) -> `StaffDocumentVault.jsx`

### Fixed
- **Dashboard Redirections**: Wired quick actions "Add Intern" and "Generate Report" buttons to navigate to their respective subpages with query parameters (`action=add-intern`, `action=generate-report`) to automatically trigger form modals.
- **Attendance Overview Chart**: Fixed static filter dropdown, mapping SVG bars dynamically to Today, Week, Month, and Yearly datasets.
- **MOA Metrics cards**: Fixed missing MOA status cards under Partner Universities; counts are now computed dynamically from the database.
- **University Email Copy**: Replaced static border element with a functional Copy button utilizing `navigator.clipboard` write actions and copy confirmation feedback.
- **Update University MOA**: Fixed save event inside the MOA upload modal to recalculate active/expired status and update the persistent local storage database.
- **Edit University Profile**: Fixed non-functional "Edit Profile" button by implementing form modal updating contacts, phone, address, and email.
- **Native Date Pickers**: Re-typed Partner University date inputs to use native browser datepicker widgets.
- **Login Stability**: Fixed white-screen crash on unmatched email lookups by adding safety checks. Auto-initializes and merges default test accounts into local storage database.
- **Staff Page Designation Crashes**: Fixed javascript crash in staff search filters by adding optional property lookups (`member.designation?.toLowerCase()`).
