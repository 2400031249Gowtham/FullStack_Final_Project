# 🎓 CampusConnect (Activity-Hub)

Hey everyone! 👋 Thanks for checking out my project, **CampusConnect**.

I built this because keeping track of everything happening on campus—club meetings, intramural sports, hackathons, you name it—can get really messy. I wanted to build a single place where students can log in, see what's going on, and sign up with one click. 

## ✨ What I Built

So, how does it work? I made two different sides to the app:

*   **If you're a Student 🎒:** You get a clean portal showing all the upcoming events. You can browse, click "Register" on whatever sounds fun, and your personal dashboard keeps track of your schedule so you don't double-book yourself.
*   **If you're an Admin 🛠️:** You get the control panel. You can easily add new activities to the board, write descriptions, set dates, and see exactly how many students are signing up for your events.

I also built a full login and registration system so everyone gets their own private dashboard. 

## 🛠️ How I Built It (The Tech Side)

I wanted this app to be fast and modern, so here’s what I used:
*   I wrote the frontend using **React 18** and **Vite** (it is *so* much faster than Create React App).
*   For the design, I used **Tailwind CSS** and **shadcn/ui**. I really wanted it to look polished and professional, not just like a standard school project!
*   To handle data loading without making the UI freeze up, I used **React Query**.

### The "Database" Trick
Because this is meant to be a lightweight frontend project that anyone can run instantly, I didn't want people to have to set up Postgres or MongoDB just to test it out. 

Instead, I built a custom mock-backend that uses the browser's `localStorage` to save all the users, activities, and registrations! It literally acts like a real database. It even has artificial network delays built in so you can see the loading animations. 

*(Oh, and if the data gets messy while you're testing, I added a version-checker that automatically wipes the old data and gives you a fresh start!)*

## 🚀 Try It Out!

If you want to pull this down and run it on your own machine, it takes like 30 seconds. All you need is Node.js installed.

1. Clone it down:
   ```bash
   git clone https://github.com/2400031249Gowtham/FullStack_Final_Project.git
   cd FullStack_Final_Project
   ```

2. Install the packages:
   ```bash
   npm install
   ```

3. Fire it up:
   ```bash
   npm run frontend
   ```
   *Your browser should pop open at `http://localhost:5173`.*

## 🧪 Don't want to make an account?

No problem! I seeded the database with some fake accounts so you can jump right in.

Try logging in as an admin to see how event creation works:
*   **Username:** `admin`
*   **Password:** `password123`

Or log in as a student to see the dashboard:
*   **Username:** `student`
*   **Password:** `password123`

---
*Feel free to poke around the code, break things, or reach out if you have any questions about how I built this!*
