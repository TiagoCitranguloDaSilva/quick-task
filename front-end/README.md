# Quick Task - Front End

- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Running the Application](#running-the-application)

## Technologies

- React
- JavaScript
- CSS
- HTML

### Requirements

- Node.js
- npm (included with Node.js)

### Libraries

- React router, client-side routing
- Lucide React, icon library

> [!NOTE]  
> This application uses **JWT-based stateless authentication**. After a login, the back end returns a JWT access token that expires after **2 hours**. The token is stored as a cookie, and it's included in requests that need it.

## Project Structure

| Folder      | Description                                     |
| ----------- | ----------------------------------------------- |
| components/ | Reusable UI components                          |
| contexts/   | Global contexts (authentication and user state) |
| hooks/      | Custom hooks                                    |
| pages/      | Application pages                               |
| styles/     | Global styles                                   |

### Pages

| Page         | Description                                      |
| ------------ | ------------------------------------------------ |
| Home         | Displays all lists                               |
| Login        | Authenticate an existing user                    |
| NotFoundPage | Shown when a request for the route doesn't exist |
| Register     | Create a new account                             |
| ShowList     | Manage items within a selected list              |

## Setup

### How to run locally

To run you need:

- Node.js (includes npm)

### Verify Installation

```sh
node -v
npm -v
```

## Running the Application

### Install Dependencies

Open a terminal in `front-end/` folder and run:

```sh
npm install
```

This installs all project dependencies.

### Start the front end server

After installing, open a terminal in `front-end/` folder and run:

```sh
npm run dev
```

Once the server starts, open the URL displayed in the terminal, which is http://localhost:5173/

> [!TIP]
> Keep the terminal open, as it is the front-end server. You can press `ctrl + o` to open the link on the browser
