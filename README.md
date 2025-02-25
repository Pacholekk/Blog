# Blog Application

A simple blog platform built with Node.js and Express.

## Overview

This project is a basic blogging platform that demonstrates server-side rendering with Express and EJS templates.

## Features

- View blog posts
- Simple and clean design
- Server-side rendered pages

## Tech Stack

- Node.js
- Express.js
- EJS templating
- CSS for styling

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
 git clone https://github.com/Pacholekk/Blog.git
. Navigate to the project directory:
cd Blog
Copy
3. Install dependencies:
npm install
Copy
4. Start the server:
npm start
Copy
Or use nodemon for development:
npm run dev
Copy
5. Open your browser and visit `http://localhost:3000`

The application follows a standard Express structure:
- `public` directory contains all static assets like CSS stylesheets and images
- `views` directory houses all EJS templates, separated into:
  - `partials` for reusable components (header, footer, etc.)
  - `pages` for complete page templates
- `routes` directory contains all Express route definitions
- `app.js` is the main application entry point
## Screenshots

![Home Page](hp.png)
![Delete/edit](dl.png)
![Adding posts](add.png)

## Future Enhancements

- User authentication
- Database integration (MongoDB)
- CRUD operations for blog posts
- Comments functionality
- Admin dashboard

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Patryk Pacholski - [GitHub](https://github.com/Pacholekk)
