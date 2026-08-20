# شرح الكود الجديد

مرجع لكل ملف أضفته أو غيّرته جوهرياً: ماذا يفعل، كيف يُستعمل، ولماذا كُتب بهذا الشكل تحديداً.
مرتّب حسب الملفات لا حسب المزايا، حتى تجدي ما تريدينه بسرعة.

**اصطلاح:** 🆕 ملف جديد · ✏️ ملف عُدّل جوهرياً

---

# الجزء الأول: الخادم

## 🆕 `utils/env.js` — تحميل البيئة والتحقق منها

```js
import "dotenv/config";   // أول سطر، وله سبب

const REQUIRED = ["DATABASE_URL", "JWT_SECRET"];
const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}…`);
  process.exit(1);
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrls: (process.env.CLIENT_URLS || DEFAULT_CLIENT_URLS.join(","))
    .split(",").map((url) => url.trim().replace(/\/$/, "")).filter(Boolean),
  // …
};
```

**لماذا ملف مستقل بدل `dotenv.config()` في `server.js`؟**

في ESM كل الـ `import` تُنفَّذ **قبل** أي سطر في جسم الملف. فكتابة:

```js
import Stripe from "stripe";
import checkoutRouter from "./routes/checkout.route.js";  // ينفّذ new Stripe(...) الآن
dotenv.config();                                          // متأخر جداً
```

تعني أن `checkout.route.js` أنشأ عميل Stripe بمفتاح `undefined`. الحل أن يكون التحميل نفسه داخل ملف **يُستورد أولاً**، فيصير جزءاً من سلسلة الـ imports لا من جسم الملف.

`process.exit(1)` عند نقص متغيّر أساسي: الفشل السريع الواضح أفضل من خادم يعمل ثم ينهار عند أول طلب.

### مطابقة الأصول للـ CORS

```js
const originMatchers = env.clientUrls.map((pattern) => {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped.replace(/\*/g, "[a-zA-Z0-9-]+")}$`);
});

export const isAllowedOrigin = (origin) => {
  if (!origin) return true;                    // طلب من خادم لآخر، بلا Origin
  const normalized = origin.replace(/\/$/, "");
  return originMatchers.some((matcher) => matcher.test(normalized));
};
```

الخطوتان مقصودتان:
1. **تهريب** كل رموز الـ regex الخاصة (خصوصاً `.`) وإلا لطابق `vercelXapp` النمط `vercel.app`.
2. ثم تحويل `*` فقط إلى `[a-zA-Z0-9-]+` — **بلا نقطة**، فيطابق `https://*.vercel.app` نطاقاً فرعياً واحداً لا `sub.domain.vercel.app` ولا `evil.com`.

اختبرتها على 10 حالات منها محاولات انتحال.

---

## 🆕 `utils/httpError.js` — أخطاء بحالة HTTP

```js
export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export const badRequest = (m = "Bad request") => new HttpError(400, m);
export const forbidden  = (m = "Forbidden")   => new HttpError(403, m);
export const notFound   = (m = "Not found")   => new HttpError(404, m);

export const parseId = (value, label = "id") => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) throw badRequest(`Invalid ${label}.`);
  return parsed;
};
```

الفكرة: المتحكّم يرمي `throw notFound("Book not found.")` ويكمل، والـ error middleware يحوّلها لرد. لا حاجة لتمرير `res` أو تكرار `return res.status(404)...`.

**`parseId`:** كان الكود القديم يمرّر `parseInt(id)` لـ Prisma مباشرة. `parseInt("abc")` = `NaN`، وPrisma ترمي استثناءً غامضاً → 500. الآن أي معرّف غير رقمي = 400 برسالة واضحة.

---

## 🆕 `middlewares/asyncHandler.js`

```js
const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);
```

Express 4 **لا يلتقط** الأخطاء من الدوال غير المتزامنة. بدون هذا الغلاف، أي `throw` داخل `async` يصبح رفضاً غير معالَج والطلب يتجمّد حتى انتهاء المهلة. الغلاف يوصّل الخطأ إلى `next()` أي إلى المعالج المركزي.

الاستعمال: `router.get("/:id", asyncHandler(getBook))`.

---

## 🆕 `utils/selects.js` — الأعمدة المسموح خروجها

```js
export const publicUserSelect = { id: true, name: true, role: true, generes: true, created_at: true };
export const selfUserSelect   = { ...publicUserSelect, email: true, has_paid: true };
export const bookSelect       = { id: true, title: true, /* … */ };

export const bookOwnerSelect = {
  where: { type: "ALL" },
  select: { user: { select: { id: true, name: true, role: true } } },
  take: 1,
};
```

القاعدة التي فرضتها: **ممنوع `include: { user: true }`**. الـ `include` يعني "كل الأعمدة"، وعمود `password` من ضمنها — وهكذا كانت هاشات كلمات المرور تخرج مع كل تعليق ورسالة.

`bookOwnerSelect` علاقة مُفلترة قابلة لإعادة الاستخدام: `user_books` حيث `type = "ALL"`. تُستعمل هكذا:

```js
select: { ...bookSelect, users: bookOwnerSelect }
// ثم في الرد:
const { users, ...rest } = book;
res.json({ ...rest, owner: users[0]?.user ?? null });
```

نُسطّحها إلى `owner` بدل ترك الواجهة تكتب `users[0].user`.

---

## 🆕 `middlewares/authorize.js` — كل قواعد الصلاحيات

ستة حرّاس مُصدّرين:

| الحارس | القاعدة | يُستعمل في |
|---|---|---|
| `requireBookOwner` | مالك الكتاب فقط | حذف/تعديل الكتاب، إعادة الترتيب |
| `requireChapterOwner` | مالك الكتاب (بمسار `:chapterId`) | حذف/تعديل الفصل، تعديل الفقرات |
| `requireBookAccess` | مالك **أو** مشترك | إنشاء فصل، قراءة فصل بمسار الكتاب |
| `requireChapterAccess` | مالك **أو** مشترك | قراءة/كتابة محتوى الفصل |
| `requireConversationParticipant` | مشارك في المحادثة | الرسائل |
| `isBookOwner` | دالة مساعدة | داخلياً |

### الفرق بين `Owner` و`Access`

منتجك تعاوني: المشترك يضيف فصولاً لأي كتاب. لكن **الحذف والتعديل** يبقيان للمالك، لأن الفقرات مصفوفة نصوص بلا كاتب لكل فقرة — فلا يمكن معرفة من كتب ماذا.

### أهم جزء تقنياً: `requireChapterAccess`

```js
const [chapter, content, book, ownership, user] = await Promise.all([
  prisma.chapters.findUnique({ where: { id: chapterId }, select: { /* حقول مسطّحة */ } }),
  prisma.chapter_content.findUnique({ where: { chapter_id: chapterId }, select: { /* … */ } }),
  prisma.books.findFirst({
    where: { chapters: { some: { id: chapterId } } },     // استعلام فرعي
    select: { id: true, title: true, author: true },
  }),
  prisma.user_books.findFirst({
    where: { user_id: req.user.id, type: "ALL",
             book: { chapters: { some: { id: chapterId } } } },   // استعلام فرعي
  }),
  prisma.users.findUnique({ where: { id: req.user.id }, select: { has_paid: true } }),
]);

req.chapter = { ...chapter, book, chapter_content: content };
```

**القصة:** كانت النسخة الأولى أربعة استعلامات **متتالية** (الفصل ← الملكية ← الاشتراك ← ثم المتحكّم يجلب الفصل ثانية). قست: **850ms** مقابل 160–370ms لباقي النقاط.

جرّبت `Promise.all` مع `select` متداخل — لم ينفع، لأن **Prisma يحلّ العلاقات المتداخلة استعلاماً بعد آخر**. سجل الاستعلامات أثبتها:

```
q1 COUNT       531ms
q2 books       700ms
q3 user_books  337ms  ← متتالية
q4 users       375ms  ← متتالية
```

الحل: خمسة استعلامات **مستقلة تماماً**. الوصول للكتاب والملكية عبر **استعلام فرعي على رقم الفصل** (`chapters: { some: { id } }`) بدل انتظار وصول `book_id` أولاً. النتيجة **370ms**.

والسطر الأخير `req.chapter = …` يمرّر الفصل المُحمَّل للمتحكّم:

```js
const getChapter = async (req, res) => {
  if (req.chapter) return res.status(200).json(req.chapter);   // بلا استعلام سادس
  // …
};
```

---

## 🆕 `utils/notify.js` — الإشعارات

أربع دوال عامة: `notifyNewChapter` · `notifyNewComment` · `notifyNewMessage` · `notifyNewFollower`، وكلها تمرّ عبر:

```js
const create = async (rows) => {
  if (!rows.length) return;
  try {
    await prisma.notifications.createMany({ data: rows, skipDuplicates: true });
    emitToUsers([...new Set(rows.map((r) => r.user_id))], "notification:new", { count: rows.length });
  } catch (error) {
    console.error("Failed to write notifications:", error.message);
  }
};
```

ثلاثة قرارات مقصودة:

1. **`try/catch` يبتلع الخطأ.** الإشعار أثر جانبي؛ فشله يجب ألا يُفشل العملية التي سبّبته. الفصل حُفظ فعلاً — لا يصح أن ترى المستخدمة خطأ بسبب صف إشعار.

2. **تُستدعى بلا `await`:**
   ```js
   notifyNewChapter({ … });          // لا await
   res.status(201).json(newChapter); // الرد يخرج فوراً
   ```
   وهذا آمن تحديداً **لأنها لا ترمي أبداً** (النقطة 1). لولا ذلك لصار وعداً مرفوضاً بلا معالج.

3. **`new Set`** لمنع التكرار: من هو متابع ومالك في آن لا يستحق إشعارين.

ودالة `followersOf` تستخدم `distinct: ["user_id"]` للسبب نفسه على مستوى قاعدة البيانات.

---

## 🆕 `utils/realtime.js` — Socket.IO

```js
export const initRealtime = (httpServer) => {
  io = new Server(httpServer, { cors: { origin: (o, cb) => isAllowedOrigin(o) ? cb(null, true) : cb(new Error(…)) } });

  io.use((socket, next) => {                       // مصادقة عند المصافحة
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token provided"));
    try {
      socket.userId = jwt.verify(token, env.jwtSecret).id;
      next();
    } catch { next(new Error("Invalid token")); }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.userId}`);           // غرفة خاصة لكل مستخدم

    socket.on("conversation:join", async (conversationId) => {
      const id = Number(conversationId);
      if (!Number.isInteger(id)) return;
      const participant = await prisma.participant.findFirst({
        where: { conversationId: id, userId: socket.userId },
        select: { id: true },
      });
      if (participant) socket.join(`conversation:${id}`);   // ← الفحص الحاسم
    });
  });
};
```

**نوعا الغرف:**
- `user:<id>` — ينضم لها تلقائياً عند الاتصال، لتنبيه الجرس.
- `conversation:<id>` — بطلب صريح، **وبعد التحقق من جدول المشاركين**.

معرّفات المحادثات متسلسلة (1، 2، 3…). لولا الفحص لأمكن لأي متصل أن يطلب الانضمام للمحادثة رقم 7 ويقرأ محادثات غيره. اختبرته: غير المشارك **لم يصله شيء**.

**ملاحظة `io = null` الابتدائية:** الدوال المُصدَّرة تستخدم `io?.to(...)` — أي أنها لا تفعل شيئاً بأمان في بيئة لا يعمل فيها الـ realtime (مثل سكربتات الاختبار).

**في `server.js`:**

```js
const server = http.createServer(app);   // بدل app.listen
initRealtime(server);
server.listen(env.port, …);
```

Socket.IO يحتاج خادم HTTP خاماً ليُركّب نفسه عليه، فيتشارك المنفذ مع Express.

---

## 🆕 `routes/public.route.js` — الوصول بلا حساب

```js
router.get("/books/:id", asyncHandler(async (req, res) => {
  const [chapters, likes, follows] = await Promise.all([
    prisma.chapters.findMany({
      where: { book_id: id, published: true },
      select: { id: true, title: true, cover_image: true, position: true },
    }),
    prisma.user_books.count({ where: { book_id: id, type: "LIKE" } }),
    prisma.user_books.count({ where: { book_id: id, type: "FOLLOW" } }),
  ]);
  // …
}));
```

المسار الوحيد بلا `verifyToken`. الأمان هنا ليس شرطاً بل **بنية**: `chapter_content` غير مذكور في الـ `select` إطلاقاً، فلا يمكن تسريبه مهما تغيّر الكود لاحقاً. و`published: true` يضمن أن المسودّات لا تظهر للعامة.

مُثبّت في `server.js` تحت `/api/public`.

---

## 🆕 `controllers/notification.controller.js`

```js
const markAsRead = async (req, res) => {
  const id = parseId(req.params.id, "notification id");
  const result = await prisma.notifications.updateMany({
    where: { id, user_id: req.user.id },   // ← مقيّد بالمستخدم
    data: { read: true },
  });
  res.status(200).json({ updated: result.count });
};
```

استعملت `updateMany` لا `update` عمداً: `update` مع `where: { id }` كان سيسمح بتعليم إشعار شخص آخر كمقروء. مع `updateMany` يصبح `user_id` جزءاً من الشرط، فمحاولة العبث تُرجع `count: 0` بلا خطأ ولا تسريب.

و`getNotifications` تُرجع القائمة وعدد غير المقروء في طلب واحد عبر `Promise.all`.

---

## ✏️ `controllers/book.controller.js`

### `searchBooks` — البحث

```js
const where = {
  ...(q ? { OR: [
      { title:  { contains: q, mode: "insensitive" } },
      { author: { contains: q, mode: "insensitive" } },
  ] } : {}),
  ...(genre ? { generes: { has: genre } } : {}),
};

