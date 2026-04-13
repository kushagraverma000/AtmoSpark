# 🌍 AtmoSpark — Climate Decision Intelligence System

> Turning climate data into real-time decisions for safer living.

---

## 🚀 Overview

AtmoSpark is a **climate decision intelligence platform** that transforms real-time environmental data into **actionable insights**.

Instead of just displaying weather data, AtmoSpark helps users answer:

> ❓ *“What should I do right now based on current climate conditions?”*

It is designed especially for **climate-vulnerable populations**, where timely decisions can directly impact safety, health, and livelihood.

---

## ✨ Features

- 📍 **Location-Based Insights**  
  Enter any city and get real-time climate data

- ⚠️ **Climate Risk Score (0–100)**  
  Intelligent scoring based on temperature and humidity

- 🚨 **Real-Time Alerts**  
  Detects unsafe environmental conditions

- ✅ **Actionable Recommendations**  
  Provides clear, practical guidance (not just data)

- 💬 **Smart Assistant**  
  Scenario-based responses tailored to real-world situations

- 🎯 **Interactive UI**  
  Clean, modern dashboard with smooth animations

---

## 🧠 Problem Statement

Climate data is widely available—but **not actionable**.

People often struggle to interpret:
- When it’s safe to work outdoors  
- When conditions are risky for children or elderly  
- How to respond to extreme heat or environmental stress  

AtmoSpark bridges this gap by converting **data → decisions**.

---

## 💡 Solution

AtmoSpark processes real-time environmental data and:

1. Calculates a **risk score**
2. Generates **alerts**
3. Suggests **practical actions**
4. Enables **interactive decision support**

---

## ⚙️ Tech Stack

- **Frontend:** React, Vite, TypeScript  
- **Styling:** Tailwind CSS  
- **Animations:** Framer Motion  
- **APIs:** OpenWeather API  
- **Deployment:** Vercel  

---

## 🏗️ Architecture

User Input (City)
↓
Weather API (Real-time data)
↓
Risk Engine (Custom logic)
↓
Insights Generator (Alerts + Actions)
↓
UI Dashboard + Chat Assistant


---

## 🖥️ Screenshots

> *<img width="1470" height="956" alt="Screenshot 2026-04-12 at 5 02 56 PM" src="https://github.com/user-attachments/assets/02aaf96d-b416-4535-ab49-cd45b9874a01" />*

- Dashboard View  
- Risk Score Visualization  
- Alerts & Recommendations  
- Chat Assistant  

---

## 🚀 Getting Started

### 1. Clone the repository

bash
git clone https://github.com/kushagraverma000/AtmoSpark
cd atmospark

2. Install dependencies
npm install

4. Add environment variables

Create a .env file:

VITE_WEATHER_API_KEY=your_openweather_api_key
VITE_OPENROUTER_API_KEY=your_openrouter_key

4. Run locally
npm run dev
5. Build for production
npm run build
🌐 Live Demo

atmo-spark.vercel.app

📊 Impact

AtmoSpark is designed to support:

🌾 Farmers and outdoor workers
🏙️ Urban populations facing extreme heat
👨‍👩‍👧 Families making daily safety decisions

By enabling real-time climate decisions, it helps reduce risk and improve safety.

🧠 What We Learned
Data is only useful when it leads to action
UI/UX plays a critical role in trust and usability
Reliability is more important than complexity
Designing for real-world impact requires user-first thinking
⚡ Challenges
Handling real-time API failures gracefully
Ensuring smooth deployment with environment variables
Balancing feature richness with simplicity
Creating an intuitive and impactful UI
🔮 Future Scope
Predictive climate risk using machine learning
Disaster alerts (floods, heatwaves)
Integration with public safety systems
Multi-language support
Mobile-first expansion
🏆 Vision

AtmoSpark aims to evolve from a personal assistant into a global climate safety platform.

👤 Author
Kushagra Verma

📜 License

This project is for educational and hackathon purposes.

⭐ Final Note

AtmoSpark is not just a dashboard — it is a decision-making companion for climate resilience.
