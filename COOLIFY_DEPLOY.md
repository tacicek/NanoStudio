# Coolify Deploy Rehberi

## 🚀 Hızlı Deploy

### 1. Coolify'da Yeni Uygulama Oluştur

1. Coolify Dashboard → **New Resource** → **Application**
2. Git repository'nizi seçin veya bağlayın
3. Branch: `main` (veya kullandığınız branch)

### 2. Build Ayarları

- **Build Pack**: Dockerfile
- **Port**: 80
- **Base Directory**: `/` (root)

### 3. Environment Variables

Coolify'da sadece N8N webhook URL'ini ekleyin:

```
N8N_WEBHOOK_URL=https://n8n.g53.ch/webhook/6d59b41c-223e-47c8-9186-4bd81541da72
```

**Nasıl Eklenir:**
- Application Settings → Environment → Add Variable
- Her satır için ayrı variable ekleyin

### 4. Deploy

**Deploy** butonuna tıklayın. Build süreci:
1. Dependencies yüklenir (npm ci)
2. Vite build çalışır
3. Nginx container oluşturulur
4. Uygulama yayına alınır

### 5. Domain Ayarları (Opsiyonel)

- Settings → Domains
- Custom domain ekleyin
- SSL otomatik aktif olur

## 🔧 Lokal Test

Deploy öncesi lokal test:

```bash
# Build image
docker build -t nanostudio .

# Run container
docker run -p 3000:80 \
  -e N8N_WEBHOOK_URL=https://n8n.g53.ch/webhook/6d59b41c-223e-47c8-9186-4bd81541da72 \
  nanostudio

# Test: http://localhost:3000
```

## 📋 Gerekli Dosyalar

✅ Dockerfile  
✅ nginx.conf  
✅ .dockerignore  
✅ .env.example  

Tüm dosyalar hazır, deploy edebilirsiniz!

## 🐛 Sorun Giderme

**Build hatası alıyorsanız:**
- Logs'u kontrol edin
- Environment variable'ların doğru girildiğinden emin olun

**Uygulama açılmıyorsa:**
- Port 80'in expose edildiğini kontrol edin
- Nginx loglarını inceleyin

**N8N bağlantı hatası:**
- N8N_WEBHOOK_URL'in doğru olduğunu kontrol edin
- N8N workflow'unun aktif olduğundan emin olun
