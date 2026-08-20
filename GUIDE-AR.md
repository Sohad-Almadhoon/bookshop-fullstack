# دليل المزايا الجديدة — شرح للمبتدئين

هذا الملف يشرح **كل ميزة أضفتها**، بلغة بسيطة، مع الكود وسبب كتابته بهذه الطريقة.
اقرئيه بالترتيب: القسم صفر يشرح الأساسيات التي تتكرر في كل ميزة بعده.

---

## 0. الأساسيات التي ستتكرر معك

### 0.1 كيف يتكلّم المشروع مع نفسه؟

```
المتصفح (React)  →  الخادم (Express)  →  قاعدة البيانات (PostgreSQL)
   frontend/            backend/              عبر Prisma
```

1. أنت تضغطين زراً في **React**.
2. React يرسل طلب HTTP إلى **Express** (مثلاً `GET /api/books/1`).
3. Express يسأل **قاعدة البيانات** عبر **Prisma**.
4. الجواب يعود بصيغة JSON إلى React، فيعرضه على الشاشة.

### 0.2 ما هو Prisma؟

مترجم بينك وبين قاعدة البيانات. بدل أن تكتبي SQL:

```sql
SELECT * FROM books WHERE id = 1;
```

تكتبين جافاسكربت:

```js
await prisma.books.findUnique({ where: { id: 1 } });
```

وملف `backend/prisma/schema.prisma` هو **خريطة** الجداول: كل `model` = جدول، وكل سطر داخله = عمود.

### 0.3 ما هو الـ middleware؟

دالة تعمل **قبل** أن يصل الطلب إلى وجهته. تخيّليها حارس باب:

```js
router.delete("/:id", requireBookOwner, deleteBook);
//                    └─ الحارس ─┘      └─ العمل ─┘
```

الحارس إما يمرّر الطلب بـ `next()`، أو يوقفه برسالة خطأ. فلا يصل `deleteBook` إلا لصاحب الكتاب.

### 0.4 ما هو React Query؟

مكتبة تدير **البيانات القادمة من الخادم**. تستخدم شيئين:

| الأداة | متى | مثال |
|---|---|---|
| `useQuery` | لـ **قراءة** بيانات | اجلب الكتاب |
| `useMutation` | لـ **تغيير** بيانات | احذف الكتاب |

ولكل `useQuery` **مفتاح** (`queryKey`) مثل `["book", "1"]` تستخدمه المكتبة كعنوان في الذاكرة. وعندما تتغيّر البيانات نقول لها "هذا المفتاح لم يعد صالحاً":

```js
queryClient.invalidateQueries({ queryKey: ["chapters", bookId] });
// ترجمتها: أعد جلب قائمة الفصول لأنني غيّرت شيئاً فيها
```

### 0.5 ما هو الـ hook؟

دالة تبدأ بـ `use` تجمع منطقاً قابلاً لإعادة الاستخدام. بدل تكرار نفس الكود في خمس صفحات، تكتبينه مرة في hook وتستدعينه.

---

## 1. الحذف (كتاب / فصل / فقرة / صوت)

### المشكلة

لم يكن في المشروع **أي** طريقة لحذف شيء. تنشئين كتاباً بالخطأ؟ يبقى للأبد.

### القاعدة التي اخترتها

الحذف **لصاحب الكتاب فقط**. السبب تقني: الفقرات مخزّنة كمصفوفة نصوص:

```prisma
model chapter_content {
  text  String[]   // ["الفقرة الأولى", "الفقرة الثانية"]
}
```

مصفوفة نصوص لا تحمل معلومة "من كتب كل فقرة". فلو سمحت لأي مشترك بالحذف، لصار بإمكانه مسح كتابة غيره بلا أي طريقة لمعرفة ذلك.

### الكود: حذف الكتاب

`backend/controllers/book.controller.js`