const [total, books] = await Promise.all([
  prisma.books.count({ where }),
  prisma.books.findMany({
    where,
    select: { ...bookSelect, _count: { select: { users: { where: { type: "LIKE" } } } } },
    orderBy: SORTS[sort],
    skip: (page - 1) * limit,
    take: limit,
  }),
]);
```

- بناء `where` بالنشر الشرطي: الشرط يدخل فقط إن وُجدت قيمته.
- `generes: { has: genre }` — عامل المصفوفات في Postgres.
- `SORTS` كائن ثابت (`newest`/`oldest`/`title`) وليس قيمة من المستخدم مباشرة: تمرير `req.query.sort` إلى `orderBy` بلا قائمة بيضاء يفتح باب حقن حقول.
- **`_count` المُفلتر** يجلب عدد الإعجابات مع كل صف في نفس الاستعلام. بدونه كانت كل بطاقة تطلب عدّادها: 24 كتاباً = 25 طلباً.

**ما حذفته عمداً:** كانت النسخة الأولى تجلب صاحب الكتاب مع كل نتيجة، فأضاف ذلك رحلتين متتاليتين (`user_books` ثم `users`) ورفع الزمن إلى 1.5–3.5 ثانية. البطاقة لا تعرض المالك أصلاً، فأزلته → **~600ms**.

### `updateBook` — التعديل

```js
const book = await prisma.books.update({
  where: { id: bookId },
  data: req.body,          // آمن، والسبب أدناه
  select: { ...bookSelect, users: bookOwnerSelect },
});
```

تمرير `req.body` مباشرة إلى Prisma يبدو خطراً، لكنه آمن هنا لأن `validateRequest` **يستبدل `req.body` بمخرَج zod**:

```js
if (result.data.body) req.body = result.data.body;
```

وzod يحذف أي مفتاح غير معرّف في المخطط. فلو أرسل أحد `has_paid: true` مع تعديل الكتاب، لا يصل إلى Prisma إطلاقاً.

### `deleteBook` — الحذف المتسلسل

```js
await prisma.$transaction(async (tx) => {
  // الفصول ← محتواها ← المحادثات ← الرسائل والمشاركون ← التعليقات
  // ← علاقات المتابعة/الإعجاب ← الإشعارات ← الكتاب
});
```

المخطط بلا `onDelete: Cascade`، فالترتيب يدوي من الأصغر إلى الأكبر (اتجاه المفاتيح الأجنبية). و`$transaction` تمنع بقاء كتاب نصف محذوف لو انقطع الاتصال.

`notifications.deleteMany({ where: { book_id } })` أضفتها لاحقاً: اكتشف الاختبار أن إشعارات تبقى تشير لكتاب محذوف.

---

## ✏️ `controllers/book_chapter.controller.js`

### `reorderChapters`

```js
const known = new Set(chapters.map((c) => c.id));

