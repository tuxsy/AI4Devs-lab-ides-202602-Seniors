## ADDED Requirements

### Requirement: Dashboard loads user data on mount

The Dashboard page SHALL automatically invoke the `/autologin` endpoint when the component mounts and display the returned user information.

#### Scenario: Dashboard displays user info after load
- **WHEN** user navigates to the Dashboard page
- **THEN** system calls `/autologin` endpoint
- **THEN** system displays user name and email in a card component

### Requirement: Dashboard displays candidate list

The Dashboard SHALL display a list of candidates associated with the logged-in user by calling the `/candidates` endpoint.

#### Scenario: Candidate list loads successfully
- **WHEN** Dashboard has obtained user data from autologin
- **THEN** system calls `/candidates` endpoint
- **THEN** system displays candidates in a table with columns: name, email, status

### Requirement: Dashboard shows loading state

The Dashboard SHALL display a loading indicator while fetching data from the API.

#### Scenario: Loading indicator during data fetch
- **WHEN** Dashboard is fetching user or candidate data
- **THEN** system displays a loading spinner or skeleton

### Requirement: Dashboard handles empty candidate list

The Dashboard SHALL display an appropriate message when the user has no candidates.

#### Scenario: No candidates available
- **WHEN** the `/candidates` endpoint returns an empty list
- **THEN** system displays message "No candidates found"

### Requirement: Dashboard handles API errors gracefully

The Dashboard SHALL display an error message if API calls fail.

#### Scenario: API error during load
- **WHEN** `/autologin` or `/candidates` endpoint returns an error
- **THEN** system displays an error message to the user
