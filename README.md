Thinklet - Article Feeds Web Application


--------Overview--------------

Thinklet is a full-stack web application for sharing and viewing articles based on user preferences. Users can sign up, log in, manage their profiles, create articles, view personalized feeds, like/dislike articles, and manage their own articles. The application follows an MVC architecture in the backend and is built using the MERN stack (MongoDB, Express.js, React.js, Node.js).
This repository contains the backend code. The frontend repository can be found here (replace with actual link).
Live Demo:

Frontend: www.thinklet.abdullhakalamban.online - vercel
Backend API: api.thinklet.abdullhakalamban.online - aws EC2

Note: Two features from the task specification are not implemented: password change and article editing (though article viewing, creation, deletion, and management are fully functional).


-----------------------Features--------------------------

-User registration with preferences (categories like sports, politics, etc.)
-Login using email or phone
-Personalized article feeds based on user preferences
-Article creation with title, description, thumbnail, tags, and category
-Article management (view, delete) in user dashboard
-Like, dislike, and block articles
-Profile management (edit personal info and preferences)
-Secure authentication with JWT and bcrypt
-Image uploads to AWS S3

-Responsive UI with Framer Motion animations
-Redux for state management
-Ant Design for UI components
-Zod for form validation
-Integration with backend APIs

-------------------------------------------------------------------------------

Tech Stack (Backend)

-Node.js: Runtime environment
-Express.js: Web framework
-MongoDB: Database (via Mongoose ODM)
-AWS S3: For storing thumbnails and profile images
-JWT: For authentication
-Bcrypt: For password hashing
-Multer : For file uploads and image processing
-Docker: For containerization
-Nginx: Reverse proxy for deployment
-Certbot: For SSL/TLS certificates
-TypeScript



Tech Stack (Frontend)

-React.js: UI library
-Redux & Redux Persist: State management
-Axios: API requests
-Tailwind CSS: Styling
-Framer Motion: Animations
-Ant Design: Components
-Zod: Validation
-Vite: Build tool


------------------------------------Setup (Local Development)------------------------- 

1 Clone the Repository
-https://github.com/abdullhaks/Thinklet-2025.git

-------Backend Setup-------

2 move to backend directory 
-cd backend
-npm install


3 Configure Environment Variables
MONGODB_URL=

PORT=3000

ACCESS_TOKEN_SECRET="thinklet_accesstokensecret"
REFRESH_TOKEN_SECRET="thinklet_refreshtokensecret"

MAX_AGE=604800000


AWS_REGION
AWS_BUCKET_NAME

TEST_URL=http://localhost:4173
DEV_URL=http://localhost:5173
VERCEL_URL=https://thinklet-2025.vercel.app/
DOMAIN_URL=https://www.thinklet.abdullhakalamban.online

CLIENT_URL=http://localhost:5173

4 run
-npm run dev

-npm run build
-npm start


-----------------Frontend Setup----------------

5 move to frontend directory
cd .\frontend\thinklet\
npm install

6 Configure Environment
VITE_API_URL=http://localhost:3000/api


7 run 
-npm run dev

-npm run build
-npm run prewview



---------------------Testing Procedures backend------------------

Unit Tests:

Currently, no automated tests are implemented. Manual testing is recommended.
Use Postman or Insomnia to test API endpoints (e.g., /signup, /login, /articleCreate).


Manual Testing:

Signup/Login: Test user registration and authentication.
Article Creation: Upload articles with thumbnails and verify S3 storage.
Feeds: Check personalized feeds based on preferences.
Profile Update: Test editing user details.
Error Handling: Simulate invalid inputs and check responses.


Tools:

MongoDB Compass for database inspection.
AWS S3 Console for verifying uploads.
Browser/Postman for API calls.



-----------------Testing Procedures frontend------------

Manual Testing:

Test UI components and flows: signup, login, dashboard, article creation.
Use browser dev tools for responsiveness.
Simulate API calls with backend running locally.


Tools:

React DevTools for component inspection.
ESLint for code quality: npm run lint.
Browser console for errors.




------------------Contributing-----------------------

Fork the repository.
Create a feature branch (git checkout -b feature/YourFeature).
Commit changes (git commit -m 'Add YourFeature').
Push to the branch (git push origin feature/YourFeature).
Open a Pull Request.


