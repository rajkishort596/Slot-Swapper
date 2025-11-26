# Slot Swapper 🗓️

A full-stack MERN application that enables users to swap their assigned event slots with other users through an intuitive request-based system.

## 🚀 Features

### 🔐 Authentication & Security

- User registration & login with JWT tokens
- Secure password hashing with bcrypt
- Protected routes requiring authentication
- Refresh token mechanism for extended sessions
- HTTP-only cookies for token storage

### 📅 Event & Slot Management

- Create, edit, and delete personal events
- Mark events as **BUSY** or **SWAPPABLE**
- View all personal calendar events
- Browse other users' available swappable slots
- Real-time event status management

### 🔁 Smart Swap Request System

- Send swap requests with custom slot offerings
- Incoming requests tab (receive swap proposals)
- Outgoing requests tab (track sent proposals)
- Accept or reject swap requests
- Automatic slot ownership transfer on acceptance
- Request status tracking (PENDING, ACCEPTED, REJECTED)

### 🎨 Modern UI/UX

- Built with React + Vite for optimal performance
- Tailwind CSS for responsive design
- Lucide icons for intuitive visuals
- Real-time toast notifications
- Modal dialogs for confirmations
- Mobile-friendly navigation

## 🏗️ Tech Stack

### Frontend

- **Framework:** React 19 + Vite 7
- **State Management:** Redux Toolkit
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS 4.1
- **Form Handling:** React Hook Form
- **UI Components:** Lucide React
- **Notifications:** React Toastify
- **Routing:** React Router v7

### Backend

- **Runtime:** Node.js (v18+)
- **Server:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcrypt for password hashing, CORS
- **Middleware:** Cookie parser, error handling

### Deployment

- **Frontend:** Vercel
- **Backend:** Render

## 📁 Project Structure

```
Slot Swapper/
├── client/
│   ├── src/
│   │   ├── api/              # API calls (auth, events, swaps)
│   │   ├── components/       # Reusable React components
│   │   │   ├── Header/
│   │   │   ├── Modal/        # EventModal, DeleteModal, OfferSlotModal
│   │   │   └── PrivateRoute.jsx
│   │   ├── features/         # Redux slices (authSlice)
│   │   ├── layouts/          # RootLayout with auth hydration
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Marketplace.jsx
│   │   │   ├── SwapRequests.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── app/              # Redux store configuration
│   │   ├── App.jsx           # Main router setup
│   │   ├── axios.js          # Axios instance config
│   │   └── index.css         # Global styles
│   ├── vite.config.js
│   └── vercel.json           # Vercel SPA routing config
│
└── server/
    ├── src/
    │   ├── controllers/      # Route handlers
    │   │   ├── user.controller.js
    │   │   ├── event.controller.js
    │   │   └── swap.controller.js
    │   ├── models/          # MongoDB schemas
    │   │   ├── user.model.js
    │   │   ├── event.model.js
    │   │   └── swapRequest.model.js
    │   ├── routes/          # API routes
    │   │   ├── user.routes.js
    │   │   ├── event.routes.js
    │   │   └── swap.routes.js
    │   ├── middlewares/     # Custom middlewares
    │   │   ├── auth.middleware.js
    │   │   └── errorHandler.middleware.js
    │   ├── utils/           # Helper functions
    │   │   ├── ApiError.js
    │   │   ├── ApiResponse.js
    │   │   ├── asyncHandler.js
    │   │   └── generateToken.js
    │   ├── db/             # Database connection
    │   ├── app.js          # Express app setup
    │   └── index.js        # Server entry point
    └── package.json
    └── package-lock.json
```

## 📡 API Endpoints

### User Routes (`/api/v1/users`)

| Method | Endpoint         | Auth | Description          |
| ------ | ---------------- | ---- | -------------------- |
| POST   | `/register`      | ❌   | Register new user    |
| POST   | `/login`         | ❌   | Login user           |
| GET    | `/me`            | ✅   | Fetch user profile   |
| POST   | `/logout`        | ✅   | Logout user          |
| POST   | `/refresh-token` | ❌   | Refresh access token |

### Event Routes (`/api/v1/events`)

| Method | Endpoint           | Auth | Description                 |
| ------ | ------------------ | ---- | --------------------------- |
| POST   | `/`                | ✅   | Create new event            |
| GET    | `/`                | ✅   | Get all user events         |
| GET    | `/swappable`       | ✅   | Get user's swappable events |
| GET    | `/:eventId`        | ✅   | Get event by ID             |
| PATCH  | `/:eventId`        | ✅   | Update event details        |
| PATCH  | `/:eventId/status` | ✅   | Update event status         |
| DELETE | `/:eventId`        | ✅   | Delete event                |

### Swap Routes (`/api/v1/swaps`)

| Method | Endpoint                    | Auth | Description                             |
| ------ | --------------------------- | ---- | --------------------------------------- |
| GET    | `/swappable-slots`          | ✅   | Get all swappable slots (others' slots) |
| POST   | `/swap-request`             | ✅   | Create swap request                     |
| POST   | `/swap-response/:requestId` | ✅   | Accept/Reject swap request              |
| GET    | `/incoming`                 | ✅   | Get incoming swap requests              |
| GET    | `/outgoing`                 | ✅   | Get outgoing swap requests              |

## 🧪 User Flow

1. **Authentication**

   - Sign up with email & password
   - Login to receive JWT tokens
   - Tokens stored in HTTP-only cookies

2. **Event Management**

   - Create events on your calendar
   - Mark events as BUSY or SWAPPABLE

3. **Discover & Request**

   - Browse Marketplace for swappable slots
   - Select your slot to offer in exchange
   - Send swap request

4. **Manage Requests**

   - View incoming swap proposals
   - Accept to complete the swap (ownership transfers)
   - Reject to unlock slots for other requests
   - Track outgoing requests

5. **Confirmation**
   - Accepted swaps immediately transfer slot ownership
   - Both slots marked as BUSY after swap
   - Rejected swaps reset slots to SWAPPABLE

## ⚙️ Installation & Setup

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

```bash
cd server
npm install

# Run development server
npm run dev

# Or production build
npm start
```

### Frontend Setup

```bash
cd client
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🔑 Environment Variables

### Server (`.env`)

```env
PORT=8000
MONGODB_URI=mongodb_url
ACCESS_TOKEN_SECRET=your_access_token_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
CORS_ORIGIN=frontend_url
NODE_ENV=development
```

### Client (`.env`)

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 🚀 Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Deploy on `main` branch push

### Deploy Frontend to Vercel

1. Import project from GitHub
2. Set `VITE_API_URL` environment variable
3. Configure build: `npm run build`
4. Output directory: `dist`
5. Deploy automatically

## 🔄 Key Features Implementation

### Authentication Flow

- JWT tokens with refresh mechanism
- HTTP-only secure cookies
- Role-based protected routes
- Auto user hydration on page refresh

### Event Swap Logic

- MongoDB transactions for data consistency
- Dual-slot locking during pending requests
- Atomic ownership transfer on acceptance
- Automatic status rollback on rejection

### Real-time Updates

- Toast notifications for user feedback
- Automatic UI refresh after state changes
- Optimistic UI updates where applicable

## 👨‍💻 Author

**Rajkishor Thakur**

---

## 🤝 Contributing

This is a demonstration project. For questions or improvements, please open an issue.
