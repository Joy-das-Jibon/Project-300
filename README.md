# Hotel Website Contact Backend

This Express backend receives contact form submissions from your hotel website and stores them in a MySQL database.

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

Make sure your form JS points to this endpoint.
