# TokoBaju - Aplikasi E-Commerce Full-Stack

Aplikasi e-commerce modern yang dibangun dengan React (frontend) dan Python Pyramid (backend), dilengkapi dengan autentikasi pengguna, manajemen produk, keranjang belanja, dan dashboard admin.

## 📝 Deskripsi Aplikasi

TokoBaju adalah platform e-commerce yang memungkinkan pengguna untuk menjelajahi katalog produk fashion, menambahkan item ke keranjang belanja, melakukan pemesanan, dan mengelola profil mereka. Aplikasi ini juga menyediakan panel admin untuk mengelola produk, pengguna, dan pesanan.

## 🚀 Fitur Utama

### Fitur Pengguna

- **Autentikasi Pengguna**: Registrasi, login, logout, dan manajemen profil
- **Katalog Produk**: Jelajahi produk dengan kategori, pencarian, dan filter
- **Keranjang Belanja**: Tambah/hapus item, proses checkout
- **Manajemen Pesanan**: Riwayat pesanan dan pelacakan status
- **Profil Pengguna**: Edit informasi pribadi dan ganti password
- **Favorit**: Simpan produk favorit untuk pembelian di masa depan

### Fitur Admin

- **Dashboard Admin**: Panel kontrol untuk mengelola seluruh sistem
- **Manajemen Produk**: Tambah, edit, hapus produk
- **Manajemen Pengguna**: Kelola data pengguna dan hak akses
- **Manajemen Pesanan**: Proses dan update status pesanan

### Fitur Teknis

- **Desain Responsif**: Antarmuka yang mobile-friendly dengan Tailwind CSS
- **API RESTful**: Backend API yang terstruktur dengan dokumentasi lengkap
- **Keamanan**: Autentikasi JWT dan enkripsi password
- **Database**: PostgreSQL untuk penyimpanan data yang reliable

## 📋 Dependensi dan Library

### Frontend Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "@reduxjs/toolkit": "^1.9.0",
  "react-redux": "^8.0.5",
  "axios": "^1.3.0",
  "tailwindcss": "^3.2.0"
}
```

### Backend Dependencies

```python
requires = [
    'pyramid',              # Web framework
    'SQLAlchemy',          # ORM untuk database
    'psycopg2-binary',     # PostgreSQL driver
    'alembic',             # Database migrations
    'marshmallow',         # Object serialization
    'PyJWT',               # JSON Web Token
    'bcrypt',              # Password hashing
    'pyramid_jwt',         # JWT integration
    'cornice',             # REST services dengan CORS
    'requests',            # HTTP library
]
```

### System Requirements

- **PostgreSQL** (versi 12 atau lebih tinggi)
- **Node.js** (versi 16 atau lebih tinggi) dan npm
- **Python** (versi 3.8 atau lebih tinggi)
- **Git** (untuk cloning repository)

## 🛠️ Instalasi & Setup

### Langkah 1: Clone Repository

```powershell
git clone <repository-url>
cd toko-baju
```

### Langkah 2: Konfigurasi Database

#### 2.1 Install PostgreSQL

1. Download PostgreSQL dari [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
2. Install dengan pengaturan default
3. Ingat password yang Anda set untuk user `postgres`

#### 2.2 Buat Database

```powershell
# Hubungkan ke PostgreSQL
psql -U postgres

# Di PostgreSQL shell, buat database:
CREATE DATABASE tokobaju;

# Buat user untuk aplikasi:
CREATE USER admintokobaju WITH PASSWORD '12345678';
ALTER USER admintokobaju CREATEDB CREATEROLE SUPERUSER;

# Keluar dari PostgreSQL shell
\q
```

#### 2.3 Konfigurasi Koneksi Database

Edit file `backend/development.ini` dan update database URL:

```ini
sqlalchemy.url = postgresql://admintokobaju:12345678@localhost:5432/tokobaju
```

### Langkah 3: Setup Backend

#### 3.1 Navigasi ke Direktori Backend

```powershell
cd backend
```

#### 3.2 Buat Virtual Environment

```powershell
# Buat virtual environment
python -m venv venv

