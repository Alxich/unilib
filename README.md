<h1 align="center"> U n i l i b </h1>
<p align="center">
    A Simple and Efficient Blog Project Crafted by a Student
</p>
<p align="center">
<img src="https://i.imgur.com/4c2bItC.gif" alt="project example">
</p>

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Project Status](#project-status)
- [Installation](#installation)
- [Dependencies in Project](#dependencies-in-project)
- [Documentation](#documentation)

## Introduction

***Unilib - Real-time Blog Project***

Unilib is a dynamic project built with NextJS, Apollo, MongoDB, and GraphQL. It offers real-time interactions without page reloads, providing a seamless user experience. Unique messaging features enable private conversations and group discussions. An admin panel allows content management, from tags to posts. The Tiptap editor streamlines content creation, and responsive design ensures adaptability across devices. 🌟

 - The Titap editor
    <p align="center">
        <img src="https://i.imgur.com/IFQe9Lk.png" alt="Here is titap editor">
    </p>

- The administrative page
    <p align="center">
        <img src="https://i.imgur.com/UnJExhB.png" alt="Here is administrative editor">
    </p>

## Features

- **Registration and User Authentication**: Seamlessly manage user access.
- **Real-time Messaging Functionality**: Experience live communication.
- **Posting and Commenting on Articles**: Share and discuss content.
- **Tagging and Categorization**: Organize posts with ease.
- **Keyword-based Search**: Quickly find articles by title.
- **Admin Panel**: Effortlessly manage content and the site.

## Project Status

While Unilib is operational and functional, it's important to note that it's an ongoing project. As such, you might encounter some areas that need refining or unimplemented ideas. The project is currently at the "early_release" stage.

Feel free to explore the codebase. I've added comments throughout the code for your understanding. While ChatGPT assisted with some comments, they still provide valuable insights.

Unilib is suitable for both students working on web programming labs and those exploring some junior lever projects. I've put significant effort into ensuring basic features run smoothly, and I hope you find it useful.

## Installation

Follow these steps to set up and run the project on your local machine:

1. **Clone the Repository**: `git clone https://github.com/author-username/unilib.git`
2. **Frontend Setup**:
	- Navigate to the Frontend directory: `cd ./frontend`
	- Install dependencies: `npm install`
	- Rename `.env.example` to `.env.local`
	- Provide necessary data in `.env.local`:
	  - `NEXTAUTH_SECRET`: Generate using [openssl](https://next-auth.js.org/configuration/options#secret)
	  - Google API credentials: [Link with creating and guide](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid)
	  - `MONGODB_URI`: Access URL for your MongoDB cluster
3. **Backend Setup**:
	- Navigate to the Backend directory: `cd ./backend`
	- Install dependencies: `npm install`
	- Rename `.env.example` to `.env`
	- Provide necessary data in `.env`:
	  - `MONGODB_URI`: Access URL for your MongoDB cluster (same as frontend)
4. **Run the Project**:
	- Start frontend: `cd ./frontend && npm run dev`
	- Start backend: `cd ./backend && npm run dev`

## Dependencies in Project

### Frontend Dependencies

Main dependencies used in the frontend of the project:

- `@apollo/client`, `@fortawesome/fontawesome-svg-core`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/react-fontawesome`: UI and GraphQL.
- `@next-auth/prisma-adapter`, `@prisma/client`: Authentication and database integration.
- `@tiptap` libraries: Text editing functionality.
- `sass`: Styling language.

### Development Dependencies (Frontend)

- `@types/node`, `@types/react`, `@types/react-dom`: TypeScript type declarations.
- `eslint`, `eslint-config-next`: ESLint and Next.js ESLint configuration.
- `prisma`, `typescript`: Prisma and TypeScript.

### Backend Dependencies

Main dependencies used in the backend of the project:

- `@apollo/server`, `@graphql-tools/schema`, `graphql-subscriptions`: GraphQL server and subscriptions.
- `@prisma/client`: Prisma for database interactions.
- `body-parser`, `express`, `cors`: Express and middleware.
- `dotenv`, `esm`, `ws`: Environment variables, ES modules, and WebSocket.
- `kleur`, `lodash.merge`, `log-symbols`: Utilities for enhancing terminal logs.

### Development Dependencies (Backend)

- `@types/cors`, `@types/lodash.merge`, `@types/ws`: TypeScript type declarations.
- `nodemon`, `ts-node`, `typescript`: Development tools for Node.js and TypeScript.

## Documentation

This is all documentations that can help you with understanding this project and proceed in fixind or adding some new features into.

- [Next.js Documentation](https://nextjs.org/docs)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
- [MongoDB](https://www.mongodb.com/)
- [Google API Console](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid)
- [SCSS/SASS](https://sass-lang.com/documentation/)
- [OpenSSL](https://www.openssl.org/docs/)

These resources provided invaluable information and tools that greatly helped to push the development of this project.

Best of luck exploring and understanding my ugly code! 🚀
