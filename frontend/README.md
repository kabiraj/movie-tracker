# Movie Tracker Frontend

React frontend for the Movie Tracker app. Built with Vite for fast development and hot module replacement.

## What's Here

This is the frontend part of the movie tracker app. It's a React app that lets users:
- Sign up and log in
- Search for movies
- Add movies to their watchlist
- View and delete movies from their watchlist

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool (way faster than Create React App)
- **React Router** - For navigation between pages
- **React Icons** - For icons (heart, trash, etc.)
- **CSS** - Custom styling with glassmorphism effects

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Opens on `http://localhost:5173` (or whatever port Vite picks).

### Build for Production

```bash
npm run build
```

Output goes to `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── Navbar.jsx    # Navigation bar with scroll effects
│   └── Footer.jsx    # Footer component
├── pages/            # Page components
│   ├── LoginPage.jsx      # Login form
│   ├── SignupPage.jsx     # Signup form
│   ├── SearchPage.jsx     # Movie search page
│   └── MoviesListPage.jsx # User's watchlist
├── styles/           # CSS files
│   ├── colors.css    # CSS variables for colors
│   ├── Navbar.css
│   ├── SearchPage.css
│   └── MoviesList.css
└── App.jsx           # Main app with routes
```

## Features

- **Protected Routes** - Pages check for JWT token, redirect to login if missing
- **Responsive Design** - Works on mobile and desktop
- **Glassmorphism UI** - Modern frosted glass effects
- **Smooth Animations** - Hover effects, transitions, scroll-triggered navbar
- **State Management** - React hooks for managing data

## API Integration

The frontend talks to the backend at `http://localhost:3000`. Make sure the backend is running!

All authenticated requests need a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens are stored in `localStorage` after login.

## Development Tips

- Hot reload is enabled - changes show up instantly
- Check browser console for errors
- Network tab shows API requests/responses
- React DevTools helps debug component state

## Notes

- The app uses TMDb API for movie data
- Movie IDs are TMDb numeric IDs (not IMDb IDs)
- Heart icon shows filled when movie is in watchlist
- Delete button uses MongoDB `_id`, not TMDb `movieId`