```js
const deleteBook = async (req, res) => {
  const bookId = req.bookId; // الحارس تحقق منه مسبقاً

  await prisma.$transaction(async (tx) => {
    // ١) الفصول ومحتواها
    const chapters = await tx.chapters.findMany({
      where: { book_id: bookId },
      select: { id: true },
    });
    const chapterIds = chapters.map((chapter) => chapter.id);

    if (chapterIds.length) {
      await tx.chapter_content.deleteMany({ where: { chapter_id: { in: chapterIds } } });
      await tx.chapters.deleteMany({ where: { id: { in: chapterIds } } });
    }

    // ٢) المحادثة ورسائلها ومشاركيها
    // ٣) التعليقات وعلاقات المتابعة/الإعجاب والإشعارات
    // ٤) الكتاب نفسه في النهاية
    await tx.books.delete({ where: { id: bookId } });
  });

  res.status(200).json({ id: bookId, message: "Book deleted successfully." });
};
```

**لماذا كل هذا الترتيب؟** قاعدة البيانات فيها **مفاتيح أجنبية** (foreign keys): جدول الفصول يقول "أنا أنتمي للكتاب رقم 1". فلو حذفتِ الكتاب أولاً، تصرخ قاعدة البيانات: "لا أستطيع، هناك فصول تشير إليه!". لذلك نحذف **من الأصغر إلى الأكبر**.

**ما هي `$transaction`؟** صندوق يقول: *نفّذ كل هذا، وإن فشل أي سطر فألغِ كل شيء*. بدونها قد ينقطع الاتصال في المنتصف فتبقى فصول يتيمة بلا كتاب.

### الكود: حذف فقرة واحدة

الفقرات مصفوفة، فالفقرة تُعرَّف بـ **موقعها** (`index`):

```js
const deleteTextBlock = async (req, res) => {
  const index = Number(req.params.index);

  const blocks = await readTextBlocks(chapterId, index); // يقرأ + يتحقق
  blocks.splice(index, 1);                               // احذف عنصراً واحداً

  const updated = await prisma.chapter_content.update({
    where: { chapter_id: chapterId },
    data: { text: blocks },
  });
  res.status(200).json(updated);
};
```

وداخل `readTextBlocks` حماية مهمة:

```js
if (index < 0 || index >= content.text.length) {
  throw badRequest("That paragraph no longer exists. Refresh the page and try again.");
}
```

**لماذا؟** تخيّلي أن الصفحة مفتوحة عندك في تبويبين. حذفتِ فقرة في التبويب الأول، ثم ضغطتِ حذف في التبويب الثاني وهو ما زال يعرض الترقيم القديم — بلا هذا الفحص ستُحذف **الفقرة الخطأ**.

### الكود: نافذة التأكيد

`frontend/src/components/shared/ConfirmDialog.tsx` — مكوّن واحد مشترك يُستخدم في كل عمليات الحذف:

```tsx
<ConfirmDialog
  open={confirmOpen}
  loading={deleteBook.isPending}
  title="Delete this book?"
  description="…This cannot be undone."
  onConfirm={() => deleteBook.mutate()}
  onClose={() => setConfirmOpen(false)}
/>
```

`loading` مهم: أثناء الحذف يتحوّل الزر إلى "Deleting…" ويُعطَّل، فلا تضغطين مرتين.

---

## 2. الكتابة داخل صفحة الفصل

### قبل وبعد

| قبل | بعد |
|---|---|
| نافذة منبثقة | الكتابة في مكان النص نفسه |
| 400 حرف | 2000 حرف |
| لا تعديل ولا حذف | زر ✎ وزر 🗑 على كل فقرة |

الملف: `frontend/src/components/chapter/TextBlocks.tsx`

### فكرة الحالة (state)

المكوّن يحتاج أن يتذكّر أربعة أشياء:

