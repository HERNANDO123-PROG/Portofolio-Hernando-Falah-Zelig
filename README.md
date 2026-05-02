# Portfolio Website - Interactive Desktop Experience

Portfolio website modern dengan konsep **Desktop Experience** yang interaktif, seperti sistem operasi desktop dengan windows, taskbar, dan ikon yang bisa diklik.

## ✨ Fitur Utama

### 🖥️ Desktop Experience
- **Desktop Icons** - Ikon di desktop yang bisa diklik untuk membuka aplikasi
- **Draggable Windows** - Windows bisa di-drag dan dipindahkan
- **Window Controls** - Minimize, Maximize, dan Close buttons
- **Taskbar** - Taskbar di bagian bawah dengan aplikasi yang sedang berjalan
- **Start Menu** - Menu start dengan daftar aplikasi
- **System Tray** - Jam real-time di system tray

### 🎨 Visual Features
- 🌊 **Matrix Rain Effect** - Animasi background khas hacker/programmer
- 💻 **Terminal Window** - Terminal dengan animasi typing command
- 🎭 **Glassmorphism** - Efek glassmorphism pada windows
- ⚡ **Smooth Animations** - Animasi halus untuk semua interaksi
- 🎯 **Z-Index Management** - Windows yang diklik otomatis muncul di depan

### 📱 Responsive Design
- Tampilan optimal di semua perangkat
- Desktop icons dan windows menyesuaikan ukuran layar
- Touch-friendly untuk mobile devices

## 🚀 Teknologi

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- Google Fonts (Fira Code, Inter)

## 📁 Struktur File

```
Portofolio/
├── index.html      # Struktur HTML dengan templates
├── style.css       # Styling dan animasi desktop experience
├── script.js       # JavaScript untuk window management & interaktivitas
└── README.md       # Dokumentasi
```

## 🎮 Cara Menggunakan

### Membuka Windows
1. **Double-click** pada desktop icon untuk membuka aplikasi
2. **Klik** item di Start Menu untuk membuka aplikasi
3. Windows akan muncul dengan animasi smooth

### Mengelola Windows
- **Drag** - Klik dan tahan pada window header untuk memindahkan
- **Minimize** - Klik tombol `−` untuk minimize window
- **Maximize** - Klik tombol `□` untuk maximize/restore window
- **Close** - Klik tombol `×` untuk menutup window
- **Focus** - Klik window header untuk membawa ke depan

### Taskbar
- Klik aplikasi di taskbar untuk focus/restore window
- Aplikasi yang aktif ditandai dengan highlight

### Start Menu
- Klik tombol "Start" di taskbar untuk membuka menu
- Klik di luar menu untuk menutup
- Pilih aplikasi dari menu untuk membuka

## 🎨 Aplikasi yang Tersedia

1. **About Me** - Informasi tentang developer dengan code block
2. **Projects** - Portfolio proyek-proyek dengan preview
3. **Skills** - Teknologi dan skill yang dikuasai
4. **Contact** - Form kontak dan social media links
5. **Terminal** - Terminal dengan animasi typing command

## 🛠️ Customization

### Menambah Window Baru

1. **Buat Template** di `index.html`:
```html
<template id="myWindow">
    <div class="window" data-window-id="myWindow">
        <div class="window-header">
            <div class="window-title">
                <span class="window-icon">🎨</span>
                <span>My Window</span>
            </div>
            <div class="window-controls">
                <button class="window-btn minimize">−</button>
                <button class="window-btn maximize">□</button>
                <button class="window-btn close">×</button>
            </div>
        </div>
        <div class="window-content">
            <!-- Konten window -->
        </div>
    </div>
</template>
```

2. **Tambah Desktop Icon**:
```html
<div class="desktop-icon" data-window="myWindow">
    <div class="icon-image">🎨</div>
    <div class="icon-label">My App</div>
</div>
```

3. **Tambah ke Start Menu**:
```html
<div class="start-menu-item" data-window="myWindow">
    <span class="menu-icon">🎨</span>
    <span class="menu-text">My App</span>
</div>
```

4. **Register Template** di `script.js`:
```javascript
this.windowTemplates = {
    // ... existing templates
    myWindow: document.getElementById('myWindow')
};
```

### Mengubah Warna Tema

Edit CSS variables di `style.css`:
```css
:root {
    --accent-primary: #00d9ff;    /* Warna utama */
    --accent-secondary: #7c3aed;  /* Warna sekunder */
    --bg-primary: #0a0e27;        /* Background utama */
    --bg-window: rgba(15, 22, 41, 0.98); /* Background window */
}
```

## 📝 Notes

- Form kontak saat ini hanya demo (console.log). Integrasikan dengan backend untuk fungsi sebenarnya
- Matrix effect menggunakan canvas HTML5
- Semua animasi menggunakan CSS dan vanilla JavaScript (no dependencies)
- Windows menggunakan z-index management untuk layering
- Drag & drop menggunakan mouse events (mousedown, mousemove, mouseup)

## 🌐 Browser Support

- Chrome (latest) ✅
- Firefox (latest) ✅
- Safari (latest) ✅
- Edge (latest) ✅

## 🎯 Fitur Advanced (Bisa Ditambahkan)

- [ ] Window resizing
- [ ] Multiple desktops/virtual desktops
- [ ] Window snapping
- [ ] Keyboard shortcuts
- [ ] File explorer
- [ ] Notifications system
- [ ] Settings panel
- [ ] Theme switcher

## 📄 License

Free to use for personal and commercial projects.

---

**Dibuat dengan ❤️ dan banyak ☕**

*Experience the desktop, explore the portfolio!*
# Portofolio-Hernando-Falah-Zelig
