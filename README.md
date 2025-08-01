# Uttar - Community Q&A Platform

Uttar is a comprehensive Question & Answer platform designed to offer an experience similar to Reddit, Stack Overflow, and other Q&A platforms, providing a space where people can ask real-world questions and get answers from the community. The platform features both user and admin interfaces with robust content management capabilities.

This project is divided into a modern frontend built with **React**, **Vite**, and **TailwindCSS**, and a powerful backend powered by **Node.js**, **Express.js**, **Sequelize ORM**, and **PostgreSQL**.

## 🚀 Features

### **User Features**

- **Question & Answer System** - Ask questions, provide detailed answers, and engage in discussions
- **User Authentication** - Secure login/registration system with JWT tokens
- **User Profiles** - View community member profiles and their contributions
- **User Search** - Find and connect with other community members
- **Content Management** - Manage your own posts and questions
- **Bookmarking System** - Save questions for later reference
- **Tag System** - Organize content with color-coded tags (admin=cyan, request=orange, general=gray)
- **Engagement Features** - Like questions, view counts, and comment system
- **Personal Dashboard** - Activity statistics and quick actions

### **Admin Features**

- **User Management** - Search, activate/deactivate users, promote to admin
- **Content Moderation** - Delete inappropriate posts and manage content
- **Advanced User Profiles** - Detailed user statistics and management tools
- **Admin Dashboard** - Comprehensive platform analytics and management
- **Role-Based Access Control** - Secure admin-only functionalities

### **Technical Features**

- **Responsive Design** - Mobile-friendly interface with TailwindCSS
- **Real-time Search** - Debounced search with live results
- **File Upload Support** - Image uploads for questions
- **Pagination** - Efficient content loading with limits
- **Error Handling** - Comprehensive error management
- **Security** - Protected routes and data validation

## 🛠️ Tech Stack

### **Frontend**

- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful and accessible UI components
- **React Router** - Client-side routing for SPA navigation
- **Axios** - HTTP client for API requests
- **Lucide React** - Clean and consistent icons

### **Backend**

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Sequelize ORM** - Database object-relational mapping
- **PostgreSQL** - Relational database management system
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing for security
- **Multer** - Middleware for file upload handling
- **Helmet** - Security middleware for Express
- **CORS** - Cross-origin resource sharing middleware

## 🚀 Frontend Setup (React + Vite + TailwindCSS)

To get the Uttar frontend up and running, follow these steps:

### Prerequisites

Before you begin, ensure you have one of the following package managers installed:

- **For Windows:**

  ```bash
  # Install Bun (recommended)
  winget install bun

  # Or install Node.js and npm
  winget install nodejs
  ```

- **For NixOS:**

  ```bash
  # Use Bun
  nix-shell -p bun

  # Or use Node.js
  nix-shell -p nodejs
  ```

- **For macOS:**

  ```bash
  # Install Bun
  curl -fsSL https://bun.sh/install | bash

  # Or install Node.js
  brew install node
  ```

- **For Linux (Ubuntu/Debian):**

  ```bash
  # Install Bun
  curl -fsSL https://bun.sh/install | bash

  # Or install Node.js
  sudo apt update && sudo apt install nodejs npm
  ```

### Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YourUsername/Uttar.git
   cd Uttar
   ```

2. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

3. **Install dependencies:**

   ```bash
   bun install
   # Or if using npm:
   # npm install
   ```

4. **Create environment configuration:**
   Create a `.env` file in the frontend directory:

   ```bash
   # Frontend environment variables
   VITE_API_BASE_URL=http://localhost:5000
   ```

5. **Start the development server:**

   ```bash
   bun dev
   # Alternatively:
   # bun run dev
   # Or for npm:
   # npm run dev
   ```

6. **Access the application:**
   - **Frontend:** `http://localhost:5173`
   - **Admin Panel:** `http://localhost:5173/admin`
   - **User Panel:** `http://localhost:5173/user`

## 🗄️ Backend Setup (Node.js + Express.js + PostgreSQL)

The backend handles API requests, database interactions, and authentication.

### Prerequisites

- **Node.js 18+** - Ensure Node.js is installed on your system
- **PostgreSQL 12+** - You'll need a PostgreSQL database instance running
- **Git** - Version control system

