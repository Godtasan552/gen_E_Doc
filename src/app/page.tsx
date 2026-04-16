import Link from "next/link";
import { FilePlus, FileText, Settings, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="container text-center py-20 fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-6">
          <ShieldCheck size={16} />
          SSKRU Evaluation System Supported
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Gen<span className="text-indigo-600">E</span>Doc
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          เปลี่ยนไฟล์ Word ของคุณให้เป็นจุดกรอกข้อมูลดิจิทัลที่สวยงาม 
          และส่งออกเป็น PDF คุณภาพสูงด้วยพลังของพลังของระบบจัดการเอกสารล่าสุด
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/templates/upload" className="btn btn-primary px-8 py-4 text-lg">
            เริ่มใช้งานฟรี <ArrowRight size={20} />
          </Link>
          <button className="btn btn-outline px-8 py-4 text-lg">
            ดูคู่มือการใช้งาน
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-slate-50 py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/templates/upload" className="card border-none shadow-sm hover:shadow-xl group">
              <div className="bg-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                <FilePlus size={28} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">สร้างแม่แบบใหม่</h2>
              <p className="text-slate-500 leading-relaxed">
                เพียงอัปโหลดไฟล์ Word (.docx) ระบบจะสแกนหาตัวแปรและสร้างแบบฟอร์มให้คุณทันที 
                รวดเร็ว ไม่ต้องเขียนโค้ด
              </p>
            </Link>

            <div className="card border-none shadow-sm opacity-70 cursor-not-allowed">
              <div className="bg-emerald-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-white">
                <FileText size={28} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">เรียกดูเอกสาร</h2>
              <p className="text-slate-500 leading-relaxed">
                จัดการและเรียกดูรายการเอกสารที่เคยสร้างไว้ (Coming Soon) 
                เตรียมพบกับระบบคลังเอกสารในเร็วๆ นี้
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 mt-auto">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-400 text-sm">
            © 2026 GenEDoc Project. SSKRU Programming.
          </div>
          <div className="flex gap-8 items-center opacity-60">
             <div className="flex items-center gap-2 font-semibold text-slate-700">
                <Settings size={18} />
                Powered by LibreOffice
             </div>
             <div className="flex items-center gap-2 font-semibold text-slate-700">
                <ShieldCheck size={18} />
                Secure & Digital
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
