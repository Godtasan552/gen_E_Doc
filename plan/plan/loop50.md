# 2 แบบที่ต้องการ

## แบบที่ 1: ส่งทีละข้อความ → คนเดียวหรือกลุ่มเล็ก (1-3+ คน)

```javascript
// ส่งให้คนเดียว
await sendEmail(auth, 'user@test.com', 'หัวข้อ', 'เนื้อหา')

// ส่งให้กลุ่มเล็ก (3+ คน) → ใส่ To หลายคนใน email เดียว
function createMessage(recipients, subject, body) {
  const to = recipients.join(', ') // 'a@test.com, b@test.com, c@test.com'
  
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    body
  ].join('\n')

  return Buffer.from(message).toString('base64url')
}

// ใช้งาน
await sendEmail(auth, ['a@test.com', 'b@test.com', 'c@test.com'], 'หัวข้อ', 'เนื้อหา')
```

> [!NOTE]
> **1 email** → ส่งหา a, b, c พร้อมกัน (เห็นชื่อกันในกล่อง To)

---

## แบบที่ 2: ส่งทุกคน 50+ → แต่ละคนได้รับ email ส่วนตัว

```javascript
// แต่ละคนได้รับ email ของตัวเอง (ไม่เห็นชื่อคนอื่น)
await Promise.allSettled(
  recipients.map(user =>
    sendEmail(auth, user.email, 'หัวข้อ', `สวัสดี ${user.name}`)
  )
)
```

> [!NOTE]
> **50 emails** → แต่ละคนได้รับแยกกัน ไม่เห็นชื่อคนอื่น

---

## รวมทั้ง 2 แบบในโค้ดเดียว

```javascript
async function send(auth, type, data) {
  if (type === 'single') {
    // แบบที่ 1: email เดียว To หลายคน
    const { recipients, subject, body } = data
    await sendEmail(auth, recipients, subject, body)

  } else if (type === 'bulk') {
    // แบบที่ 2: แยก email ให้แต่ละคน
    const { recipients, subject, body } = data
    await Promise.allSettled(
      recipients.map(user =>
        sendEmail(auth, user.email, subject, body(user))
      )
    )
  }
}

// ใช้งาน
// แบบที่ 1
await send(auth, 'single', {
  recipients: ['a@test.com', 'b@test.com', 'c@test.com'],
  subject: 'ประชุมวันพรุ่งนี้',
  body: '<p>แจ้งเตือนประชุม</p>'
})

// แบบที่ 2
await send(auth, 'bulk', {
  recipients: allUsers, // 50+ คน
  subject: 'ประกาศทั่วไป',
  body: (user) => `<p>สวัสดี ${user.name}</p>` // personalize ได้
})
```

---

## ความแตกต่างหลัก

| หัวข้อ | แบบที่ 1 | แบบที่ 2 |
| :--- | :--- | :--- |
| **จำนวน email ที่ส่ง** | 1 อัน | 50+ อัน |
| **ผู้รับเห็นชื่อคนอื่น** | เห็น | ไม่เห็น |
| **Personalize ได้** | ไม่ได้ | ได้ |
| **Use case** | กลุ่มงาน, ทีม | broadcast, แจ้งเตือน |

---

## อธิบายการทำงานของโค้ดอย่างละเอียด

### ภาพรวม Flow ทั้งหมด

1. **เรียกใช้ `send()`**
2. ↓
3. **เช็ค `type` ว่าเป็น `'single'` หรือ `'bulk'`**
4. ↓
5. **`'single'`** → สร้าง 1 email → ส่ง
6. **`'bulk'`** → สร้าง 50 email → ส่งพร้อมกัน

### ส่วนที่ 1: ฟังก์ชัน `send()`

```javascript
async function send(auth, type, data) {
```

- **async** → ฟังก์ชันนี้ทำงานแบบ asynchronous (ต้องรอ API response)
- **auth** → ตัวพิสูจน์ตัวตนกับ Google (OAuth token)
- **type** → บอกว่าจะส่งแบบไหน `'single'` หรือ `'bulk'`
- **data** → ข้อมูลที่ต้องใช้ส่ง (`recipients`, `subject`, `body`)

---

### ส่วนที่ 2: แบบ Single

```javascript
if (type === 'single') {
  const { recipients, subject, body } = data
  await sendEmail(auth, recipients, subject, body)
}
```

