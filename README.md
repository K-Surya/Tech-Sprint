# Benchmate AI 🎓

**Benchmate AI** is an advanced, AI-powered lecture companion designed to help students transform messy lecture audio into structured, study-ready content instantly. Built for the modern student, it leverages cutting-edge AI to filter the noise and deliver high-quality notes, quizzes, and flashcards.

---

## 🚀 Key Features

### 🎙️ Smart Lecture Recording
Capture live lectures directly through the web interface. Benchmate AI is optimized for classroom environments, focusing on the core content.

### 📝 AI-Generated Study Material
- **Instant Notes**: Automatically transcribes and summarizes lectures into clean, structured Markdown notes.
- **Dynamic Quizzes**: Generates relevant quiz questions from your lecture content to test your knowledge.
- **Automated Flashcards**: Creates study flashcards for quick revision and active recall.

### 📊 Learning Analytics
- **Learning Curve**: Visualize your progress and mastery over time with interactive charts.
- **Study Sessions**: Track your focus time with integrated study timers and session history.

### 📅 Seamless Integrations
- **Google Calendar**: Automatically sync your exams and study deadlines.
- **Google Drive**: Export and upload your generated notes directly to your Drive as PDFs.

### ✨ Premium Experience
- **Modern UI**: A stunning, high-performance interface with fluid animations (Powered by Three.js and Framer Motion).
- **Responsive Design**: Works seamlessly across desktops and tablets.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Animations**: Framer Motion, GSAP, Three.js
- **State Management**: React Hooks
- **Styling**: Vanilla CSS (Custom Glassmorphism Design)
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Environment**: Node.js & Express
- **AI Core**: Google Gemini (Generative AI)
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication


---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A Google Cloud Project (for Gemini API)
- A Firebase Project

### 1. Clone the Repository
```bash
git clone https://github.com/K-Surya/Tech-Sprint.git
cd Tech-Sprint
```

### 2. Backend Setup
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your credentials:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   # Add other required environment variables
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `app` directory:
   ```bash
   cd ../app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `firebase.js` with your Firebase project configuration.
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```text
Tech-Sprint/
├── app/                # Frontend React Application
│   ├── src/
│   │   ├── components/ # UI Components (Dashboard, Plasma, etc.)
│   │   ├── services/   # API Communication (api.js)
│   │   ├── assets/     # Static assets and images
│   │   └── App.jsx     # Main Application Entry
├── Backend/            # Node.js Backend Server
│   ├── src/
│   │   ├── server.js   # Server Entry Point
│   │   └── ...         # Service and Controller logic
```

---

## 📄 License

This project is built for the **GDG Hackathon**. Distributed under the MIT License.

---

## 📧 Contact
For support or inquiries, reach out at **benchmateai@gmail.com**
