This is my implementation of the Fenrir Security frontend internship task. I have built a fully functional React application that recreates the provided design reference with a focus on clean code and responsiveness.

🚀 Live Links
Live Demo: https://fenrir-task-pi.vercel.app/

Video Walkthrough (Loom): https://www.loom.com/share/e78ad4e356b3413ea8346b42dd4ee993

🛠️ How I Built This
I used React 18 with Vite for a fast development experience. For styling, I chose Tailwind CSS to handle the complex layout and theme switching.

Main Tech Stack:

Framework: React.js

Routing: React Router DOM (for page navigation and protected routes)

Icons: Lucide-React

Animations: Framer Motion (for smooth transitions)

✨ Features Implemented
User Authentication: I implemented a login/signup flow with protected routes. You cannot access the dashboard without "logging in" first.

Global Theme Toggle: A working Dark and Light mode. I used localStorage so the theme stays the same even if you refresh the page.

Live Scan Dashboard: I created a dashboard that shows all scans. You can search for scans and filter them by status (Completed, Scheduled, Failed).

Interactive Scan Details: When you click on a scan, it opens a detailed view with a live-typing terminal log and vulnerability findings.

Fully Responsive: I made sure the sidebar turns into a hamburger menu on mobile devices (375px) so it doesn't look cramped.

📁 Project Structure
src/pages: Contains the main screens (Signup, Login, Dashboard, ScanDetail).

src/components: Reusable UI elements like Sidebar and Status Badges.

src/context: Handles the global theme state.

src/data: Mock data used for the scan entries.

🏃 How to Run Locally
Clone this repository to your machine.

Open the terminal in the project folder.

Run npm install to get the dependencies.

Run npm run dev to start the local server.