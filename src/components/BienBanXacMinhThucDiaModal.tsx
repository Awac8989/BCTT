import { useState } from "react";
import {
  X,
  Printer,
  FileText,
  MapPin,
  CheckCircle2,
  Calendar,
  Building,
  Users,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { type HoSo } from "@/data/mock";
import { DigitalSignatureBadge } from "@/components/DigitalSignatureBadge";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hoSo: HoSo | null;
}

export function BienBanXacMinhThucDiaModal({ isOpen, onClose, hoSo }: Props) {
  if (!isOpen || !hoSo) return null;

  const now = new Date();
  const namHienTai = now.getFullYear();
  const soBienBan = `BBXMTD-UBND/${namHienTai}/${hoSo.id.replace(/\D/g, "").slice(-3) || "019"}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-md shadow-2xl max-w-4xl w-full border border-gray-300 overflow-hidden my-4 text-[#222]">
        {/* HEADER ĐIỀU KHIỂN (Ẩn khi in) */}
        <div className="no-print bg-[#0073b7] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-blue-900">
          <div className="flex items-center gap-2">
            <MapPin className="size-5" />
            <div>
              <div className="font-bold text-sm uppercase">
                Biên Bản Kiểm Tra Hiện Trường &amp; Xác Minh Thực Địa Cấp Cơ Sở (Mẫu 02/XMTD)
              </div>
              <div className="text-[11px] text-blue-100">
                Tổ công tác liên ngành UBND Phường Phú Cường - Công an Phường - Ban điều hành Khu phố
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold shadow-xs cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>In Biên Bản (A4)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-white hover:bg-white/20"
              title="Đóng cửa sổ"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* NỘI DUNG VĂN BẢN CHUẨN THỂ THỨC HÀNH CHÍNH (A4) */}
        <div className="p-8 sm:p-12 font-serif text-[13px] leading-relaxed text-[#111] bg-white print:p-6">
          {/* QUỐC HUY / TIÊU NGỮ */}
          <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-6 font-sans">
            <div className="text-center">
              <div className="font-bold text-[12px] uppercase">ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG</div>
              <div className="font-bold text-[11px] text-[#0073b7] uppercase">TỔ CÔNG TÁC XÁC MINH THỰC ĐỊA</div>
              <div className="text-[11px] text-gray-600 mt-1 font-mono">
                Số: {soBienBan}
              </div>
            </div>

            <div className="text-center">
              <div className="font-bold text-[12px] uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div className="font-bold text-[12px] underline">Độc lập - Tự do - Hạnh phúc</div>
              <div className="text-[11px] italic text-gray-600 mt-1">
                Phú Cường, ngày {now.getDate()} tháng {now.getMonth() + 1} năm {namHienTai}
              </div>
            </div>
          </div>

          {/* TIÊU ĐỀ */}
          <div className="text-center my-4 font-sans">
            <h2 className="text-base font-bold uppercase tracking-wide">
              BIÊN BẢN KIỂM TRA HIỆN TRƯỜNG &amp; XÁC MINH THỰC ĐỊA
            </h2>
            <div className="font-bold text-xs uppercase text-[#0073b7] mt-0.5">
              Về việc xác minh điều kiện hoàn cảnh &amp; nơi cư trú thực tế của người đề nghị giải quyết chính sách NCC
            </div>
            <div className="text-[11px] italic text-gray-500 mt-0.5">
              (Lập hồi 09 giờ 30 phút, ngày {now.getDate()} tháng {now.getMonth() + 1} năm {namHienTai})
            </div>
          </div>

          <div className="space-y-3">
            <p className="indent-6 text-justify">
              Hôm nay, vào hồi 09 giờ 30 phút ngày {now.toLocaleDateString("vi-VN")}, Tổ công tác liên ngành Ủy ban nhân dân Phường Phú Cường tiến hành kiểm tra hiện trường, xác minh thực tế nơi cư trú và điều kiện hưởng chính sách ưu đãi người có công tại địa bàn khu phố đối với trường hợp của ông/bà <strong>{hoSo.hoTen}</strong>.
            </p>

            <div className="font-bold font-sans text-xs uppercase text-gray-800">I. THÀNH PHẦN TỔ CÔNG TÁC XÁC MINH:</div>
            <ol className="list-decimal pl-6 space-y-1 font-sans text-xs">
              <li><strong>Ông Đoàn Minh Quân</strong> - Công chức Lao động - Thương binh &amp; Xã hội Phường Phú Cường - Tổ trưởng.</li>
              <li><strong>Đại úy Nguyễn Văn Dũng</strong> - Cán bộ Cảnh sát khu vực - Công an Phường Phú Cường - Thành viên.</li>
              <li><strong>Ông Lê Văn Hải</strong> - Trưởng ban điều hành Khu phố - Thành viên.</li>
              <li><strong>Ông/Bà {hoSo.thanNhan?.[0]?.hoTen || hoSo.hoTen}</strong> - Đại diện gia đình người có công - Người được xác minh.</li>
            </ol>

            <div className="font-bold font-sans text-xs uppercase text-gray-800 mt-4">II. NỘI DUNG VÀ KẾT QUẢ XÁC MINH THỰC ĐỊA:</div>
            
            <div className="space-y-2 font-sans text-xs">
              <div className="p-3 bg-gray-50 rounded border border-gray-200 space-y-1.5">
                <p>1. Thông tin người có công: <strong>{hoSo.hoTen}</strong> (Năm sinh: {hoSo.namSinh || "1926"}, CCCD: {hoSo.cccd})</p>
                <p>2. Thuộc diện chính sách: <strong>{hoSo.loaiDoiTuong}</strong> {hoSo.tyLeThuongTat > 0 && `(Tỷ lệ tổn thương cơ thể: ${hoSo.tyLeThuongTat}%)`}</p>
                <p>3. Nơi cư trú thực tế: {hoSo.phuong}, {hoSo.huyen || "TP. Thủ Dầu Một"}, tỉnh Bình Dương (Đã đối soát khớp dữ liệu dân cư C06).</p>
                <p>4. Tình trạng bàn thờ / nơi thờ cúng liệt sĩ: Gia đình đang trực tiếp lập bàn thờ trang nghiêm tại nhà riêng, hương khói chu đáo.</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-blue-900">
                  <CheckCircle2 className="size-4 text-blue-700" />
                  <span>KẾT QUẢ KIỂM TRA HỒ SƠ &amp; GIẤY TỜ GỐC:</span>
                </div>
                <p>- Đã đối chiếu Bằng Tổ quốc ghi công / Giấy chứng nhận thương binh bản gốc: Đầy đủ, rõ ràng, không có dấu hiệu tẩy xóa, sửa chữa.</p>
                <p>- Đã xác minh ý kiến các bậc lão thành cách mạng và nhân dân sinh sống cùng tổ dân phố: 100% xác nhận quá trình tham gia hoạt động cách mạng của đối tượng là đúng sự thật khách quan.</p>
              </div>
            </div>

            <div className="font-bold font-sans text-xs uppercase text-gray-800 mt-4">III. KẾT LUẬN CỦA TỔ CÔNG TÁC LIÊN NGÀNH:</div>
            <p className="indent-6 text-justify">
              Tổ công tác liên ngành thống nhất kết luận: Hồ sơ đề nghị công nhận và giải quyết chế độ ưu đãi của ông/bà <strong>{hoSo.hoTen}</strong> là <strong>hoàn toàn chính xác, trung thực, đủ điều kiện đưa vào danh sách niêm yết công khai 15 ngày tại Trụ sở UBND Phường Phú Cường và Nhà văn hóa Khu phố</strong> theo đúng quy định tại Nghị định số 131/2021/NĐ-CP của Chính phủ.
            </p>

            <p className="indent-6 text-justify">
              Biên bản được lập xong vào hồi 10 giờ 30 phút cùng ngày, đã đọc lại cho các thành viên cùng nghe, công nhận đúng sự thật và ký tên dưới đây./.
            </p>
          </div>

          {/* 4 CHỮ KÝ TRÁCH NHIỆM */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-4 font-sans text-center text-xs">
            <div>
              <div className="font-bold uppercase">NGƯỜI ĐƯỢC XÁC MINH</div>
              <div className="text-[10px] italic text-gray-500">(Ký và ghi rõ họ tên)</div>
              <div className="h-16 flex items-end justify-center font-bold text-gray-800">
                {hoSo.thanNhan?.[0]?.hoTen || hoSo.hoTen}
              </div>
            </div>

            <div>
              <div className="font-bold uppercase">TRƯỞNG BAN KHU PHỐ</div>
              <div className="text-[10px] italic text-gray-500">(Ký và ghi rõ họ tên)</div>
              <div className="h-16 flex items-end justify-center font-bold text-gray-800">
                Lê Văn Hải
              </div>
            </div>

            <div>
              <div className="font-bold uppercase">CÔNG AN PHƯỜNG</div>
              <div className="text-[10px] italic text-gray-500">(Cảnh sát khu vực xác nhận)</div>
              <div className="h-16 flex items-end justify-center font-bold text-blue-900">
                Đại úy Nguyễn Văn Dũng
              </div>
            </div>

            <div>
              <div className="font-bold uppercase text-[#0073b7]">TỔ TRƯỞNG XÁC MINH</div>
              <div className="text-[10px] italic text-gray-500">(Công chức LĐ-TB&amp;XH)</div>
              <div className="my-1">
                <DigitalSignatureBadge
                  nguoiKy="Đoàn Minh Quân"
                  chucVu="Công chức LĐ-TB&XH Phường Phú Cường"
                />
              </div>
              <div className="font-bold text-gray-900">Đoàn Minh Quân</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

