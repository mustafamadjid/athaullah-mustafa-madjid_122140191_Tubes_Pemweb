<p align="center">
  <a href="" rel="noopener">
 <img width=300px height=200px src="assets/tokoijo.png" alt="Project logo"></a>
</p>

<h3 align="center">TokoIjo Web Application</h3>

<div align="center">



</div>

---

<p align="center"> Aplikasi E-Commerce Berbasis Website
    <br> 
</p>

## 📝 Table of Contents

- [Tentang Aplikasi Web](#about)
- [Memulai Aplikasi](#getting_started)
- [Fitur-fitur dalam aplikasi](#usage)
- [Dependency](#built_using)
- [Authors](#authors)
- [Referensi](#acknowledgement)

## 🧐 TokoIjo <a name = "about"></a>

##  Deskripsi Aplikasi  <a name = "about"></a>

TokoIjo merupakan aplikasi e-commerce berbasis website yang dibangun untuk memudahkan pengguna dalam berbelanja secara daring. Aplikasi ini memiliki fitur-fitur yang umum dalam sebuah aplikasi e-commerce seperti pilihan produk berdasarkan kategori, menambahkan produk baru untuk dijual, pilihan metode pembayaran, dan berbagai fitur lainnnya.


## 🏁 Memulai <a name = "getting_started"></a>

Instruksi di bawah ini berguna jika anda ingin melakukan copy terhadap aplikasi web ini agar dapat dijalankan secara lokal di komputer anda.


## ⛏️ Proyek ini Dibangun Menggunakan <a name = "built_using"></a>

### Code Editor
- [VSCode](https://code.visualstudio.com/) - Code Editor

### Frontend
- [Vite](https://vite.dev/) - Web Build tool
- [ReactJS](https://react.dev/) - Javascript Library
- [Redux](https://react-redux.js.org/) - React State Management
- [React-Router](https://reactrouter.com/) - React Router
- [Axios](https://axios-http.com/docs/intro) - Javascript HTTP Client
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
- [React-Slick](https://react-slick.neostack.com/) - Carousel UI
- [Framer-Motion](https://motion.dev/) - Animation
- [Lucide](https://lucide.dev/) - Icon Library
- [NodeJs](https://nodejs.org/en/) - Javascript Runtime

### Backend
- [PostgreSQL](https://www.postgresql.org/) - Database
- [SQLAlchemy](https://www.sqlalchemy.org/) - Python Database ORM
- [Python](https://www.python.org/) - Backend Programming Language
- [Pyramid](https://trypyramid.com/) - Backend Framework
- [Cookiecutter](https://github.com/cookiecutter/cookiecutter) - Python Project Template
- [Firebase Authentication](https://firebase.google.com/docs/auth) - Auhtentication Provider


## Installing

Tahapan Menginstall proyek aplikasi web ini.


Clone repository dari link ini ke folder anda
```
git clone https://github.com/mustafamadjid/athaullah-mustafa-madjid_122140191_Tubes_Pemweb.git
```
### Backend Setup
Buat Folder untuk aplikasi backend. Contohnya : 
```
D:\Pemweb\UAS\back_end
```

Masuk ke folder dalam terminal, kemudian buat virtual environment python
```
python -m venv venv
```

Jalankan virtual environment
```
venv\Scripts\activate #untuk windows
```

Install dependency
```
pip install -e .
```

Pastikan bahwa anda telah menginstall PostgreSQL. Kemudian, pada file `development.ini` ubah variabel `sqlalchemy.url` sesuai dengan akun dan database anda
```
sqlalchemy.url = postgresql://db_user:db_pass@localhost:5432/your_db
```

Lakukan migrasi dan update database melalui perintah
```
alembic -c development.ini revision --autogenerate -m "init"
alembic -c development.ini upgrade head
```

Jalankan Aplikasi Backend
```
pserve development.ini --reload
```
### Frontend Setup
Pastikan anda telah menginstall node js terlebih dahulu. Jika sudah, buat folder khusus frontend di root folder
```
D:\Pemweb\UAS\Frontend
```

kemudian install semua dependency melalui perintah ini

```
npm install
```

Jalankan aplikasi dengan perintah 

```
npm run dev
```


## 🎈 Fitur-Fitur Dalam Aplikasi <a name="usage"></a>

- Login menggunakan akun google
- Menambahkan produk yang ingin dibeli ke keranjang
- Checkout produk
- Memantau pesanan yang sudah dibuat
- Mengelola produk sebagai penjual
- Mengelola data profil

## ✍️ Authors <a name = "authors"></a>

- [mustafamadjid](https://github.com/mustafamadjid) - Creator


## Referensi <a name = "acknowledgement"></a>

- [Praktikum Pemweb ITERA](https://prakifpemweb.vercel.app/)
- [Programmer Zaman Now](https://www.youtube.com/@ProgrammerZamanNow)
