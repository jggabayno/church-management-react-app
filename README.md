# Church Management System (React, Redux-Thunk)

## Overview

This app is a **React-based church management system** that integrates **Redux and Redux Thunk** for state management and asynchronous actions. The system supports functionalities such as:

- **User Management**: Admins can manage users and roles.
- **Authentication & Security**: Secure login, registration, and user authentication.
- **Activities & Logs**: Manage church activities and track logs.
- **Dashboard Analytics**: View graphs for members by position and age.
- **Offerings & Donations**: Manage church offerings and donations.
- **Expense Management**: Track and manage church expenses.
- **Service Management**: Handle baptisms, weddings, event calendars, fees, and payments.
- **Profile Management**: Users can view and update their profiles.

## Features
- **User Authentication**: Secure login and registration.
- **Church Services**:
  - Manage baptisms, weddings, and other church events.
  - Handle payments and service fees.
  - View event calendars.
- **Financial Management**:
  - Track offerings, donations, and expenses.
- **Activity Management**:
  - Log and manage church activities.
- **Dashboard & Reports**:
  - Graphical insights on church members by position and age.

## Getting Started

### Requirements

- Node.js 12.x to 14.x 
- npm

### Setup

1. Clone the repository.
2. Install dependencies:

   ```sh
   npm install
   ```

3. Use the .env.example file as a reference to create your own .env for environment setup.

## Running the Application

### Development Mode

To start the development server:

```sh
npm run dev
```

After running, access the application at:

```sh
http://localhost:3000/
```

### Production Mode

To build and start the production server:

```sh
npm run build
npm run start
```