### Installation & Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   bun install
   # If you're using npm:
   # npm install
   ```

3. **Database Configuration:**

   Create a `.env` file in the `backend` directory with the following configuration:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=uttar_db
   DB_USER=your_username
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   # File Upload Configuration
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

4. **Database Setup:**

   ```bash
   # Create PostgreSQL database
   createdb uttar_db

   # Or using psql
   psql -U postgres -c "CREATE DATABASE uttar_db;"
   ```

5. **Database Migration/Sync:**
   The application uses Sequelize ORM and will automatically create tables on first run:

   ```bash
   # Optional: Manually sync database models
   bun run sync-db
   # Or for npm:
   # npm run sync-db
   ```

6. **Create Upload Directory:**

   ```bash
   mkdir uploads
   mkdir uploads/questions
   ```

7. **Start the backend server:**

   ```bash
   bun dev
   # Alternatively:
   # bun run dev
   # Or for npm:
   # npm run dev
   ```

8. **Verify backend is running:**
   - **API Health Check:** `http://localhost:5000/health`
   - **API Base URL:** `http://localhost:5000/api`

## 🎯 API Endpoints

### **Authentication**

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### **Questions**

- `GET /api/questions` - Get all questions (with pagination and limit support)
- `POST /api/questions` - Create new question
- `GET /api/questions/:id` - Get specific question with details
- `PUT /api/questions/:id` - Update question (author only)
- `DELETE /api/questions/:id` - Delete question (author only)
- `POST /api/questions/:id/like` - Toggle question like
- `POST /api/questions/:id/bookmark` - Toggle question bookmark
- `POST /api/questions/:id/view` - Track question view

### **Comments**

- `GET /api/comments/:questionId` - Get comments for a question
- `POST /api/comments` - Create new comment
- `PUT /api/comments/:id` - Update comment (author only)
- `DELETE /api/comments/:id` - Delete comment (author only)
- `POST /api/comments/:id/like` - Toggle comment like

### **User Management**

- `GET /api/users/search` - Search users (public)
- `GET /api/users/:id` - Get user profile (public)
- `GET /api/users/:id/posts` - Get user posts (public)
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update current user profile

### **Admin Routes**

- `GET /api/admin/users/search` - Search users (admin only)
- `GET /api/admin/users/:id` - Get detailed user profile (admin only)
- `GET /api/admin/users/:id/posts` - Get user posts (admin only)
- `PUT /api/admin/users/:id/activate` - Activate user account
- `PUT /api/admin/users/:id/deactivate` - Deactivate user account
- `PUT /api/admin/users/:id/promote` - Promote user to admin
- `PUT /api/admin/users/:id/demote` - Demote admin to user
- `DELETE /api/admin/posts/:id` - Delete any user's post

### **Dashboard & Analytics**

- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/tags` - Get all available tags

## 📁 Project Structure

```
Uttar/
├── frontend/
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   └── ui/            # Shadcn/ui components
│   │   ├── layouts/           # Layout components
│   │   │   ├── AdminLayout.jsx
│   │   │   └── DeveloperLayout.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Admin/         # Admin-specific pages
│   │   │   │   ├── AdminHome.jsx
│   │   │   │   ├── AdminSearchUsers.jsx
│   │   │   │   └── AdminUserProfile.jsx
│   │   │   ├── User/          # User-specific pages
│   │   │   │   ├── UserHome.jsx
│   │   │   │   ├── UserSearchUsers.jsx
│   │   │   │   └── UserProfile.jsx
│   │   │   └── Auth/          # Authentication pages
│   │   ├── lib/               # Utility functions
│   │   │   └── utils.js
│   │   ├── styles/            # Global styles
│   │   └── App.jsx            # Main application component
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env                   # Environment variables
├── backend/
│   ├── controllers/           # Route controllers
│   │   ├── authController.js
│   │   ├── questionController.js
│   │   ├── commentController.js
│   │   ├── dashboardController.js
│   │   ├── adminUserController.js
│   │   └── userController.js
│   ├── models/                # Database models
│   │   ├── User.js
│   │   ├── Question.js
│   │   ├── Comment.js
│   │   ├── QuestionLike.js
│   │   ├── QuestionView.js
│   │   ├── Bookmark.js
│   │   ├── Tag.js
│   │   └── associations.js
│   ├── routes/                # API routes
│   │   ├── auth.js
│   │   ├── question.js
│   │   ├── comments.js
│   │   ├── dashboard.js
│   │   ├── adminUsers.js
│   │   ├── adminPosts.js
│   │   ├── users.js
│   │   ├── profile.js
│   │   └── tags.js
│   ├── viable/                # Middleware & utilities
│   │   ├── authMiddleware.js
│   │   └── db.js
│   ├── uploads/               # File uploads directory
│   │   └── questions/
│   ├── package.json
│   ├── app.js                 # Express app configuration
│   ├── server.js              # Server entry point
│   └── .env                   # Environment variables
└── README.md
```

## 🎨 UI Features & Design System

### **Color Scheme**

- **Primary Theme:** Cyan (`#06b6d4`) - Used throughout user interface
- **Tag Color Coding:**
  - **Admin tags:** Red background (`bg-cyan-100 text-cyan-800`)
  - **Request tags:** Blue background (`bg-orange-100 text-orange-800`)
  - **General tags:** Gray background (`bg-gray-100 text-gray-600`)

