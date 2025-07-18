# Medicure – Online Medicine Selling System

## 📌 Introduction
**Medicure** is an online medicine selling platform developed using the **MERN (MongoDB, Express.js, React.js, Node.js)** stack. It simplifies the process of buying medicines by allowing users to browse products, upload prescriptions for restricted drugs, and securely place orders. The system ensures regulatory compliance through admin-verified prescription approval while providing a smooth and secure shopping experience.

---

## 🚀 Features
- **User Registration & Login** with email verification  
- **Password Reset** functionality  
- **Product Browsing & Search** by categories and keywords  
- **Product Details View** with description, price, and stock  
- **Cart Management** (add, update, and remove products)  
- **Selective Checkout** for flexible order processing  
- **Prescription Upload & Verification** for restricted medicines  
- **Order Placement & Confirmation**  
- **Order History** with current status tracking  
- **Contact Form** for feedback and support  
- **Admin Panel** for:
  - Product Management (CRUD operations)
  - Prescription Verification
  - Order Management
  - User Management

---

## 🛠️ Tech Stack
**Frontend**: React.js, Axios, Bootstrap  
**Backend**: Node.js, Express.js  
**Database**: MongoDB (Mongoose ODM)  
**Authentication & Security**: JWT, Bcrypt  
**Email Service**: Nodemailer  
**File Handling**: Multer or Cloudinary for prescription and product image uploads  

---

Install dependencies
Backend
cd backend
npm install

Frontend
cd frontend
npm install

Create a .env file in the backend directory:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password



