# CSPTS - แผนการดำเนินงานฉบับละเอียด (Detailed Implementation Plan)

แผนการพัฒนาระบบติดตามโครงงานคอมพิวเตอร์แบบครบวงจร สำหรับมหาวิทยาลัยราชภัฏศรีสะเกษ (SSKRU)

## 🎯 เป้าหมายของระบบ

สร้างระบบนิเวศดิจิทัลที่เชื่อมโยงนักศึกษา อาจารย์ และเจ้าหน้าที่แอดมินเข้าด้วยกัน เพื่อจัดการเอกสาร วท.1 - วท.14 ให้มีความโปร่งใส ตรวจสอบได้ และลดการใช้กระดาษ 100%

## 🛠 เทคโนโลยีที่เลือกใช้ (The Tech Stack)

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) - เพื่อประสิทธิภาพสูงสุดและการทำ SEO สำหรับประกาศสาธารณะ
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database) - รองรับข้อมูลแบบ Dynamic JSON สำหรับแบบฟอร์มที่หลากหลาย
- **ODM**: [Mongoose](https://mongoosejs.com/) - จัดการ Schema และความสัมพันธ์ของข้อมูล
- **File Hosting**: [Google Cloud Storage](https://cloud.google.com/storage) - ระบบเก็บเอกสารระดับองค์กร ปลอดภัยและขยายตัวได้ง่าย
- **Authentication**: [NextAuth.js (Auth.js v5)](https://authjs.dev/) - รองรับการทำ Credentials Provider (Gmail + Password)
- **Styling**: [Bootstrap 5](https://getbootstrap.com/) + Custom Vanilla CSS (Premium & Glassmorphism Aesthetics)
- **Deployment**: [Vercel](https://vercel.com/) - การันตี Uptime และความเร็วในการเข้าถึงจากทุกที่

---

## 📊 1. รายละเอียดสคีมาฐานข้อมูล (Detailed Database Schema)

### **User Schema (ผู้ใช้งาน)**

| Field             | Type            | Description                                                             |
| :---------------- | :-------------- | :---------------------------------------------------------------------- |
| `_id`           | ObjectId        | Identity Key                                                            |
| `uid`           | String (Unique) | รหัสนักศึกษา/อาจารย์ (นำเข้าจาก Excel)      |
| `first_name`    | String          | ชื่อจริง (รองรับทั้งภาษาไทยและอังกฤษ) |
| `last_name`     | String          | นามสกุล                                                          |
| `gmail`         | String (Unique) | อีเมลสำหรับตรวจสอบสิทธิ์และรับ OTP        |
| `password`      | String          | รหัสผ่านที่ผ่านการ Hashing (Bcrypt)                   |
| `role`          | String          | Enum:`STUDENT`, `ADVISOR`, `ADMIN`                                |
| `academic_positions` | Array[String] | เฉพาะ ADVISOR: `COURSE_INSTRUCTOR`, `DEPARTMENT_HEAD` |
| `is_registered` | Boolean         | สถานะการสมัครสมาชิกสำเร็จ (Default: false)     |

### **Project Schema (โครงงาน)**

| Field                   | Type            | Description                                                                          |
| :---------------------- | :-------------- | :----------------------------------------------------------------------------------- |
| `title_th`            | String          | ชื่อหัวข้อโครงงาน (ภาษาไทย)                                  |
| `title_en`            | String          | ชื่อหัวข้อโครงงาน (ภาษาอังกฤษ)                            |
| `status`              | String          | สถานะปัจจุบัน (NOT_STARTED, DRAFT, SUBMITTED, AWAITING_VERIFICATION, ADVISOR_APPROVED, ADMIN_APPROVED, REJECTED) |
| `members`             | Array[Object]   | Students: `{ user_id, role: 'LEADER'/'MEMBER', status: 'PENDING'/'ACCEPTED'/'REJECTED' }` |
| `advisors`            | Array[ObjectId] | Relation -> User (Advisors)                                                          |
| `invites`             | Array[String]   | รายชื่อ Gmail ที่ถูกเชิญและยังไม่ได้กดยอมรับ |
| `year` / `semester` | Number          | ปีการศึกษาและภาคเรียนที่ลงทะเบียน                   |

### **FormSubmission & Versioning (การส่งฟอร์มและเวอร์ชัน)**

| Field            | Type       | Description                                             |
| :--------------- | :--------- | :------------------------------------------------------ |
| `form_type`    | String     | รหัสฟอร์ม (เช่น `WATT_02`)               |
| `project_id`   | ObjectId   | Link ไปยังโครงงาน                           |
| `submitted_by` | ObjectId   | ผู้ที่กดส่งฟอร์ม                        |
| `data`         | Mixed/JSON | ข้อมูลในฟอร์มทั้งหมด                |
| `document_id`  | ObjectId   | Link ไปยังไฟล์ใน Cloud Storage               |
| `version`      | Number     | เลขเวอร์ชัน (1, 2, หรือ 3)               |
| `status`       | String     | สถานะการอนุมัติ (DRAFT, SUBMITTED, etc.) |

### **Comment Schema (ระบบคอมเมนต์และข้อความแจ้งเตือน)**

| Field          | Type     | Description                                                              |
| :------------- | :------- | :----------------------------------------------------------------------- |
| `project_id` | ObjectId | Link ไปยังโครงงาน                                            |
| `user_id`    | ObjectId | Link ไปยัง User (เป็น `null` สำหรับ System Message)     |
| `step_id`    | Number   | ขั้นตอนที่คอมเมนต์ (1, 2, หรือ 3)                  |
| `content`    | String   | เนื้อหาข้อความ                                             |
| `type`       | String   | Enum:`USER` (ปกติ), `SYSTEM_APPROVE`, `SYSTEM_REJECT`          |
| `parent_id`  | ObjectId | สำหรับทำ Threaded Comments (Link ไปยัง Comment ID หลัก) |
| `created_at` | Date     | วันที่สร้าง                                                   |

### **ApprovalLog Schema (บันทึกประวัติ)**

| Field          | Type     | Description                                                   |
| :------------- | :------- | :------------------------------------------------------------ |
| `project_id` | ObjectId | Link ไปยังโครงงาน                                 |
| `step_id`    | Number   | ขั้นตอนต้นทาง                                    |
| `action`     | String   | `APPROVE` หรือ `REJECT`                               |
| `action_by`  | ObjectId | อาจารย์คนที่เป็นคนกด                      |
| `note`       | String   | ความเห็นประกอบการอนุมัติ/ตีกลับ |

### **6. กลยุทธ์การจัดการเอกสาร (Document Management Strategy)**

เพื่อให้เกิดความยืดหยุ่นและรองรับความคุ้นเคยของผู้ใช้ ระบบจะดำเนินการดังนี้:

1. **Interface/Service กลาง**:
   * สร้างไฟล์ `src/lib/storage.ts` เพื่อเป็นจุดกลางในการจัดการไฟล์ทั้งหมด (Google Cloud Storage)
   * ฟังก์ชันภายในจะประกอบด้วย อัปโหลด, ลบ และสร้าง Signed URL สำหรับเข้าถึงไฟล์
2. **การเรียกใช้งาน**:
   * ทุกส่วนของระบบ (UI หรือ API) ที่ต้องการจัดการไฟล์ จะต้องเรียกใช้ผ่าน `src/lib/storage.ts` เท่านั้น เพื่อความเป็นระเบียบและง่ายต่อการบำรุงรักษา
3. **Download & Upload (Primary)**:
   * ระบบมีเทมเพลตมาตรฐาน (วท.1-14) ให้ดาวน์โหลด
   * นักศึกษาดาวน์โหลด -> แก้ไขในเครื่อง -> อัปโหลดกลับเข้าระบบ (Version 1-3)

---

## 🔌 2. โครงสร้าง API (API Endpoints)

### **Project & Workflow**

- `GET /api/projects`: ดึงรายการโครงการ (ตาม Role)
- `POST /api/projects/create`: นักศึกษาสร้างกลุ่มและส่งคำเชิญเพื่อน
- `POST /api/projects/invite`: หัวหน้ากลุ่มส่งคำเชิญให้เพื่อน (สูงสุดรวม 3 คน/กลุ่ม)
- `DELETE /api/projects/invite`: หัวหน้ากลุ่มยกเลิกคำเชิญเพื่อน
- `POST /api/projects/:id/accept`: กดยอมรับการเข้ากลุ่ม
- `GET /api/projects/:id`: ข้อมูลโปรเจ็กต์และสถานะปัจจุบัน
- `POST /api/projects/:id/approve`: อาจารย์อนุมัติขั้นตอนปัจจุบัน (จะสร้าง System Message ในคอมเมนต์ด้วย)
- `POST /api/projects/:id/reject`: อาจารย์ตีกลับ (จะสร้าง System Message ในคอมเมนต์ด้วย)
- `GET /api/projects/:id/export`: **Export เอกสารที่นักศึกษาส่งออกมาเป็น PDF** (สำหรับอาจารย์)
- `GET /api/admin/reports/summary`: **Export สรุปสถานะทุกโครงงานเป็น PDF** (สำหรับแอดมิน)

### **Comments & Discussion**

- `GET /api/projects/:id/comments?step=:step`: ดึงคอมเมนต์ทั้งหมดในขั้นตอนนั้น (รวม System Messages)
- `POST /api/projects/:id/comments`: สร้างคอมเมนต์ใหม่ (รองรับ `parent_id` สำหรับตอบกลับ)

---

## 🔄 3. โมเดลเวิร์กโฟลว์ (Workflow & Audit Log)

### **Workflow Lifecycle**

1. **NOT_STARTED**: โครงงานเพิ่งเริ่มต้น ยังไม่มีแบบฟอร์ม (รอสมาชิกรวมกลุ่ม)
2. **DRAFT**: นักศึกษากรอกข้อมูลแต่ยังไม่ส่ง (แก้ไขได้ตลอด)
3. **SUBMITTED**: ส่งฟอร์มเข้าระบบ (ล็อคข้อมูลห้ามแก้ไข)
4. **AWAITING_VERIFICATION**: แอดมินหรือเจ้าหน้าที่ตรวจสอบเอกสารเบื้องต้น
5. **ADVISOR_APPROVED**: อาจารย์ที่ปรึกษาลงนามอนุมัติผ่านระบบ
6. **ADMIN_APPROVED**: ผ่านการอนุมัติขั้นสุดท้าย (สถานะสมบูรณ์)
7. **REJECTED**: ถูกตีกลับเพื่อแก้ไข (จะสร้าง Version ใหม่เมื่อนักศึกษาแก้ไข)

### **5. ระบบการแจ้งเตือนแบบละเอียด (Detailed Notification Matrix)**

เพื่อให้การติดตามโครงงานมีประสิทธิภาพ ระบบจะจัดการแจ้งเตือนตามบทบาทและเหตุการณ์ที่เกิดขึ้นดังนี้:

| เหตุการณ์               | ใครควรได้รับแจ้ง        | ช่องทาง | รายละเอียด                                                                                                                  |
| :------------------------------- | :-------------------------------------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| **OTP Verification**       | นักศึกษา/อาจารย์ใหม่ | Email only     | ครั้งเดียวตอนสมัคร / หมดอายุ 10 นาที                                                                     |
| **New Submission**         | อาจารย์ที่ปรึกษา        | Email + In-app | แจ้งทุกครั้งที่มีการส่งเอกสารใหม่เข้าสู่ระบบ                                              |
| **Status Changed**         | นักศึกษา                        | Email + In-app | แจ้งทันทีเมื่อเอกสารได้รับการ**อนุมัติ (Approve)** หรือ **ตีกลับ (Reject)** |
| **Important Announcement** | ทุกคน                              | Email + In-app | แจ้งประกาศกำหนดการหรือวันสำคัญจากแอดมิน                                                        |
| **New Comment (Threaded)** | สมาชิกกลุ่ม + อาจารย์ | In-app + Email | แจ้งเมื่อมีการตอบโต้ในเธรดการสนทนาของแต่ละขั้นตอน                                    |
| **Role-Specific Badges**   | นักศึกษา (REJECTED)             | In-app only    | แสดงตัวเลขแจ้งเตือนสีแดง (Badge) บนเมนูงานที่ต้องแก้ไข                                   |
|                                  | อาจารย์ (SUBMITTED)              | In-app only    | แสดงตัวเลขแจ้งเตือนสีแดงสำหรับงานที่รอการตรวจ                                            |
|                                  | Admin (New Users)                       | In-app only    | แสดง Badge สำหรับการสมัครสมาชิกใหม่ที่รอการยืนยัน                                           |

#### **เหตุการณ์แจ้งเตือนเพิ่มเติม (Additional Events)**

1. **Deadline Reminder**: แจ้งเตือนนักศึกษาและอาจารย์เมื่อใกล้ถึงกำหนดส่งเอกสาร (เพื่อลดโอกาสพลาดกำหนด)
2. **Version Update**: แจ้งเตือนอาจารย์เมื่อนักศึกษาอัปโหลดไฟล์แก้ไขใหม่หลังจากถูก Reject
3. **Admin Actions**: แจ้งเตือนผู้เกี่ยวข้องเมื่อแอดมินมีการลบโครงการหรือปรับสิทธิ์การใช้งาน (In-app Only)
4. **System Errors**: แจ้งเตือนผู้ใช้งานเมื่อเกิดความผิดพลาดในการอัปโหลดไฟล์หรือไฟล์มีขนาดใหญ่เกินไป

#### **การจัดลำดับความสำคัญ (Notification Prioritization)**

- **🌕 Critical & Immediate (Email + In-app)**: OTP, Status Changed, New Submission, System Errors
- **🌗 Medium (In-app + Email Optional)**: Threaded Comments, Version Update, Deadline Reminder
- **🌑 Low / Passive (In-app Sufficient)**: Announcements, Task Badges

### **Audit Log (ระบบประวัติการทำงาน)**

ทุกครั้งที่มีการเปลี่ยนสถานะ ระบบจะบันทึก:

- `timestamp`: วันและเวลาที่เกิดเหตุการณ์
- `action_by`: ใครเป็นคนกด (ID ของแอดมิน/อาจารย์)
- `transition`: สถานะเดิม -> สถานะใหม่
- `remarks`: เหตุผลในการอนุมัติหรือปฏิเสธ

---

## 🔐 3. ความปลอดภัยและสิทธิ์การเข้าถึง (Security & RBAC)

- **Registration Security**:
  - ตรวจสอบ Gmail จากฐานข้อมูลที่ Admin นำเข้าเท่านั้น (Whitelist)
  - **OTP System**: รหัส 6 หลักมีอายุ 10 นาที และจำกัดการขอใหม่ได้ไม่เกิน 3 ครั้งใน 30 นาที (Rate Limiting)
- **Data Protection**:
  - `password`: Hash ด้วย Bcrypt (Salt rounds: 12)
  - `Server-Side Validation`: ตรวจสอบบทบาท (Role) ทุกครั้งก่อนเข้าถึง API หรือหน้าเว็บ
- **File Security**:
  - จำกัดประเภทไฟล์: [.pdf](file:///c:/Users/kingj/Documents/Programming3_2/Project/cspts/cspts_app/docs/%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%A1%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%9A%E0%B8%97%E0%B8%97%E0%B8%B5%E0%B9%88-123%E0%B8%AA%E0%B8%B3%E0%B9%80%E0%B8%99%E0%B8%B2.pdf), [.docx](file:///c:/Users/kingj/Documents/Programming3_2/Project/cspts/cspts_app/docs/%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%A1%E0%B8%B4%E0%B8%99/%E0%B8%A7%E0%B8%97.%E0%B8%9B.1%20%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%A1%E0%B8%B4%E0%B8%99%E0%B8%81%E0%B8%A3%E0%B8%AD%E0%B8%9A%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B9%82%E0%B8%84%E0%B8%A3%E0%B8%87%E0%B8%87%E0%B8%B2%E0%B8%99.docx)
  - ขนาดไฟล์สูงสุด: 20MB ต่อไฟล์
  - GCS Signed URLs: ใช้ URL ชั่วคราวในการเข้าถึงไฟล์เพื่อความปลอดภัย

---

## 🎨 4. ส่วนติดต่อผู้ใช้งาน (UI/UX Strategy)

- **Dashboard Design**: เน้นความสะอาดตา (Clean UI) แบ่งโซนชัดเจนระหว่าง "สิ่งที่จะต้องทำตอนนี้" และ "ประวัติที่ผ่านมา"
- **User Management Navigation**:
  - ใช้ **Sliding Tabs (ซ้าย-ขวา)** เพื่อแยกมุมมองระหว่าง "นักศึกษา" และ "บุคลากร" เพื่อลดความแออัดของข้อมูล
  - ระบบนำเข้า Excel แบบแยกส่วน (Student/Staff) พร้อมระบบ Slide ภายใน Modal
- **Visual Feedback**:
  - Step Progress Bar: บอกว่าตอนนี้โครงงานถึงขั้นตอนไหนแล้ว
  - Status Badges: สีสันสื่อความหมาย (เขียว=อนุมัติ, เหลือง=รอดำเนินการ, แดง=ตีกลับ)
  - Role & Position Badges: แยกแยะสิทธิ์และตำแหน่งทางวิชาการได้ทันที
- **Responsive CSS**:
  - ใช้ **Bootstrap Grid** เป็นฐานเพื่อให้รองรับหน้าจอคอมพิวเตอร์และแท็บเล็ต
  - หน้าจัดการเอกสารออกแบบให้เหมือนกระดาษจริง (A4 Layout Preview) เพื่อให้อาจารย์ตรวจได้ง่าย

---

## 📅 5. แผนการพัฒนาแบ่งตามระยะเวลา (Development Roadmap)

### **Phase 1: Foundation (สัปดาห์ที่ 1)**

- [X] ติดตั้ง Next.js 16 + TypeScript + Mongoose
- [X] ตั้งค่าการเชื่อมต่อ MongoDB Atlas และ Google Cloud Storage
- [X] ออกแบบ Base Layout (Navbar, Sidebar) ด้วย Bootstrap + Custom CSS

### **Phase 2: Auth & User Management (สัปดาห์ที่ 2)**

- [X] พัฒนา Admin Module: Import ผู้ใช้งานจาก Excel
- [X] พัฒนาระบบลงทะเบียน: ตรวจสอบ Gmail -> ส่ง OTP -> ตั้งรหัสผ่าน
- [X] ตั้งค่า NextAuth.js สำหรับ Login/Logout
- [X] ระบบแยก Student/Staff พร้อม Sliding UI ในหน้า Admin
- [X] ระบบจัดการตำแหน่ง "ประธานสาขาวิชา" (มีได้เพียงคนเดียวเสมอ)
- [X] ระบบจัดเรียงรายชื่อนักศึกษาตามลำดับรหัส (01, 02...)

### **Phase 3: Core Workflow (สัปดาห์ที่ 3-4)**

- [ ] พัฒนาหน้าจอส่งแบบฟอร์ม (วท.1 - วท.2 เป็นลำดับแรก)
- [ ] ระบบอัปโหลดไฟล์ขึ้น GCS และการจัดการเวอร์ชัน (1-3)
- [ ] ระบบอนุมัติ (Approval System) และ Audit Log
- [ ] ระบบแจ้งเตือน (In-app + Email)

### **Phase 4: Admin Dashboard & Schedule (สัปดาห์ที่ 5)**

- [ ] หน้า Dashboard สำหรับ Admin เพื่อติดตามทุกกลุ่ม
- [ ] ระบบจัดการกำหนดการส่วนกลาง (Schedules)
- [ ] ระบบลบกลุ่มโครงงานและจัดการสิทธิ์รายบุคคล

### **Phase 5: Polishing & Testing (สัปดาห์ที่ 6)**

- [ ] ทำการ Unit Test ระบบการคำนวณคะแนน (ถ้ามี)
- [ ] ปรับจูน UI ให้สวยงามระดับ High-End
- [ ] ทดสอบประสิทธิภาพบน Vercel ก่อนส่งมอบ
