SeerBharat.org – Learning Management System (LMS)

A modern **Learning Management System** (LMS) built for **[SeerBharat.org](https://seerbharat.org)** to manage and deliver educational content securely.  
Developed with **Next.js (TypeScript)**, **MongoDB**, **Mongoose**, and **Cloudinary**, the system allows authorized admins to upload, edit, and delete learning materials — while keeping general users limited to viewing public content.

---

**-> Key Features**

**Secure Admin Authentication (OAuth)**
- Google OAuth login system.
- Only admin emails can upload/edit/delete content.
- Unauthorized users are redirected to the home page with authorization denied message.
- Sends **email notifications** to the admin whenever they successfully log in.

**Content Management**
- Upload **documents (PDF, DOCX, etc.)** and **videos (YouTube URLs)**.
- Edit or delete existing content easily.
- Store uploaded files using **Cloudinary** for optimized performance.

**User Access**
- Students and public users can view and stream uploaded content.
- Admin-only access for content modification.

**Tech Highlights**
- ⚡ Next.js 14 (App Router + TypeScript)
- 🧠 MongoDB + Mongoose ODM
- ☁️ Cloudinary file management
- 🔒 Google OAuth authentication
- 🎨 Tailwind CSS UI

---

## 🧰 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend Framework** | Next.js (TypeScript) |
| **Backend** | Node.js (API Routes in Next.js) |
| **Database** | MongoDB with Mongoose |
| **Authentication** | Google OAuth 2.0 |
| **Cloud Storage** | Cloudinary |
| **Styling** | Tailwind CSS |
| **Language** | TypeScript |
| **Version Control** | Git + GitHub |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/seerbharat-lms.git
cd seerbharat-lms
2️⃣ Install Dependencies
npm install

3️⃣ Set Up Environment Variables

Create a .env.local file in the root directory and add the following keys:
# Server
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=<your-mongodb-connection-string>
NEXTAUTH_SECRET=seerbharat_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Application
ADMIN_EMAILS=<comma-separated-admin-emails>

# Brevo
BREVO_API_KEY=<your-api-key>
BREVO_SENDER_EMAIL=<your-sender-email>

4️⃣ Run the Development Server
npm run dev


Open your browser at http://localhost:3000

🧑‍💻 Admin Authentication Logic

The app uses Google OAuth for login.

Upon login, user email is verified against the ADMIN_EMAILS list in .env.

Non-admin users are: Redirected to / (home page).