```tsx
const [draft, setDraft] = useState("");              // ما تكتبينه الآن
const [editingIndex, setEditingIndex] = useState(null); // أي فقرة تُعدَّل (أو لا شيء)
const [editingValue, setEditingValue] = useState("");   // النص أثناء التعديل
const [pendingDelete, setPendingDelete] = useState(null); // أي فقرة تنتظر التأكيد
```

ثم في العرض: إذا كان رقم الفقرة الحالية يساوي `editingIndex` نعرض محرّراً، وإلا نعرض النص:

```tsx
{blocks.map((block, index) =>
  editingIndex === index ? <محرر /> : <فقرة عادية />
)}
```

### مربّع نص يكبر مع الكتابة

```tsx
useEffect(() => {
  const el = ref.current;
  if (!el) return;
  el.style.height = "auto";                                  // صفّر الارتفاع
  el.style.height = `${Math.min(el.scrollHeight, 520)}px`;    // ثم اجعله بحجم المحتوى
}, [value]);
```

`scrollHeight` = الارتفاع الحقيقي للنص لو ظهر كاملاً. نضبط الارتفاع عليه بعد كل تغيير، مع حدّ أقصى 520px حتى لا يبتلع المربّع الشاشة. وسطر `"auto"` ضروري وإلا لن يصغر المربع أبداً عند حذف نص.

### اختصار Ctrl+Enter

```tsx
onKeyDown={(e) => {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitDraft();
}}
```

`metaKey` = زر Command على الماك، `ctrlKey` = Ctrl على ويندوز.

### إخفاء الأزرار حتى المرور بالفأرة

```tsx
className="… sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
```

اقرئيها هكذا: **على الشاشات المتوسطة فأكبر** (`sm:`) الأزرار شفافة، وتظهر عند المرور على العنصر الأب الذي يحمل `group`. أما على الجوال (لا يوجد فيه "مرور فأرة") فتبقى ظاهرة دائماً.

---

## 3. تعديل الكتاب — وصفحة مستقلة له

### لماذا صفحة وليست نافذة؟

النافذة المشتركة في المشروع **دائرية** على الشاشات الكبيرة (`rounded-full`)، والدائرة تأكل الزوايا. قِست العرض المتاح لحقل الوصف:

| | العرض |
|---|---|
| داخل النافذة الدائرية | 468px |
| في صفحة مستقلة | **756px** |

الملف: `frontend/src/pages/EditBook.tsx`، والمسار `/books/:id/edit`.

### تعبئة النموذج من الخادم

```tsx
useEffect(() => {
  if (!book) return;
  setForm({ title: book.title, author: book.author, /* … */ });
  setGenresInput((book.generes ?? []).join(", "));
}, [book]);
```

`useEffect` يعمل **بعد** كل رسم. هنا نقول: كلما وصل الكتاب من الخادم، انسخي قيمه في النموذج. والشرط `if (!book) return;` يمنع الانهيار في أول رسم قبل وصول البيانات.

`.join(", ")` يحوّل `["Fiction","Drama"]` إلى `"Fiction, Drama"` لأن حقل الإدخال يقبل نصاً واحداً فقط.

### أهم درس في هذه الميزة: أرسلي المتغيّر فقط

```tsx
const changed = {};
if (form.title !== book?.title) changed.title = form.title;
if (form.author !== book?.author) changed.author = form.author;
// …
if (Object.keys(changed).length === 0) return null; // لم يتغير شيء أصلاً

await newRequest.patch(`/api/books/${id}`, changed);
```

**القصة الحقيقية:** أول نسخة كانت ترسل كل الحقول. الاختبار فشل بـ 400. السبب أن بعض الأغلفة القديمة مخزّنة كـ **data URI** (صورة محوّلة إلى نص بيس64 بطول آلاف الأحرف)، وقاعدة التحقق تحدّد 2048 حرفاً. فالمستخدمة لم تلمس الغلاف أصلاً، لكن الصفحة كانت تعيد إرساله فيُرفض الطلب كله.

