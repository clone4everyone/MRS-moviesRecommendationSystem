# CineReview - Movie Review Platform

A full-stack movie review platform built with React, Redux, Node.js, Express, and MongoDB. Users can browse movies, write reviews, rate films, and maintain personal watchlists.

## 🎬 Features

### Frontend
- **Home Page**: Featured movies and trending films with hero section
- **Movie Browsing**: Advanced search and filtering by genre, year, and rating
- **Movie Details**: Comprehensive movie information with trailers, cast, and reviews
- **User Authentication**: Secure login and registration system
- **Review System**: Star ratings and detailed text reviews
- **Watchlist**: Personal movie collection management
- **User Profiles**: Review history and personalized dashboards
- **Responsive Design**: Optimized for all devices

### Backend
- **RESTful API**: Complete movie and user management endpoints
- **Authentication**: JWT-based secure authentication
- **Data Validation**: Comprehensive input validation with Joi
- **Rate Limiting**: Protection against abuse
- **Security**: Helmet.js for security headers
- **Database**: MongoDB with Mongoose ODM

## 🛠 Technology Stack

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Joi** - Validation
- **Helmet** - Security

### APIs
- **TMDB API** - Movie data and images

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- TMDB API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cinereview
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Environment Setup**
   
   Create `backend/.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cinereview
   JWT_SECRET=your_super_secret_jwt_key
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

5. **Update TMDB API Key**
   
   Replace the demo API key in `src/services/tmdb.js` with your actual TMDB API key:
   ```javascript
   const TMDB_API_KEY = 'your_tmdb_api_key_here';
   ```

6. **Start the application**
   ```bash
   # From root directory
   npm run full-dev
   ```
   
   Or run separately:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

## 📁 Project Structure

```
cinereview/
├── src/                          # Frontend source code
│   ├── components/               # Reusable React components
│   ├── pages/                    # Page components
│   ├── store/                    # Redux store and slices
│   ├── services/                 # API services
│   └── main.jsx                  # App entry point
├── backend/                      # Backend source code
│   ├── models/                   # Mongoose models
│   ├── routes/                   # Express routes
│   ├── middleware/               # Custom middleware
│   └── server.js                 # Server entry point
└── public/                       # Static assets
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies` - Get movies with pagination/filtering
- `GET /api/movies/:id` - Get specific movie details
- `POST /api/movies` - Add movie (admin only)
- `GET /api/movies/:id/reviews` - Get movie reviews
- `POST /api/movies/:id/reviews` - Submit movie review

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/reviews` - Get user's reviews

### Watchlist
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add movie to watchlist
- `DELETE /api/watchlist/:movieId` - Remove from watchlist

## 🎨 Design Features

- **Dark Cinema Theme**: Elegant dark design with purple and gold accents
- **Responsive Layout**: Mobile-first design with smooth transitions
- **Interactive Elements**: Hover effects, animations, and micro-interactions
- **Typography Hierarchy**: Clear content structure with readable fonts
- **Visual Feedback**: Loading states, error handling, and success messages

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting protection
- CORS configuration
- Security headers with Helmet.js
- Protected routes and admin controls

## 🚀 Deployment

The application can be deployed to various platforms:

### Frontend (Netlify, Vercel, etc.)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder

### Backend (Heroku, Railway, etc.)
1. Set environment variables
2. Deploy the `backend` folder
3. Ensure MongoDB connection

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cinereview
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## 🧪 Testing

Run tests:
```bash
cd backend && npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)