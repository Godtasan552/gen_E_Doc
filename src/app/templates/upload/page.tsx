"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Upload, FileText, CheckCircle2, ChevronLeft, Loader2, Info } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      Swal.fire("ข้อผิดพลาด", "กรุณาเลือกไฟล์ก่อนอัปโหลด", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const res = await axios.post("/api/templates/upload", formData);
      Swal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: "อัปโหลดและวิเคราะห์ตัวแปรสำเร็จแล้ว",
        confirmButtonColor: "#4f46e5",
      });
      router.push(`/templates/fill/${res.data.id}`);
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err) ? err.response?.data?.error : "เกิดข้อผิดพลาด";
      Swal.fire("อัปโหลดไม่สำเร็จ", errorMessage || "เกิดข้อผิดพลาด", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="container fade-in">
        <header className="flex justify-between items-center py-8 mb-8">
          <Link href="/" className="btn btn-outline text-sm">
            <ChevronLeft size={18} /> ย้อนกลับ
          </Link>
          <div className="text-right">
             <h2 className="font-bold text-slate-900">อัปโหลดแม่แบบ</h2>
             <p className="text-xs text-slate-400">Step 1 of 2: Template Setup</p>
          </div>
        </header>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">นำเข้าไฟล์ Word</h1>
            <p className="text-slate-500">ระบบจะวิเคราะห์หาตัวแปรในรูปแบบ {`{ตัวแปร}`} เพื่อสร้างแบบฟอร์มให้อัตโนมัติ</p>
          </div>

          <div className="card shadow-xl border-none p-10">
            <label className="upload-zone group block mb-8">
              <input type="file" className="hidden" accept=".docx" onChange={handleFileChange} />
              <div className="flex flex-col items-center">
                {file ? (
                  <div className="animate-fade-in text-center">
                    <div className="bg-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                      <FileText size={40} />
                    </div>
                    <p className="text-xl font-bold text-indigo-600 mb-1">{file.name}</p>
                    <p className="text-sm text-slate-400">ขนาดไฟล์: {(file.size / 1024).toFixed(2)} KB</p>
                    <div className="mt-4 text-indigo-500 text-sm font-medium">คลิกเพื่อเปลี่ยนไฟล์</div>
                  </div>
                ) : (
                  <>
                    <div className="bg-slate-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                      <Upload size={40} />
                    </div>
                    <p className="text-xl font-bold text-slate-700 mb-1">ลากไฟล์มาวาง หรือ คลิกเพื่อเลือก</p>
                    <p className="text-sm text-slate-400">รองรับเฉพาะไฟล์ .docx (Microsoft Word)</p>
                  </>
                )}
              </div>
            </label>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 text-amber-800 text-sm mb-8">
              <Info className="shrink-0" size={20} />
              <p>
                <strong>ทิป:</strong> โปรดตรวจสอบให้แน่ใจว่าในไฟล์ Word ของคุณมีการเขียนตัวแปรในรูปแบบ <code>{`{ตัวแปร}`}</code> 
                เช่น <code>{`{student_name}`}</code> เพื่อให้ระบบสร้างแบบฟอร์มได้อย่างถูกต้อง
              </p>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className={`btn btn-primary w-full py-4 text-lg ${(!file || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  กำลังประมวลผลแม่แบบเอกสาร...
                </>
              ) : (
                <>เริ่มสร้างแบบฟอร์มดิจิทัล</>
              )}
            </button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="flex flex-col items-center text-center">
                <div className="bg-white shadow-sm border border-slate-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                   <CheckCircle2 size={24} className="text-emerald-500" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1">สแกนตัวแปร</h3>
                <p className="text-xs text-slate-400">ดึงข้อมูลตัวแปรจากไฟล์อัตโนมัติ</p>
             </div>
             <div className="flex flex-col items-center text-center">
                <div className="bg-white shadow-sm border border-slate-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                   <CheckCircle2 size={24} className="text-emerald-500" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1">สร้างฟอร์ม</h3>
                <p className="text-xs text-slate-400">ได้หน้ากรอกข้อมูลที่สวยงามทันที</p>
             </div>
             <div className="flex flex-col items-center text-center">
                <div className="bg-white shadow-sm border border-slate-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                   <CheckCircle2 size={24} className="text-emerald-500" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1">เป็น PDF</h3>
                <p className="text-xs text-slate-400">ส่งออกไฟล์ PDF คุณภาพสูง</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