وهذا هو **المعنى الأصلي لـ PATCH**: "غيّري هذه الحقول فقط"، مقابل PUT التي تعني "استبدلي كل شيء".

---

## 4. ترتيب الفصول بالسحب

### التغيير في قاعدة البيانات

```prisma
model chapters {
  position    Int      @default(0)
  @@index([book_id, position])
}
```

- `position` = رقم ترتيب الفصل.
- `@default(0)` ضروري: الجدول فيه صفوف قديمة، والعمود الجديد يحتاج قيمة لها.
- `@@index` = فهرس، أي "فهرس الكتاب" في آخر الكتاب. بدونه تقرأ قاعدة البيانات كل الصفوف لتجد فصول كتاب معيّن.

وأضفت في ملف الهجرة أمر SQL يعطي الفصول الموجودة ترتيبها حسب تاريخ إنشائها، وإلا لبدأت كلها بالرقم 0:

```sql
UPDATE "chapters" AS c SET "position" = ordered.rn
FROM (SELECT "id", ROW_NUMBER() OVER (PARTITION BY "book_id" ORDER BY "created_at") AS rn
      FROM "chapters") AS ordered
WHERE c."id" = ordered."id";
```

### الخادم: كتابة الترتيب الجديد

```js
const known = new Set(chapters.map((chapter) => chapter.id));

if (order.length !== known.size || order.some((id) => !known.has(id))) {
  throw badRequest("The order must list every chapter of this book exactly once.");
}

await prisma.$transaction(
  order.map((id, index) =>
    prisma.chapters.update({ where: { id }, data: { position: index + 1 } })
  )
);
```

**الفحص:** الواجهة ترسل مصفوفة أرقام مثل `[5, 3, 9]`. نتأكد أنها تحتوي كل فصول الكتاب ولا شيء غريب. بدونه ترسل صفحة قديمة ترتيباً ناقصاً فيبقى الكتاب نصف مرتّب.

**لماذا `$transaction` هنا؟** `order.map(...)` يبني **قائمة** أوامر تحديث، والـ transaction تنفّذها كلها أو لا شيء.

### الواجهة: السحب والإفلات

هذه مزايا مدمجة في المتصفح — لا تحتاج مكتبة:

```tsx
<li
  draggable={isOwner}                                   // يمكن سحبه
  onDragStart={() => setDragId(chapter.id)}             // بدأ السحب: تذكّر مَن
  onDragOver={(e) => isOwner && e.preventDefault()}     // اسمح بالإفلات هنا
  onDrop={() => dragId && move(dragId, chapter.id)}     // أُفلت: نفّذ النقل
  onDragEnd={() => setDragId(null)}                     // انتهى: انسَ
>
```

⚠️ `e.preventDefault()` في `onDragOver` **إلزامي**. سلوك المتصفح الافتراضي هو *رفض* الإفلات، وهذا السطر يلغي الرفض. بدونه لن يعمل الإفلات إطلاقاً — وهو أكثر خطأ شائع في drag & drop.

ودالة النقل:

```tsx
const move = (fromId, toId) => {
  const next = [...order];                       // نسخة (لا نعدّل الأصل مباشرة)
  const from = next.findIndex((c) => c.id === fromId);
  const to = next.findIndex((c) => c.id === toId);
  next.splice(to, 0, next.splice(from, 1)[0]);   // اقتطع من مكانه وألصقه في الجديد
  setOrder(next);                                // اعرضي الترتيب الجديد فوراً
  reorder.mutate(next.map((c) => c.id));         // ثم احفظيه على الخادم
};
```

`next.splice(from, 1)` تقتطع العنصر وتعيده داخل مصفوفة، و`[0]` يأخذه منها، ثم `splice(to, 0, …)` تُدخله في موضعه الجديد.

