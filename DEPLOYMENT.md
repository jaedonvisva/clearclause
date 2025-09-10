# ClearClause Deployment Guide (Hybrid Model)

This guide explains how to deploy the ClearClause application using a hybrid model: the frontend is hosted on Vercel for speed and ease, while the backend and AI model run on a private server to ensure data privacy.

## Architecture Overview

-   **Frontend**: A Next.js application hosted on Vercel.
-   **Backend**: A Flask API running in a Docker container on a private Virtual Private Server (VPS).
-   **AI Model**: An open-source model (e.g., Llama 3) served by Ollama, running on the same private VPS.

This setup ensures that user documents are processed on your private server and are never exposed to third-party services.

---

## Part 1: Deploying the Backend & AI Model

**Objective**: Set up a private server to run the Flask backend and Ollama.

**1. Provision a Server**

-   Rent a Virtual Private Server (VPS) from a provider like DigitalOcean, Vultr, or Hetzner. 
-   **Recommended Specs**: 2 CPU Cores, 4GB RAM, 50GB SSD.
-   You will receive an IP address for your server.

**2. Install Server Software**

-   Connect to your server via SSH: `ssh root@YOUR_SERVER_IP`.
-   **Install Docker**: Follow the official instructions for your server's OS: [Install Docker Engine](https://docs.docker.com/engine/install/).
-   **Install Ollama**: Follow the official Linux instructions: [Ollama on Linux](https://ollama.com/download/linux).

**3. Set Up the AI Model**

-   On your server, pull your desired AI model using Ollama. For example:
    ```bash
    ollama pull llama3
    ```
-   Ensure the Ollama service is running: `systemctl status ollama`.

**4. Deploy the Backend Application**

-   Copy your local `backend` directory to the server. You can use `scp` for this:
    ```bash
    scp -r /path/to/your/local/clearclause/backend root@YOUR_SERVER_IP:/
    ```
-   On the server, navigate into the backend directory: `cd /backend`.
-   Build the Docker image:
    ```bash
    docker build -t clearclause-backend .
    ```
-   Run the Docker container:
    ```bash
    docker run -d -p 5001:5001 --name clearclause-backend --add-host=host.docker.internal:host-gateway clearclause-backend
    ```
    *Note*: `--add-host` allows the container to communicate with the Ollama service running on the host server.

**5. Expose the Backend to the Internet (Recommended)**

-   For a production setup, you should put your backend behind a domain name with an SSL certificate.
-   The easiest way is to use a reverse proxy like Nginx or Caddy.
-   This will give you a secure public URL for your backend, like `https://api.yourdomain.com`.

---

## Part 2: Deploying the Frontend to Vercel

**Objective**: Deploy the Next.js user interface to Vercel.

**1. Push Your Code to GitHub**

-   Ensure your entire `clearclause` project, including the `frontend` directory, is up-to-date in a GitHub repository.

**2. Create a Vercel Project**

-   Sign up for a free Vercel account and connect it to your GitHub.
-   Click "Add New..." -> "Project".
-   Import your project's GitHub repository.
-   Vercel will automatically detect that it's a Next.js project.

**3. Configure Environment Variables**

-   In your Vercel project's dashboard, go to **Settings -> Environment Variables**.
-   Add the following variable:
    -   **Name**: `NEXT_PUBLIC_API_URL`
    -   **Value**: The public URL of your backend server (e.g., `http://YOUR_SERVER_IP:5001` or `https://api.yourdomain.com`).

**4. Deploy**

-   Click the "Deploy" button. Vercel will build and deploy your frontend.
-   Once complete, you will have a public URL for your ClearClause application.

Your application is now live! The Vercel frontend will send analysis requests to your private backend, ensuring your users' data remains secure.
