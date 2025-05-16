# Lumiere Homestay Website

## Setup

1. Make sure you have Node.js installed.
2. Run `npm install` to install dependencies.
3. Run `npm run init-db` to create the SQLite database and tables.
4. Run `npm start` to start the server.
5. Visit http://localhost:3000 in your browser.

## User Login

- Admin: username: admin, password: adminpass
- Customer: username: guest, password: guestpass

Admin can see booking list at /admin.html
Customers are redirected to home page after login.

## Booking

Fill booking form with name, phone, email, check-in and check-out dates.
Bookings are saved to SQLite database.
