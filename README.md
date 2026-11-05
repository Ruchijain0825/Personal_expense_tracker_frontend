# 💰 SpendWise – Personal Expense Tracker

**SpendWise** is a personal finance management application designed to help users track their income and expenses, analyze spending patterns, and manage their finances more efficiently.

The application combines traditional expense tracking with AI-powered transaction entry, allowing users to add transactions manually or simply describe them using natural language.

🎯 **Goal:** Make personal finance tracking simpler, smarter, and more organized.

---

## 🚀 Live Demo

- **Frontend:** [SpendWise Live Application](https://personal-expense-tracker-frontend-j.vercel.app/)
- **Backend:** [Backend API](https://personal-expense-tracker-backend-an8c.onrender.com)

---

## ✨ Features

### 1. 🔐 User Authentication
- User registration and login.
- JWT-based authentication.
- Protected application routes.
- Individual user financial records.

### 2. 📊 Financial Dashboard
- Overview of total income and expenses.
- Available balance summary.
- Financial activity visualization.
- Quick access to transaction information.

### 3. 💸 Manual Transaction Management
- Add income and expense transactions.
- Enter amount, category, description, and date.
- Store and manage financial records.
- Maintain transaction history.

### 4. 🤖 AI Smart Entry
One of the key features of SpendWise.

Users can describe their transactions in natural language instead of filling out multiple form fields.

**Example:**

```text
Spent 750 rupees on dinner yesterday.
```

The AI-powered workflow extracts structured transaction information, such as:
- Transaction type
- Amount
- Category
- Description
- Date

**AI Preview Flow:**

1. User enters a natural language description.
2. AI processes the input.
3. Structured transaction details are generated.
4. User reviews and edits the preview.
5. User confirms and saves the transaction.
6. Confirmed data is stored in the database.

The preview and confirmation step gives users control over AI-generated information before saving it.

### 5. 📅 Expense Calendar
- Month-wise calendar view.
- View financial activities by date.
- Identify days with recorded transactions.
- Review transactions for a selected date.

### 6. 📈 Reports and Analytics
- Expense distribution through pie charts.
- Monthly income and expense comparison.
- Visual representation of spending patterns.
- Better understanding of financial activities.

### 7. 📋 Transaction History
- View recorded transactions.
- Maintain a centralized financial history.
- Access transaction information for financial review.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| API Communication | Axios |
| Charts | Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT |
| AI Integration | LangChain Expression Language (LCEL), Groq |
| Deployment | Vercel, Render |

---

## 🏗️ Application Architecture

```text
                 USER
                   |
                   v
          React + Vite Frontend
                   |
                   v
             Axios API Calls
                   |
                   v
          Node.js + Express API
                   |
          +--------+--------+
          |                 |
          v                 v
      MongoDB          AI Processing
                            |
                       LangChain
                            |
                          Groq
                            |
                            v
                    Structured Output
                            |
                            v
                     User Preview
                            |
                            v
                    User Confirmation
                            |
                            v
                         MongoDB
```

---

## 📂 Project Structure

```text
PersonalExpenseTracker/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── Pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ManualEntry.jsx
│   │   │   ├── AiExpenseEntry.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Calendar.jsx
│   │   │   ├── ExpensePieChart.jsx
│   │   │   └── MonthlyBarChart.jsx
│   │   │
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── services/
│
├── app.js
├── server.js
├── package.json
└── README.md
```

---

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB database
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Ruchijain0825/Personal_expense_tracker_backend.git

cd PersonalExpenseTracker
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Configure Backend Environment Variables

Create a `.env` file in the backend root directory.

```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173
```

### 4. Start the Backend

```bash
npm run dev
```

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

### 6. Configure Frontend Environment Variables

Create a `.env` file inside the `client` directory.

```env
VITE_API_URL=http://localhost:8080
```

### 7. Start the Frontend

```bash
npm run dev
```

Open the application at:

```text
http://localhost:5173
```

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGODB_URI` | MongoDB connection string |
| `GROQ_API_KEY` | API key for Groq AI integration |
| `CLIENT_URL` | Frontend origin allowed by backend CORS |
| `VITE_API_URL` | Backend API base URL used by frontend |

**Security:** Never commit `.env` files or expose secret API keys in frontend code or public repositories.

---

## 🧠 Key Learning Outcomes

Building SpendWise helped me gain practical experience in:

- Developing full-stack applications using React and Node.js.
- Designing and integrating REST APIs.
- Implementing JWT-based authentication.
- Managing application data using MongoDB and Mongoose.
- Integrating AI into an existing application workflow.
- Processing natural language into structured data.
- Building interactive charts and dashboards.
- Managing frontend-backend communication.
- Deploying applications using Vercel and Render.

---

## 🔮 Future Improvements

Some improvements I would like to explore:

- Monthly budget planning and spending limits.
- Smart expense insights and recommendations.
- Downloadable financial reports.
- Recurring transaction management.
- More advanced financial analytics.

---

## 👩‍💻 Developer

**Ruchi Jain**

Full Stack Developer | React.js | Node.js | Express.js | MongoDB | AI Integration

- GitHub: [Ruchijain0825](https://github.com/Ruchijain0825)
- LinkedIn: https://www.linkedin.com/in/ruchi-jain-31ab4738b

---

⭐ If you find this project useful, consider giving it a star!

**Built with ❤️ and continuous learning.**
