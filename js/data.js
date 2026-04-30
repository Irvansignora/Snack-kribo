// ============================================================
// Snack Kribo - Data Layer (Firebase Firestore + Auth)
// ============================================================

const CLOUDINARY = {
  cloudName: 'dyhvx9wit',
  uploadPreset: 'jastipku_unsigned',
  baseUrl() { return `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`; },
  thumb(url, w=400) {
    if (!url) return '';
    return url.replace('/upload/', `/upload/w_${w},h_${w},c_fill,q_auto:eco,f_webp/`);
  },
  mini(url, w=80) {
    if (!url) return '';
    return url.replace('/upload/', `/upload/w_${w},h_${w},c_fill,q_auto:low,f_webp/`);
  }
};
window.CLOUDINARY = CLOUDINARY;

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBgOuF0KR12hhMZVINyO8gRn0ahpC9jH4I",
  authDomain: "snack-kribo.firebaseapp.com",
  projectId: "snack-kribo",
  storageBucket: "snack-kribo.firebasestorage.app",
  messagingSenderId: "18161473320",
  appId: "1:18161473320:web:08d996766de93e5256e21d",
  measurementId: "G-M68NJDV1JG"
};

const DEFAULTS = {
  settings: {
    storeName:'Snack Kribo', ownerName:'Admin', whatsapp:'6281234567890',
    address:'Indonesia', openTime:'07:00', closeTime:'21:00',
    deliveryFee:3000, minOrder:15000, greeting:'Halo Bro! Mau pesan keripik apa? 🍌',
    isOpen:true, primaryColor:'#E91E8C', accentColor:'#FFD93D', logoEmoji:'🍌', logoUrl:'', adminPass:'admin123',
    affiliateCommission: 10, affiliateMinPayout: 50000, affiliateActive: true,
  },
  landing: {
    hero: {
      badge: 'Kripiknya Bikin Nagih Bro!',
      titleHtml: 'Keripik Pisang<br/>\n        <span class="highlight">Premium</span> Rasa<br/>\n        <span class="gold">Istimewa!</span>',
      subtitle: 'Dibuat dari 100% pisang pilihan terbaik, diproses dengan cinta tanpa pengawet & pewarna buatan. Renyah, manis, dan lumer di mulut — sekali gigit, pasti nagih! 🍌',
      imageUrl: '' // Cloudinary URL
    },
    about: {
      titleHtml: 'Cerita di Balik <span style="color:var(--pink)">Snack Kribo</span>',
      descHtml: '<p><strong>Snack Kribo</strong> — singkatan dari <em>Kripik Istimewa Bro</em> — lahir dari passion kami untuk menghadirkan keripik pisang berkualitas premium dengan rasa yang unik dan istimewa.</p><p>Setiap keripik dibuat dengan penuh cinta, menggunakan 100% pisang pilihan terbaik, diproses secara higienis tanpa pengawet dan pewarna buatan. Hasilnya? Kripik yang renyah maksimal, manis pas, dan lumer di mulut!</p>',
      imageUrl: '', // Cloudinary URL
      badges: ['🏆 Premium Quality', '💯 100% Natural', '🚀 Fast Delivery']
    },
    features: [
      { icon: '🍌', title: '100% Pisang Pilihan', desc: 'Hanya menggunakan pisang berkualitas tinggi yang dipilih secara ketat' },
      { icon: '🌿', title: 'Tanpa Pengawet', desc: 'Proses produksi alami tanpa bahan pengawet kimia berbahaya' },
      { icon: '🧪', title: 'Tanpa Pewarna Buatan', desc: 'Warna alami dari bahan-bahan premium tanpa pewarna sintetis' },
      { icon: '❄️', title: 'Renyah Maksimal', desc: 'Tekstur renyah sempurna yang tahan lama, bikin nagih!' }
    ],
    testimonials: [
      { name: 'Andi Pratama', loc: 'Jakarta', rating: 5, text: '"Rasa cokelatnya beneran nendang! Udah abis 3 pack dalam sehari. Nagih banget bro! 🤤"', imageUrl: '' },
      { name: 'Sari Dewi', loc: 'Bandung', rating: 5, text: '"Matcha-nya seger banget! Beda dari keripik pisang biasa. Packaging-nya juga kece! 💚"', imageUrl: '' },
      { name: 'Rudi Setiawan', loc: 'Surabaya', rating: 5, text: '"Beli untuk oleh-oleh, semua orang suka! Apalagi rasa strawberry, anak-anak rebutan! 🍓"', imageUrl: '' }
    ]
  },
  categories: [
    { id:'cat1', name:'Kripik Pisang', emoji:'🍌', active:true },
    { id:'cat2', name:'Paket Hemat', emoji:'📦', active:true },
  ],
  products: [
    { id:'p1', categoryId:'cat1', name:'Kripik Cokelat', desc:'Renyah, manis & lumer di mulut! Cokelatnya nendang banget!', price:5000, emoji:'🍫', imageUrl:'', active:true, stock:true },
    { id:'p2', categoryId:'cat1', name:'Kripik Matcha', desc:'Renyah, manis & lumer di mulut! Rasa matcha yang nendang banget!', price:5000, emoji:'🍵', imageUrl:'', active:true, stock:true },
    { id:'p3', categoryId:'cat1', name:'Kripik Vanila', desc:'Renyah, manis & lumer di mulut! Vanila klasik yang nendang banget!', price:5000, emoji:'🍌', imageUrl:'', active:true, stock:true },
    { id:'p4', categoryId:'cat1', name:'Kripik Strawberry', desc:'Renyah, manis & lumer di mulut! Strawberry segar yang nendang banget!', price:5000, emoji:'🍓', imageUrl:'', active:true, stock:true },
  ],
  banners: [
    { id:'b1', text:'🔥 Snack Kribo — Kripik Istimewa Bro! Renyah & Nagih!', color:'#E91E8C', active:true },
    { id:'b2', text:'🍌 100% Pisang Pilihan • Tanpa Pengawet • Tanpa Pewarna Buatan', color:'#22C55E', active:true },
    { id:'b3', text:'💰 Gabung Program Affiliate & Raih Cuan Bersama Kribo!', color:'#FFD93D', active:true },
  ],
};