**لماذا نعرض التغيير قبل أن يردّ الخادم؟** ليشعر التطبيق بالفورية. وإن فشل الحفظ نتراجع:

```tsx
onError: (error) => {
  toast.error("Could not save the new order.");
  setOrder(chapters); // أعيدي ما كان
}
```

### زرّا ← و →

السحب لا يعمل بلوحة المفاتيح ولا مع قارئات الشاشة، فأضفت بديلاً:

```tsx
const nudge = (index, direction) => {
  const target = index + direction;
  if (target < 0 || target >= order.length) return; // لا تخرجي عن الحدود
  move(order[index].id, order[target].id);
};
```

---

## 5. المسودّات

### العمود

```prisma
published   Boolean  @default(true)
```

`@default(true)` قرار مهم: كل الفصول الموجودة تبقى **منشورة** كما كانت. لو جعلته `false` لاختفت كل فصول الموقع فجأة.

### الفلترة على الخادم

```js
const isOwner = await prisma.user_books.findFirst({
  where: { user_id: req.user.id, book_id: bookId, type: "ALL" },
});

const chapters = await prisma.chapters.findMany({
  where: { book_id: bookId, ...(isOwner ? {} : { published: true }) },
  orderBy: [{ position: "asc" }, { created_at: "asc" }],
});
```

اقرئي `...(isOwner ? {} : { published: true })` هكذا:
- صاحب الكتاب → `{}` → **بلا شرط إضافي** → يرى كل شيء.
- غيره → `{ published: true }` → المنشور فقط.

و`...` هي عملية النشر (spread) التي تدمج كائناً داخل كائن.

**النقطة الأهم:** الإخفاء يحدث في **الخادم** لا في الواجهة. لو أخفيتِ المسودّة بـ CSS فقط، لرآها أي شخص يفتح أدوات المطوّر.

`orderBy` بمصفوفة = رتّبي بالموضع، وعند التساوي رتّبي بتاريخ الإنشاء.

---

## 6. الصفحة العامة القابلة للمشاركة

### المشكلة

كل شيء في الموقع خلف تسجيل الدخول. لا تستطيعين إرسال رابط كتابك لأحد.

### الحل مع الحفاظ على الاشتراك المدفوع

`backend/routes/public.route.js` — **بلا `verifyToken`**، أي بلا مصادقة:

```js
const [chapters, likes, follows] = await Promise.all([
  prisma.chapters.findMany({
    where: { book_id: id, published: true },
    // عناوين وأغلفة فقط: لا يوجد chapter_content في هذا الـ select إطلاقاً
    select: { id: true, title: true, cover_image: true, position: true },
  }),
  prisma.user_books.count({ where: { book_id: id, type: "LIKE" } }),
  prisma.user_books.count({ where: { book_id: id, type: "FOLLOW" } }),
]);
```

**السطر الحاسم هو الـ `select`.** الأمان هنا ليس شرطاً نكتبه، بل **بيانات لا نطلبها أصلاً**. لا يمكن تسريب `chapter_content` لأنه غير مذكور.

**ما هي `Promise.all`؟** تنفّذ الطلبات الثلاثة **بالتوازي** بدل الانتظار واحداً تلو الآخر. ثلاثة طلبات × 160ms = 480ms متتالية، مقابل ~160ms متوازية.

### زر المشاركة

```tsx
const url = `${window.location.origin}/read/${bookId}`;
navigator.clipboard
  ?.writeText(url)
  .then(() => toast.success("Public link copied"))
  .catch(() => toast.error(url)); // إن مُنع النسخ، أظهري الرابط ليُنسخ يدوياً
```

`window.location.origin` = `https://موقعك.com` — فيعمل الرابط في التطوير والإنتاج بلا تعديل.

---

## 7. الإشعارات

### الجدول الجديد

