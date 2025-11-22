# N8N Workflow Kurulumu

## Workflow'unuzda Değiştirilmesi Gerekenler:

**Create Request** node'unda:
- `prompt` parametresini: `={{ $json.body.prompt }}` olarak değiştirin
- `image_url` parametresini: `={{ $json.body.query }}` olarak değiştirin

## Webhook URL:
```
https://your-n8n-instance.com/webhook/6d59b41c-223e-47c8-9186-4bd81541da72
```

## Gelen Veri Formatı:
```json
{
  "query": "https://imgur.com/image-url.jpg",
  "prompt": "user prompt text"
}
```

## Dönen Veri Formatı:
```json
{
  "images": [
    {
      "url": "https://fal.ai/result-image.jpg"
    }
  ]
}
```
