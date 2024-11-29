# URL Shortener

A modern URL shortening service with a beautiful UI built with Node.js, Express, MongoDB, and Tailwind CSS.

## 🌟 Features

- **URL Shortening**: Create short, memorable links instantly
- **QR Code Generation**: Generate QR codes for shortened URLs
- **Visit Tracking**: Track the number of visits to each shortened URL
- **Beautiful UI**: Modern, responsive interface with dark mode support
- **Copy to Clipboard**: Easy one-click copying of shortened URLs
- **Bulk Actions**: Delete individual or all URLs
- **Pagination**: Efficient handling of large numbers of URLs
- **Dark Mode**: Toggle between light and dark themes

## 🛠 Tech Stack

- **Frontend**:
  - Tailwind CSS (via CDN)
  - EJS templating
  - Vanilla JavaScript
  - QRCode.js for QR generation
  
- **Backend**:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - Nanoid for URL generation
  - Express Validator

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/mhakimsaputra17/url-shortener-web
   cd url-shortener-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_uri
   PORT=3000
   BASE_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## 🌐 API Endpoints

### Create Shortened URL
```http
POST /api/v1/urls
Content-Type: application/json

{
  "originalUrl": "https://example.com/very-long-url"
}
```

### Get URL Details
```http
GET /api/v1/urls/:shortCode
```

### Get QR Code
```http
GET /api/v1/urls/:shortCode/qrcode
```

### List All URLs
```http
GET /api/v1/urls?page=1&limit=5
```

### Delete URL
```http
DELETE /api/v1/urls/:shortCode
```

### Delete All URLs
```http
DELETE /api/v1/urls/all
```

## 💡 Usage Examples

### Creating a Short URL
```javascript
const response = await fetch('/api/v1/urls', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ originalUrl: 'https://example.com' })
});
```

### Generating QR Code
```javascript
const qrCode = await fetch(`/api/v1/urls/${shortCode}/qrcode`);
```

## 🎨 UI Features

- Responsive design that works on all devices
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Dark mode support with system preference detection
- Toast notifications for actions
- Loading states and error handling
- Intuitive copy-to-clipboard functionality

## 📝 License

MIT © [mhakimsaputra17](https://github.com/mhakimsaputra17)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/mhakimsaputra17/url-shortener-web/issues).

## 👨‍💻 Author

**M Hakim Saputra**
- GitHub: [@mhakimsaputra17](https://github.com/mhakimsaputra17)

