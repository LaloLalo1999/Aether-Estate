# Aether Estate

A visually stunning, minimalist Real Estate ERP for managing CRM, properties, accounting, and contracts.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/LaloLalo1999/Aether-Estate)

Aether Estate is a minimalist, visually-driven Real Estate ERP designed for modern agencies. It integrates core functionalities into a single, cohesive dashboard. The application provides a seamless experience for managing client relationships (CRM), tracking property listings, handling basic accounting, and overseeing contracts. The core design philosophy is 'less is more,' focusing on clarity, intuitive workflows, and aesthetic elegance to reduce cognitive load and empower agents to focus on their clients and deals. The system is built on a robust serverless architecture using Cloudflare Workers and Durable Objects, ensuring high performance and scalability.

## ✨ Key Features

-   **Centralized Dashboard:** A high-level overview of key business metrics like new leads, active listings, and upcoming deadlines.
-   **Client Relationship Management (CRM):** Manage client information, interaction history, and associated properties.
-   **Property Management:** Display and manage property listings in a clean, visually appealing grid.
-   **Streamlined Accounting:** Track financial transactions, including income and expenses.
-   **Contract Lifecycle Management:** Oversee all legal documents, tracking status and key dates.
-   **Minimalist & Responsive UI:** A clean, high-contrast aesthetic built with Tailwind CSS and shadcn/ui.
-   **Serverless Architecture:** Built on Cloudflare Workers and Durable Objects for performance and scalability.

## 🚀 Technology Stack

-   **Frontend:** React, Vite, React Router, TypeScript
-   **Backend:** Hono on Cloudflare Workers
-   **State Management:** Zustand, TanStack Query
-   **Styling:** Tailwind CSS, shadcn/ui, Framer Motion
-   **Data Persistence:** Cloudflare Durable Objects
-   **Forms:** React Hook Form with Zod for validation
-   **Tooling:** Bun, ESLint, TypeScript

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   A Cloudflare account and the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and configured.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/aether_estate.git
    cd aether_estate
    ```

2.  **Install dependencies:**
    This project uses `bun` as the package manager.
    ```sh
    bun install
    ```

3.  **Run the development server:**
    This command starts the Vite development server for the frontend and the Wrangler server for the backend worker.
    ```sh
    bun run dev
    ```
    The application will be available at `http://localhost:3000`.

## 📂 Project Structure

The project is organized into three main directories:

-   `src/`: Contains the frontend React application code, including pages, components, hooks, and styles.
-   `worker/`: Contains the backend Cloudflare Worker code, built with Hono. This includes API routes, entity definitions, and core Durable Object logic.
-   `shared/`: Contains TypeScript types and mock data shared between the frontend and the backend to ensure type safety.

## 🛠️ Development

The application is a full-stack monorepo running on a single development command.

-   **Frontend:** The frontend is a standard Vite + React application. All UI components are located in `src/components`, with pages in `src/pages`. Styling is done primarily with Tailwind CSS and pre-built `shadcn/ui` components.
-   **Backend:** The backend is a Hono application running on a Cloudflare Worker. API routes are defined in `worker/user-routes.ts`. Data persistence is handled by a single `GlobalDurableObject` which is abstracted away by `IndexedEntity` classes defined in `worker/entities.ts`.

## 🚀 Deployment

This project is designed for seamless deployment to the Cloudflare network.

1.  **Build the project:**
    This command bundles the frontend application and the worker for production.
    ```sh
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    This command deploys your application to your Cloudflare account using Wrangler.
    ```sh
    bun run deploy
    ```

Alternatively, you can deploy directly from your GitHub repository with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/LaloLalo1999/Aether-Estate)

## 📜 Available Scripts

-   `bun run dev`: Starts the local development server for both frontend and backend.
-   `bun run build`: Builds the application for production.
-   `bun run deploy`: Deploys the application to Cloudflare Workers.
-   `bun run lint`: Lints the codebase using ESLint.

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.