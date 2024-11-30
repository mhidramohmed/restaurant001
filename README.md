### Instruction Manual for Setting Up the Project

Follow these steps to set up and run the project on your local machine.

---

#### **Prerequisites:**
- **XAMPP**: Ensure you have XAMPP installed and running. Start **MySQL** and **Apache** services using the XAMPP Control Panel.
- **Node.js**: Install Node.js (for frontend setup).
- **Composer**: Install Composer (for backend dependencies).

---

### **Setup Instructions**

#### 1. **Database Setup**
- Open **phpMyAdmin** (usually at `http://localhost/phpmyadmin`).
- Create a database named:  
  **`restaurant001`**

---

#### 2. **Backend Configuration**
- Navigate to the `backend` folder.
- Create a new file named **`.env`**.
- Paste the following configuration into the `.env` file:

  ```env
  APP_NAME=Laravel
  APP_ENV=local
  APP_KEY=
  APP_DEBUG=true
  APP_URL=http://localhost:3000
  FRONTEND_URL=http://localhost:3000

  LOG_CHANNEL=stack
  LOG_DEPRECATIONS_CHANNEL=null
  LOG_LEVEL=debug

  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=restaurant001
  DB_USERNAME=root
  DB_PASSWORD=

  BROADCAST_DRIVER=log
  CACHE_DRIVER=file
  FILESYSTEM_DISK=local
  QUEUE_CONNECTION=sync
  SESSION_DRIVER=file
  SESSION_LIFETIME=120

  MEMCACHED_HOST=127.0.0.1

  REDIS_HOST=127.0.0.1
  REDIS_PASSWORD=null
  REDIS_PORT=6379

  MAIL_MAILER=smtp
  MAIL_HOST=mailpit
  MAIL_PORT=1025
  MAIL_USERNAME=null
  MAIL_PASSWORD=null
  MAIL_ENCRYPTION=null
  MAIL_FROM_ADDRESS="hello@example.com"
  MAIL_FROM_NAME="${APP_NAME}"

  AWS_ACCESS_KEY_ID=
  AWS_SECRET_ACCESS_KEY=
  AWS_DEFAULT_REGION=us-east-1
  AWS_BUCKET=
  AWS_USE_PATH_STYLE_ENDPOINT=false

  PUSHER_APP_ID=
  PUSHER_APP_KEY=
  PUSHER_APP_SECRET=
  PUSHER_HOST=
  PUSHER_PORT=443
  PUSHER_SCHEME=https
  PUSHER_APP_CLUSTER=mt1

  VITE_APP_NAME="${APP_NAME}"
  VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
  VITE_PUSHER_HOST="${PUSHER_HOST}"
  VITE_PUSHER_PORT="${PUSHER_PORT}"
  VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
  VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
  ```

---

#### 3. **Frontend Configuration**
- Navigate to the `frontend` folder.
- Create a new file named **`.env`**.
- Paste the following configuration into the `.env` file:

  ```env
  NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
  NEXT_PUBLIC_APP_NAME=Bonsaï
  ```

---

#### 4. **Installing Dependencies and Running the Backend**
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd ./backend/
   ```
2. Install backend dependencies:
   ```bash
   composer install
   ```
3. Generate an application key:
   ```bash
   php artisan key:generate
   ```
4. Run migrations and seed the database:
   ```bash
   php artisan migrate:fresh --seed
   ```
5. Start the backend server:
   ```bash
   php artisan serve
   ```

---

#### 5. **Installing Dependencies and Running the Frontend**
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd ./frontend/
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

#### 6. **Access the Application**
- Open a web browser and go to:  
  **`http://localhost:3000`**

---

### You're all set! 🚀

If you encounter any issues, ensure all prerequisites are met and services are running.