if (order.length !== known.size || order.some((id) => !known.has(id))) {
  throw badRequest("The order must list every chapter of this book exactly once.");
}

await prisma.$transaction(
  order.map((id, index) =>
    prisma.chapters.update({ where: { id }, data: { position: index + 1 } })
  )
);
```

الفحص يمنع حالتين: ترتيباً ناقصاً من صفحة قديمة (فيبقى الكتاب نصف مرتّب)، وتمرير معرّف فصل من كتاب آخر.

`order.map(...)` تبني **مصفوفة عمليات**، و`$transaction` تنفّذها ذرّياً — هذه صيغة Prisma للمصفوفة لا للدالة.

### `getBookChapters` — فلترة المسودّات

```js
const isOwner = await prisma.user_books.findFirst({
  where: { user_id: req.user.id, book_id: bookId, type: "ALL" },
});

const chapters = await prisma.chapters.findMany({
  where: { book_id: bookId, ...(isOwner ? {} : { published: true }) },
  select: chapterListSelect,
  orderBy: [{ position: "asc" }, { created_at: "asc" }],
});
```

المالك يرى كل شيء؛ غيره يرى المنشور فقط. والفلترة في الخادم لا في الواجهة — إخفاء بـ CSS ليس إخفاءً.

`orderBy` كمصفوفة: بالموضع، وعند التساوي بتاريخ الإنشاء (يهمّ للصفوف القديمة).

### `chapterListSelect` مقابل `chapterSelect`

```js
const chapterListSelect = { id, title, cover_image, book_id, created_at, position, published, book };
// ولا يحتوي chapter_content
```

القائمة كانت تُرجع `chapter_content` لكل فصل — أي أن نص المحتوى المدفوع كان يخرج مع قائمة الأغلفة.

### `readTextBlocks` — حماية الفهرس

```js
if (index < 0 || index >= content.text.length) {
  throw badRequest("That paragraph no longer exists. Refresh the page and try again.");
}
```

النص مصفوفة، والفقرة تُعرَّف بموقعها. لو حُذفت فقرة من تبويب آخر، لصار الترقيم القديم يشير لفقرة مختلفة — فتُحذف الخطأ. الفحص يقطع هذا.

---

## ✏️ `middlewares/errorMiddleware.js`

```js
if (err instanceof Prisma.PrismaClientKnownRequestError) {
  if (err.code === "P2002") { status = 409; message = "This record already exists."; }
  else if (err.code === "P2025") { status = 404; message = "Record not found."; }
  else if (err.code === "P2003") { status = 400; message = "Related record does not exist."; }
} else if (err instanceof multer.MulterError) {
  status = 400;
  message = err.code === "LIMIT_FILE_SIZE" ? "File is too large." : /* … */;
}

