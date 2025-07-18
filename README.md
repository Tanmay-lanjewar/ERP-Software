# ERP Software  - Enterprises Management System

A full-stack business management web application designed to simplify and streamline sales, purchases, and inventory processes. This system supports essential business operations, including managing customers, products, vendors, purchase orders, quotations, invoices, taxes, and more.

## 🚀 Features
🔹 Sales Module
👤 Customer Management – Add, edit, delete, and filter customers
📄 Quotations – Generate quotations for customers
🧾 Invoices – Create and manage sales invoices
📃 Pro Forma Invoices – Issue pre-invoice documents

🔹 Purchase Module
📑 Purchase Orders – Create and track purchase orders
🏢 Vendors – Manage vendor information
🛠️ Work Orders – Track production/repair jobs (if applicable)

🔹 Inventory Module
📦 Products & Services – Add items, prices, units, and status (active/inactive)
🔎 Search & Filter – Filter by status and name
🔹 Finance Settings
💸 Tax Configuration – Setup tax slabs
📆 Financial Year Settings – Set accounting periods

🔹 Admin Tools
📊 Reports & Analytics – Placeholder for future analytics
⚙️ Settings – Customize business configuration

##🧑‍💻 Tech Stack
| Layer    | Technology                   |
| -------- | ---------------------------- |
| Frontend | React.js, Axios, Bootstrap   |
| Backend  | Node.js, Express.js          |
| Database | MySQL                        |
| Others   | Postman (API testing), XAMPP |


📂 Project Structure
root/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/db.js
│   └── server.js
│
├── front/
│   ├── src/components/
│   ├── src/pages/
│   ├── src/services/
│   └── App.js, index.js



## 📸 UI Screenshots
🛍️ Product & Services
<img width="1918" height="870" alt="image" src="https://github.com/user-attachments/assets/6609756c-3ab7-4ac2-829d-02f687079f8e" />
🧑‍💻 Customers
<img width="1918" height="867" alt="image" src="https://github.com/user-attachments/assets/230df13d-7087-4808-bc13-72c73b37226a" />
📦 Purchase Orders
<img width="1918" height="872" alt="image" src="https://github.com/user-attachments/assets/75a5231d-940f-487e-8865-16ce202a4a86" />


## How to Run

1. Clone the repo
2. Database setup: Start SQL Server and create the required table. The SQL setup file is given.
3. Navigate to the backend and run:
   ```bash
   npm install
   nodemon index
   ```
4. Navigate to the front and run:
   ```bash
   npm install
   npm start
   ```
5. Open in browser at `http://localhost:3000`

---

Made with ❤️ using MERN stack.
