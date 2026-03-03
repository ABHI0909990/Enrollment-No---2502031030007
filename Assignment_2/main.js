// Bookstore Core Logic
const Bookstore = {
  // Mock Data
  books: [
    {
      id: "1",
      title: "Thunmanhandiya",
      author: "Mahagamasekara",
      price: "Rs. 700/=",
      image: "assets/bookstore/book1.png",
      category: "Novel",
      description:
        "Thunmanhandiya, written by Mahagamasekara, is a poignant novel set in rural Sri Lanka. It explores the complexities of human relationships and emotions, depicting the lives of its characters with sensitivity and depth.",
    },
    {
      id: "2",
      title: "Gamperaliya",
      author: "Martin Wickramasinghe",
      price: "Rs. 850/=",
      image: "assets/bookstore/book2.png",
      category: "Novel",
      description:
        "Gamperaliya is a landmark novel in Sinhala literature, depicting the transformation of a traditional feudal family into a modern urban middle-class family.",
    },
    {
      id: "3",
      title: "Nectar in a Sieve",
      author: "Kamala Markandaya",
      price: "Rs. 950/=",
      image: "assets/bookstore/book3.png",
      category: "Translations",
      description:
        "Nectar in a Sieve is a 1954 novel by Kamala Markandaya. The book is set in India during a period of intense urban development.",
    },
    {
      id: "4",
      title: "Adaraneeya Victoria",
      author: "Mohan Raj Madawala",
      price: "Rs. 1100/=",
      image: "assets/bookstore/book4.png",
      category: "Novel",
      description:
        "Adaraneeya Victoria is a captivating story that weaves together historical elements and fictional narratives.",
    },
    {
      id: "5",
      title: "Manikkawatha",
      author: "Mahinda Prasad Masimbula",
      price: "Rs. 900/=",
      image: "assets/bookstore/book1.png",
      category: "Novel",
      description: "A beautiful story about rural life and human connections.",
    },
    {
      id: "6",
      title: "The Book Thief",
      author: "Markus Zusak",
      price: "Rs. 1200/=",
      image: "assets/bookstore/book2.png",
      category: "Translations",
      description: "A story narrated by Death, set in Nazi Germany.",
    },
  ],

  // Cart Management
  cart: {
    items: JSON.parse(localStorage.getItem("bookstore_cart")) || [],

    add(bookId) {
      const book = Bookstore.books.find((b) => b.id === bookId);
      if (!book) return;

      const existing = this.items.find((item) => item.id === bookId);
      if (existing) {
        existing.quantity += 1;
      } else {
        this.items.push({ ...book, quantity: 1 });
      }
      this.save();
      this.updateBadge();
      alert("Added to cart!");
    },

    remove(id) {
      this.items = this.items.filter((item) => item.id !== id);
      this.save();
      this.updateBadge();
      this.renderCart();
    },

    updateQuantity(id, delta) {
      const item = this.items.find((item) => item.id === id);
      if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
        this.save();
        this.updateBadge();
        this.renderCart();
      }
    },

    save() {
      localStorage.setItem("bookstore_cart", JSON.stringify(this.items));
    },

    updateBadge() {
      const badge = document.getElementById("cart-badge");
      if (badge) {
        const count = this.items.reduce((acc, item) => acc + item.quantity, 0);
        badge.textContent = count;
        badge.style.display = count > 0 ? "flex" : "none";
      }
    },

    getTotal() {
      return this.items.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
        return total + price * item.quantity;
      }, 0);
    },

    renderCart() {
      const container = document.getElementById("cart-items");
      const totalEl = document.getElementById("cart-total");
      if (!container) return;

      if (this.items.length === 0) {
        container.innerHTML = `
                    <div class="text-center py-24">
                        <div class="flex items-center justify-center mb-4" style="color: var(--gray);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">Your cart is empty</h3>
                        <a href="shop.html" class="btn btn-gold">Start Shopping</a>
                    </div>
                `;
        if (totalEl) totalEl.textContent = "Rs. 0.00";
        return;
      }

      container.innerHTML = this.items
        .map(
          (item) => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" style="width: 6rem; height: 8rem; object-fit: cover; border-radius: 0.5rem;">
                    <div style="flex: 1;">
                        <h4 class="text-lg font-bold">${item.title}</h4>
                        <p class="text-gray text-sm">${item.author}</p>
                        <p class="text-orange font-bold mt-4">${item.price}</p>
                    </div>
                    <div class="flex items-center gap-4" style="background: rgba(242, 242, 242, 0.5); padding: 0.5rem; border-radius: 0.75rem;">
                        <button onclick="Bookstore.cart.updateQuantity('${item.id}', -1)" class="btn" style="padding: 0.25rem; background: transparent;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg></button>
                        <span class="font-bold" style="width: 2rem; text-align: center;">${item.quantity}</span>
                        <button onclick="Bookstore.cart.updateQuantity('${item.id}', 1)" class="btn" style="padding: 0.25rem; background: transparent;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg></button>
                    </div>
                    <button onclick="Bookstore.cart.remove('${item.id}')" class="text-red" style="padding: 0.5rem; background: transparent; border: none; cursor: pointer;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></button>
                </div>
            `,
        )
        .join("");

      if (totalEl) totalEl.textContent = "Rs. " + this.getTotal().toFixed(2);
    },
  },

  // Auth Management
  auth: {
    user: JSON.parse(localStorage.getItem("bookstore_user")) || null,

    login(email) {
      this.user = { email };
      localStorage.setItem("bookstore_user", JSON.stringify(this.user));
      window.location.href = "index.html";
    },

    logout() {
      this.user = null;
      localStorage.removeItem("bookstore_user");
      window.location.reload();
    },

    updateUI() {
      const userEl = document.getElementById("user-profile");
      if (userEl) {
        if (this.user) {
          userEl.innerHTML = `
                        <div class="flex items-center gap-3" style="position: relative; cursor: pointer;" onclick="this.querySelector('.dropdown').style.display = this.querySelector('.dropdown').style.display === 'block' ? 'none' : 'block'">
                            <span class="text-white text-sm hidden md:block">${this.user.email}</span>
                            <img src="assets/bookstore/user-avatar.png" alt="User" style="width: 2.5rem; height: 2.5rem; border-radius: 50%; border: 2px solid var(--gold);">
                            <div class="dropdown" style="display: none; position: absolute; top: 100%; right: 0; margin-top: 0.5rem; width: 12rem; background: white; border-radius: 0.75rem; box-shadow: var(--shadow-lg); border: 1px solid var(--gray-light); padding: 0.5rem; z-index: 100;">
                                <a href="notifications.html" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: 0.5rem; color: var(--dark); text-decoration: none; transition: background 0.3s;" onmouseover="this.style.background='rgba(242,242,242,0.5)'" onmouseout="this.style.background='transparent'">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                                    <span>Notifications</span>
                                </a>
                                <button onclick="Bookstore.auth.logout()" style="width: 100%; display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: 0.5rem; color: var(--red); background: transparent; border: none; cursor: pointer; transition: background 0.3s;" onmouseover="this.style.background='rgba(249,5,5,0.1)'" onmouseout="this.style.background='transparent'">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    `;
        } else {
          userEl.innerHTML =
            '<a href="login.html" class="text-white" style="text-decoration: none; font-weight: 500;">Login</a>';
        }
      }
    },
  },

  // Page Specific Logic
  pages: {
    book() {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      const book =
        Bookstore.books.find((b) => b.id === id) || Bookstore.books[0];

      const container = document.getElementById("book-details");
      if (container) {
        container.innerHTML = `
                    <div class="grid grid-cols-2 gap-16 items-start">
                        <div style="background: rgba(242, 242, 242, 0.3); border-radius: 1.5rem; padding: 3rem; display: flex; align-items: center; justify-content: center; border: 1px solid var(--gray-light);">
                            <img src="${book.image}" alt="${book.title}" style="width: 100%; max-width: 24rem; height: auto; border-radius: 0.5rem; box-shadow: var(--shadow-lg);">
                        </div>
                        <div class="flex flex-col gap-8">
                            <div class="flex flex-col gap-4">
                                <div class="flex items-center gap-4">
                                    <span style="background: rgba(204, 149, 0, 0.1); color: var(--gold); padding: 0.25rem 1rem; border-radius: 999px; font-weight: 700; font-size: 0.875rem; text-transform: uppercase;">${book.category}</span>
                                </div>
                                <h2 class="text-5xl font-bold" style="line-height: 1.2;">${book.title}</h2>
                                <p class="text-2xl text-gray">${book.author}</p>
                            </div>
                            <div style="padding: 1.5rem 0; border-top: 1px solid var(--gray-light); border-bottom: 1px solid var(--gray-light);">
                                <p class="text-sm text-gray uppercase tracking-widest mb-1">Price</p>
                                <p class="text-4xl font-bold text-orange">${book.price}</p>
                            </div>
                            <div class="flex flex-col gap-4">
                                <h3 class="text-xl font-bold">About This Book</h3>
                                <p class="text-lg text-gray text-justify">${book.description}</p>
                            </div>
                            <div class="flex gap-4 mt-4">
                                <button onclick="Bookstore.cart.add('${book.id}')" class="btn btn-gold" style="flex: 1; justify-content: center; padding: 1.25rem;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
      }
    },

    checkout() {
      const totalEl = document.getElementById("checkout-total");
      if (totalEl) {
        const subtotal = Bookstore.cart.getTotal();
        const shipping = subtotal > 0 ? 200 : 0;
        const discount = subtotal > 1000 ? 400 : 0;
        const total = subtotal + shipping - discount;
        totalEl.textContent = "Rs. " + total.toFixed(2);
      }

      const form = document.getElementById("checkout-form");
      if (form) {
        form.onsubmit = (e) => {
          e.preventDefault();
          document.getElementById("checkout-content").innerHTML = `
                        <div class="text-center py-32">
                            <div class="flex items-center justify-center mb-8" style="color: #10b981;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            </div>
                            <h2 class="text-3xl font-bold mb-4">Payment Successful!</h2>
                            <p class="text-gray mb-2">Thank you for your purchase. Your books are on the way!</p>
                            <p class="text-sm text-gray">Redirecting you to home page...</p>
                        </div>
                    `;
          setTimeout(() => {
            Bookstore.cart.items = [];
            Bookstore.cart.save();
            window.location.href = "index.html";
          }, 3000);
        };
      }
    },
  },

  init() {
    this.cart.updateBadge();
    this.auth.updateUI();

    const path = window.location.pathname;
    if (path.includes("cart")) this.cart.renderCart();
    if (path.includes("book")) this.pages.book();
    if (path.includes("checkout")) this.pages.checkout();
  },
};

document.addEventListener("DOMContentLoaded", () => Bookstore.init());
