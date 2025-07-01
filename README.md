# Messaging-Slack Backend

**Messaging-Slack** is the backend API for a real-time Slack-like team messaging platform. It supports workspace creation, channel/DM communication, media sharing, user roles, notifications, and email workflows.

Built using **Node.js**, **Express.js**, **MongoDB**, **Redis**, and **Socket.IO**, this API enables scalable, event-driven communication between users.

🔗 **Frontend Repository**: [https://github.com/Roshan21p/Messaging-Slack-Frontend](https://github.com/Roshan21p/Messaging-Slack-Frontend)  
🔗 **Live Backend URL**: [https://messaging-slack-backend.onrender.com/connect-db](https://messaging-slack-backend.onrender.com/connect-db) <br/>
🔗 **BullMQ Dashboard**: [https://messaging-slack-backend.onrender.com/ui](https://messaging-slack-backend.onrender.com/ui)

> ⚠️ Render may take 40–50 seconds to wake up if idle.

---

##  Features

- **User Authentication** with JWT
- **Role-based Access Control** (Admin / Member)
- **Real-time messaging** using Socket.IO
- **Direct and Channel Messaging**
- **Typing Indicators** and **Online Presence**
- **Event-driven communication** between users
- **Email Notifications** via **BullMQ + Redis**
- **Channel creation/edit/delete** notifications via email
- **Workspace & Channel management**
- **Add/Remove/Invite Users**
- **Upload media** to Cloudinary
- **Swagger API Docs** and **Postman Collection**
- **Queue Dashboard** via BullMQ UI
- **Centralized Error Handling**
- **Modular architecture**
---

## Architecture Highlights

- **Event-driven design** using **Socket.IO** for real-time chat
- **Email Queue System**: Events like channel creation or deletion trigger jobs added to Redis using **BullMQ**
- Email jobs are processed in the background to avoid blocking the main thread
- **Swagger** for interactive API testing and documentation

---
## Technologies Used
- **Node.js**
- **Express.js**
- **MongoDB** with Mongoose
- **Socket.IO**
- **Redis + BullMQ** (Message Queue)
- **Cloudinary**
- **Nodemailer**
- **Swagger** (API Documentation)
- **Zod** (for input validation)
- **JWT** (Authentication)

## 💻 How to Run Locally
### 1. Clone the repository

```bash
git clone https://github.com/Roshan21p/Messaging-Slack-Backend.git
cd Messaging-Slack-Backend
```
### 2. Install dependencies
```bash
npm install
```
### 3. To run the project, use the following command
```bash
npm start
```
### 4 Backend .env
Create a .env file in the root of Messaging-Slack-Backend
```bash
PORT=3000
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000/api/v1

# Add your actual credentials below:
DEV_DB_URL=mongodb+srv://<your-mongo-credentials>.oqsvz.mongodb.net/slack?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=your_jwt_secret
JWT_EXPIRY=expiry_time

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

REDIS_PORT=6379
REDIS_HOST=localhost || 127.0.0.1

MAIL_ID=your_email
MAIL_PASSWORD=your_email_password
```
---

## 📪 API Documentation

- 📘 **Swagger Docs**:  
  Visit [https://messaging-slack-backend.onrender.com/api-docs](https://messaging-slack-backend.onrender.com/api-docs) to explore and test the API interactively.

- 📁 **Postman Collection (GitHub)**:  
  [View or Download Messaging-Slack.postman_collection.json](https://github.com/Roshan21p/Messaging-Slack-Backend/blob/main/Message%20Slack%20APIs.postman_collection.json)

> ⚙️ This collection includes routes for:
> Users, Workspaces, Channels, Messages and Message Status.

> Make sure the base URL is:
   - `http://localhost:3000/api/v1` for local testing, or  
   - `https://messaging-slack-backend.onrender.com/api/v1` for production.

---
