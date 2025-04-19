# VOD Playlist Manager

A web application for managing a Video-on-Demand (VOD) M3U8 playlist with a dynamic admin panel. Users can add, edit, and view movies and series, generate a downloadable M3U8 playlist, and manage content via a secure admin interface. Built with modern web technologies and deployed on Vercel with a Neon Postgres database.

![V1 Homepage](https://github.com/DevHimu/commercial-vod-playlist/blob/a15d16d15c6dfddfee96870f8898b2d87785bbb9/Repo-Images/homepage-v1.png)

## Technologies Used

This project leverages the following technologies:

- **Next.js (15.3.0)**: React framework for server-side rendering, client components, and API routes.
- **Prisma (6.6.0)**: ORM for database management with TypeScript support.
- **Neon Postgres**: Serverless PostgreSQL database for scalable storage.
- **TypeScript**: Static typing for robust code.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Vercel**: Platform for deployment, hosting, and automatic scaling.
- **Node.js (v18+)**: Runtime for local development and build processes.
- **Git**: Version control for repository management.

## Prerequisites

Before running the project locally, ensure you have:

- **Node.js** (v18 or higher): Download
- **Git**: Download
- **Neon Account**: For database hosting (neon.tech)
- **Vercel Account**: For deployment (vercel.com)
- **GitHub Account**: For cloning the repository

## Local Development Commands

Below are the essential commands to set up and run the project locally, including Prisma, Next.js, and database management.

### 1. Clone the Repository

Clone the project to your local machine:

```bash
git clone https://github.com/HimuWorks/vod-playlist.git
cd vod-playlist
```

### 2. Install Dependencies

Install required Node.js packages:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root and add the following:

```
DATABASE_URL="your-neon-postgres-connection-string?connection_limit=1&pool_timeout=5"
ADMIN_USERNAME="your-admin-username"
ADMIN_PASSWORD="your-admin-password"
```

- **DATABASE_URL**: Obtain from Neon Console after creating a project.
- **ADMIN_USERNAME** and **ADMIN_PASSWORD**: Set for admin panel authentication.

### 4. Prisma Commands

Manage the database schema and client with Prisma.

- **Initialize Prisma** (if not already set up):

  ```bash
  npx prisma init
  ```

  - Creates `prisma/schema.prisma` and `.env`.

- **Push Schema to Database**: Sync the Prisma schema with your Neon Postgres database:

  ```bash
  npx prisma db push
  ```

  - Applies the schema (`Movie`, `Series`, `Episode` models) to the database.

- **Generate Prisma Client**: Generate the Prisma client for TypeScript:

  ```bash
  npx prisma generate
  ```

  - Required after schema changes or initial setup.

- **Reset Database** (use with caution): Drop and recreate the database schema:

  ```bash
  npx prisma db push --force-reset
  ```

  - Warning: This deletes all data and reapplies the schema.

- **Access Database (Prisma Studio)**: Open a web interface to view and manage database records:

  ```bash
  npx prisma studio
  ```

  - Access at `http://localhost:5555`.

### 5. Next.js Commands

Run and build the application with Next.js.

- **Run Development Server**: Start the app locally:

  ```bash
  npm run dev
  ```

  - Access at `http://localhost:3000`.
  - Hot-reloads for development.

- **Build for Production**: Generate an optimized production build:

  ```bash
  npm run build
  ```

  - Includes `prisma generate` to ensure Prisma client is ready.

- **Start Production Server**: Run the built app:

  ```bash
  npm run start
  ```

  - Serves the production build locally.

### 6. Clear Cache (Optional)

If you encounter build or runtime issues:

```bash
rm -rf node_modules .next
npm install
```

## Guide to Use This Repository

Follow these steps to set up and use the VOD Playlist Manager on your local machine or deploy it.

### 1. Setup Instructions

1. **Clone and Install**:
   - Clone the repo and install dependencies (see above).
2. **Configure Database**:
   - Sign up at neon.tech and create a project.
   - Copy the connection string and add `?connection_limit=1&pool_timeout=5`.
   - Update `.env` with `DATABASE_URL`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD`.
3. **Apply Schema**:
   - Run `npx prisma db push` to sync the database schema.
4. **Run Locally**:
   - Start the development server with `npm run dev`.
   - Access the app at `http://localhost:3000`.
   - Navigate to:
     - `/`: Home page with links to add content or view the index.
     - `/content-index`: View all movies and series (admin-only for editing).
     - `/add-movie` and `/add-series`: Add new content (admin-only).
     - `/api/playlist`: Download the M3U8 playlist.

### 2. Admin Access

- The admin panel (`/add-movie`, `/add-series`, `/edit-movie`, `/edit-series`) is protected by basic authentication.
- Use the `ADMIN_USERNAME` and `ADMIN_PASSWORD` set in `.env`.
- Example: Add a movie at `http://localhost:3000/add-movie` after logging in.

### 3. Deploy to Vercel

1. **Push to GitHub**:

   - Create a GitHub repository and push your code:

     ```bash
     git add .
     git commit -m "Initial commit"
     git push origin main
     ```

2. **Import to Vercel**:

   - Sign up at vercel.com.
   - Import your GitHub repository.

3. **Set Environment Variables**:

   - Add `DATABASE_URL`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` in Vercel’s Dashboard.

4. **Install Neon Integration**:

   - In Vercel’s Storage tab, connect to your Neon project.

5. **Deploy**:

   - Vercel automatically builds and deploys on each push.
   - Access at `https://your-vercel-app.vercel.app`.

### 4. Test the Playlist

- Download the playlist from `/api/playlist` (e.g., `http://localhost:3000/api/playlist` or `https://your-vercel-app.vercel.app/api/playlist`).
- Test in an IPTV player (e.g., VLC, IPTV Smarters).
- Ensure stream URLs in the database are valid M3U8 links.

## Project Structure

Key files and directories:

- `src/app/`: Next.js App Router with pages and API routes.
  - `content-index/page.tsx`: Displays movies and series (server component).
  - `add-movie/page.tsx`, `add-series/page.tsx`: Admin forms for adding content.
  - `edit-movie/[id]/page.tsx`, `edit-series/[id]/page.tsx`: Edit existing content.
  - `api/`: API routes for CRUD operations and playlist generation.
- `prisma/schema.prisma`: Database schema for `Movie`, `Series`, and `Episode` models.
- `package.json`: Includes build script with `prisma generate`.

## Notes

- **Database**: Use Neon’s Free Plan for cost-effective hosting. Back up regularly via Neon Console.
- **Authentication**: Basic auth is used. Consider NextAuth.js for advanced security.
- **Search**: The `/content-index` page uses a server component, disabling client-side search. Add a client component for search if needed.
- **Troubleshooting**:
  - If the build fails, ensure `prisma generate` runs (`npm run build`).
  - Clear caches if runtime errors occur (`rm -rf node_modules .next`).
  - Check Vercel Logs for deployment issues.
- **Future Enhancements**:
  - Add pagination to `/content-index`.
  - Validate input forms for URLs and data.
  - Cache API responses for performance.
  - Enhance UI with loading states and better styling.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See LICENSE for details.

## Contact

For questions or support, open an issue on GitHub or contact [DevHimu](https://github.com/DevHimu).