# CSPTS Project Blueprint & Roadmap

สรุปโครงสร้างและวิธีการพัฒนาโปรเจกต์ **CSPTS (Computer Project Tracking System)** เพื่อเปลี่ยนเป็น Next.js

## 1. ภาพรวมโปรเจกต์ (Project Summary)
ระบบติดตามและจัดการโครงงานคอมพิวเตอร์ (CSPTS) ออกแบบมาเพื่อให้นักศึกษา อาจารย์ และเจ้าหน้าที่ สามารถจัดการกระบวนการทำโครงงานตั้งแต่เสนอหัวข้อจนถึงจบการศึกษา (วท.1 - วท.14)

### ฟีเจอร์หลัก:
- **Authentication**: ระบบ Login/Logout แบ่งบทบาท (Student, Advisor, Admin) และระบบลืมรหัสผ่าน (OTP via Email)
- **Project Tracking**: จัดการกลุ่มโครงงาน, ค้นหาที่ปรึกษา, และสถานะโครงงาน
- **E-Document**: ระบบส่งแบบฟอร์มออนไลน์ (Web Form) และการสร้างเอกสารอัตโนมัติ (Docx to PDF)
- **Cloud Storage**: เก็บไฟล์เอกสารและรูปภาพบน Google Cloud Storage
- **Notifications**: ระบบแจ้งเตือนสถานะผ่านหน้าเว็บและอีเมล

---

## 2. เทคโนโลยีที่ใช้ (Tech Stack)
สำหรับการพัฒนาด้วย Next.js (เวอร์ชันล่าสุดที่แนะนำ):
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Frontend Components**: [Bootstrap 5](https://getbootstrap.com/) หรือ [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) กับ [Mongoose](https://mongoosejs.com/)
- **Email Service**: [Nodemailer](https://nodemailer.com/)
- **File Storage**: [Google Cloud Storage](https://cloud.google.com/storage)
- **Doc Generation**: `docxtemplater`, `pizzip`, `pdf-lib`

---

## 3. ขั้นตอนการสร้างโปรเจกต์ (Step-by-Step Roadmap)

### Step 1: Initialize Project
เริ่มสร้างโปรเจกต์ Next.js พร้อมรองรับ TypeScript และการจัดการโครงสร้างไฟล์
```bash
npx create-next-app@latest .
```

### Step 2: Database Connection
ตั้งค่าการเชื่อมต่อ MongoDB ใน `src/lib/db.ts` เพื่อให้ API เรียกใช้งานได้ทั่วถึง

### Step 3: Define Data Models (Mongoose)
สร้าง Schema ใน `src/models/`:
- `User.ts`: เก็บข้อมูลผู้ใช้, บทบาท, รหัสผ่าน (Hashed)
- `Project.ts`: ข้อมูลโครงงาน, สมาชิก, ที่ปรึกษา, สถานะ
- `FormSubmission.ts`: ข้อมูลการส่งเอกสารต่างๆ
- `Notification.ts`: ข้อมูลการแจ้งเตือน

### Step 4: Authentication System
ตั้งค่า NextAuth ใน `src/app/api/auth/[...nextauth]/route.ts`:
- ใช้ **Credentials Provider** สำหรับ Login ด้วย Email/Password
- เก็บ **Session** ไว้ใน Client เพื่อตรวจสอบสิทธิ์การเข้าถึงหน้าต่างๆ

### Step 5: API Development
พัฒนาระบบหลังบ้านใน `src/app/api/`:
- `/api/register`: ลงทะเบียนผู้ใช้ใหม่
- `/api/projects`: จัดการข้อมูลโครงงาน
- `/api/auth/forgot-password`: ระบบส่ง OTP และ Reset Password

### Step 6: Frontend Development
สร้างหน้าจอการใช้งานตาม Role:
- **Common**: Home, Login, Profile
- **Student**: จัดเสนอโครงงาน, ส่งแบบฟอร์ม, ดูสถานะ
- **Advisor**: ตรวจสอบคำขอ, อนุมัติเอกสาร
- **Admin**: จัดการผู้ใช้, ตั้งค่ากำหนดการ

### Step 7: Document Service
ระบบจัดการเอกสาร (วท.1 - วท.14):
- รับข้อมูลจาก Form ในหน้าเว็บ
- ใช้ `docxtemplater` ใส่ข้อมูลลงใน Template Word
- แปลงเป็น PDF (สามารถใช้ `libreoffice-convert` ใน Server-side)

---

## 4. โครงสร้างโฟลเดอร์ที่แนะนำ (Folder Structure)
```text
src/
├── app/                  # Next.js App Router (Pages & APIs)
│   ├── (auth)/           # Login, Register, Forgot Password
│   ├── admin/            # Admin Dashboard
│   ├── student/          # Student Dashboard
│   └── api/              # Backend Endpoints
├── components/           # Reusable UI Components
├── lib/                  # Utilities (db, auth, storage)
├── models/               # Mongoose Models
├── services/             # Business Logic (email, doc generation)
└── types/                # TypeScript Definitions
```

---

## 5. ข้อแนะนำเพิ่มเติม (Tips for Next.js Migration)
- **Server Components**: พยายามใช้ Server Components สำหรับหน้าแสดงผลข้อมูลเพื่อ Performance ที่ดี
- **Client Components ('use client')**: ใช้เฉพาะเมื่อจำเป็นต้องมีการ Interaction (Form, Click, State)
- **API Routes**: ไม่จำเป็นต้องมี Backend แยกชิ้น สามารถทำทุกอย่างใน Next.js ได้เลย
- **Environment Variables**: เก็บความลับ (DB URI, API Keys) ไว้ใน `.env` เสมอ
