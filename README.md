# Hotel Website Contact Backend

This Express backend receives contact form submissions from  hotel website and stores them in a MySQL database.
## Setup

1. **Clone / copy** this `backend` folder somewhere outside your frontend code.
2. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```
3. **Create the database**
   ```bash
   mysql -u root -p < schema.sql
   ```
4. **Configure environment variables**

   Rename `.env.example` to `.env` and put your MySQL credentials.
5. **Run the server**
   ```bash
   npm start            # production
   npm run dev          # with nodemon for development
   ```
The API will be available at `http://localhost:3000/contact`.

## Front‑end integration

In `Contact.html` (or your JS), send a POST request:

```js
fetch('http://localhost:3000/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message })
});
```
Homepage
![image alt](https://github.com/Joy-das-Jibon/Project-300/blob/main/Screenshot/Homepage.png?raw=true)\
 After Login Homepage
 ![image alt](https://github.com/Joy-das-Jibon/Project-300/blob/main/Screenshot/Afterlogin_homepage.png?raw=true)
About Page
![image alt](https://github.com/Joy-das-Jibon/Project-300/blob/main/Screenshot/Aboutpage.png?raw=true)
Services Page
![image alt](https://github.com/Joy-das-Jibon/Project-300/blob/main/Screenshot/Services.png?raw=true)
Explore Page
![image alt](https://github.com/Joy-das-Jibon/Project-300/blob/main/Screenshot/Explorepage.png?raw=true)

Login Page
![image alt](https://github.com/Joy-das-Jibon/Project-300/blob/main/Screenshot/Login_page.png?raw=true)
Check-in Info Page
![image alt](https://github.com/Joy-das-Jibon/Project-300/blob/main/Screenshot/Checkin_info.png?raw=true)