if (status >= 500) {
  console.error(err);
  if (env.isProduction) message = "Internal server error.";   // لا تسريب تفاصيل
}
res.status(status).json({ error: message });
```

ترجمة أكواد Prisma إلى حالات HTTP مفهومة، وإخفاء تفاصيل أخطاء 500 في الإنتاج (قد تحوي أسماء جداول أو أجزاء استعلامات). والرد دائماً JSON بشكل `{ error }` واحد تعتمد عليه الواجهة.

---

## 🆕 الهجرة `20260818184226_…`

```sql
ALTER TABLE "chapters" ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0,
                       ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT true;
CREATE TABLE "notifications" ( … );
CREATE INDEX "user_books_book_id_type_idx" ON "user_books"("book_id", "type");
CREATE INDEX "messages_conversationId_createdAt_idx" ON "messages"("conversationId", "createdAt");
-- …
```

**كلها إضافات: لا `DROP` ولا تعديل نوع.** راجعت الـ SQL قبل التطبيق على قاعدة الإنتاج.

`published DEFAULT true` مقصود: لو كان `false` لاختفت كل فصول الموقع فجأة.

وأضفت يدوياً تعبئة أولية، وإلا لبدأت كل الفصول بالموضع 0:

```sql
UPDATE "chapters" AS c SET "position" = ordered.rn
FROM (SELECT "id", ROW_NUMBER() OVER (PARTITION BY "book_id" ORDER BY "created_at", "id") AS rn
      FROM "chapters") AS ordered