```prisma
model notifications {
  id         Int      @id @default(autoincrement())
  user_id    Int      // لمن هذا الإشعار
  actor_id   Int?     // من تسبّب به
  type       String   // NEW_CHAPTER, NEW_COMMENT, …
  message    String
  book_id    Int?
  chapter_id Int?
  read       Boolean  @default(false)
  created_at DateTime @default(now())

  @@index([user_id, read, created_at])
}
```

علامة `?` تعني "قد يكون فارغاً". `book_id` اختياري لأن ليس كل إشعار متعلقاً بكتاب.

### الملف المركزي `backend/utils/notify.js`

```js
const create = async (rows) => {
  if (!rows.length) return;
  try {
    await prisma.notifications.createMany({ data: rows, skipDuplicates: true });
    emitToUsers([...new Set(rows.map((row) => row.user_id))], "notification:new", { … });
  } catch (error) {
    console.error("Failed to write notifications:", error.message);
  }
};
```

**أهم فكرة هنا: `try/catch` يبتلع الخطأ عمداً.**

الإشعار **أثر جانبي**. تخيّلي أن كتابة الإشعار فشلت أثناء إضافة فصل: هل يجب أن تفشل إضافة الفصل؟ قطعاً لا. الفصل حُفظ فعلاً؛ فمن غير المقبول أن يرى المستخدم رسالة خطأ بسبب إشعار.

ولهذا أيضاً نستدعيها **بلا `await`**:

```js
notifyNewChapter({ bookId, chapterId, actorId, … });  // لا await
res.status(201).json(newChapter);                      // الرد يخرج فوراً
```

`await` تعني "انتظري" — ولا داعي لتأخير المستخدم ريثما تُكتب الإشعارات.

و`new Set(...)` تحذف التكرار: لو كان الشخص متابعاً ومالكاً في آن، لا نرسل له إشعارين.

### hook الواجهة

`frontend/src/hooks/useNotifications.ts`

```tsx
const query = useQuery({
  queryKey: ["notifications"],
  queryFn: async () => (await newRequest.get("/api/notifications")).data,
  refetchInterval: 2 * 60 * 1000,   // شبكة أمان كل دقيقتين
});

useEffect(() => {
  const socket = getSocket();
  const onNew = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });
  socket.on("notification:new", onNew);
  return () => { socket.off("notification:new", onNew); };  // تنظيف
}, [isSignedIn, queryClient]);
```

طبقتان: **السوكِت** يعطي التنبيه الفوري، و`refetchInterval` احتياط لو انقطع الاتصال.

⚠️ سطر `return () => socket.off(...)` اسمه **دالة التنظيف**. تعمل عند اختفاء المكوّن. بدونها يتراكم مستمع جديد كل مرة، فيصل الإشعار الواحد خمس مرات.

---

## 8. الرسائل اللحظية (WebSocket)

### الفرق عن HTTP

| HTTP | WebSocket |
|---|---|
| أنت تسألين، الخادم يجيب | قناة مفتوحة في الاتجاهين |
| لا يستطيع الخادم مبادرتك | يستطيع أن يدفع لك شيئاً في أي لحظة |
| مثل رسالة نصية | مثل مكالمة هاتفية مفتوحة |

### الخادم `backend/utils/realtime.js`

```js
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("No token provided"));
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    socket.userId = decoded.id;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});
```

نفس التوكن المستخدم في REST. اتصال بلا توكن **يُرفض من البداية**.

### الغرف — وأهم فحص أمني

```js
socket.on("conversation:join", async (conversationId) => {
  const participant = await prisma.participant.findFirst({
    where: { conversationId: id, userId: socket.userId },
  });
  if (participant) socket.join(`conversation:${id}`);   // فقط إن كان مشاركاً فعلاً
});
```

**لماذا هذا مهم جداً؟** الأرقام متسلسلة (1، 2، 3…). لولا هذا الفحص لاستطاع أي شخص أن يقول "ضمّني للمحادثة رقم 7" ويقرأ محادثات غيره. الفحص يسأل جدول المشاركين قبل الضمّ.

