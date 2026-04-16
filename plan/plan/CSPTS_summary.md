# CSPTS — สรุประบบติดตามโครงงานนักศึกษา
**สาขาวิชาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยราชภัฏศรีสะเกษ**

---

## 🎯 เป้าหมายหลัก

- ลดการใช้กระดาษ 100% สำหรับเอกสาร วท. ทั้งหมด
- จัดการ Workflow การอนุมัติเอกสารทั้งหมดในเว็บ
- เก็บคลังผลงานโครงงานของนักศึกษาทุกรุ่นในระบบ

---

## 👥 ผู้ใช้งาน 3 กลุ่ม

| Role | หน้าที่ |
|---|---|
| `STUDENT` | กรอกฟอร์ม, upload เล่ม, ดู annotation จากอาจารย์ |
| `ADVISOR` | ตรวจเอกสาร, annotate, approve/reject |
| `ADMIN` | จัดการผู้ใช้, แก้ template ฟอร์ม, ติดตามภาพรวมทุกกลุ่ม |

---

## 🗂️ ประเภทเอกสารในระบบ (3 กลุ่ม)

### กลุ่ม A — E-Document (วท.1–14)
- นักศึกษา **กรอกในเว็บ** ไม่มีกระดาษเลย
- ระบบ render เป็น PDF viewer ในหน้าเว็บ
- อาจารย์ annotate + approve/reject ในระบบ
- Export PDF ได้ พร้อมลายเซ็นอาจารย์ (pdf-lib overlay)

### กลุ่ม B — Upload File (เล่ม 3 บท / 5 บท / รายงาน)
- นักศึกษา **upload PDF** เข้าระบบ (บังคับ PDF เท่านั้น)
- อาจารย์ preview + annotate ในเว็บได้
- ยังต้องส่ง **เล่มจริง** ด้วย (ข้อบังคับสาขา)
- มี .docx template ให้โหลดเพื่อช่วยพิมพ์ แต่ไม่รับ .docx เข้าระบบ

### กลุ่ม C — เล่มปกแข็ง (ปิดโครงงาน)
- นักศึกษา **upload PDF เล่มสมบูรณ์** เข้าระบบ
- ส่ง **เล่มจริง + CD** ที่สาขาด้วย
- Admin กด mark "รับเล่มจริงแล้ว" → Project status = `COMPLETED`
- ระบบดึง PDF ขึ้น **คลังผลงาน** อัตโนมัติ

---

## 🔄 Workflow หลัก (4 ระยะ ตามคู่มือสาขา)

```
ระยะ 1: ขออนุมัติหัวข้อ (สัปดาห์ 2–4)
  วท.1 → วท.2 → วท.3 → วท.9
  นักศึกษากรอก E-Form → อาจารย์ที่ปรึกษา approve → ส่งประธาน

ระยะ 2: รายงานความก้าวหน้า (สัปดาห์ 8–16)
  วท.4 → วท.5.1 + เล่ม 3 บท (upload PDF)
  ประเมิน 6 ครั้ง (วท.ป.3)

ระยะ 3: สอบปลายภาค (สัปดาห์ 32)
  วท.5.2 + เล่ม 5 บท (upload PDF)
  อาจารย์ที่ปรึกษา + ที่ปรึกษาร่วม approve ก่อนสอบ

ระยะ 4: ปิดเล่ม (สัปดาห์ 34)
  วท.11 → วท.13 → upload PDF ปกแข็ง + ส่งเล่มจริง
  Admin mark ปิดงาน → ขึ้นคลังผลงานอัตโนมัติ
```

---

## 🔁 Project Status Lifecycle

```
NOT_STARTED → DRAFT → SUBMITTED → AWAITING_VERIFICATION
  → ADVISOR_APPROVED → ADMIN_APPROVED → COMPLETED
                              ↘
                           REJECTED (สร้าง Version ใหม่)
```

---

## ✍️ ระบบ Annotation (2 Layer — ไม่แตะเอกสารจริง)

```
Layer 1: Document (PDF.js)     ← read-only ไม่มีวันถูกแก้ไข
Layer 2: Annotation (Fabric.js) ← comment / วาดทับ แยกกัน
```

| อุปกรณ์ | วิธี Annotate |
|---|---|
| iPad + Apple Pencil | วาด/ขีดเส้นได้เลย (pressure-sensitive) |
| Desktop / Mouse | คลิกจุดที่ต้องการ → popup พิมพ์ comment |

**Flow หลังอาจารย์ Annotate:**
1. นักศึกษาเปิดเอกสาร → เห็น Layer 1 + Layer 2 ซ้อนกัน
2. แก้ไขตามจุดที่อาจารย์ระบุ → กด **Mark as Resolved** ทีละจุด
3. แก้ครบทุกจุด → กด **ส่งใหม่** (สร้าง Version ถัดไป)

---

## 🖊️ ระบบลายเซ็นดิจิตอล

```
1. อาจารย์ upload รูปลายเซ็นไว้ใน Profile (ครั้งเดียว)
2. กด Approve ในระบบ
3. pdf-lib overlay ลายเซ็น + ชื่อ + timestamp ลงบน PDF
4. บันทึก ApprovalLog (timestamp + userID = หลักฐานการอนุมัติ)
```

> หากอาจารย์ยังไม่มีรูปลายเซ็น → ระบบแสดง Signature Pad ให้วาดได้เลย

---