- **บรรทัดที่ 1**: เช็คว่า `type` เป็น `'single'` ไหม
- **บรรทัดที่ 2**: **Destructuring** - แกะข้อมูลออกจาก `data` object

```javascript
// เหมือนกับ
const recipients = data.recipients
const subject = data.subject
const body = data.body
```

- **บรรทัดที่ 3**: **await** = รอให้ส่งเสร็จก่อนทำอย่างอื่น
- **ส่ง 1 email ที่มี To หลายคน**
- **ทุกคนเห็นชื่อกันใน To field**

```javascript
sendEmail(auth, ['a@', 'b@', 'c@'], subject, body)
```

- ↑ **array of emails** → กลายเป็น `"To: a@, b@, c@"` ใน email header

---

### ส่วนที่ 3: แบบ Bulk

```javascript
} else if (type === 'bulk') {
  const { recipients, subject, body } = data

  await Promise.allSettled(
    recipients.map(user =>
      sendEmail(auth, user.email, subject, body(user))
    )
  )
}
```

#### `recipients.map(user => ...)`

- วน loop ทุก user แล้ว return array ของ Promise

```javascript
// map ผลิตออกมาเป็น
[
  sendEmail(auth, 'a@test.com', subject, body(userA)), // Promise 1
  sendEmail(auth, 'b@test.com', subject, body(userB)), // Promise 2
  sendEmail(auth, 'c@test.com', subject, body(userC)), // Promise 3
  // ... 50+ promises
]
```

#### `body(user)`

- **body เป็น function ไม่ใช่ string**
- เรียกใช้แล้วได้ content ที่ personalize สำหรับแต่ละคน

```javascript
body: (user) => `<p>สวัสดี ${user.name}</p>`

body(userA) // → '<p>สวัสดี สมชาย</p>'
body(userB) // → '<p>สวัสดี สมหญิง</p>'
```

#### `Promise.allSettled([...])`

- รัน Promise ทั้ง 50+ พร้อมกันหมดเลย ไม่รอทีละอัน
- ต่างจาก `Promise.all` ตรงที่ถ้าอันไหน fail จะไม่หยุดอันอื่น

```javascript
// ผลลัพธ์ที่ได้
[
  { status: 'fulfilled', value: 'messageId_1' }, // ส่งสำเร็จ
  { status: 'rejected', reason: 'Error: ...' }, // ส่งไม่สำเร็จ
  { status: 'fulfilled', value: 'messageId_3' }, // ส่งสำเร็จ
  // ...
]
```

---

### ส่วนที่ 4: การเรียกใช้งาน

#### แบบ Single

```javascript
await send(auth, 'single', {
  recipients: ['a@test.com', 'b@test.com', 'c@test.com'],
  subject: 'ประชุมวันพรุ่งนี้',
  body: '<p>แจ้งเตือนประชุม</p>' // ← string ธรรมดา
})
```

- **Gmail inbox ของ `a@test.com`**:
  - **From**: me
  - **To**: `a@test.com`, `b@test.com`, `c@test.com` ← เห็นชื่อทุกคน
  - **Subject**: ประชุมวันพรุ่งนี้

#### แบบ Bulk

```javascript
await send(auth, 'bulk', {
  recipients: allUsers,
  subject: 'ประกาศทั่วไป',
  body: (user) => `<p>สวัสดี ${user.name}</p>` // ← function
})
```

- **Gmail inbox ของ `a@test.com`**:
  - **From**: me
  - **To**: `a@test.com` ← เห็นแค่ตัวเอง
  - **Subject**: ประกาศทั่วไป
  - **เนื้อหา**: สวัสดี สมชาย ← personalized

- **Gmail inbox ของ `b@test.com`**:
  - **From**: me
  - **To**: `b@test.com`
  - **Subject**: ประกาศทั่วไป
  - **เนื้อหา**: สวัสดี สมหญิง

---

### สรุปความแตกต่างของ body

| หัวข้อ | Single | Bulk |
| :--- | :--- | :--- |
| **body คือ** | string | function |
| **เหตุผล** | ทุกคนได้ content เดียวกัน | แต่ละคนได้ content ต่างกัน |
| **ตัวอย่าง** | `'<p>ข้อความ</p>'` | `(user) => '<p>สวัสดี ' + user.name + '</p>'` |