WHERE c."id" = ordered."id";
```

`ROW_NUMBER() OVER (PARTITION BY book_id ORDER BY created_at)` = رقّم داخل كل كتاب على حدة حسب تاريخ الإنشاء.

---

# الجزء الثاني: الواجهة

## 🆕 `utils/session.ts` — القارئ الوحيد للجلسة

```ts
export const getSession = (): Session | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.user) return null;
    return parsed as Session;
  } catch {
    localStorage.removeItem(STORAGE_KEY);   // تالف: نظّفه بدل تكرار الانهيار
    return null;
  }
};
```

كان كل مكوّن يكتب `JSON.parse(localStorage.getItem("currentUser")!)` بنفسه — وعلامة `!` تعني "ثقي أنه ليس null"، فينهار المكوّن كله إن كان فارغاً أو تالفاً. الآن نقطة دخول واحدة، وكل شيء يمرّ بها.

`patchSessionUser` تدمج حقولاً جديدة (مثل `has_paid`) في المستخدم المخزّن بلا مسح التوكن.

---

## 🆕 `utils/socket.ts` — اتصال واحد مشترك

```ts
let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  const token = getStoredToken();
  if (!token) return null;
  if (!socket) {
    socket = io(baseURL, { auth: { token }, transports: ["websocket", "polling"] });
  }
  return socket;
};

export const closeSocket = () => { socket?.close(); socket = null; };
```

نمط singleton: صفحة المحادثة والجرس يتشاركان **اتصالاً واحداً**، لا اثنين. `auth: { token }` هو ما يقرأه الخادم في `socket.handshake.auth`.

و`closeSocket()` تُستدعى في `logout` — وإلا بقي الاتصال حاملاً توكن المستخدم السابق.

---

## 🆕 `hooks/useNotifications.ts`

```ts
const query = useQuery({
  queryKey: ["notifications"],
  queryFn: async () => (await newRequest.get("/api/notifications")).data,
  enabled: isSignedIn,
  refetchInterval: 2 * 60 * 1000,
});

