"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

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
    <div className="container animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">อัปโหลดแม่แบบเอกสาร</h1>
        <p className="text-slate-500">เลือกไฟล์ .docx เพื่อสร้างแบบฟอร์มกรอกข้อมูลอัตโนมัติ</p>
      </div>

      <div className="card max-w-2xl mx-auto">
        <label className="drop-zone block">
          <input type="file" className="hidden" accept=".docx" onChange={handleFileChange} />
          <div className="flex flex-col items-center">
            {file ? (
              <>
                <FileText className="w-16 h-16 text-indigo-500 mb-4" />
                <p className="text-lg font-medium text-slate-700">{file.name}</p>
                <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
              </>
            ) : (
              <>
                <Upload className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-700">คลิกหรือลากไฟล์มาวางที่นี่</p>
                <p className="text-sm text-slate-400">รองรับไฟล์ Microsoft Word (.docx) เท่านั้น</p>
              </>
            )}
          </div>
        </label>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`btn btn-primary px-8 ${(!file || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                กำลังอัปโหลด...
              </>
            ) : (
              "เริ่มวิเคราะห์ตัวแปร"
            )}
          </button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-4">
          <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-indigo-600 w-6 h-6" />
          </div>
          <h3 className="font-semibold mb-2">ไม่ต้องเขียนโค้ด</h3>
          <p className="text-sm text-slate-500">ระบบจะหาตัวแปร {`{ชื่อ}`} ใน Word ของคุณให้เอง</p>
        </div>
        <div className="p-4">
          <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-indigo-600 w-6 h-6" />
          </div>
          <h3 className="font-semibold mb-2">รักษาต้นฉบับ</h3>
          <p className="text-sm text-slate-500">คงเลย์เอาต์เดิมไว้ 100% เมื่อ Export เป็น PDF</p>
        </div>
        <div className="p-4">
          <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-indigo-600 w-6 h-6" />
          </div>
          <h3 className="font-semibold mb-2">ใช้งานง่าย</h3>
          <p className="text-sm text-slate-500">กรอกฟอร์มแล้วได้ไฟล์ PDF ทันที</p>
        </div>
      </div>
    </div>
  );
}