# Aktifkan virtual environment
venv\Scripts\activate
```

#### 3.3 Install Dependencies Python

```powershell
# Install package dalam mode development
pip install -e .
```

#### 3.4 Inisialisasi Schema Database

```powershell
# Inisialisasi tabel database
python -m ecommerce_api.scripts.initialize_db development.ini

# Import sample products (opsional)
python -m ecommerce_api.scripts.import_products development.ini
```

#### 3.5 Test Setup Backend

```powershell
# Jalankan server backend
pserve development.ini
```

Backend akan berjalan di `http://localhost:8000`. Anda dapat mengujinya dengan mengunjungi `http://localhost:8000/api/debug/products`.

### Langkah 4: Setup Frontend

#### 4.1 Navigasi ke Direktori Frontend (terminal baru)

```powershell
cd frontend
```

#### 4.2 Install Dependencies Node.js

```powershell
# Install semua dependencies
npm install
```

#### 4.3 Jalankan Development Server Frontend

```powershell
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 📚 Dokumentasi API

### Authentication Endpoints

- `POST /api/auth/register` - Registrasi pengguna
- `POST /api/auth/login` - Login pengguna
- `POST /api/auth/logout` - Logout pengguna
- `GET /api/auth/me` - Dapatkan info pengguna saat ini

### Product Endpoints

- `GET /api/products` - Dapatkan semua produk
- `GET /api/products/{id}` - Dapatkan produk berdasarkan ID
- `GET /api/products/categories` - Dapatkan kategori produk
- `POST /api/products` - Buat produk (admin only)
- `PUT /api/products/{id}` - Update produk (admin only)
- `DELETE /api/products/{id}` - Hapus produk (admin only)

### Order Endpoints

- `GET /api/orders` - Dapatkan pesanan pengguna
- `POST /api/orders` - Buat pesanan baru
- `GET /api/orders/{id}` - Dapatkan detail pesanan

### User Management (Admin)

- `GET /api/users` - Dapatkan semua pengguna (admin only)
- `PUT /api/users/{id}` - Update pengguna (admin only)
- `DELETE /api/users/{id}` - Hapus pengguna (admin only)

## 🔧 Teknologi yang Digunakan

### Frontend

- **React 18**: Library JavaScript untuk membangun user interface
- **React Router DOM**: Routing dan navigasi
- **Redux Toolkit**: State management
- **Axios**: HTTP client untuk API requests
- **Tailwind CSS**: Utility-first CSS framework

### Backend

- **Python Pyramid**: Web framework untuk backend API
- **SQLAlchemy**: Object-Relational Mapping (ORM)
- **PostgreSQL**: Relational database
- **JWT**: JSON Web Token untuk autentikasi
- **Alembic**: Database migration tool
- **Marshmallow**: Object serialization/deserialization

## 📖 Referensi

### Dokumentasi Framework

- [React Documentation](https://react.dev/)
- [Python Pyramid Documentation](https://docs.pylonsproject.org/projects/pyramid/en/latest/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Tutorial dan Panduan

- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [Redux Toolkit Tutorial](https://redux-toolkit.js.org/tutorials/quick-start)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [JWT Authentication Guide](https://jwt.io/introduction)

### Tools dan Library

- [Axios HTTP Client](https://axios-http.com/docs/intro)
- [Bcrypt Password Hashing](https://github.com/pyca/bcrypt/)
- [Marshmallow Serialization](https://marshmallow.readthedocs.io/)
- [Alembic Database Migration](https://alembic.sqlalchemy.org/)

### Design Resources

- [Tailwind UI Components](https://tailwindui.com/)
- [Heroicons](https://heroicons.com/)
- [Unsplash Photos](https://unsplash.com/)

## 📄 Lisensi

Proyek ini dibuat untuk keperluan pembelajaran dan pengembangan portfolio.

## 👨‍💻 Kontributor

Dikembangkan sebagai bagian dari proyek pembelajaran web development full-stack.

---

**TokoBaju** - Fashion untuk Gaya Hidupmu 🛍️
