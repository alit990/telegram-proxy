const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// برای دریافت raw body
app.use(express.raw({ type: '*/*', limit: '50mb' }));

app.all('*', async (req, res) => {
  const path = req.path;
  const search = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';

  console.log('📥 Incoming request:', {
    method: req.method,
    path: path,
    search: search
  });

  // بررسی path
  let telegramPath = path;

  if (path.startsWith('/bot')) {
    telegramPath = path;
  } else if (path === '/' || path === '') {
    return res.status(200).send('Telegram Proxy is running ✅');
  } else {
    return res.status(400).send('Invalid request. Path must start with /bot');
  }

  // ساخت URL تلگرام
  const telegramUrl = `https://api.telegram.org${telegramPath}${search}`;
  
  console.log('📤 Forwarding to:', telegramUrl);

  try {
    const options = {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json'
      }
    };

    // اگر بدنه درخواست داشت اضافه کن
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      options.body = req.body;
    }

    const response = await fetch(telegramUrl, options);
    const data = await response.text();

    console.log('✅ Response status:', response.status);

    res.status(response.status)
       .set('Content-Type', response.headers.get('content-type'))
       .send(data);

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).send('Proxy error: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

**فایل `.gitignore`:**
```
node_modules/
.env
```

### 3️⃣ آپلود کد به GitHub
1. این فایل‌ها را در یک ریپوزیتوری GitHub قرار بده
2. Push کن

### 4️⃣ اتصال به Render
1. در صفحه **Create a new Web Service**:
   - **Connect a repository** را انتخاب کن
   - اکانت GitHub خودت را وصل کن
   - ریپوزیتوری پروژه را انتخاب کن

2. تنظیمات:
   - **Name**: یک نام دلخواه (مثلاً `telegram-proxy`)
   - **Region**: نزدیک‌ترین منطقه به ایران رو انتخاب کن (مثلاً Singapore یا Frankfurt)
   - **Branch**: `main` یا `master`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free** را انتخاب کن

3. روی **Create Web Service** کلیک کن

### 5️⃣ دریافت لینک
بعد از چند دقیقه، Render یک لینک مثل این بهت میده:
```
https://telegram-proxy-xxxx.onrender.com
```

این لینک دقیقاً مثل لینک Cloudflare Worker عمل می‌کنه.

### 6️⃣ استفاده
درخواست‌های تلگرام رو به این صورت بفرست:
```
https://telegram-proxy-xxxx.onrender.com/bot<TOKEN>/sendMessage