useEffect(() => {
  if (!isSignedIn) return;
  const socket = getSocket();
  if (!socket) return;
  const onNew = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });
  socket.on("notification:new", onNew);
  return () => { socket.off("notification:new", onNew); };
}, [isSignedIn, queryClient]);
```

طبقتان مقصودتان: السوكِت للتنبيه الفوري، و`refetchInterval` شبكة أمان لو انقطع.

الحدث لا يحمل بيانات الإشعار، بل **يُبطل الاستعلام** فقط. أبسط وأصح: القائمة تُعاد من مصدر واحد بدل محاولة دمج حدث في ذاكرة قد تكون قديمة.

⚠️ دالة التنظيف `socket.off(...)` ضرورية: بدونها يتراكم مستمع مع كل mount ويصل الإشعار عدة مرات.

---

## 🆕 `hooks/usePrefetch.ts`

```ts
const prefetch = (key: unknown[], url: string) =>
  queryClient.prefetchQuery({ queryKey: key, queryFn: …, staleTime: 60 * 1000 });

const prefetchBook = (id: number | string) => {
  const bookId = String(id);                       // ← أهم سطر
  prefetch(["book", bookId], `/api/books/${bookId}`);
  prefetch(["chapters", bookId], `/api/books/${bookId}/chapters`);
  prefetch(["bookStates", bookId], `/api/books/${bookId}/book-states`);
};
```

**المصيدة:** الصفحة تقرأ المعرّف من الرابط عبر `useParams` فيكون **نصاً**، والبطاقة تحمله **رقماً**. و`["book", 1]` مفتاح مختلف عن `["book", "1"]` — فلو لم نُوحّدهما لملأنا الذاكرة بمفاتيح لا يقرأها أحد، والجلب المسبق بلا أثر.

يُستدعى على `onMouseEnter` و`onFocus` معاً (الثاني لمستخدمي لوحة المفاتيح).

**القياس:** كتاب ← فصل من 1966ms إلى **26ms بلا وميض تحميل** بعد مرور 300ms بالمؤشر.

---

## 🆕 `hooks/useAccount.ts` و `useBookStates.ts`

```ts
export const useAccount = () => {
  const cached = getCurrentUser();
  const query = useQuery({ queryKey: ["me"], queryFn: fetchMe, enabled: Boolean(cached), staleTime: 60_000 });

  useEffect(() => { if (query.data) patchSessionUser(query.data); }, [query.data]);

  return { …query, user: query.data ?? cached ?? null,
           hasPaid: Boolean(query.data?.has_paid),   // من الخادم فقط
           isChecking: query.isLoading };
};
```

`hasPaid` تُقرأ من **رد الخادم لا من الذاكرة المخزّنة**. سابقاً كان الاشتراك يُقرأ من `localStorage`، أي أن تعديل قيمة واحدة في أدوات المطوّر يفتح كل المزايا المدفوعة.

`useBookStates` تمركز مفتاح `["bookStates", String(bookId)]` في مكان واحد — كان مكرراً بصيغ مختلفة فلا يتطابق الإبطال مع الجلب.

---

## 🆕 `components/chapter/TextBlocks.tsx`

قلب تجربة الكتابة الجديدة. ثلاث نقاط تستحق الانتباه:

### 1. مربّع يكبر مع النص

```tsx
useEffect(() => {
  const el = ref.current;
  if (!el) return;
  el.style.height = "auto";                                // صفّر أولاً
  el.style.height = `${Math.min(el.scrollHeight, 520)}px`;
}, [value]);
```

سطر `"auto"` ليس زائداً: بدونه يقيس `scrollHeight` بالنسبة للارتفاع الحالي فلا يصغر المربّع أبداً عند حذف نص.

### 2. التعديل داخل القائمة نفسها

```tsx
{blocks.map((block, index) =>
  editingIndex === index ? <محرر … /> : <فقرة … />
)}
```

حالة واحدة (`editingIndex`) تحدد أي فقرة في وضع التحرير. لا حاجة لمكوّن منفصل ولا لحالة لكل فقرة.

### 3. مفاتيح الاختصار

```tsx
onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitDraft(); }}
// وفي المحرّر:
onKeyDown={(e) => { if (e.key === "Escape") setEditingIndex(null); }}
```

---

## ✏️ `components/book/ChaptersArea.tsx` — السحب والإفلات

```tsx
const [order, setOrder] = useState<Chapter[]>(chapters);
useEffect(() => setOrder(chapters), [chapters]);
```

نسخة محلية للترتيب حتى يستجيب السحب فوراً، مع مزامنتها كلما وصل ترتيب جديد من الخادم.

```tsx
<li
  draggable={isOwner}
  onDragStart={() => setDragId(chapter.id)}
  onDragOver={(e) => isOwner && e.preventDefault()}    // ← إلزامي
  onDrop={() => dragId && move(dragId, chapter.id)}
  onDragEnd={() => setDragId(null)}
