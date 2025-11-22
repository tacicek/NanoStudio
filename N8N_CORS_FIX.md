# N8N CORS Hatası Çözümü

## Sorun
```
Access to fetch at 'https://designx.app.n8n.cloud/webhook/...' has been blocked by CORS policy
```

## Çözüm: N8N Workflow'da CORS Ayarları

### 1. Webhook Node Ayarları

N8N'de **Webhook** node'una tıklayın ve şu ayarları yapın:

**Response Headers:**
```json
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}
```

### 2. OPTIONS Request Desteği

Webhook node'unda:
- **Respond** seçeneğini açın
- **Response Mode**: "On Received"
- **Response Code**: 200

### 3. Alternatif: Set Headers Node Ekleyin

Webhook'tan sonra bir **Set** node ekleyin:

**Headers to Set:**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Test

Değişiklikleri yaptıktan sonra workflow'u kaydedin ve aktif edin.
