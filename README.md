# PenguinPals 🐧

Welcome to the **PenguinPals** monorepo! This application is designed to create a frictionless, modern, and playful check-in experience between patients and their healthcare providers. It consists of two major components:
1. **The Patient App (React Native/Expo)**: A beautifully designed mobile application where patients complete dynamic check-ins with "Pip," their penguin companion.
2. **The Doctor Dashboard (Next.js)**: A sleek, modern web platform where providers can monitor patient streaks, view check-in histories, and build custom question decks.

Both applications share a centralized backend powered by **Supabase**.

---

## 🚀 Getting Started

To collaborate on this project, you will need to run both the Expo mobile app and the Next.js web dashboard locally. 

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or yarn
- iOS Simulator or Android Emulator (for running the Expo app natively)

### 1. Database Configuration (Supabase)

For security, we **do not** commit our actual database keys to this repository. You must either obtain the development keys from the project owner, or spin up your own Supabase instance.

**Option A: Connect to the Team Database**
1. Ask the project owner for the `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
2. Copy `.env.example` in the root folder to `.env` and fill it out:
   ```bash
   cp .env.example .env
   ```
3. Copy `dashboard/.env.example` to `dashboard/.env.local` and fill it out:
   ```bash
   cp dashboard/.env.example dashboard/.env.local
   ```

**Option B: Spin up your own Staging Database**
If you want to experiment without touching production data:
1. Create a free account at [Supabase](https://supabase.com/).
2. Create a new project.
3. Once the database is ready, go to the **SQL Editor**, paste the contents of the `combined_schema.sql` (found in the root or provided by the team), and click **Run**. This will instantly duplicate the entire table architecture, Row Level Security (RLS) policies, and foreign keys!
4. Grab your new Project URL and Anon Key from the Supabase settings and place them in the `.env` files mentioned above.

---

### 2. Running the Patient App (Expo Root)

The mobile application lives in the root of the repository.

```bash
# Install dependencies
npm install

# Start the Expo development server
npx expo start
```
*Press `i` in the terminal to launch the iOS simulator, or scan the QR code with the Expo Go app on your physical device.*

### 3. Running the Doctor Dashboard (Next.js)

The web dashboard is isolated in the `/dashboard` directory.

```bash
# Navigate to the dashboard directory
cd dashboard

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```
*Open [http://localhost:3000](http://localhost:3000) in your browser to view the portal.*

---

## 🎨 Architecture & Styling Notes
- **Frictionless UI**: Both targets use a unified, playful light theme defined by `--fog`, `--snow`, and `--glacier` standard colors.
- **Lucide Icons**: We use `lucide-react` and `lucide-react-native` exclusively for scalable, sleek vector iconography. Avoid committing raw OS emojis or ASCII art to maintain a premium feel.
- **Real-time Sync**: The mobile app subscribes to the `doctors` and `patients` schema via Supabase real-time channels to fetch active question decks instantly.

---
*Happy coding!*
