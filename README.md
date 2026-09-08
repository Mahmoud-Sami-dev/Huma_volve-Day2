# Backend API — User CRUD + Auth + RBAC + Streams

مشروع كامل بيغطي كل الـ 12 تاسك اللي في الـ PDF.

## 1. التشغيل (Setup)

```bash
cd backend-api
npm install
cp .env.example .env
```

افتح `.env` وحط:
- `MONGO_URI` بتاع MongoDB Atlas بتاعك
- غيّر `ACCESS_TOKEN_SECRET` و `REFRESH_TOKEN_SECRET` لأي string عشوائي طويل

```bash
npm run dev   # أو npm start
```

السيرفر هيشتغل على `http://localhost:5000`

---

## 2. بنية المشروع (Task 2)

```
backend-api/
├── config/db.js              # الاتصال بقاعدة البيانات
├── models/User.js             # Mongoose User Model
├── controllers/
│   ├── userController.js      # منطق الـ CRUD
│   └── authController.js      # منطق الـ Auth
├── routes/
│   ├── userRoutes.js
│   ├── authRoutes.js
│   ├── demoRoutes.js          # أمثلة req.params / req.query
│   └── fileRoutes.js          # أمثلة الـ Streams
├── middleware/
│   ├── authMiddleware.js       # التحقق من الـ Access Token
│   ├── roleMiddleware.js       # التحقق من الصلاحيات (admin/user)
│   └── errorMiddleware.js      # معالجة الأخطاء المركزية
├── utils/
│   ├── generateTokens.js
│   ├── validateUserInput.js
│   ├── appError.js
│   ├── asyncHandler.js
│   ├── streamCopy.js           # Task 11
│   └── pipeCopy.js             # Task 12
└── server.js
```

---

## 3. اختبار الـ Endpoints على Postman

### Auth (Task 4, 5, 6)
| Method | Endpoint | Body |
|---|---|---|
| POST | `/auth/register` | `{ "name": "Ali", "email": "ali@test.com", "password": "Test@1234" }` |
| POST | `/auth/login` | `{ "email": "ali@test.com", "password": "Test@1234" }` |
| POST | `/auth/refresh-token` | (بيقرأ الكوكي تلقائيًا) |
| POST | `/auth/logout` | — |

**مهم في Postman:** روح لـ Settings → فعّل "Send cookies automatically" أو استخدم الـ Cookie Manager، عشان `accessToken` و `refreshToken` يترسلوا مع كل request زي ما بيحصل في المتصفح.

### Users (Task 1, 8) — كل الـ routes دي محمية، والـ Create/Update/Delete admin بس
| Method | Endpoint |
|---|---|
| GET | `/users` |
| GET | `/users/:id` |
| POST | `/users` (admin) |
| PUT | `/users/:id` (admin) |
| DELETE | `/users/:id` (admin) |

عشان تعمل أول admin، سجّل يوزر عادي، وبعدين غيّر الـ `role` بتاعه لـ `"admin"` يدويًا من MongoDB Atlas مباشرة (أول مرة بس).

### Demo — Params vs Query (Task 10)
- `GET /demo/params/123/hello` → بيرجع `{ id: "123", name: "hello" }`
- `GET /demo/query?search=ali&page=2` → بيرجع `{ search: "ali", page: "2" }`

**الفرق:**
- `req.params`: أجزاء من الـ URL نفسه، بتحدد resource معين (زي `/users/:id`)
- `req.query`: بعد الـ `?`، اختيارية، للفلترة والترتيب والصفحات

### File Streams (Task 11, 12)
- `GET /file/copy-stream` → بينسخ ملف باستخدام Readable/Writable streams يدويًا
- `GET /file/copy-pipe` → بينسخ نفس الملف باستخدام `.pipe()`

كل endpoint بيرجع `contentMatches: true` لو النسخ نجح ومطابق للمصدر.

---

## 4. شرح تدفق الـ JWT Cookies (Task 6)

1. `login` ناجح → السيرفر بيحط `accessToken` (15 دقيقة) و `refreshToken` (7 أيام) في HTTP-only cookies
2. أي request لروت محمي → الـ `authMiddleware` بيقرأ `accessToken` من الكوكي
3. لما الـ `accessToken` ينتهي → تنادي `/auth/refresh-token` وهو بيتحقق من `refreshToken` ويرجع `accessToken` جديد
4. `logout` → بيمسح الكوكيز ويلغي الـ `refreshToken` من قاعدة البيانات

**HTTP-only** يعني الـ JavaScript في المتصفح مش قادر يقرأ الكوكي دي (حماية من XSS).

---

## 5. كل تاسك اتحل فين

| Task | الملفات |
|---|---|
| 1. User CRUD | `controllers/userController.js`, `routes/userRoutes.js` |
| 2. Project Structure | البنية كلها + `config/db.js` |
| 3. Validation | `models/User.js`, `utils/validateUserInput.js` |
| 4. Authentication | `controllers/authController.js`, `utils/generateTokens.js` |
| 5. Auth Endpoints | `routes/authRoutes.js` |
| 6. JWT Cookies | `utils/generateTokens.js` (cookie options) |
| 7. RBAC | `models/User.js` (role field), `middleware/roleMiddleware.js` |
| 8. Protected Routes | `routes/userRoutes.js` |
| 9. Error Handling | `middleware/errorMiddleware.js`, `utils/appError.js` |
| 10. Params & Query | `routes/demoRoutes.js` |
| 11. Streams Copy | `utils/streamCopy.js` |
| 12. Pipe Copy | `utils/pipeCopy.js` |

بالتوفيق! 🚀
