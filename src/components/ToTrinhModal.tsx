import { useState } from "react";
import {
  X,
  Printer,
  FileText,
  Send,
  CheckCircle2,
  Building,
  UserCheck,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { appStore, useAppState } from "@/services/app-state";
import { formatVND, type HoSo } from "@/data/mock";
import { docSoTienBangChu } from "@/services/calculator.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hoSo: HoSo | null;
  onSubmitted?: () => void;
}

export function ToTrinhModal({ isOpen, onClose, hoSo, onSubmitted }: Props) {
  const { currentUser } = useAppState();
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !hoSo) return null;

  const now = new Date();
  const soToTrinh = `TTr-LĐTBXH-${now.getFullYear()}/${hoSo.id.replace(/\D/g, "").slice(-3) || "086"}`;
  const ngayLap = now.toLocaleDateString("vi-VN");

  const tongTien = hoSo.mucTroCap + (hoSo.phuCapPhucVu || 0);
  const soTienChu = docSoTienBangChu(tongTien > 0 ? tongTien : 2055000);

  const isChoPheDuyet = hoSo.trangThai === "CHỜ_PHÊ_DUYỆT";
  const isDaDuyet = hoSo.trangThai === "ĐÃ_DUYỆT";
  const isCanBoPhong = currentUser.role === "ADMIN_PHONG";
  const isLeader = currentUser.role === "ADMIN_SO";

  // Xử lý gửi Tờ trình lên Lãnh đạo Sở phê duyệt
  const handleSubmitToTrinh = () => {
    setSubmitting(true);
    setTimeout(() => {
      appStore.updateProfileStatus(
        hoSo.id,
        "CHỜ_PHÊ_DUYỆT",
        `Phòng LĐ-TB&XH TP. Thủ Dầu Một đã lập ${soToTrinh} đề nghị Giám đốc Sở phê duyệt trợ cấp ưu đãi cho ông/bà ${hoSo.hoTen}.`,
      );
      toast.success(`Đã gửi Tờ trình số ${soToTrinh} lên Ban Giám đốc Sở!`, {
        description: `Hồ sơ ${hoSo.hoTen} đã chuyển sang trạng thái "CHỜ_PHÊ_DUYỆT".`,
      });
      setSubmitting(false);
      if (onSubmitted) onSubmitted();
    }, 500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-md shadow-2xl max-w-4xl w-full border border-gray-300 overflow-hidden my-4 text-[#222]">
        {/* HEADER ĐIỀU KHIỂN (Ẩn khi in) */}
        <div className="no-print bg-[#0073b7] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-blue-900">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-amber-300" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-200">
                TỜ TRÌNH ĐỀ NGHỊ PHÊ DUYỆT CHẾ ĐỘ ƯU ĐÃI NGƯỜI CÓ CÔNG
              </div>
              <div className="text-[11px] text-white/90 font-mono">
                Số: <strong>{soToTrinh}</strong> · Phòng LĐ-TB&amp;XH TP. Thủ Dầu Một trình Giám đốc Sở
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Nút gửi tờ trình nếu hồ sơ chưa ở trạng thái CHỜ_PHÊ_DUYỆT hoặc ĐÃ_DUYỆT */}
            {!isChoPheDuyet && !isDaDuyet && (
              <button
                type="button"
                onClick={handleSubmitToTrinh}
                disabled={submitting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#00a65a] hover:bg-[#008d4c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Send className="size-3.5" />
                <span>{submitting ? "Đang gửi tờ trình..." : "Ký & Gửi Tờ trình lên Sở"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded bg-white hover:bg-gray-100 text-gray-800 px-3 py-1.5 text-xs font-bold transition-colors shadow-xs"
            >
              <Printer className="size-3.5 text-gray-600" />
              <span>In Tờ trình (A4)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* THÔNG BÁO TIẾN ĐỘ TỜ TRÌNH */}
        <div className="no-print bg-blue-50 border-b border-blue-200 px-5 py-2 text-xs text-blue-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="size-4 text-blue-700 shrink-0" />
            <span>
              Người lập tờ trình: <strong>Nguyễn Thị Minh Thảo</strong> (Chuyên viên Thụ lý Một cửa &amp; CSXH)
            </span>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
              isDaDuyet
                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                : isChoPheDuyet
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-blue-100 text-blue-800 border-blue-300"
            }`}
          >
            {isDaDuyet
              ? "Lãnh đạo Sở đã phê duyệt ban hành QĐ"
              : isChoPheDuyet
                ? "Đang chờ Giám đốc Sở ký duyệt"
                : "Dự thảo Tờ trình cấp phòng"}
          </span>
        </div>

        {/* NỘI DUNG VĂN BẢN TỜ TRÌNH CHUẨN THỂ THỨC NGHỊ ĐỊNH 30/2020/NĐ-CP */}
        <div className="p-8 sm:p-12 font-serif text-[14px] leading-relaxed bg-white max-h-[82vh] overflow-y-auto">
          {/* 1. Header cơ quan & Tiêu ngữ */}
          <div className="grid grid-cols-12 gap-2 text-center pb-4 border-b border-gray-300">
            <div className="col-span-5 text-center">
              <div className="text-[12px] font-normal uppercase text-gray-800">
                ỦY BAN NHÂN DÂN TP. THỦ DẦU MỘT
              </div>
              <div className="text-[13px] font-bold uppercase text-gray-900 mt-0.5">
                PHÒNG LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI
              </div>
              <div className="w-24 h-[1px] bg-gray-800 mx-auto my-1" />
              <div className="text-[12px] text-gray-700 mt-1 font-sans">
                Số: <span className="font-semibold text-blue-800">{soToTrinh}</span>
              </div>
            </div>

            <div className="col-span-7 text-center">
              <div className="text-[13px] font-bold uppercase text-gray-900 tracking-wider">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </div>
              <div className="text-[13px] font-bold text-gray-900 italic mt-0.5">
                Độc lập - Tự do - Hạnh phúc
              </div>
              <div className="w-36 h-[1px] bg-gray-800 mx-auto my-1" />
              <div className="text-[12px] text-gray-600 italic mt-1 font-serif">
                Thủ Dầu Một, ngày {ngayLap}
              </div>
            </div>
          </div>

          {/* 2. Tiêu đề Tờ trình */}
          <div className="text-center my-6">
            <h1 className="text-lg sm:text-xl font-bold uppercase text-gray-900 tracking-wide">
              TỜ TRÌNH
            </h1>
            <div className="text-sm sm:text-base font-bold text-gray-800 mt-1">
              Về việc đề nghị giải quyết chế độ trợ cấp, phụ cấp ưu đãi người có công với cách mạng
            </div>
            <div className="text-xs italic text-gray-600 mt-2">
              Kính gửi: <strong>Giám đốc Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương</strong>
            </div>
          </div>

          {/* 3. Nội dung báo cáo thẩm định thực tế */}
          <div className="space-y-3.5 text-justify text-[13.5px] leading-relaxed">
            <p className="indent-6">
              Căn cứ Pháp lệnh Ưu đãi người có công với cách mạng số 02/2020/UBTVQH14 ngày 09 tháng 12 năm 2020 của Ủy ban Thường vụ Quốc hội;
            </p>
            <p className="indent-6">
              Căn cứ Nghị định số 131/2021/NĐ-CP ngày 30 tháng 12 năm 2021 của Chính phủ quy định chi tiết và biện pháp thi hành Pháp lệnh Ưu đãi người có công với cách mạng;
            </p>
            <p className="indent-6">
              Căn cứ Nghị định số 75/2021/NĐ-CP và Nghị định số 77/2024/NĐ-CP ngày 25 tháng 06 năm 2024 của Chính phủ sửa đổi mức chuẩn trợ cấp ưu đãi người có công với cách mạng;
            </p>
            <p className="indent-6">
              Bộ phận Tiếp nhận và Trả kết quả (Một cửa) TP. Thủ Dầu Một đã tiếp nhận và lập hồ sơ đề nghị giải quyết chính sách ưu đãi cho đối tượng:
            </p>

            {/* Bảng tóm tắt thông tin đối tượng */}
            <div className="bg-gray-50 border border-gray-200 rounded p-4 my-2 text-xs font-sans space-y-1.5">
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 font-semibold text-gray-600">1. Họ và tên đối tượng:</span>
                <span className="col-span-8 font-bold text-gray-950 uppercase">{hoSo.hoTen}</span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 font-semibold text-gray-600">2. Số CCCD / Định danh cá nhân:</span>
                <span className="col-span-8 font-mono font-semibold">{hoSo.cccd}</span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 font-semibold text-gray-600">3. Nơi thường trú:</span>
                <span className="col-span-8">
                  {hoSo.khuPho}, Phường {hoSo.phuong}, {hoSo.huyen || "TP. Thủ Dầu Một"}, tỉnh Bình Dương
                </span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 font-semibold text-gray-600">4. Diện hồ sơ thụ lý:</span>
                <span className="col-span-8 font-bold text-blue-900">{hoSo.loaiDoiTuong}</span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 font-semibold text-gray-600">5. Kết luận Giám định Y khoa:</span>
                <span className="col-span-8 font-semibold text-[#dd4b39]">
                  Tỷ lệ tổn thương cơ thể: {hoSo.tyLeTonThuong}% (Biên bản GĐYK số {hoSo.id.slice(-3)}/BB-GĐYK)
                </span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                <span className="col-span-4 font-semibold text-gray-600">6. Mức trợ cấp đề nghị hưởng:</span>
                <span className="col-span-8 font-bold text-emerald-800">
                  {formatVND(hoSo.mucTroCap > 0 ? hoSo.mucTroCap : 2055000)} / tháng
                </span>
              </div>
              {hoSo.phuCapPhucVu > 0 && (
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 font-semibold text-gray-600">7. Phụ cấp người phục vụ:</span>
                  <span className="col-span-8 font-semibold">{formatVND(hoSo.phuCapPhucVu)} / tháng</span>
                </div>
              )}
              <div className="grid grid-cols-12 gap-1 pt-1 border-t border-gray-200">
                <span className="col-span-4 font-bold text-gray-800">Tổng kinh phí đề nghị/tháng:</span>
                <span className="col-span-8 font-bold text-[#dd4b39]">
                  {formatVND(tongTien > 0 ? tongTien : 2055000)} ({soTienChu})
                </span>
              </div>
            </div>

            <p className="indent-6">
              <strong>Kết quả thẩm tra hồ sơ:</strong> Qua kiểm tra thực địa, đối chiếu hồ sơ gốc và trích lục thông tin cư trú từ Cơ sở dữ liệu quốc gia về Dân cư (VNeID Đề án 06), hồ sơ của Ông/Bà <strong>{hoSo.hoTen}</strong> hoàn toàn đầy đủ, hợp lệ, đúng đối tượng và điều kiện theo quy định của pháp luật hiện hành.
            </p>

            <p className="indent-6">
              Phòng Lao động - Thương binh và Xã hội TP. Thủ Dầu Một kính trình Giám đốc Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương xem xét, ký ban hành Quyết định hưởng trợ cấp, phụ cấp ưu đãi người có công với cách mạng cho đối tượng có tên nêu trên.
            </p>

            <p className="italic text-gray-700">
              (Kèm theo: Dự thảo Quyết định; Biên bản Hội đồng Giám định Y khoa; Đơn đề nghị và tài liệu minh chứng).
            </p>
          </div>

          {/* 4. Phần ký duyệt Tờ trình Cấp Phòng */}
          <div className="grid grid-cols-12 gap-4 mt-8 pt-4 border-t border-gray-200 items-start">
            <div className="col-span-5 text-xs text-gray-700">
              <div className="font-bold uppercase text-gray-800 mb-1">Nơi nhận:</div>
              <ul className="space-y-0.5 italic text-[11px]">
                <li>- Như kính gửi;</li>
                <li>- UBND TP. Thủ Dầu Một (b/c);</li>
                <li>- UBND Phường {hoSo.phuong};</li>
                <li>- Lưu: VT, HS (02b).</li>
              </ul>
            </div>

            <div className="col-span-7 text-center">
              <div className="font-bold uppercase text-[12px] text-gray-900">
                KT. TRƯỞNG PHÒNG
              </div>
              <div className="font-bold uppercase text-sm text-[#0073b7]">
                PHÓ TRƯỞNG PHÒNG THƯỜNG TRỰC
              </div>

              {/* Chữ ký cán bộ phòng */}
              <div className="my-3 min-h-[70px] flex items-center justify-center">
                <div className="border border-blue-200 bg-blue-50/60 p-2.5 rounded text-left text-xs space-y-0.5">
                  <div className="text-[10px] text-blue-600 font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 className="size-3 text-blue-600" />
                    <span>ĐÃ THẨM ĐỊNH &amp; XÁC THỰC CÔNG VỤ</span>
                  </div>
                  <div className="font-bold text-gray-900">Nguyễn Thị Minh Thảo</div>
                  <div className="text-[11px] text-gray-500">Chuyên viên Thụ lý Một cửa &amp; CSXH</div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    Ngày ký: {ngayLap} · Mã: TTR-TDM-{hoSo.id}
                  </div>
                </div>
              </div>

              <div className="font-bold text-sm text-gray-900 uppercase">
                Nguyễn Thị Minh Thảo
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="no-print bg-gray-100 px-6 py-3 border-t border-gray-300 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1.5 text-[11px]">
            <CheckCircle2 className="size-4 text-blue-600" />
            <span>Tờ trình hành chính chuẩn Nghị định 30/2020/NĐ-CP của UBND TP. Thủ Dầu Một</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded bg-white hover:bg-gray-50 border border-gray-300 font-semibold text-gray-700 text-xs flex items-center gap-1"
            >
              <Printer className="size-3.5 text-gray-500" />
              <span>In trang A4</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-gray-800 hover:bg-gray-900 text-white font-semibold text-xs transition-colors"
            >
              Đóng văn bản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

