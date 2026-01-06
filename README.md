# COLLOSPOT - Smart WiFi Billing System

**"Connect. Pay. Browse — Seamlessly."**

COLLOSPOT is a comprehensive WiFi billing system designed specifically for Kenya, featuring M-Pesa integration, MikroTik router control, and a modern web-based admin dashboard.

## 🌟 Features

### 🧍♂️ Customer Features
- **Captive Portal**: Custom-branded login page with mobile-first design
- **M-Pesa Integration**: STK Push and Paybill payments via Daraja API
- **Multiple Plans**: Time-based, data-based, and subscription packages
- **Auto-Connect**: Automatic internet access after payment
- **Real-time Status**: Connection status and usage monitoring
- **Multi-language**: English and Swahili support

### 💼 Admin Features
- **Dashboard**: Real-time analytics and system monitoring
- **User Management**: Customer account management and activity tracking
- **Plan Management**: Create and manage internet packages
- **Session Control**: Monitor and terminate user sessions
- **Payment Tracking**: Complete payment history and reporting
- **Router Integration**: MikroTik API for bandwidth and access control

### 🔧 Technical Features
- **Modern Stack**: React 18 + TypeScript + Node.js + PostgreSQL
- **Security**: JWT authentication, HTTPS, rate limiting
- **Scalable**: Cloud-ready with Docker support
- **Notifications**: SMS alerts via Africa's Talking
- **API-First**: RESTful API with comprehensive documentation

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Customer      │    │   Admin         │    │   MikroTik      │
│   Portal        │    │   Dashboard     │    │   Router        │
│   (React)       │    │   (React)       │    │   (API)         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Backend API   │
                    │   (Node.js)     │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- MikroTik router with API access
- M-Pesa Daraja API credentials
- Africa's Talking SMS API (optional)

### 1. Clone Repository
```bash
git clone <repository-url>
cd wifi-billing-system
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access Applications
- **Customer Portal**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **API Documentation**: http://localhost:5000/health

## 📱 Responsive Design

The admin dashboard is fully responsive and optimized for:
- **Mobile devices** (< 640px): Card-based layouts, touch-friendly interfaces
- **Tablets** (640px - 1024px): Adaptive grids and navigation
- **Desktop** (> 1024px): Full table views and multi-column layouts

### Mobile Features
- Collapsible sidebar navigation
- Card-based data display replacing tables
- Touch-optimized buttons and controls
- Responsive pagination and filters
- Optimized spacing and typography

## 📋 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/collospot_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# M-Pesa Daraja API
MPESA_CONSUMER_KEY="your-mpesa-consumer-key"
MPESA_CONSUMER_SECRET="your-mpesa-consumer-secret"
MPESA_SHORTCODE="174379"
MPESA_PASSKEY="your-mpesa-passkey"
MPESA_CALLBACK_URL="https://yourdomain.com/api/payments/mpesa/callback"

# MikroTik Router
MIKROTIK_HOST="192.168.1.1"
MIKROTIK_USERNAME="admin"
MIKROTIK_PASSWORD="your-router-password"

# SMS (Africa's Talking)
AFRICASTALKING_USERNAME="sandbox"
AFRICASTALKING_API_KEY="your-africastalking-api-key"
```

### Default Admin Credentials
- **Email**: admin@collospot.com
- **Password**: admin123

## 💰 Payment Plans

The system comes with pre-configured plans:

| Plan | Duration | Price | Data Limit | Speed |
|------|----------|-------|------------|-------|
| Basic 1 Hour | 1 hour | KES 20 | 500MB | 5Mbps |
| Standard 6 Hours | 6 hours | KES 100 | 2GB | 10Mbps |
| Premium 24 Hours | 24 hours | KES 300 | 10GB | 20Mbps |
| Weekly Package | 7 days | KES 1,500 | 50GB | 25Mbps |
| Monthly Unlimited | 30 days | KES 5,000 | Unlimited | 50Mbps |

## 🔌 API Endpoints

### Public API (Customer Portal)
- `GET /api/public/plans` - Get available plans
- `POST /api/public/register` - Register new user
- `POST /api/public/login` - User login
- `POST /api/public/payment` - Initiate M-Pesa payment
- `GET /api/public/payment/status/:id` - Check payment status
- `POST /api/public/connect` - Connect to internet

### Admin API
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/plans` - Manage plans
- `GET /api/admin/sessions` - Monitor sessions
- `GET /api/admin/payments` - Payment history

## 🛠️ Development

### Database Schema
The system uses Prisma ORM with the following main models:
- **User**: Customer and admin accounts
- **Plan**: Internet packages
- **Session**: Active user connections
- **Payment**: M-Pesa transactions
- **Voucher**: Prepaid codes (optional)

### Responsive Breakpoints
- **Mobile**: `< 640px` - Card layouts, stacked navigation
- **Small**: `sm: ≥ 640px` - Improved spacing, inline elements
- **Large**: `lg: ≥ 1024px` - Table views, sidebar navigation
- **Extra Large**: `xl: ≥ 1280px` - Multi-column layouts

### Adding New Features
1. Update Prisma schema in `backend/prisma/schema.prisma`
2. Run `npm run db:generate` and `npm run db:push`
3. Add API endpoints in `backend/src/routes/`
4. Update frontend components in `frontend/src/`
5. Ensure responsive design using Tailwind CSS breakpoints

## 🚀 Deployment

### Using Docker
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Manual Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Build frontend: `npm run build`
4. Start backend: `npm start`
5. Serve frontend with Nginx

### Cloud Deployment (AWS/DigitalOcean)
1. Set up EC2 instance or Droplet
2. Install Node.js, PostgreSQL, Nginx
3. Configure SSL certificates
4. Set up domain and DNS
5. Configure M-Pesa callback URLs

## 📱 Mobile App (Optional)

The system is designed to support a mobile app using the same API:
- React Native or Flutter
- QR code WiFi login
- Push notifications
- Offline voucher support

## 🔒 Security Features

- **HTTPS Enforcement**: SSL/TLS encryption
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: API request throttling
- **Input Validation**: Comprehensive data validation
- **SQL Injection Protection**: Prisma ORM safety
- **CORS Configuration**: Cross-origin request control

## 📊 Monitoring & Analytics

- Real-time dashboard with key metrics
- User activity tracking
- Revenue reporting
- Session monitoring
- Payment analytics
- Router status monitoring

## 🆘 Support & Troubleshooting

### Common Issues

1. **M-Pesa payments failing**
   - Check Daraja API credentials
   - Verify callback URL is accessible
   - Ensure phone number format is correct

2. **Router connection issues**
   - Verify MikroTik API is enabled
   - Check network connectivity
   - Confirm credentials are correct

3. **Database connection errors**
   - Check PostgreSQL is running
   - Verify DATABASE_URL format
   - Ensure database exists

### Getting Help
- Check the logs in `backend/logs/`
- Review API responses for error details
- Test individual components separately

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Contact

For support or inquiries:
- **Email**: support@collospot.com
- **Phone**: +254 700 000 000
- **Website**: https://collospot.com

---

**COLLOSPOT** - Empowering Kenya's digital connectivity, one WiFi connection at a time. 🇰🇪