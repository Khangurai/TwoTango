
# 📘 TwoTango Expense Tracker

**TwoTango Expense Tracker** သည် အသုံးစရိတ်များကို အလွယ်တကူ ထည့်သွင်း၊ တည်းဖြတ်ပြီး Local Storage တွင် သိမ်းဆည်းထားနိုင်သော Web App တစ်ခုဖြစ်ပါသည်။ ဤ App တွင် တည်နေရာအချက်အလက်များကိုပါ ထည့်သွင်းနိုင်ပါသည်။

Slides: https://gamma.app/docs/TwoTango-Our-Tracker-suv48xnb4jfebu8

---

## 🔧 Features

- ✅ အသုံးစရိတ်သစ် ထည့်သွင်းခြင်း
- ✏️ အသုံးစရိတ် တည်းဖြတ်ခြင်း
- 🗑 အသုံးစရိတ် ဖျက်ခြင်း (ဖော်ပြထားလျှင်)
- 📍 Google Maps API ဖြင့် လက်ရှိတည်နေရာ ရယူခြင်း
- 🗺 စိတ်ကြိုက်တည်နေရာ ထည့်သွင်းခြင်း
- 🧠 LocalStorage တွင် ဒေတာ သိမ်းဆည်းထားခြင်း
- 🧾 ထည့်သွင်းသည့်အချက်အလက်များ:
  - ဖော်ပြချက် (`description`)
  - ငွေပမာဏ (`amount`)
  - အမျိုးအစား (`category`)
  - ရက်စွဲ (`date`)
  - ပေးသည့်သူ (`paidBy`)
  - မှတ်ချက် (`notes`)
  - တည်နေရာ (`location`) *(Optional)*

---

## 🚀 How to Use

1. **Clone this repository**
   ```bash
   git clone https://github.com/Khangurai/TwoTango.git
   ```

2. **Open `index.html` in your browser**

3. **Start Tracking!**
   - `Add Expense` ခလုတ်ကိုနှိပ်ပြီး အသုံးစရိတ်ထည့်ပါ။
   - `Include Location` ကို အမှန်ခြစ်ခြင်းဖြင့် တည်နေရာကို ထည့်နိုင်သည်။
   - Google Maps Geocoding API က သင်၏ latitude/longitude မှနေ၍ တည်နေရာနာမည်ကို ပြန်ထုတ်ပေးပါသည်။

---

## 🗂 Technologies Used

- HTML + CSS + Bootstrap 5
- JavaScript (Vanilla)
- Google Maps Geocoding API
- Browser LocalStorage

---

## 🔐 Requirements

- Browser with Geolocation API support
- Google Maps API Key (for Geocoding)
  ```html
  <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
  ```

---

## 📎 Sample Data Storage (LocalStorage)
```json
[
  {
    "id": "1728182712817",
    "description": "Dinner with friends",
    "amount": 15000,
    "category": "Food & Dining",
    "date": "2025-06-05",
    "paidBy": "Aung Kaung Khant",
    "notes": "BBQ place",
    "location": {
      "name": "Yangon, Myanmar",
      "address": "16.8661, 96.1951"
    }
  }
]
```

---

## 💬 Author

**Aung Kaung Khant**  
Software Enthusiast  
GitHub: [@khangurai](https://github.com/khangurai)

---

## 📄 License

This project is licensed under the MIT License.