## ⚙️ Dynamic Form Template (รองรับ วท. เปลี่ยนแปลงในอนาคต)

- โครงสร้างฟอร์มแต่ละใบ (field, label, type, ตำแหน่งบน PDF) เก็บใน **MongoDB**
- Admin แก้ field หรือ upload PDF template ใหม่ได้เองผ่าน UI
- ระบบจัดการ **Version** อัตโนมัติ — เอกสารเก่า render ตาม version เดิมได้เสมอ
- **ไม่ต้องแก้ code** เมื่อ วท. มีการเปลี่ยนแปลง

### Field Types ที่รองรับ
| Type | คำอธิบาย |
|---|---|
| `TEXT` | กรอกข้อความสั้น |
| `TEXTAREA` | กรอกข้อความยาว |
| `DATE` | เลือกวันที่ |
| `SELECT` | dropdown |
| `CHECKBOX` | เลือกหลายตัวเลือก |
| `AUTO` | ดึงข้อมูลจาก Project อัตโนมัติ (เช่น ชื่ออาจารย์, สมาชิก) |

---

## 📚 คลังผลงาน (Portfolio Archive)

- เก็บ PDF เล่มปกแข็งของทุกรุ่น
- ค้นหาได้ตามชื่อโครงงาน, ปีการศึกษา, อาจารย์ที่ปรึกษา
- Admin ควบคุม `is_public` ว่าเล่มไหนแสดงหรือไม่แสดง

---

## 🗄️ Database Schema (สรุป)

| Schema | หน้าที่ |
|---|---|
| `User` | ข้อมูลผู้ใช้ทุก role + signature_url |
| `Project` | โครงงาน + สมาชิก + สถานะ + final_report_url |
| `FormSubmission` | ข้อมูลฟอร์มที่ส่ง + version + submission_mode |
| `FormTemplate` | โครงสร้างฟอร์มแบบ dynamic + version |
| `Annotation` | layer comment/drawing ของอาจารย์ แยกจากเอกสาร |
| `ApprovalLog` | ประวัติการอนุมัติทุกขั้นตอน |
| `Comment` | ระบบ threaded comment ต่อแต่ละขั้นตอน |

---

## 🔔 ระบบแจ้งเตือน

| เหตุการณ์ | ช่องทาง |
|---|---|
| ส่งเอกสารใหม่ | Email + In-app (แจ้งอาจารย์) |
| อนุมัติ / ตีกลับ | Email + In-app (แจ้งนักศึกษา) |
| มี Annotation ใหม่ | Email + In-app |
| ใกล้กำหนดส่ง | Email + In-app |
| อัปโหลดไฟล์แก้ไขใหม่ | In-app (แจ้งอาจารย์) |
| ประกาศจาก Admin | Email + In-app (ทุกคน) |

---

## 🛠️ Tech Stack

| ส่วน | เทคโนโลยี |
|---|---|
| Framework | Next.js 16 (App Router + TypeScript) |
| Database | MongoDB Atlas + Mongoose |
| File Storage | Google Cloud Storage (GCS) |
| Authentication | NextAuth.js v5 (OTP + Bcrypt) |
| PDF Render (Viewer) | pdfjs-dist |
| Annotation Canvas | Fabric.js |
| PDF Manipulation | pdf-lib |
| Styling | Bootstrap 5 + Custom CSS |
| Hosting | Vercel |

---

## 📅 แผน Phase การพัฒนา

| Phase | งาน | สถานะ |
|---|---|---|
| Phase 1 | Foundation — Next.js, MongoDB, GCS, Base Layout | ✅ เสร็จแล้ว |
| Phase 2 | Auth + User Management — Import Excel, OTP, RBAC | ✅ เสร็จแล้ว |
| Phase 3A | Core E-Form + PDF Viewer + Upload + Approve/Reject + Audit Log | 🔲 ถัดไป |
| Phase 3B | Annotation Layer — Fabric.js, Comment, Drawing, Resolved flow | 🔲 ถัดไป |
| Phase 4 | Admin Form Builder — แก้ FormTemplate, Version management | 🔲 ถัดไป |
| Phase 5 | คลังผลงาน — Portfolio Archive, ค้นหา, is_public | 🔲 ถัดไป |
| Phase 6 | Polish + Testing + Deploy บน Vercel | 🔲 ถัดไป |

---

## 📌 ข้อตกลงสำคัญที่ตัดสินใจแล้ว

1. **Upload เข้าระบบบังคับเป็น PDF เท่านั้น** — นักศึกษา save as PDF เอง
2. **มี .docx template ให้โหลด** เพื่อช่วยพิมพ์ แต่ไม่รับ .docx เข้าระบบ
3. **Annotation ไม่แตะ Layer เอกสารจริง** — แยก layer ชัดเจนด้วย Fabric.js
4. **วท. ที่เปลี่ยนในอนาคต** — Admin จัดการเองผ่าน UI ไม่ต้องแก้ code
5. **เล่มปกแข็ง** — upload PDF เข้าระบบ และส่งเล่มจริงที่สาขา (ทำทั้งคู่)
6. **คลังผลงาน** — ขึ้นอัตโนมัติเมื่อ Admin mark ปิดโครงงานแล้ว

---

*อัปเดตล่าสุด: เวอร์ชัน 11 — เพิ่มกลุ่ม C (เล่มปกแข็ง) และระบบคลังผลงาน*
