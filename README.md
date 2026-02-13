# Kanban Board – Frontend Assignment

This project is a simplified Kanban board built using React and Tailwind CSS. The main focus of the assignment was implementing Optimistic UI updates along with proper rollback handling for asynchronous operations.

## Features

- Mock Login (persists after refresh using localStorage)
- Three columns: To Do, In Progress, Done
- Add, Delete, and Drag & Drop tasks
- Simulated backend API with:
  - 1–2 second delay
  - 20% random failure rate
- Optimistic UI updates
- Automatic rollback on API failure
- Toast notifications for errors

---

## How to Run Locally

1. Clone the repository
2. Install dependencies:

   npm install

3. Start the development server:

   npm run dev

4. Open the local URL shown in terminal

---

## Optimistic UI Approach

For each action (add, move, delete), the UI updates immediately without waiting for the API response. Before updating, I store the previous state. If the mock API fails (20% failure simulation), the app shows a toast error and automatically rolls back to the previous state.

This ensures a fast and responsive experience while maintaining data consistency.

---

## Trade-offs

Due to the 24-hour constraint, I kept the state logic inside the main Board component instead of extracting it into a separate global store. In a larger production application, I would use Zustand or Redux for better scalability and separation of concerns.
