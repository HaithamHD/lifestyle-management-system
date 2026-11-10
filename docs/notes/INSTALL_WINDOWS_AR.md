# تشغيل المشروع على Windows

## الطريقة الموصى بها

فك الضغط، ثم افتح المجلد الذي يحتوي على ملف `artisan` وشغّل:

```text
START-LIFESTYLE.bat
```

النسخة الحالية لا تتطلب تفعيل `mbstring` أو SQLite يدويًا في `php.ini` العام. المشغّل ينشئ تلقائيًا:

```text
.runtime-php/php.ini
```

ويستخدمه لهذه الجلسة فقط لتفعيل:

```text
mbstring
openssl
PDO
pdo_sqlite
sqlite3
fileinfo
```

## عند ظهور خطأ

شغّل:

```text
DIAGNOSE-PHP.bat
```

ثم انسخ الناتج كاملًا.

## شروط مهمة

- يجب أن يكون XAMPP/PHP 8.2 أو أحدث مثبتًا.
- يجب أن يوجد مجلد إضافات PHP، غالبًا:

```text
C:\xampp\php\ext
```

- أبقِ نافذة `START-LIFESTYLE.bat` مفتوحة.
- لا تضغط `Ctrl+C` إلا لإيقاف السيرفر.