>
```

`e.preventDefault()` في `onDragOver` هو ما يجعل العنصر **هدفاً صالحاً للإفلات**؛ سلوك المتصفح الافتراضي هو الرفض. حذفه = لا يعمل الإفلات إطلاقاً.

```tsx
const move = (fromId, toId) => {
  const next = [...order];
  const from = next.findIndex((c) => c.id === fromId);
  const to   = next.findIndex((c) => c.id === toId);
  next.splice(to, 0, next.splice(from, 1)[0]);
  setOrder(next);                              // تفاؤلي
  reorder.mutate(next.map((c) => c.id));
};
```

تحديث تفاؤلي: نعرض النتيجة قبل رد الخادم. وعند الفشل نتراجع:

```tsx
onError: () => { toast.error(…); setOrder(chapters); }
```

وأضفت `nudge(index, ±1)` لزرّي ← و→ لأن السحب لا يعمل بلوحة المفاتيح ولا مع قارئات الشاشة.

---

## 🆕 `pages/EditBook.tsx` — أهم درس

```tsx
const changed: Record<string, unknown> = {};
if (form.title !== book?.title) changed.title = form.title;
if (form.author !== book?.author) changed.author = form.author;
if (form.description !== book?.description) changed.description = form.description;
if (form.main_cover !== book?.main_cover) changed.main_cover = form.main_cover;
if (generes.join(",") !== (book?.generes ?? []).join(",")) changed.generes = generes;

if (Object.keys(changed).length === 0) return null;
await newRequest.patch(`/api/books/${id}`, changed);
```

**ما حدث فعلاً:** أول نسخة أرسلت كل الحقول، ففشلت بـ 400 على الكتب القديمة. السبب أن بعض الأغلفة مخزّنة كـ **data URI** بالبيس64 يتجاوز حد 2048 حرفاً في المخطط — والمستخدمة لم تلمس الغلاف أصلاً، لكن النموذج كان يعيد إرساله.

إرسال المتغيّر فقط هو **دلالة PATCH الأصلية** (مقابل PUT التي تستبدل كل شيء)، وقد أصلح المشكلة مجاناً.

باقي الصفحة: `useEffect` لتعبئة النموذج عند وصول الكتاب، وحاجز `isOwner` يعرض صفحة "Not your book" (الخادم يرفض على أي حال، لكن الجدار الواضح أفضل من توست 403).

---

## 🆕 `pages/PublicBook.tsx` و `pages/Discover.tsx`

### الصفحة العامة

صفحة قائمة بذاتها — **لا تستخدم `Header` المشترك** لأنه يفترض وجود جلسة. لها هيدر مصغّر بشعار وزر "Join to read". وتعمل تحت مسار `/read/:id` **خارج** `<ProtectedRoute>`.

### المكتبة

```tsx
const [params, setParams] = useSearchParams();
const q = params.get("q") ?? "";

useEffect(() => {
  const id = setTimeout(() => {
    if (term === q) return;
    const next = new URLSearchParams(params);
    term ? next.set("q", term) : next.delete("q");
    next.delete("page");                       // بحث جديد يعود للصفحة الأولى
    setParams(next, { replace: true });        // بلا تلويث تاريخ التصفح
  }, 350);
  return () => clearTimeout(id);
}, [term]);
```

- **الحالة في الرابط لا في `useState`**: البحث قابل للمشاركة، يصمد أمام التحديث، وزر الرجوع يعمل معه.
- **debounce بالتنظيف**: كل حرف يُلغي مؤقّت الحرف السابق، فلا ينجو إلا الأخير. "midnight" = طلب واحد بدل ثمانية.
- `replace: true` أثناء الكتابة حتى لا يمتلئ تاريخ المتصفح بحالة لكل حرف.

```tsx
placeholderData: keepPreviousData,
```

تُبقي نتائج الصفحة السابقة معروضة أثناء تحميل التالية بدل وميض فارغ.

---

## ✏️ `pages/App.tsx`

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403 || status === 404) return false;
        return failureCount < 2;
      },
    },
  },
});
```