### **User Experience**

- **Responsive Design** - Mobile-first approach with TailwindCSS
- **Real-time Search** - 500ms debounced search with live results
- **Loading States** - Smooth loading animations with spinners
- **Error Handling** - User-friendly error messages with auto-dismiss
- **Navigation** - Clear routing between admin (`/admin/*`) and user (`/user/*`) sections
- **Accessibility** - Screen reader friendly components and proper contrast

### **Key Components**

- **Dashboard Cards** - Statistics display with hover effects
- **User Cards** - Profile information with avatar generation
- **Question Cards** - Clickable post previews with engagement metrics
- **Search Interface** - Real-time search with filtering capabilities
- **Admin Controls** - Role-based action buttons and management interfaces

## 🔧 Development Scripts

### **Frontend**

```bash
bun dev          # Start development server
bun build        # Build for production
bun preview      # Preview production build
bun lint         # Run ESLint (if configured)
```

### **Backend**

```bash
bun dev          # Start development server with auto-reload
bun start        # Start production server
bun sync-db      # Manually sync database models
bun test         # Run tests (if configured)
```

## 🚀 Production Deployment

### **Environment Variables**

Ensure all environment variables are properly configured for production:

```env
# Production Backend Configuration
NODE_ENV=production
JWT_SECRET=your_very_secure_production_jwt_secret
DB_HOST=your_production_db_host
DB_NAME=uttar_production
FRONTEND_URL=https://yourdomain.com

# Production Frontend Configuration
VITE_API_BASE_URL=https://api.yourdomain.com
```

### **Security Considerations**

- Use strong, unique JWT secrets in production
- Enable HTTPS for all connections
- Configure proper CORS origins
- Implement rate limiting on API endpoints
- Regular security updates for dependencies
- Secure file upload validation and sanitization

## 🎯 Key Features Explained

### **User vs Admin Functionality**

**User Features:**

- View-only access to other users' profiles (no email visible)
- Can search and connect with community members
- Manage their own posts only
- Access to public user search (`/api/users/search`)

**Admin Features:**

- Full user management capabilities
- Can activate/deactivate user accounts
- Can promote users to admin role
- Can delete any user's posts
- Access to admin-only endpoints (`/api/admin/*`)
- View sensitive user information (emails, detailed stats)

### **Question Management**

- **5 questions limit** on dashboard latest questions display
- **Pagination support** for large question sets
- **Tag-based organization** with visual color coding
- **Engagement tracking** with likes, views, and comments
- **File upload support** for question images

### **Search Functionality**

- **Debounced search** (500ms delay) for optimal performance
- **Multi-field search** across username, email, first name, last name
- **Real-time results** with loading states
- **Role-based filtering** (admin vs public search)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** for beautiful and accessible UI components
- **TailwindCSS** for utility-first CSS framework
- **Lucide React** for clean and consistent icons
- **PostgreSQL** for reliable database management
- **Sequelize** for powerful ORM capabilities

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/YourUsername/Uttar/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

**Built with ❤️ for the developer community**