const DB = {
  _db: null,
  _fs: null,
  _auth: null,
  _authMod: null,
  _cache: {},

  async init() {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
    const { getFirestore, doc, getDoc, setDoc, collection, getDocs, updateDoc, deleteDoc, onSnapshot, query, orderBy, where }
      = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    const authMod = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');

    const app = initializeApp(FIREBASE_CONFIG);
    this._db  = getFirestore(app);
    this._auth = authMod.getAuth(app);
    this._authMod = authMod;
    this._fs  = { doc, getDoc, setDoc, collection, getDocs, updateDoc, deleteDoc, onSnapshot, query, orderBy, where };
    await this._seedIfEmpty();
  },

  async _seedIfEmpty() {
    const { doc, getDoc, setDoc, collection, getDocs } = this._fs;
    const db = this._db;
    const sSnap = await getDoc(doc(db, 'config', 'settings'));
    if (sSnap.exists()) return;
    const promises = [];
    promises.push(setDoc(doc(db, 'config', 'settings'), DEFAULTS.settings));
    promises.push(setDoc(doc(db, 'config', 'landing'), DEFAULTS.landing));
    const [cSnap, pSnap, bSnap] = await Promise.all([
      getDocs(collection(db, 'categories')),
      getDocs(collection(db, 'products')),
      getDocs(collection(db, 'banners'))
    ]);
    if (cSnap.empty) { for (const c of DEFAULTS.categories) promises.push(setDoc(doc(db, 'categories', c.id), c)); }
    if (pSnap.empty) { for (const p of DEFAULTS.products) promises.push(setDoc(doc(db, 'products', p.id), p)); }
    if (bSnap.empty) { for (const b of DEFAULTS.banners) promises.push(setDoc(doc(db, 'banners', b.id), b)); }
    await Promise.all(promises);
  },

  // ---- AUTH ----
  async register(email, password, name, isAffiliate = false) {
    const { createUserWithEmailAndPassword, updateProfile } = this._authMod;
    const cred = await createUserWithEmailAndPassword(this._auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const userData = {
      uid: cred.user.uid, email, name, 
      isAffiliate, affiliateApproved: false,
      affiliateCode: isAffiliate ? this.genAffiliateCode(name) : '',
      totalSales: 0, totalCommission: 0, pendingPayout: 0,
      createdAt: Date.now()
    };
    await this._fs.setDoc(this._fs.doc(this._db, 'users', cred.user.uid), userData);
    return { user: cred.user, userData };
  },

  async login(email, password) {
    const { signInWithEmailAndPassword } = this._authMod;
    const cred = await signInWithEmailAndPassword(this._auth, email, password);
    const userData = await this.getUserData(cred.user.uid);
    return { user: cred.user, userData };
  },

  async logout() {
    await this._authMod.signOut(this._auth);
  },

  getCurrentUser() {
    return this._auth?.currentUser || null;
  },

  onAuthChange(cb) {
    return this._authMod.onAuthStateChanged(this._auth, cb);
  },

  async getUserData(uid) {
    const snap = await this._fs.getDoc(this._fs.doc(this._db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  },

  async updateUserData(uid, data) {
    await this._fs.updateDoc(this._fs.doc(this._db, 'users', uid), data);
  },

  genAffiliateCode(name) {
    const clean = name.replace(/[^a-zA-Z]/g, '').substring(0, 5).toUpperCase();
    return 'KB' + clean + Math.random().toString(36).substring(2, 5).toUpperCase();
  },

  // ---- AFFILIATES ----
  async getAffiliates() {
    const { collection, getDocs, query, where } = this._fs;
    const q = query(collection(this._db, 'users'), where('isAffiliate', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  async approveAffiliate(uid) {
    await this._fs.updateDoc(this._fs.doc(this._db, 'users', uid), { affiliateApproved: true });
  },

  async rejectAffiliate(uid) {
    await this._fs.updateDoc(this._fs.doc(this._db, 'users', uid), { affiliateApproved: false, isAffiliate: false });
  },

  async getAffiliateOrders(affiliateCode) {
    const { collection, getDocs, query, where } = this._fs;
    const q = query(collection(this._db, 'orders'), where('affiliateCode', '==', affiliateCode));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  async recordAffiliateSale(affiliateCode, orderTotal) {
    const { collection, getDocs, query, where } = this._fs;
    const q = query(collection(this._db, 'users'), where('affiliateCode', '==', affiliateCode));
    const snap = await getDocs(q);
    if (snap.empty) return;
    const affDoc = snap.docs[0];
    const affData = affDoc.data();
    const settings = await this.getSettings();
    const commission = Math.floor(orderTotal * (settings.affiliateCommission || 10) / 100);
    await this._fs.updateDoc(this._fs.doc(this._db, 'users', affDoc.id), {
      totalSales: (affData.totalSales || 0) + orderTotal,
      totalCommission: (affData.totalCommission || 0) + commission,
      pendingPayout: (affData.pendingPayout || 0) + commission,
    });
  },

  // ---- SETTINGS & LANDING ----
  async getSettings() {
    if (this._cache.settings) return this._cache.settings;
    const snap = await this._fs.getDoc(this._fs.doc(this._db, 'config', 'settings'));
    this._cache.settings = snap.exists() ? snap.data() : DEFAULTS.settings;
    return this._cache.settings;
  },
  async saveSettings(s) {
    await this._fs.setDoc(this._fs.doc(this._db, 'config', 'settings'), s);
    this._cache.settings = s;
  },

  async getLanding() {
    if (this._cache.landing) return this._cache.landing;
    const snap = await this._fs.getDoc(this._fs.doc(this._db, 'config', 'landing'));
    this._cache.landing = snap.exists() ? snap.data() : DEFAULTS.landing;
    return this._cache.landing;
  },
  async saveLanding(l) {
    await this._fs.setDoc(this._fs.doc(this._db, 'config', 'landing'), l);
    this._cache.landing = l;
  },

  // ---- CATEGORIES ----
  async getCategories() {
    if (this._cache.categories) return this._cache.categories;
    const snap = await this._fs.getDocs(this._fs.collection(this._db, 'categories'));
    this._cache.categories = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return this._cache.categories;
  },
  async saveCategory(c) {
    await this._fs.setDoc(this._fs.doc(this._db, 'categories', c.id), c);
    this._cache.categories = null;
  },
  async deleteCategory(id) {
    await this._fs.deleteDoc(this._fs.doc(this._db, 'categories', id));
    this._cache.categories = null;
  },

  // ---- PRODUCTS ----
  async getProducts() {
    if (this._cache.products) return this._cache.products;
    const snap = await this._fs.getDocs(this._fs.collection(this._db, 'products'));
    this._cache.products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return this._cache.products;
  },
  async saveProduct(p) {
    await this._fs.setDoc(this._fs.doc(this._db, 'products', p.id), p);
    this._cache.products = null;
  },
  async deleteProduct(id) {
    await this._fs.deleteDoc(this._fs.doc(this._db, 'products', id));
    this._cache.products = null;
  },

  // ---- BANNERS ----
  async getBanners() {
    if (this._cache.banners) return this._cache.banners;
    const snap = await this._fs.getDocs(this._fs.collection(this._db, 'banners'));
    this._cache.banners = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return this._cache.banners;
  },
  async saveBanner(b) {
    await this._fs.setDoc(this._fs.doc(this._db, 'banners', b.id), b);
    this._cache.banners = null;
  },
  async deleteBanner(id) {
    await this._fs.deleteDoc(this._fs.doc(this._db, 'banners', id));
    this._cache.banners = null;
  },

  // ---- ORDERS ----
  async getOrders() {
    const { collection, getDocs, query, orderBy } = this._fs;
    const q = query(collection(this._db, 'orders'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async saveOrder(order) {
    await this._fs.setDoc(this._fs.doc(this._db, 'orders', order.id), order);
    return order;
  },
  async updateOrderStatus(id, status) {
    await this._fs.updateDoc(this._fs.doc(this._db, 'orders', id), { status, updatedAt: Date.now() });
  },

  // Cart - localStorage
  getCart()   { try { return JSON.parse(localStorage.getItem('kribo_cart')) || []; } catch { return []; } },
  saveCart(c) { localStorage.setItem('kribo_cart', JSON.stringify(c)); },
  clearCart() { localStorage.setItem('kribo_cart', JSON.stringify([])); },

  // Affiliate code from URL
  getRefCode() {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) localStorage.setItem('kribo_ref', ref);
    return localStorage.getItem('kribo_ref') || '';
  },

  // Realtime listeners
  onOrders(cb) {
    const { collection, onSnapshot, query, orderBy } = this._fs;
    const q = query(collection(this._db, 'orders'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  },

  genId()        { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); },
  formatRupiah(n){ return 'Rp ' + Number(n).toLocaleString('id-ID'); },
  formatDate(ts) {
    return new Date(ts).toLocaleString('id-ID', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  },
};

window.DB = DB;
