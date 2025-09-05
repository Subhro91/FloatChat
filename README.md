# FloatChat 🌊

FloatChat is an innovative, AI-powered web application designed for the intuitive exploration of oceanographic data. It allows users to ask natural language questions about complex ARGO float datasets and receive instant, dynamic visualizations, including interactive maps and charts.

This project utilizes a sophisticated RAG (Retrieval-Augmented Generation) pipeline to process user queries, retrieve relevant information from ARGO datasets, and generate insightful, data-driven responses.

## ✨ Features

-   **Conversational AI:** Employs a RAG pipeline to understand user intent and query real-time oceanographic data.
-   **Dynamic Visualizations:** Receive answers not just as text, but as interactive Leaflet maps and dynamic charts based on real ARGO data.
-   **Secure Authentication:** User accounts and chat histories are kept secure and private with Firebase Authentication.
-   **Persistent Chat History:** All conversations are automatically saved and can be revisited, renamed, or deleted.
-   **Fully Responsive:** A seamless user experience on both desktop and mobile devices, with an adaptive layout for the dashboard.

## 🛠️ Tech Stack

-   **Frontend:** React, Vite, TypeScript
-   **Styling:** Tailwind CSS, shadcn/ui
-   **AI & Data Pipeline:** Retrieval-Augmented Generation (RAG) over ARGO datasets
-   **Backend & Database:** Firebase (Authentication, Firestore)
-   **Mapping:** Leaflet & React-Leaflet
-   **Charting:** Chart.js & react-chartjs-2

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your-username/floatchat.git
    cd floatchat/ocean-ai-explorer
    ```
2.  **Install NPM packages**
    ```sh
    npm install
    ```
3.  **Set up environment variables**
    -   Create a new file named `.env.local` in the `ocean-ai-explorer` directory.
    -   Add your own API keys from Firebase to this file. It should look like this:
        ```
        VITE_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY_HERE"
        VITE_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN_HERE"
        VITE_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID_HERE"
        VITE_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET_HERE"
        VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID_HERE"
        VITE_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID_HERE"
        VITE_FIREBASE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID_HERE"
        ```

4.  **Run the development server**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