- `staleTime: 60s` — العودة لصفحة زرتِها قبل ثوانٍ تُرسم من الذاكرة فوراً بلا وميض. كان كل mount يعيد الجلب من الصفر.
- `retry` لا يعيد المحاولة على 401/403/404: لا معنى لإعادة طلب مرفوض ثلاث مرات، وقد اعترضت الجلسةُ المنتهيةَ أصلاً.

```tsx
const Layout = () => {
  const location = useLocation();
  return (
    <ProtectedRoute>
      <div className="…">
        <ModalProvider />
        <div key={location.pathname} className="route-transition">
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
};
```

`key={location.pathname}` يجبر React على إنشاء عنصر جديد عند تغيّر المسار، فتُعاد حركة التلاشي في CSS. بدون `key` يبقى العنصر نفسه ولا تُعاد الحركة.

---

## ✏️ `index.css` و `public/fonts.css`

```css
html { scrollbar-gutter: stable; }
```

سطر واحد يمنع قفز الإطار أفقياً عند انتقال صفحة من "بلا تمرير" إلى "فيها تمرير".

ونقلت تعريفات `@font-face` إلى `public/fonts.css` لأن webpack كان يضيف بصمة لأسماء ملفات الخطوط، فتصير الروابط غير معروفة وقت كتابة `index.html` ولا يمكن تحميلها مسبقاً. بروابط ثابتة صار ممكناً:

```html
<link rel="preload" as="font" type="font/woff" crossorigin href="%PUBLIC_URL%/assets/fonts/Romie-Regular.woff" />
```

**النتيجة المقيسة:** مجموع CLS عبر الصفحات من **0.593 إلى 0.022**.

---

# مرجع سريع: النقاط الجديدة

| Method | Endpoint | الحارس |
|---|---|---|
| `GET` | `/api/books/search` | verifyToken |
| `GET` | `/api/books/genres` | verifyToken |
| `PATCH` | `/api/books/:id` | requireBookOwner |
| `DELETE` | `/api/books/:id` | requireBookOwner |
| `PATCH` | `/api/books/:id/chapters/order` | requireBookOwner |
| `GET` | `/api/chapters/:id` | requireChapterAccess |
| `PATCH` | `/api/chapters/:id` | requireChapterOwner |
| `DELETE` | `/api/chapters/:id` | requireChapterOwner |
| `PATCH` | `/api/chapters/:id/content/text/:index` | requireChapterOwner |
| `DELETE` | `/api/chapters/:id/content/text/:index` | requireChapterOwner |
| `DELETE` | `/api/chapters/:id/content/audio` | requireChapterOwner |
| `GET` | `/api/users/me` | verifyToken |
| `GET` | `/api/conversations/:id` | requireConversationParticipant |
| `GET` | `/api/notifications` | verifyToken |
| `PATCH` | `/api/notifications/:id/read` | verifyToken |
| `PATCH` | `/api/notifications/read-all` | verifyToken |
| `GET` | `/api/public/books/:id` | **بلا مصادقة** |
| `POST` | `/api/payment/webhook` | توقيع Stripe |

**أحداث Socket.IO**

| الحدث | الاتجاه | المعنى |
|---|---|---|
| `conversation:join` | العميل ← الخادم | ضمّني (بعد التحقق) |
| `conversation:leave` | العميل ← الخادم | أخرجني |
| `message:new` | الخادم ← العميل | رسالة جديدة في الغرفة |
| `notification:new` | الخادم ← العميل | أبطِل استعلام الإشعارات |

---

# ثلاثة أنماط تتكرر في كل الكود أعلاه

**١. الحماية بالبنية لا بالشرط.**
الصفحة العامة لا تسرّب النص لأنها لا تطلبه في الـ `select`. أقوى من `if` قد ينساه أحدهم لاحقاً.

**٢. الأثر الجانبي لا يُفشل العملية الأصلية.**
الإشعارات تبتلع أخطاءها وتُستدعى بلا `await`. الفصل حُفظ — لا يصح أن يفشل الطلب بسبب صف إشعار.

**٣. كل تحسين أداء بدأ بقياس.**
لم أخمّن أن `/api/chapters/:id` بطيء — قسته (850ms مقابل 160ms لغيره)، ثم فتحت سجل استعلامات Prisma فوجدت أربع رحلات متتالية، ثم قست بعد الإصلاح (370ms). ونفس الشيء مع CLS والتنقّل.

---

للأرقام والقياسات الكاملة: [FIXES.md](FIXES.md)
