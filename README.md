# Movie Watchlist

A simple web app for keeping track of movies you want to watch. Sign up, add movies to your list, mark them as watched, rate them out of 5 stars, and edit or remove them anytime. Each user only sees their own list.


**Live app:** https://movie-watchlistey.netlify.app/
**Demo video:** https://youtu.be/7J2IEr6FrQE

## What it does

- **Accounts:** register, log in, and log out with email and password (Supabase Auth). You have to be logged in to see or change any data.
- **Create:** add a movie with a title, release year, genre, status, and notes.
- **Read:** see your whole list, filter by To watch / Watched, and search by title or genre.
- **Update:** edit any movie, mark it as watched (or move it back), and give it a 1–5 star rating.
- **Delete:** remove a movie from your list.
- **Privacy:** Row Level Security in the database makes sure users can only read and change their own movies.

## Technologies used

- React 18 + Vite for the frontend
- Supabase (Postgres database + Auth) for the backend
- @supabase/supabase-js to connect the app to Supabase
- Netlify for deployment
- Git + GitHub for version control
- AI tools: Claude

## Project structure

```
movie-watchlist/
├── index.html              # Page that loads the React app
├── netlify.toml            # Netlify build settings
├── .env.example            # Template for Supabase keys
├── SPEC.md                 # App plan written before coding
├── supabase/
│   └── schema.sql          # Creates the movies table + security rules
└── src/
    ├── main.jsx            # Starts React
    ├── App.jsx             # Shows login screen or watchlist
    ├── supabaseClient.js   # Connects to Supabase
    ├── index.css           # Styles
    └── components/
        ├── Auth.jsx        # Register / log in form
        ├── Watchlist.jsx   # Main page, handles add/edit/delete
        ├── MovieForm.jsx   # Add / edit movie form
        └── TicketCard.jsx  # One movie, styled like a ticket
```

## Setup instructions

### 1. Supabase
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor**, paste in everything from `supabase/schema.sql`, and click **Run**.
3. Go to **Authentication > Sign In / Providers > Email** and turn off **Confirm email** (optional, makes testing easier).
4. Go to **Project Settings > API Keys** and copy your **Project URL** and **publishable key**.

### 2. Run locally
You need [Node.js](https://nodejs.org) 18 or newer.

```bash
git clone https://github.com/MDalien/movie-watchlist.git
cd movie-watchlist
npm install
cp .env.example .env
```

Open `.env` and add your Supabase values:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-key
```

Then start the app:

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 3. Deploy to Netlify
1. In Netlify, click **Add new project > Import an existing project** and pick this repo.
2. The build settings come from `netlify.toml` (build command `npm run build`, publish folder `dist`).
3. Under **Environment variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Deploy. Then in Supabase, go to **Authentication > URL Configuration** and set the **Site URL** to your Netlify link.

The `.env` file is ignored by Git, so your keys never get uploaded to GitHub.