اختبرت هذا فعلياً: شخص غير مشارك **لم يصله أي شيء**.

### الواجهة

```tsx
const onMessage = (incoming) => {
  queryClient.setQueryData(["messages", id], (old = []) =>
    old.some((m) => m.id === incoming.id) ? old : [...old, incoming]
  );
};
```

`setQueryData` تضيف الرسالة للذاكرة مباشرة بلا طلب جديد. وفحص `old.some(...)` يمنع التكرار: المرسل لديه الرسالة أصلاً من ردّ طلبه، فلا نضيفها مرتين.

---

## 9. البحث والتصفية

### الخادم

```js
const where = {
  ...(q ? {
    OR: [
      { title:  { contains: q, mode: "insensitive" } },
      { author: { contains: q, mode: "insensitive" } },
    ],
  } : {}),
  ...(genre ? { generes: { has: genre } } : {}),
};
```

- `OR` = العنوان **أو** المؤلف.
- `contains` = يحتوي (بحث جزئي).
- `mode: "insensitive"` = لا فرق بين كبير وصغير الأحرف.
- `has` للمصفوفات = "هل يحتوي هذا التصنيف؟".
- والـ `...(شرط ? {…} : {})` تعني: أضيفي هذا الشرط **فقط إن كانت القيمة موجودة**.

### الترقيم

```js
skip: (page - 1) * limit,   // كم صفاً نتخطى
take: limit,                // كم صفاً نأخذ
```

صفحة 1 → تخطَّ 0. صفحة 2 (بحدّ 24) → تخطَّ 24.

### حيلة مهمة في الأداء

```js
_count: { select: { users: { where: { type: "LIKE" } } } }
```

تجلب **عدد الإعجابات مع كل كتاب في نفس الاستعلام**. بدونها كانت كل بطاقة تطلب عدّادها بنفسها: 24 كتاباً = 25 طلباً. الآن **طلب واحد**.

### الواجهة: تأخير الكتابة (debounce)

```tsx
useEffect(() => {
  const id = setTimeout(() => { /* نفّذ البحث */ }, 350);
  return () => clearTimeout(id);
}, [term]);
```

بدونها: كلمة "midnight" = 8 أحرف = 8 طلبات. معها: تنتظر 350ms من التوقف عن الكتابة، فتصير **طلباً واحداً**.

كيف؟ كل حرف يُشغّل `useEffect` من جديد، ودالة التنظيف تُلغي المؤقّت السابق. فلا ينجو إلا آخر مؤقّت.

### الحالة في الرابط

```tsx
const [params, setParams] = useSearchParams();
const q = params.get("q") ?? "";
```

البحث مخزّن في الرابط نفسه: `/discover?q=midnight&genre=Fiction`. فيمكن مشاركته، ويبقى بعد تحديث الصفحة، وزر الرجوع يعمل معه.

---

## 10. البادجات

### ملاحظة قبل الكود

`role` يختاره المستخدم عند التسجيل ولا يُتحقّق منه — فهو **زينة**. أما بادج `Owner` فمشتقّ من البيانات الحقيقية (من يملك علاقة `ALL` للكتاب) — وهذا ما يجعله ذا معنى.

### إحضار صاحب الكتاب

```js
export const bookOwnerSelect = {
  where: { type: "ALL" },
  select: { user: { select: { id: true, name: true, role: true } } },
  take: 1,
};
```

ثم في المتحكّم نُخرجه من العلاقة إلى حقل مباشر:

```js
const { users, ...rest } = book;
res.status(200).json({ ...rest, owner: users[0]?.user ?? null });
```

هذا `destructuring`: خذي `users` في متغيّر، وكل الباقي في `rest`. فتصل الواجهة `owner` جاهزاً بدل `users[0].user`.

### التمييز في الواجهة

