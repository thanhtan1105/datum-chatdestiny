# Numerology Chatbot UI

A beautiful, modern chatbot interface for the numerology service with stunning animations and effects.

## Features

✨ **Beautiful Design**
- Glassmorphism effects
- Gradient backgrounds
- Smooth animations with Framer Motion
- Responsive layout

🎨 **Visual Effects**
- Animated background orbs
- Floating particles
- Typing indicators
- Message animations
- Hover effects

🚀 **Modern Stack**
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Lucide Icons

## Quick Start

### 1. Install Dependencies

```bash
cd fe
npm install
```

### 2. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:8000
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
fe/
├── src/
│   ├── components/
│   │   ├── BackgroundEffects.jsx  # Animated background
│   │   ├── ChatInterface.jsx      # Main chat container
│   │   ├── Header.jsx              # App header
│   │   ├── Message.jsx             # Individual message
│   │   ├── MessageInput.jsx        # Input field
│   │   ├── MessageList.jsx         # Messages container
│   │   └── TypingIndicator.jsx    # Typing animation
│   ├── services/
│   │   └── api.js                  # API client
│   ├── App.jsx                     # Root component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## API Integration

The frontend connects to the backend API at `http://localhost:8000` by default.

### Endpoints Used

- `POST /chat` - Send messages
- `GET /events/{actor_id}/{session_id}` - Get conversation history
- `GET /health` - Health check

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
colors: {
  primary: { ... },
  mystical: { ... }
}
```

### Animations

Modify animations in `tailwind.config.js`:

```js
animation: {
  'float': 'float 3s ease-in-out infinite',
  'glow': 'glow 2s ease-in-out infinite alternate',
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
