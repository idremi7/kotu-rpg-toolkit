# KOTU: RPG Toolkit

KOTU is a web-based application designed to empower both Game Masters (GMs) and players in the world of tabletop role-playing games (TTRPGs). It provides a flexible platform for creating custom game systems and managing characters within those systems.

## Features

### For Game Masters (GMs)
- **Create Custom TTRPG Systems**: Design your own game from the ground up by defining its core mechanics.
- **Define System Components**: Specify custom attributes, skills, saving throws, and feats that make your game unique.
- **AI-Powered Skill Suggestions**: Leverage a generative AI assistant to get creative suggestions for skills based on your system's attributes, helping to flesh out your world with less effort.
- **Dynamic Schema Generation**: The application automatically generates the necessary data and UI schemas for character sheets based on the rules you define.

### For Players
- **Browse Game Systems**: Discover and choose from a list of available game systems created by GMs.
- **Dynamic Character Creation**: Create new characters using a form that is dynamically generated to match the specific rules of the chosen game system.
- **View Character Sheets**: Access a clean, well-organized digital character sheet that displays all your character's stats, skills, and details.

## Tech Stack

This project is built with a modern, component-based architecture:

- **Framework**: [Next.js](https://nextjs.org/) (with App Router and React Server Components)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Generative AI**: [Google Gemini](https://deepmind.google/technologies/gemini/) via [Genkit](https://firebase.google.com/docs/genkit)
- **Data Storage**: Local JSON files (no database required).

## Getting Started

To get started with development:

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run the development server**:
    ```bash
    npm run dev
    ```
This will start the Next.js application, typically on `http://localhost:9002`.

### First-Time Git Setup (Important)

If you get an error from GitHub about large files, it means large files (like `node_modules` or `.firebase`) were accidentally committed in the past. You need to clean your Git history. Run the following commands **once**:

1.  Make the setup script executable:
    ```bash
    chmod +x init.sh
    ```
2.  Run the script to rewrite history:
    ```bash
    ./init.sh
    ```
3.  Force push the cleaned history to GitHub:
    ```bash
    git push --force
    ```
This will permanently remove the large files from your Git history. You can now push your code to GitHub without issues.
