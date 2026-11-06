import { useState } from "react";
import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  FileCheck2,
  FileText,
  Building,
  Award,
  Sparkles,
  ExternalLink,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { appStore, useAppState } from "@/services/app-state";
import { formatVND, type HoSo } from "@/data/mock";
import { docSoTienBangChu } from "@/services/calculator.service";
import { DigitalSignatureBadge } from "./DigitalSignatureBadge";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hoSo: HoSo | null;
  onApproved?: () => void;
}

export function QuyetDinhModal({ isOpen, onClose, hoSo, onApproved }: Props) {
  const { currentUser, quyetDinhList } = useAppState();
  const [signing, setSigning] = useState(false);

  if (!isOpen || !hoSo) return null;

  // Tìm quyết định đã ban hành hoặc lấy thông tin mặc định
  const existingQd = quyetDinhList.find((q) => q.hoSoId === hoSo.id);
  const now = new Date();
  const soQd =
    existingQd?.soQuyetDinh ||
    hoSo.soQuyetDinh ||
    `QĐ-SLĐTBXH-${now.getFullYear()}/${hoSo.id.replace(/\D/g, "").slice(-4) || "2408"}`;

  const ngayBanHanh = existingQd?.ngayBanHanh || hoSo.kySoLanhDao?.ngayKy || now.toLocaleDateString("vi-VN");
  const ngayHieuLuc =
    existingQd?.ngayHieuLuc || `01/${String(now.getMonth() + 2).padStart(2, "0")}/${now.getFullYear()}`;

  const tongTien = hoSo.mucTroCap + (hoSo.phuCapPhucVu || 0);
  const soTienChu = docSoTienBangChu(tongTien > 0 ? tongTien : 2055000);

  const isApproved = hoSo.trangThai === "ĐÃ_DUYỆT";
  const isAwaitingApproval = hoSo.trangThai === "CHỜ_PHÊ_DUYỆT";
  const isLeader = currentUser.role === "ADMIN_SO";

  // Xử lý ký số và ban hành quyết định (Chỉ dành cho Lãnh đạo Sở - TS. Nguyễn Văn Hùng)
  const handleSignAndApprove = () => {
    if (!isLeader) {
      toast.error("Từ chối quyền hạn!", {
        description:
          "Theo quy định, chỉ Lãnh đạo Ban Giám đốc Sở (TS. Nguyễn Văn Hùng) mới có thẩm quyền Ký số & Ban hành Quyết định.",
      });
      return;
    }

    setSigning(true);
    setTimeout(() => {
      const res = appStore.approveProfile(hoSo.id, currentUser.fullName);
      if (res.success) {
        appStore.kySoHoSo(hoSo.id, currentUser.fullName, currentUser.title);
        toast.success(`Đã ký số công vụ & Ban hành Quyết định số ${res.quyetDinh?.soQuyetDinh}!`, {
          description: `Đã tự động liên thông hồ sơ ${hoSo.hoTen} vào danh sách chi trả tháng tới.`,
        });
        setSigning(false);
        if (onApproved) onApproved();
      } else {
        toast.error(res.message);
        setSigning(false);
      }
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-md shadow-2xl max-w-4xl w-full border border-gray-300 overflow-hidden my-4 text-[#222]">
        {/* THANH ĐIỀU KHIỂN TRÊN CÙNG (Ẩn khi in) */}
        <div className="no-print bg-gray-900 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-amber-400" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {isApproved ? "QUYẾT ĐỊNH CHÍNH THỨC (ĐÃ BAN HÀNH & KÝ SỐ)" : "DỰ THẢO QUYẾT ĐỊNH HƯỞNG TRỢ CẤP"}
              </div>
              <div className="text-[11px] text-gray-300 font-mono">
                Số văn bản: <strong>{soQd}</strong> · Mã hồ sơ: {hoSo.id}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Nút Ký số nếu là Lãnh đạo và hồ sơ đang chờ duyệt */}
            {isAwaitingApproval && (
              <button
                type="button"
                onClick={handleSignAndApprove}
                disabled={signing || !isLeader}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all shadow-sm ${
                  isLeader
                    ? "bg-[#dd4b39] hover:bg-[#c23321] text-white animate-pulse"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
                title={isLeader ? "Ký số điện tử công vụ" : "Chỉ Lãnh đạo Ban Giám đốc Sở mới có quyền ký"}
              >
                <ShieldCheck className="size-4" />
                <span>
                  {signing
                    ? "Đang xác thực chứng thư số công vụ..."
                    : isLeader
                      ? "KÝ SỐ CÔNG VỤ & BAN HÀNH"
                      : "Chờ Lãnh đạo ký số"}
                </span>
              </button>
            )}

            {/* Nút In văn bản A4 */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 text-xs font-bold transition-colors shadow-xs"
            >
              <Printer className="size-3.5" />
              <span>In Quyết định (A4)</span>
            </button>

            {/* Nút đóng */}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* THÔNG BÁO QUYỀN HẠN PHÂN CẤP (NẾU KHÔNG PHẢI LÃNH ĐẠO) */}
        {!isLeader && isAwaitingApproval && (
          <div className="no-print bg-amber-50 border-b border-amber-200 px-5 py-2 text-xs text-amber-900 flex items-center gap-2">
            <Lock className="size-4 text-amber-600 shrink-0" />
            <span>
              <strong>Phân quyền công vụ:</strong> Quý cán bộ đang đăng nhập với quyền{" "}
              <strong>{currentUser.roleName}</strong>. Thẩm quyền ký số ban hành Quyết định này thuộc về{" "}
              <strong>TS. Nguyễn Văn Hùng (Lãnh đạo Ban Giám đốc Sở)</strong>.
            </span>
          </div>
        )}

        {/* NỘI DUNG VĂN BẢN QUYẾT ĐỊNH CHUẨN THỂ THỨC NGHỊ ĐỊNH 30/2020/NĐ-CP */}
        <div className="p-8 sm:p-12 font-serif text-[14px] leading-relaxed bg-white max-h-[82vh] overflow-y-auto">
          {/* 1. Phần Đầu Văn Bản */}
          <div className="grid grid-cols-12 gap-2 text-center pb-4 border-b border-gray-300">
            {/* Cột trái: Cơ quan ban hành */}
            <div className="col-span-5 text-center">
              <div className="text-[12px] font-normal uppercase text-gray-800">
                ỦY BAN NHÂN DÂN TỈNH BÌNH DƯƠNG
              </div>
              <div className="text-[13px] font-bold uppercase text-gray-900 mt-0.5">
                SỞ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI
              </div>
              <div className="w-24 h-[1px] bg-gray-800 mx-auto my-1" />
              <div className="text-[12px] text-gray-700 mt-1 font-sans">
                Số: <span className="font-semibold text-[#dd4b39]">{soQd}</span>
              </div>
            </div>

            {/* Cột phải: Quốc hiệu - Tiêu ngữ */}
            <div className="col-span-7 text-center">
              <div className="text-[13px] font-bold uppercase text-gray-900 tracking-wider">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </div>
              <div className="text-[13px] font-bold text-gray-900 italic mt-0.5">
                Độc lập - Tự do - Hạnh phúc
              </div>
              <div className="w-36 h-[1px] bg-gray-800 mx-auto my-1" />
              <div className="text-[12px] text-gray-600 italic mt-1 font-serif">
                Bình Dương, ngày {ngayBanHanh}
              </div>
            </div>
          </div>

          {/* 2. Tiêu Đề Quyết Định */}
          <div className="text-center my-6">
            <h1 className="text-lg sm:text-xl font-bold uppercase text-gray-900 tracking-wide">
              QUYẾT ĐỊNH
            </h1>
            <div className="text-sm sm:text-base font-bold text-gray-800 mt-1">
              Về việc giải quyết chế độ trợ cấp, phụ cấp ưu đãi người có công với cách mạng
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-700 mt-2">
              GIÁM ĐỐC SỞ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI TỈNH BÌNH DƯƠNG
            </div>
          </div>

          {/* 3. Căn Cứ Pháp Lý (Preamble) */}
          <div className="space-y-1.5 text-[13px] italic text-gray-800 text-justify mb-5 leading-normal">
            <p>
              Căn cứ Quyết định số 28/2021/QĐ-UBND ngày 15/10/2021 của Ủy ban nhân dân tỉnh Bình Dương ban hành quy định chức năng, nhiệm vụ, quyền hạn và cơ cấu tổ chức của Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương;
            </p>
            <p>
              Căn cứ Pháp lệnh Ưu đãi người có công với cách mạng số 02/2020/UBTVQH14 ngày 09 tháng 12 năm 2020 của Ủy ban Thường vụ Quốc hội;
            </p>
            <p>
              Căn cứ Nghị định số 131/2021/NĐ-CP ngày 30 tháng 12 năm 2021 của Chính phủ quy định chi tiết và biện pháp thi hành Pháp lệnh Ưu đãi người có công với cách mạng;
            </p>
            <p>
              Căn cứ Nghị định số 75/2021/NĐ-CP ngày 24/07/2021 và Nghị định số 77/2024/NĐ-CP ngày 25/06/2024 của Chính phủ sửa đổi mức chuẩn trợ cấp ưu đãi người có công;
            </p>
            <p>
              Căn cứ Biên bản giám định y khoa tỷ lệ tổn thương cơ thể số {hoSo.id.slice(-3)}/BB-GĐYK của Hội đồng Giám định Y khoa tỉnh Bình Dương;
            </p>
            <p>
              Xét Tờ trình số {hoSo.id.replace(/\D/g, "").slice(-3) || "12"}/TTr-LĐTBXH của Trưởng phòng Lao động - Thương binh và Xã hội TP. Thủ Dầu Một; theo đề nghị của Trưởng phòng Người có công.
            </p>
          </div>

          <div className="text-center font-bold text-sm tracking-widest uppercase my-4">
            QUYẾT ĐỊNH:
          </div>

          {/* 4. Nội Dung Các Điều Khoản (Articles) */}
          <div className="space-y-3.5 text-justify text-[13.5px]">
            <div>
              <p className="font-bold">
                Điều 1. Trợ cấp, phụ cấp ưu đãi hàng tháng đối với người có công với cách mạng:
              </p>
              <div className="mt-1.5 pl-4 space-y-1">
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 font-semibold text-gray-700">- Họ và tên đối tượng:</span>
                  <span className="col-span-8 font-bold text-gray-900 uppercase">{hoSo.hoTen}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 font-semibold text-gray-700">- Năm sinh:</span>
                  <span className="col-span-8 font-medium">
                    {hoSo.namSinh || hoSo.ngaySinh} &nbsp; | &nbsp; Giới tính: <strong>{hoSo.gioiTinh}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 font-semibold text-gray-700">- Số CCCD / Định danh:</span>
                  <span className="col-span-8 font-mono font-semibold">{hoSo.cccd}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 font-semibold text-gray-700">- Nơi cư trú:</span>
                  <span className="col-span-8">
                    {hoSo.khuPho}, Phường {hoSo.phuong}, {hoSo.huyen || "TP. Thủ Dầu Một"}, tỉnh Bình Dương
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 font-semibold text-gray-700">- Diện đối tượng:</span>
                  <span className="col-span-8 font-bold text-blue-900">{hoSo.loaiDoiTuong}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 font-semibold text-gray-700">- Tỷ lệ tổn thương:</span>
                  <span className="col-span-8 font-bold text-[#dd4b39]">{hoSo.tyLeTonThuong}%</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 font-semibold text-gray-700">- Mức trợ cấp hàng tháng:</span>
                  <span className="col-span-8 font-bold text-emerald-800 text-sm">
                    {formatVND(hoSo.mucTroCap > 0 ? hoSo.mucTroCap : 2055000)}
                  </span>
                </div>
                {hoSo.phuCapPhucVu > 0 && (
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-4 font-semibold text-gray-700">- Phụ cấp người phục vụ:</span>
                    <span className="col-span-8 font-semibold">{formatVND(hoSo.phuCapPhucVu)}</span>
                  </div>
                )}
                <div className="grid grid-cols-12 gap-1 pt-0.5">
                  <span className="col-span-4 font-bold text-gray-800">- Tổng số tiền thực nhận:</span>
                  <span className="col-span-8 font-bold text-[#dd4b39] text-sm">
                    {formatVND(tongTien > 0 ? tongTien : 2055000)}
                  </span>
                </div>
                <div className="italic text-gray-700 pl-0">
                  (Bằng chữ: <strong>{soTienChu}</strong>)
                </div>
                <div className="grid grid-cols-12 gap-1 pt-1">
                  <span className="col-span-4 font-semibold text-gray-700">- Thời điểm hưởng:</span>
                  <span className="col-span-8 font-semibold">Kể từ ngày {ngayHieuLuc}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-4 font-semibold text-gray-700">- Hình thức nhận tiền:</span>
                  <span className="col-span-8 font-medium">
                    {hoSo.soTaiKhoan
                      ? `Tài khoản ngân hàng (${hoSo.tenNganHang || "Vietcombank"} - STK: ${hoSo.soTaiKhoan})`
                      : `Tiền mặt qua Điểm bưu điện văn hóa Phường ${hoSo.phuong}`}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="font-bold">
                Điều 2. Chế độ ưu đãi kèm theo:
              </p>
              <ul className="list-disc pl-8 space-y-0.5 text-gray-800">
                <li>Cấp thẻ Bảo hiểm y tế ưu đãi mã hiệu dành cho người có công (mức thanh toán 100% chi phí khám chữa bệnh).</li>
                <li>Chế độ điều dưỡng phục hồi sức khỏe luân phiên theo quy định tại Nghị định 131/2021/NĐ-CP.</li>
                <li>Trang cấp dụng cụ chỉnh hình, phương tiện trợ giúp sinh hoạt (nếu có chỉ định y khoa).</li>
                <li>Hưởng các chế độ ưu đãi giáo dục, nhà ở và quà tặng ngày lễ, tết theo chính sách của Tỉnh ủy, HĐND, UBND tỉnh Bình Dương.</li>
              </ul>
            </div>

            <div>
              <p className="font-bold">
                Điều 3. Trách nhiệm thi hành:
              </p>
              <p className="pl-4">
                Chánh Văn phòng Sở, Trưởng phòng Người có công, Trưởng phòng Kế hoạch - Tài chính, Giám đốc Kho bạc Nhà nước tỉnh, Trưởng phòng Lao động - Thương binh và Xã hội TP. Thủ Dầu Một, Chủ tịch UBND Phường {hoSo.phuong} và Ông/Bà <strong>{hoSo.hoTen}</strong> chịu trách nhiệm thi hành Quyết định này./.
              </p>
            </div>
          </div>

          {/* 5. Phần Chân Chữ Ký & Dấu Mộc Chuẩn Nghị Định 30/2020/NĐ-CP */}
          <div className="grid grid-cols-12 gap-4 mt-8 pt-4 border-t border-gray-200 items-start">
            {/* Nơi nhận (Cột trái) */}
            <div className="col-span-5 text-xs text-gray-700">
              <div className="font-bold uppercase text-gray-800 mb-1">Nơi nhận:</div>
              <ul className="space-y-0.5 italic text-[11px]">
                <li>- Như Điều 3;</li>
                <li>- Cục Người có công - Bộ LĐTBXH (b/c);</li>
                <li>- Ban Giám đốc Sở;</li>
                <li>- UBND TP. Thủ Dầu Một;</li>
                <li>- Cổng Dịch vụ công &amp; Trục LGSP;</li>
                <li>- Lưu: VT, NCC (03b).</li>
              </ul>
            </div>

            {/* Chữ ký Lãnh đạo & Dấu mộc số (Cột phải) */}
            <div className="col-span-7 text-center">
              <div className="font-bold uppercase text-[12px] text-gray-900">
                KT. GIÁM ĐỐC
              </div>
              <div className="font-bold uppercase text-sm text-[#c82333]">
                PHÓ GIÁM ĐỐC
              </div>

              {/* Con dấu & Chữ ký số điện tử */}
              <div className="my-3 min-h-[90px] flex items-center justify-center">
                {isApproved || hoSo.kySoLanhDao ? (
                  <DigitalSignatureBadge
                    nguoiKy="TS. Nguyễn Văn Hùng"
                    chucVu="Phó Giám đốc Sở LĐ-TB&XH tỉnh Bình Dương"
                    ngayKy={hoSo.kySoLanhDao?.ngayKy || ngayBanHanh}
                    maXacThuc={hoSo.kySoLanhDao?.maXacThuc || `SHA256:${soQd}-SMARTCA`}
                  />
                ) : (
                  <div className="rounded border-2 border-dashed border-gray-300 p-3 text-center text-xs text-gray-400 font-sans">
                    <div className="font-semibold text-gray-500">Chưa ký số điện tử</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      Đang chờ Lãnh đạo Sở (TS. Nguyễn Văn Hùng) phê duyệt
                    </div>
                  </div>
                )}
              </div>

              <div className="font-bold text-sm text-gray-900 uppercase">
                TS. Nguyễn Văn Hùng
              </div>
              <div className="text-[11px] text-gray-500 italic font-sans mt-0.5">
                (Đã xác thực chữ ký số công vụ qua Ban Cơ yếu Chính phủ)
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER MODAL (Ẩn khi in) */}
        <div className="no-print bg-gray-100 px-6 py-3 border-t border-gray-300 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1.5 text-[11px]">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Văn bản chuẩn định dạng Quyết định hành chính (Nghị định 30/2020/NĐ-CP &amp; NĐ 131/2021)</span>
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

