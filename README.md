# HD Notes - Full Stack Note Taking Application

A modern, full-stack note-taking application built with React TypeScript frontend and Node.js/Express backend, featuring user authentication, real-time note management, and email notifications.

## 🚀 Features

- **User Authentication**: JWT-based authentication with email OTP verification
- **Note Management**: Create, read, update, and delete notes with rich text support
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Instant synchronization across devices
- **Email Notifications**: OTP verification and notification system
- **Modern UI**: Clean, intuitive interface with toast notifications

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **React Hook Form** for form handling
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Nodemailer** for email services
- **CORS** enabled for cross-origin requests

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** for version control

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backEnd
npm install
```

### 3. Environment Configuration (Backend)

Copy the environment example file and configure your variables:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/notetaking

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Note**: For Gmail, you'll need to:
1. Enable 2-factor authentication on your Google account
2. Generate an App Password for the EMAIL_PASS field

### 4. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontEnd
npm install
```

### 5. Environment Configuration (Frontend)

Configure the frontend environment variables:

```bash
cp env.example .env
```

Update the `.env` file:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# App Configuration
REACT_APP_NAME=HD Notes
REACT_APP_VERSION=1.0.0
```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend** (Terminal 1):
```bash
cd backEnd
npm run dev
```
The backend will start on `http://localhost:5000`

2. **Start the Frontend** (Terminal 2):
```bash
cd frontEnd
npm start
```
The frontend will start on `http://localhost:3000`

### Production Mode

1. **Build the Frontend**:
```bash
cd frontEnd
npm run build
```

2. **Start the Backend**:
```bash
cd backEnd
npm start
```

## 🧪 Testing

### Backend Tests
```bash
cd backEnd
npm test
```

### Frontend Tests
```bash
cd frontEnd
npm test
```

## 📁 Project Structure

```
hogh/
├── backEnd/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic services
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Main server file
│   ├── .env                # Environment variables
│   ├── package.json        # Dependencies and scripts
│   └── ...
├── frontEnd/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── App.tsx         # Main App component
│   │   └── index.tsx       # Entry point
│   ├── public/             # Static files
│   ├── .env                # Environment variables
│   ├── package.json        # Dependencies and scripts
│   └── ...
└── README.md
```

## 🔌 API Endpoints

The backend provides the following main endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## 🚀 Deployment

### Frontend Deployment

The frontend is a standard React app that can be deployed to:
- **Netlify**
- **Vercel**
- **GitHub Pages**
- **AWS S3 + CloudFront**

Build the production version:
```bash
cd frontEnd
npm run build
```

### Backend Deployment

The backend can be deployed to:
- **Heroku**
- **DigitalOcean**
- **AWS EC2**
- **Railway**
- **Render**

Make sure to configure production environment variables in your deployment platform.

## 🔒 Security Notes

- Change JWT_SECRET in production
- Use strong passwords for email configuration
- Enable HTTPS in production
- Never commit .env files to version control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or need help:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Updates

- Backend runs on port 5000
- Frontend runs on port 3000
- MongoDB default connection: `mongodb://localhost:27017/notetaking`

For production, update the MongoDB URI in the backend `.env` file to point to your production database.

---

**Happy Note Taking! 📝**
