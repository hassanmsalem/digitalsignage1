# Digital Signage Platform

A full-stack digital signage platform built with React, TypeScript, and Node.js/Express.

## Features

### Backend (Node.js + Express)
- RESTful API with Express server
- File upload handling with Multer
- JSON file-based database storage
- CORS support for cross-origin requests
- Public display endpoints (no authentication required)

### Frontend (React + TypeScript)
- Modern React with TypeScript and Vite
- React Context for state management
- React Router for navigation
- Responsive design with Tailwind CSS
- File upload capabilities
- Real-time data synchronization

### Core Functionality
- **Screens**: Create and manage digital display screens
- **Playlists**: Organize content into playlists with customizable durations
- **Content**: Upload images, videos, text, and URL content
- **Display**: Public display pages for screens (accessible without login)

## API Endpoints

### Screens
- `GET /api/screens` - Get all screens
- `GET /api/screens/:id` - Get specific screen
- `POST /api/screens` - Create new screen
- `PATCH /api/screens/:id` - Update screen
- `DELETE /api/screens/:id` - Delete screen

### Playlists
- `GET /api/playlists` - Get all playlists
- `GET /api/playlists/:id` - Get specific playlist
- `POST /api/playlists` - Create new playlist
- `PATCH /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist

### Content
- `GET /api/content` - Get all content
- `GET /api/content/:id` - Get specific content
- `POST /api/content` - Create new content (with file upload)
- `PATCH /api/content/:id` - Update content (with file upload)
- `DELETE /api/content/:id` - Delete content

### Display
- `GET /api/display/:id` - Get display data for screen (public endpoint)

### File Serving
- `GET /uploads/:filename` - Serve uploaded files

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start both frontend and backend with a single command:
```bash
npm run dev
```

This will start:
- Backend server on port 5000
- Frontend development server on port 3000

### Network Access
The application is configured to work across your local network:
- Backend: `http://<your-ip>:5000`
- Frontend: `http://<your-ip>:3000`

Access the display pages from any device on your network using:
`http://<your-ip>:3000/display/<screen-id>`

### Build for Production
```bash
npm run build
```

## Project Structure

```
├── server/                 # Backend Express server
│   ├── server.js          # Main server file
│   └── db.json            # JSON database (auto-created)
├── src/                   # Frontend React application
│   ├── components/        # Reusable components
│   ├── contexts/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # API service layer
│   └── App.tsx           # Main App component
├── uploads/              # Uploaded files directory (auto-created)
└── package.json          # Dependencies and scripts
```

## Usage

### Admin Dashboard
1. Navigate to the admin dashboard at `http://localhost:3000`
2. Create content (images, videos, text, URLs)
3. Organize content into playlists
4. Create screens and assign playlists
5. Use the display URL for each screen on your digital displays

### Display Pages
- Access display pages at `/display/:screenId`
- Display pages are public (no authentication required)
- Content automatically cycles based on playlist settings
- Data refreshes every 30 seconds

## Configuration

### Environment Variables
- `PORT` - Backend server port (default: 5000)
- `VITE_API_URL` - Frontend API base URL (default: http://localhost:5000)

### File Upload Limits
- Maximum file size: 100MB
- Supported formats: Images and videos
- Files are stored in the `uploads/` directory

## Security Notes
- Display endpoints are intentionally public for kiosk/display use
- File uploads are restricted to images and videos only
- CORS is enabled for development (configure for production use)
- Consider implementing authentication for admin features in production

## Troubleshooting

### Common Issues
1. **Port conflicts**: Change ports in package.json scripts if needed
2. **Network access**: Ensure firewall allows connections on ports 3000 and 5000
3. **File uploads**: Check that the uploads directory has write permissions
4. **Database issues**: Delete db.json to reset the database (will lose all data)

### Development Tips
- The backend automatically creates necessary directories
- Database is automatically initialized on first run
- Hot reload is enabled for both frontend and backend during development
- Check browser console and server logs for detailed error messages