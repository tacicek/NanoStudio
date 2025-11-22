# N8N Workflow Güncelleme

## Değişiklik: Base64 Görsel Desteği

Artık görsel **base64** formatında gönderiliyor.

### Webhook'a Gelen Veri:
```json
{
  "image": "base64_encoded_image_data",
  "prompt": "user prompt text"
}
```

### N8N Workflow'da Yapılacaklar:

1. **Create Request** node'unda `image_url` parametresini kaldırın
2. Yeni bir node ekleyin: **Convert Base64 to URL**
   - Base64'ü bir image hosting servisine yükleyin (Cloudinary, ImgBB, vb.)
   - Veya direkt base64'ü Fal.ai'ye gönderin (destekliyorsa)

### Alternatif: Base64'ü Data URI olarak kullan
```
data:image/png;base64,{{ $json.body.image }}
```

Fal.ai eğer data URI destekliyorsa:
```
image_url: data:image/png;base64,{{ $json.body.image }}
```
