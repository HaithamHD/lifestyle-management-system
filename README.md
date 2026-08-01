# Lifestyle Management System — Original UI Final Edition v2

مشروع Laravel 12 متكامل يجمع الـBackend REST API مع الواجهات الأصلية، مع مشغّل Windows يقوم تلقائيًا بتجهيز إضافات PHP المطلوبة للمشروع دون الحاجة إلى تعديل ملف `php.ini` العام يدويًا.

## الوظائف الموجودة

- Register / Login باستخدام Laravel Sanctum.
- User Dashboard وإحصائيات أسبوعية.
- Tasks: إنشاء، عرض، تعديل، حذف، وإكمال المهمة.
- Habits: إنشاء العادات وتسجيل الإنجاز اليومي.
- Journal entries.
- Mood tracking.
- Notifications.
- Profile management.
- Admin Dashboard وإدارة حالة المستخدمين.
- Repository, Dependency Injection, Observer, Strategy, Factory, MVC.

## التشغيل السريع على Windows

1. فك ضغط الملف كاملًا.
2. افتح المجلد الذي يحتوي مباشرة على `artisan`.
3. شغّل:

```text
START-LIFESTYLE.bat
```

المشغّل يقوم تلقائيًا بما يلي:

- العثور على PHP أو XAMPP.
- إنشاء ملف PHP محلي داخل `.runtime-php/php.ini`.
- تفعيل `mbstring`, `openssl`, `pdo_sqlite`, `sqlite3`, و`fileinfo` للمشروع فقط.
- تجهيز SQLite.
- مسح Laravel cache.
- تشغيل migrations.
- اختيار منفذ متاح وفتح المتصفح.

هذا الحل لا يغيّر إعداد PHP العام على الجهاز. المجلد `.runtime-php` يُنشأ محليًا داخل المشروع.

## سبب خطأ mbstring في النسخة السابقة

الرسالة:

```text
PHP extension mbstring is disabled
```

تعني أن PHP الذي تم تشغيل المشروع به لم يكن يحمل إضافة `mbstring` من ملف `php.ini` النشط. النسخة الحالية تعالج ذلك تلقائيًا بإنشاء إعداد PHP محلي للمشروع وتفعيل الإضافات الموجودة في مجلد `ext` الخاص بـPHP/XAMPP.

## الحسابات التجريبية

### User

```text
Email: user@lifestyle.test
Password: Password123!
```

### Admin

```text
Email: admin@lifestyle.test
Password: Admin123!
```

بعد تسجيل الدخول بحساب Admin افتح:

```text
http://127.0.0.1:8001/admin/dashboard
```

قد يستخدم المشغّل المنفذ `8002` أو `8003` عندما يكون `8001` مستخدمًا؛ اتبع الرابط الذي يظهر في نافذة التشغيل.

## تشخيص PHP

عند استمرار مشكلة PHP شغّل:

```text
DIAGNOSE-PHP.bat
```

سيعرض:

- مسار `php.exe` المستخدم.
- ملف `php.ini` العام.
- ملف `php.ini` المحلي للمشروع.
- الإضافات المحملة.

## قاعدة البيانات

الوضع الافتراضي يستخدم SQLite جاهزة:

```text
database/database.sqlite
```

لإعادة بيانات العرض، أوقف السيرفر ثم شغّل:

```text
RESET-DEMO-DATABASE.bat
```

يوجد إعداد MySQL بديل داخل:

```text
.env.mysql.example
```

## الواجهة الأصلية

الواجهة الأصلية المربوطة موجودة داخل:

```text
resources/views/original/
public/css/original-overrides.css
public/js/original-app.js
frontend-source/
```

لا يحتاج التشغيل إلى `npm install` أو `npm run dev`. تستخدم الواجهة Google Fonts وTailwind Play CDN، لذلك يلزم اتصال بالإنترنت لظهور الخطوط والتنسيق الأصلي بالكامل.

## أهم المسارات

```text
/
/login
/register
/app/dashboard
/app/tasks
/app/habits
/app/journal
/app/mood
/app/notifications
/app/profile
/admin/dashboard
/api/*
```

## التشغيل اليدوي باستخدام الإعداد المحلي

شغّل `START-LIFESTYLE.bat` مرة واحدة لإنشاء `.runtime-php/php.ini`. بعد ذلك يمكن تشغيل الأوامر يدويًا من PowerShell:

```powershell
cd "C:\Projects\Lifestyle-Original-UI-Final-v2"
$env:PHPRC = "$PWD\.runtime-php"
$env:PHP_INI_SCAN_DIR = ""
php artisan optimize:clear
php artisan migrate --force
php artisan serve --host=127.0.0.1 --port=8001
```

## فحص المشروع

```powershell
powershell -ExecutionPolicy Bypass -File .\VERIFY-PROJECT.ps1
php artisan route:list --except-vendor
php artisan test
```
