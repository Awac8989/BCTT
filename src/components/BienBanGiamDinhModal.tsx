import {
  X,
  Printer,
  Stethoscope,
  CheckCircle2,
  Activity,
  FileCheck2,
  Calendar,
  Building,
  AlertCircle,
} from "lucide-react";
import { type HoSo } from "@/data/mock";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hoSo: HoSo | null;
}

export function BienBanGiamDinhModal({ isOpen, onClose, hoSo }: Props) {
  if (!isOpen || !hoSo) return null;

  const now = new Date();
  const soBienBan = `${hoSo.id.replace(/\D/g, "").slice(-3) || "148"}/BB-GĐYK`;
  const ngayKham = `15/04/2021`; // Ngày giám định chuẩn trong hồ sơ lưu trữ
  const tyLe = hoSo.tyLeTonThuong || 61;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-md shadow-2xl max-w-4xl w-full border border-gray-300 overflow-hidden my-4 text-[#222]">
        {/* THANH ĐIỀU KHIỂN TRÊN CÙNG */}
        <div className="no-print bg-[#00a65a] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <Stethoscope className="size-5 text-amber-200" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-100">
                BIÊN BẢN GIÁM ĐỊNH Y KHOA TỶ LỆ TỔN THƯƠNG CƠ THỂ
              </div>
              <div className="text-[11px] text-white/90 font-mono">
                Số: <strong>{soBienBan}</strong> · Hội đồng Giám định Y khoa tỉnh Bình Dương
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded bg-white hover:bg-gray-100 text-gray-800 px-3 py-1.5 text-xs font-bold transition-colors shadow-xs"
            >
              <Printer className="size-3.5 text-gray-600" />
              <span>In Biên bản (A4)</span>
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

        {/* NỘI DUNG BIÊN BẢN CHUẨN THÔNG TƯ LIÊN TỊCH 28/2013/TTLT-BYT-BLĐTBXH */}
        <div className="p-8 sm:p-12 font-serif text-[14px] leading-relaxed bg-white max-h-[82vh] overflow-y-auto">
          {/* 1. Header cơ quan */}
          <div className="grid grid-cols-12 gap-2 text-center pb-4 border-b border-gray-300">
            <div className="col-span-5 text-center">
              <div className="text-[12px] font-normal uppercase text-gray-800">
                SỞ Y TẾ TỈNH BÌNH DƯƠNG
              </div>
              <div className="text-[13px] font-bold uppercase text-gray-900 mt-0.5">
                HỘI ĐỒNG GIÁM ĐỊNH Y KHOA
              </div>
              <div className="w-24 h-[1px] bg-gray-800 mx-auto my-1" />
              <div className="text-[12px] text-gray-700 mt-1 font-sans">
                Số: <span className="font-semibold text-emerald-800">{soBienBan}</span>
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
                Bình Dương, ngày {ngayKham}
              </div>
            </div>
          </div>

          {/* 2. Tiêu đề Biên bản */}
          <div className="text-center my-6">
            <h1 className="text-lg sm:text-xl font-bold uppercase text-gray-900 tracking-wide">
              BIÊN BẢN GIÁM ĐỊNH Y KHOA
            </h1>
            <div className="text-sm font-bold text-gray-800 mt-1">
              Khám xác định tỷ lệ tổn thương cơ thể đối với Người có công với cách mạng
            </div>
            <div className="text-xs italic text-gray-600 mt-1">
              (Thực hiện theo Thông tư liên tịch số 28/2013/TTLT-BYT-BLĐTBXH của Bộ Y tế - Bộ LĐ-TB&amp;XH)
            </div>
          </div>

          {/* 3. Thông tin người được khám */}
          <div className="space-y-2.5 text-[13.5px]">
            <div className="font-bold uppercase text-gray-800 border-b pb-1 text-xs">
              I. PHẦN HÀNH CHÍNH
            </div>

            <div className="grid grid-cols-12 gap-1 pl-4">
              <span className="col-span-4 font-semibold text-gray-700">1. Họ và tên người khám:</span>
              <span className="col-span-8 font-bold text-gray-900 uppercase">{hoSo.hoTen}</span>
            </div>
            <div className="grid grid-cols-12 gap-1 pl-4">
              <span className="col-span-4 font-semibold text-gray-700">2. Năm sinh:</span>
              <span className="col-span-8">
                {hoSo.namSinh || hoSo.ngaySinh} &nbsp; | &nbsp; Giới tính: <strong>{hoSo.gioiTinh}</strong>
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 pl-4">
              <span className="col-span-4 font-semibold text-gray-700">3. Số CCCD:</span>
              <span className="col-span-8 font-mono font-semibold">{hoSo.cccd}</span>
            </div>
            <div className="grid grid-cols-12 gap-1 pl-4">
              <span className="col-span-4 font-semibold text-gray-700">4. Địa chỉ thường trú:</span>
              <span className="col-span-8">
                {hoSo.khuPho}, Phường {hoSo.phuong}, {hoSo.huyen || "TP. Thủ Dầu Một"}, tỉnh Bình Dương
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 pl-4">
              <span className="col-span-4 font-semibold text-gray-700">5. Cơ quan giới thiệu:</span>
              <span className="col-span-8">
                Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương (Giấy GT số {hoSo.id.slice(-3)}/SLĐTBXH-NCC)
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1 pl-4">
              <span className="col-span-4 font-semibold text-gray-700">6. Diện đối tượng:</span>
              <span className="col-span-8 font-bold text-blue-900">{hoSo.loaiDoiTuong}</span>
            </div>

            {/* II. Phần Y khoa thực thể */}
            <div className="font-bold uppercase text-gray-800 border-b pb-1 text-xs pt-4">
              II. TỔN THƯƠNG THỰC THỂ &amp; KẾT QUẢ KHÁM CHUYÊN KHOA
            </div>

            <div className="pl-4 space-y-2 text-xs leading-relaxed font-sans">
              <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-1.5">
                <div className="font-bold text-gray-800 flex items-center gap-1.5">
                  <Activity className="size-4 text-emerald-700" />
                  <span>1. Khám Ngoại khoa - Chấn thương chỉnh hình:</span>
                </div>
                <p className="text-gray-700 pl-5">
                  • Sẹo vết thương do hỏa khí vùng cẳng chân trái kích thước 8x4 cm, xơ dính, teo cơ cẳng chân 3 cm so với chân lành.
                  <br />
                  • Can lệch xương chày 1/3 dưới, hạn chế biên độ gập duỗi khớp cổ chân trái 30%.
                </p>

                <div className="font-bold text-gray-800 flex items-center gap-1.5 pt-1">
                  <Activity className="size-4 text-emerald-700" />
                  <span>2. Khám Nội khoa &amp; Thần kinh:</span>
                </div>
                <p className="text-gray-700 pl-5">
                  • Hội chứng suy nhược thần kinh sau sang chấn hỏa khí, giảm thính lực tiếp nhận tai trái 45 dB.
                  <br />
                  • Huyết áp: 130/80 mmHg; Nhịp tim đều 78 ck/phút.
                </p>

                <div className="font-bold text-gray-800 flex items-center gap-1.5 pt-1">
                  <Activity className="size-4 text-emerald-700" />
                  <span>3. Kết quả cận lâm sàng (X-Quang &amp; Đo chức năng):</span>
                </div>
                <p className="text-gray-700 pl-5">
                  • Phim X-quang cẳng chân: Hình ảnh can xương chày lệch trục, có 01 mảnh kim loại cản quang $\approx 6 \times 4$ mm chưa phẫu thuật lấy ra.
                </p>
              </div>
            </div>

            {/* III. Kết luận của Hội đồng */}
            <div className="font-bold uppercase text-gray-800 border-b pb-1 text-xs pt-4">
              III. KẾT LUẬN CỦA HỘI ĐỒNG GIÁM ĐỊNH Y KHOA
            </div>

            <div className="pl-4 space-y-2">
              <div className="p-3.5 rounded bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800 text-sm">
                    TỔNG TỶ LỆ TỔN THƯƠNG CƠ THỂ KẾT LUẬN:
                  </span>
                  <span className="text-2xl font-black text-[#dd4b39] font-mono">
                    {tyLe}%
                  </span>
                </div>
                <div className="text-xs text-emerald-900 mt-1">
                  (Phương pháp tính: Theo công thức cộng dồn tỷ lệ tổn thương cơ thể quy định tại Phụ lục 1 - Thông tư liên tịch 28/2013)
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div>
                  • <strong>Mức độ suy giảm khả năng lao động:</strong> {tyLe}% (
                  {tyLe >= 81 ? "Thương tật nặng đặc biệt" : tyLe >= 61 ? "Thương tật nặng" : "Thương tật trung bình"})
                </div>
                <div>
                  • <strong>Nhu cầu người phục vụ:</strong>{" "}
                  {tyLe >= 81 ? (
                    <span className="font-bold text-[#dd4b39]">CẦN CÓ NGƯỜI PHỤC VỤ TẠI NHÀ</span>
                  ) : (
                    <span>Không cần người phục vụ thường xuyên</span>
                  )}
                </div>
                <div>
                  • <strong>Chỉ định phương tiện trợ giúp / Dụng cụ chỉnh hình:</strong>{" "}
                  {tyLe >= 61 ? "Nẹp hỗ trợ cổ chân, giày chỉnh hình chuyên dụng, xe lăn tay" : "Giày nẹp chỉnh hình"}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Chữ ký Hội đồng Giám định Y khoa */}
          <div className="grid grid-cols-12 gap-4 mt-8 pt-4 border-t border-gray-200 text-center">
            <div className="col-span-4">
              <div className="font-bold uppercase text-[11px] text-gray-800">THƯ KÝ HỘI ĐỒNG</div>
              <div className="my-8 text-xs italic text-gray-400">(Đã ký xác nhận)</div>
              <div className="font-bold text-xs uppercase text-gray-900">ThS.BS. Phạm Quỳnh Mai</div>
            </div>

            <div className="col-span-4">
              <div className="font-bold uppercase text-[11px] text-gray-800">GIÁM ĐỊNH VIÊN CHUYÊN KHOA</div>
              <div className="my-8 text-xs italic text-gray-400">(Đã ký xác nhận)</div>
              <div className="font-bold text-xs uppercase text-gray-900">BSCKII. Lê Hoàng Long</div>
            </div>

            <div className="col-span-4">
              <div className="font-bold uppercase text-[11px] text-gray-800">CHỦ TỊCH HỘI ĐỒNG</div>
              <div className="text-[10px] text-gray-500 italic">Phó Giám đốc Sở Y tế kiêm Giám đốc BV Đa khoa tỉnh</div>
              
              {/* Dấu mộc số Hội đồng GĐYK */}
              <div className="my-3 min-h-[50px] flex items-center justify-center">
                <div className="size-16 rounded-full border-2 border-dashed border-[#c82333] flex items-center justify-center p-0.5 text-[#c82333] font-bold text-[7px] text-center leading-none">
                  HỘI ĐỒNG<br />GĐYK TỈNH<br />BÌNH DƯƠNG
                </div>
              </div>

              <div className="font-bold text-xs uppercase text-gray-900">BSCKII. Trần Văn Bình</div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="no-print bg-gray-100 px-6 py-3 border-t border-gray-300 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1.5 text-[11px]">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Biên bản giám định y khoa lưu trữ gốc số {soBienBan}</span>
          </div>

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
  );
}

