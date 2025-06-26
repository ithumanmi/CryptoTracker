# Theo Dõi Giá Coin - Crypto Tracker

Ứng dụng web theo dõi giá coin và phân tích thị trường crypto với các tính năng chuyên nghiệp dành cho các chuyên viên phân tích và săn coin tiềm năng.

## 🚀 Tính Năng Chính

### 📊 Dashboard
- **Tổng quan thị trường**: Hiển thị tổng market cap, volume, và các chỉ số quan trọng
- **Top 20 coins**: Danh sách coin hàng đầu theo market cap
- **Thống kê nhanh**: Market change, active coins, và sentiment

### 🔍 Săn Gem
- **Phân tích tokenomics**: Tổng cung, lưu thông, phân bổ token
- **Social metrics**: Twitter, Telegram, Discord followers
- **Risk assessment**: Đánh giá rủi ro và tiềm năng
- **Scoring system**: Hệ thống điểm đánh giá coin

### 📈 Phân Tích Thị Trường
- **Top gainers/losers**: Coin tăng/giảm mạnh nhất
- **Volume leaders**: Coin có khối lượng giao dịch cao
- **Technical analysis**: RSI, MACD, Bollinger Bands
- **Support & Resistance**: Mức hỗ trợ và kháng cự

### 💼 Portfolio Management
- **Quản lý danh mục**: Thêm, sửa, xóa coin
- **Theo dõi lãi/lỗ**: Tính toán profit/loss real-time
- **Phân bổ danh mục**: Biểu đồ phân bổ tài sản
- **Thống kê chi tiết**: Coin có lãi/lỗ cao nhất

### 📰 Tin Tức Crypto
- **Tin tức real-time**: Cập nhật tin tức mới nhất
- **Sentiment analysis**: Phân tích tâm lý thị trường
- **Filter theo sentiment**: Lọc tin tích cực/tiêu cực
- **Market trends**: Xu hướng thị trường

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## 📦 Cài Đặt

1. **Clone repository**:
```bash
git clone https://github.com/your-username/theo-doi-gia-coin.git
cd theo-doi-gia-coin
```

2. **Cài đặt dependencies**:
```bash
npm install
```

3. **Chạy ứng dụng**:
```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## 🔧 Cấu Hình

### API Keys
Ứng dụng sử dụng CoinGecko API (miễn phí). Để sử dụng các API khác:

1. Tạo file `.env` trong thư mục gốc
2. Thêm API keys:
```env
REACT_APP_COINGECKO_API_KEY=your_api_key
REACT_APP_NEWS_API_KEY=your_news_api_key
```

### Customization
- **Theme**: Chỉnh sửa `tailwind.config.js` để thay đổi màu sắc
- **Components**: Tùy chỉnh components trong thư mục `src/components`
- **API**: Thay đổi endpoints trong `src/services/cryptoApi.ts`

## 📱 Responsive Design

Ứng dụng được thiết kế responsive và hoạt động tốt trên:
- Desktop (1920px+)
- Laptop (1366px+)
- Tablet (768px+)
- Mobile (375px+)

## 🎯 Hướng Dẫn Sử Dụng

### Cho Chuyên Viên Phân Tích

1. **Dashboard**: Xem tổng quan thị trường và top coins
2. **Săn Gem**: Phân tích coin tiềm năng với các chỉ số chi tiết
3. **Market Analysis**: Xem phân tích kỹ thuật và xu hướng
4. **Portfolio**: Quản lý danh mục đầu tư cá nhân
5. **News**: Theo dõi tin tức và sentiment thị trường

### Phân Tích Tokenomics

- **Total Supply**: Tổng cung token
- **Circulating Supply**: Lượng token đang lưu thông
- **Burned Tokens**: Token đã được đốt
- **Team Allocation**: Phần trăm token của team
- **Liquidity**: Phần trăm thanh khoản

### Đánh Giá Rủi Ro

- **LOW**: Rủi ro thấp, phù hợp đầu tư dài hạn
- **MEDIUM**: Rủi ro trung bình, cân nhắc kỹ
- **HIGH**: Rủi ro cao, chỉ dành cho trader kinh nghiệm

## 🔮 Roadmap

### Phase 1 (Hiện tại)
- ✅ Dashboard cơ bản
- ✅ Săn gem với phân tích tokenomics
- ✅ Portfolio management
- ✅ Tin tức crypto

### Phase 2 (Sắp tới)
- 🔄 Real-time price updates
- 🔄 Advanced technical analysis
- 🔄 Price alerts
- 🔄 Social trading features

### Phase 3 (Tương lai)
- 📋 AI-powered analysis
- 📋 DeFi protocol integration
- 📋 NFT tracking
- 📋 Mobile app

## 🤝 Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## ⚠️ Disclaimer

**Đây không phải là lời khuyên đầu tư tài chính.** Ứng dụng chỉ cung cấp thông tin và công cụ phân tích. Người dùng cần tự chịu trách nhiệm về quyết định đầu tư của mình.

## 📞 Liên Hệ

- **Email**: contact@cryptotracker.com
- **Telegram**: @cryptotracker
- **Twitter**: @cryptotracker

---

**Made with ❤️ for the crypto community** 