```tsx
const book = queryClient.getQueryData(["book", id]);
const ownerId = book?.owner?.id;
// …
isBookOwner={Boolean(ownerId) && comment.user?.id === ownerId}
```

`getQueryData` تقرأ من **ذاكرة React Query** بلا طلب جديد — صفحة الكتاب جلبت البيانات قبل قليل، فنستفيد منها مجاناً.

---

## 11. التنقّل الفوري (prefetch)

### الفكرة

المؤشّر يبقى على البطاقة جزءاً من الثانية قبل النقر. نستغل هذا الوقت.

`frontend/src/hooks/usePrefetch.ts`

```tsx
const prefetchBook = (id) => {
  const bookId = String(id);
  prefetch(["book", bookId], `/api/books/${bookId}`);
  prefetch(["chapters", bookId], `/api/books/${bookId}/chapters`);
};
```

```tsx
<Link onMouseEnter={() => prefetchBook(id)} onFocus={() => prefetchBook(id)}>
```

`onFocus` ضروري لمستخدمي لوحة المفاتيح الذين لا يمرّرون فأرة.

⚠️ **مصيدة انتبهي لها:** المفاتيح لا بد أن تتطابق حرفياً. الصفحة تقرأ الرقم من الرابط فيكون **نصاً** `"1"`، والبطاقة تحمله **رقماً** `1`. و`["book", 1]` ليس نفسه `["book", "1"]`! لهذا `String(id)`.

### النتيجة المقيسة

| الانتقال | قبل | بعد (مع مرور 300ms) |
|---|---|---|
| كتاب ← فصل | 1966ms + وميض تحميل | **26ms بلا وميض** |

---

## 12. مصطلحات سريعة

| المصطلح | المعنى |
|---|---|
| **Endpoint** | عنوان في الـ API مثل `/api/books/1` |
| **GET / POST / PATCH / DELETE** | اقرأ / أنشئ / عدّل جزئياً / احذف |
| **Middleware** | حارس يعمل قبل وصول الطلب لوجهته |
| **Migration** | ملف يصف تغييراً في بنية قاعدة البيانات |
| **Index (فهرس)** | يسرّع البحث في عمود، كفهرس آخر الكتاب |
| **Transaction** | مجموعة أوامر تنجح كلها أو تُلغى كلها |
| **Foreign key** | عمود يشير إلى صف في جدول آخر |
| **Hook** | دالة React تبدأ بـ `use` |
| **State** | ذاكرة المكوّن؛ تغييرها يعيد الرسم |
| **Toast** | رسالة صغيرة تظهر وتختفي |
| **Debounce** | تأخير التنفيذ حتى يتوقف المستخدم |
| **Prefetch** | جلب البيانات قبل طلبها |
| **CLS** | مقياس اهتزاز العناصر أثناء التحميل |
| **WebSocket** | قناة مفتوحة في الاتجاهين |

---

## 13. ثلاثة دروس تتكرر في كل ما سبق

**١. الأمان في الخادم، لا في الواجهة.**
إخفاء زر لا يحمي شيئاً — أدوات المطوّر تكشف كل شيء. كل قاعدة (المالك فقط، المشترك فقط، المشارك فقط) مكتوبة في الخادم، والواجهة تخفي الأزرار **للراحة فقط**.

**٢. لا تطلبي بيانات لا تحتاجينها.**
الصفحة العامة لا تسرّب النص لأنها **لا تطلبه أصلاً**. هذا أقوى من أي شرط `if`.

**٣. قيسي قبل أن تُصلحي.**
"الموقع بطيء" ليست معلومة. أما "هذه النقطة تستغرق 850ms لأن فحص الصلاحية ينفّذ 4 استعلامات متتالية" فهي معلومة تقود إلى حل. كل تحسين هنا بدأ بقياس وانتهى بقياس.

---

للتفاصيل التقنية الكاملة والأرقام: [FIXES.md](FIXES.md)
