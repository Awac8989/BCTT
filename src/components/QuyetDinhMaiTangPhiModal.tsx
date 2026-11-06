import { useState } from "react";
import {
  X,
  Printer,
  FileText,
  DollarSign,
  Building,
  CheckCircle2,
  Calendar,
  CreditCard,
  Download,
  ShieldCheck,
  Send,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { formatVND, type HoSo } from "@/data/mock";
import { docSoTienBangChu } from "@/services/calculator.service";
import { DigitalSignatureBadge } from "@/components/DigitalSignatureBadge";
import { appStore } from "@/services/app-state";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hoSo: HoSo | null;
  onDisbursed?: () => void;
}

export function QuyetDinhMaiTangPhiModal({ isOpen, onClose, hoSo, onDisbursed }: Props) {
  const [tenNguoiLoMaiTang, setTenNguoiLoMaiTang] = useState(
    hoSo?.thanNhan?.[0]?.hoTen || "Nguyễn Văn Hậu (Con trai)",
  );
  const [cccdNguoiNhan, setCccdNguoiNhan] = useState(
    hoSo?.thanNhan?.[0]?.cccd || "074088001928",
  );
  const [soTaiKhoan, setSoTaiKhoan] = useState("0281000349281 (Vietcombank CN Bình Dương)");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !hoSo) return null;

  const now = new Date();
  const namHienTai = now.getFullYear();
  const soQuyetDinh = `QĐ-SLĐTBXH/${namHienTai}/${hoSo.id.replace(/\D/g, "").slice(-3) || "108"}`;

  // 1. Mức mai táng phí = 10 tháng lương cơ sở (2.340.000đ theo Nghị định 73/2024/NĐ-CP)
  const tienMaiTangPhi = 23400000;

  // 2. Trợ cấp một lần = 3 tháng mức trợ cấp ưu đãi đang hưởng trước khi mất
  const tienTroCapMotLan = (hoSo.mucTroCap > 0 ? hoSo.mucTroCap : 3500000) * 3;

  // Tổng kinh phí thanh toán
  const tongKinhPhi = tienMaiTangPhi + tienTroCapMotLan;
  const tongKinhPhiChu = docSoTienBangChu(tongKinhPhi);

  const handlePrint = () => {
    window.print();
  };

  const handleChuyenChiTraKhoBac = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      appStore.updateProfileStatus(
        hoSo.id,
        "ĐÃ_DUYỆT",
        `Đã ban hành ${soQuyetDinh} giải quyết trợ cấp Mai táng phí (${formatVND(tienMaiTangPhi)}) và Trợ cấp một lần (${formatVND(tienTroCapMotLan)}) cho thân nhân ông/bà ${hoSo.hoTen}.`,
      );
      toast.success(`Đã ban hành ${soQuyetDinh} và lập lệnh thanh toán Kho bạc!`, {
        description: `Tổng kinh phí ${formatVND(tongKinhPhi)} đã được chuyển sang phân hệ Chi trả điện tử.`,
      });
      if (onDisbursed) onDisbursed();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-md shadow-2xl max-w-4xl w-full border border-gray-300 overflow-hidden my-4 text-[#222]">
        {/* HEADER ĐIỀU KHIỂN (Ẩn khi in) */}
        <div className="no-print bg-[#dd4b39] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-red-900">
          <div className="flex items-center gap-2">
            <FileText className="size-5" />
            <div>
              <div className="font-bold text-sm uppercase">
                Quyết định Hưởng Trợ cấp Mai táng phí &amp; Trợ cấp Một lần khi Người có công từ trần
              </div>
              <div className="text-[11px] text-red-100">
                Nghị định 131/2021/NĐ-CP &amp; Nghị định 73/2024/NĐ-CP (Lương cơ sở 2.340.000đ x 10 tháng)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-red-800 hover:bg-red-50 text-xs font-bold shadow-xs cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>In Quyết định (A4)</span>
            </button>
            <button
              type="button"
              onClick={handleChuyenChiTraKhoBac}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              <CreditCard className="size-3.5" />
              <span>{isSubmitting ? "Đang xử lý..." : "Chuyển Kho bạc chi trả ngay"}</span>
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

        {/* THÔNG TIN TỔNG QUAN KINH PHÍ ĐƯỢC HƯỞNG (Ẩn khi in) */}
        <div className="no-print bg-amber-50/80 border-b border-amber-200 px-5 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            <div className="bg-white p-2 rounded border border-amber-200">
              <span className="text-gray-500 font-medium">1. Mai táng phí (10 tháng LCS):</span>
              <div className="font-mono font-bold text-red-700 text-sm mt-0.5">
                {formatVND(tienMaiTangPhi)}
              </div>
            </div>
            <div className="bg-white p-2 rounded border border-amber-200">
              <span className="text-gray-500 font-medium">2. Trợ cấp một lần (03 tháng):</span>
              <div className="font-mono font-bold text-red-700 text-sm mt-0.5">
                {formatVND(tienTroCapMotLan)}
              </div>
            </div>
            <div className="bg-white p-2 rounded border border-amber-200">
              <span className="text-gray-500 font-medium">➔ Tổng kinh phí chi trả:</span>
              <div className="font-mono font-black text-emerald-800 text-base mt-0.5">
                {formatVND(tongKinhPhi)}
              </div>
            </div>
          </div>
        </div>

        {/* NỘI DUNG VĂN BẢN QUYẾT ĐỊNH A4 CHUẨN THỂ THỨC NGHỊ ĐỊNH 30/2020 */}
        <div className="p-8 sm:p-12 font-serif text-[13px] leading-relaxed text-[#111] bg-white print:p-6">
          {/* QUỐC HUY / TIÊU NGỮ */}
          <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-6 font-sans">
            <div className="text-center">
              <div className="font-bold text-[12px] uppercase">ỦY BAN NHÂN DÂN TỈNH BÌNH DƯƠNG</div>
              <div className="font-bold text-[12px] uppercase text-[#dd4b39]">SỞ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI</div>
              <div className="text-[11px] text-gray-600 mt-1 font-mono">
                Số: {soQuyetDinh}
              </div>
            </div>

            <div className="text-center">
              <div className="font-bold text-[12px] uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div className="font-bold text-[12px] underline">Độc lập - Tự do - Hạnh phúc</div>
              <div className="text-[11px] italic text-gray-600 mt-1">
                Bình Dương, ngày {now.getDate()} tháng {now.getMonth() + 1} năm {namHienTai}
              </div>
            </div>
          </div>

          {/* TIÊU ĐỀ QUYẾT ĐỊNH */}
          <div className="text-center my-5 font-sans">
            <h2 className="text-base font-bold uppercase tracking-wide">
              QUYẾT ĐỊNH
            </h2>
            <div className="font-bold text-sm uppercase text-gray-900 mt-1">
              Về việc giải quyết trợ cấp mai táng phí và trợ cấp một lần đối với thân nhân người có công từ trần
            </div>
            <div className="text-sm font-bold uppercase text-[#dd4b39] mt-1">
              GIÁM ĐỐC SỞ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI TỈNH BÌNH DƯƠNG
            </div>
          </div>

          {/* CĂN CỨ PHÁP LÝ */}
          <div className="space-y-1.5 text-xs text-justify italic text-gray-800">
            <p className="indent-6">
              Căn cứ Pháp lệnh Ưu đãi người có công với cách mạng số 02/2020/UBTVQH14 ngày 09 tháng 12 năm 2020 của Ủy ban Thường vụ Quốc hội;
            </p>
            <p className="indent-6">
              Căn cứ Nghị định số 131/2021/NĐ-CP ngày 30 tháng 12 năm 2021 của Chính phủ quy định chi tiết và biện pháp thi hành Pháp lệnh Ưu đãi người có công với cách mạng;
            </p>
            <p className="indent-6">
              Căn cứ Nghị định số 73/2024/NĐ-CP ngày 30 tháng 6 năm 2024 của Chính phủ quy định mức lương cơ sở đối với cán bộ, công chức, viên chức và lực lượng vũ trang (2.340.000 đồng/tháng);
            </p>
            <p className="indent-6">
              Căn cứ Nghị định số 77/2024/NĐ-CP ngày 01 tháng 7 năm 2024 của Chính phủ sửa đổi, bổ sung mức chuẩn trợ cấp ưu đãi người có công;
            </p>
            <p className="indent-6">
              Xét Tờ trình của Ủy ban nhân dân thành phố Thủ Dầu Một và đề nghị của Trưởng phòng Người có công - Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương,
            </p>
          </div>

          <div className="text-center my-4 font-sans font-bold text-sm uppercase">
            QUYẾT ĐỊNH:
          </div>

          {/* CÁC ĐIỀU KHOẢN QUYẾT ĐỊNH */}
          <div className="space-y-3 font-serif">
            <p className="indent-6 text-justify">
              <strong>Điều 1.</strong> Cấp tiền trợ cấp mai táng phí và trợ cấp một lần cho thân nhân của Người có công với cách mạng đã từ trần:
            </p>

            <div className="pl-6 space-y-1 font-sans text-xs">
              <p>- Họ và tên người có công đã từ trần: <strong>{hoSo.hoTen}</strong></p>
              <p>- Sinh năm: {hoSo.namSinh} · Số CCCD: {hoSo.cccd}</p>
              <p>- Diện đối tượng: <strong>{hoSo.loaiDoiTuong}</strong> {hoSo.tyLeThuongTat > 0 && `(Tỷ lệ tổn thương: ${hoSo.tyLeThuongTat}%)`}</p>
              <p>- Số hồ sơ quản lý tại Sở LĐ-TB&amp;XH: <strong>{hoSo.soHoSoTinh || hoSo.id}</strong></p>
              <p>- Nơi cư trú trước khi từ trần: {hoSo.phuong}, {hoSo.huyen}, tỉnh Bình Dương</p>
              <p>- Đã từ trần ngày: {new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN")} (Theo Trích lục khai tử số 88/TLKT-UBND)</p>
            </div>

            <p className="indent-6 text-justify">
              <strong>Điều 2.</strong> Thân nhân hoặc tổ chức, cá nhân đứng tên lo mai táng được hưởng chế độ gồm:
            </p>

            <div className="pl-6 space-y-1.5 font-sans text-xs">
              <p>- Người nhận tiền trợ cấp: <strong>{tenNguoiLoMaiTang}</strong></p>
              <p>- Số CCCD người nhận: <strong>{cccdNguoiNhan}</strong></p>
              <p>- Hình thức nhận tiền: <strong>Chuyển khoản qua số tài khoản {soTaiKhoan}</strong> (liên kết VNeID Đề án 06).</p>
              
              <div className="my-2 border border-gray-300 rounded overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 font-bold border-b border-gray-300">
                    <tr>
                      <th className="p-2 text-center w-10">STT</th>
                      <th className="p-2">Khoản trợ cấp được hưởng</th>
                      <th className="p-2">Căn cứ tính toán</th>
                      <th className="p-2 text-right">Số tiền (VNĐ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="p-2 text-center font-mono">1</td>
                      <td className="p-2 font-semibold">Trợ cấp mai táng phí</td>
                      <td className="p-2 text-gray-600">10 tháng lương cơ sở (10 x 2.340.000đ)</td>
                      <td className="p-2 text-right font-mono font-bold text-gray-900">{formatVND(tienMaiTangPhi)}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2 text-center font-mono">2</td>
                      <td className="p-2 font-semibold">Trợ cấp một lần khi NCC từ trần</td>
                      <td className="p-2 text-gray-600">03 tháng trợ cấp, phụ cấp ưu đãi đang hưởng</td>
                      <td className="p-2 text-right font-mono font-bold text-gray-900">{formatVND(tienTroCapMotLan)}</td>
                    </tr>
                    <tr className="bg-emerald-50/50 font-bold">
                      <td className="p-2.5 text-center" colSpan={3}>
                        TỔNG CỘNG KINH PHÍ ĐƯỢC CẤP PHÁT:
                      </td>
                      <td className="p-2.5 text-right font-mono text-sm text-red-700">
                        {formatVND(tongKinhPhi)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="italic text-gray-700">
                (Số tiền bằng chữ: <strong>{tongKinhPhiChu}</strong>).
              </p>
            </div>

            <p className="indent-6 text-justify">
              <strong>Điều 3.</strong> Quyết định này có hiệu lực kể từ ngày ký. Chánh Văn phòng Sở, Trưởng phòng Người có công, Trưởng phòng Kế hoạch - Tài chính Sở Lao động - TB&amp;XH, Trưởng phòng Lao động - TB&amp;XH thành phố Thủ Dầu Một, Chủ tịch UBND Phường Thủ Dầu Một và ông/bà <strong>{tenNguoiLoMaiTang}</strong> chịu trách nhiệm thi hành Quyết định này./.
            </p>
          </div>

          {/* CHỮ KÝ VÀ DẤU ĐỎ ĐIỆN TỬ */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-4 font-sans">
            <div className="text-left text-xs">
              <div className="font-bold">Nơi nhận:</div>
              <div className="text-[11px] text-gray-600 mt-1 space-y-0.5">
                <div>- Như Điều 3;</div>
                <div>- Kho bạc Nhà nước tỉnh Bình Dương (thanh toán);</div>
                <div>- BHXH tỉnh Bình Dương (báo giảm BHYT);</div>
                <div>- Ngân hàng Vietcombank CN Bình Dương;</div>
                <div>- Lưu: VT, NCC, KHTC.</div>
              </div>
            </div>

            <div className="text-center">
              <div className="font-bold uppercase text-xs">KT. GIÁM ĐỐC SỞ</div>
              <div className="font-bold text-xs uppercase text-[#dd4b39]">PHÓ GIÁM ĐỐC</div>
              <div className="my-2">
                <DigitalSignatureBadge
                  nguoiKy="TS. Nguyễn Văn Hùng"
                  chucVu="Phó Giám đốc Sở LĐ-TB&XH tỉnh Bình Dương"
                />
              </div>
              <div className="font-bold text-xs">TS. Nguyễn Văn Hùng</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

