<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/6wj0hh6.jpg" alt="Project logo"></a>
</p>

<h3 align="center">Project Title</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Few lines describing your project.
    <br> 
</p>

## 📝 Table of Contents

- [Tentang Aplikasi Web](#about)
- [Memulai Aplikasi](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [TODO](../TODO.md)
- [Contributing](../CONTRIBUTING.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

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

Add notes about how to use the system.

## 🚀 Deployment <a name = "deployment"></a>

Add additional notes about how to deploy this on a live system.

## ⛏️ Built Using <a name = "built_using"></a>

- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [VueJs](https://vuejs.org/) - Web Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>

- [@kylelobo](https://github.com/kylelobo) - Idea & Initial work

See also the list of [contributors](https://github.com/kylelobo/The-Documentation-Compendium/contributors) who participated in this project.

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- Hat tip to anyone whose code was used
- Inspiration
- References
