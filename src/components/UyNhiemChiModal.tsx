import {
  X,
  Printer,
  CreditCard,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Send,
  Zap,
} from "lucide-react";
import { type ChiTraItem } from "@/services/app-state";
import { docSoTienBangChu } from "@/services/calculator.service";
import { formatVND } from "@/data/mock";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: ChiTraItem | null;
}

export function UyNhiemChiModal({ isOpen, onClose, item }: Props) {
  if (!isOpen || !item) return null;

  const now = new Date();
  const soTienChu = docSoTienBangChu(item.soTien);
  const ngayLap = `Ngày ${String(now.getDate()).padStart(2, "0")} tháng ${String(now.getMonth() + 1).padStart(2, "0")} năm ${now.getFullYear()}`;
  const maGiaoDich = item.maGiaoDich || `UNC-VCB-2026-${item.id.slice(-4)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-md shadow-2xl max-w-4xl w-full border border-gray-300 overflow-hidden my-4 text-[#222]">
        {/* THANH ĐIỀU KHIỂN TRÊN CÙNG */}
        <div className="no-print bg-[#0073b7] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-blue-900">
          <div className="flex items-center gap-2">
            <CreditCard className="size-5 text-amber-300" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-200">
                ỦY NHIỆM CHI TRỢ CẤP QUA TÀI KHOẢN NGÂN HÀNG (ĐỀ ÁN 06)
              </div>
              <div className="text-[11px] text-white/90 font-mono">
                Mã giao dịch: <strong>{maGiaoDich}</strong> · Mẫu C2-02/NS &amp; Lệnh chuyển tiền Vietcombank
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
              <span>In Ủy nhiệm chi (A4)</span>
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

        {/* NỘI DUNG BIỂU MẪU ỦY NHIỆM CHI CHUẨN THÔNG TƯ 77/2017/TT-BTC & VIETCOMBANK */}
        <div className="p-8 sm:p-12 font-sans text-xs leading-relaxed bg-white max-h-[82vh] overflow-y-auto">
          {/* Header biểu mẫu */}
          <div className="grid grid-cols-12 gap-2 pb-4 border-b-2 border-gray-800">
            <div className="col-span-8">
              <div className="flex items-center gap-2">
                <div className="size-9 rounded bg-[#0073b7] text-white flex items-center justify-center font-bold text-sm">
                  VCB
                </div>
                <div>
                  <div className="font-extrabold text-sm uppercase text-[#0073b7]">
                    NGÂN HÀNG TMCP NGOẠI THƯƠNG VIỆT NAM (VIETCOMBANK)
                  </div>
                  <div className="text-[11px] text-gray-600">
                    Chi nhánh Bình Dương · Trục liên thông thanh toán an sinh xã hội Đề án 06
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-4 text-right">
              <div className="font-bold text-gray-800 text-xs">Mẫu số: C2-02/NS</div>
              <div className="text-[10px] text-gray-500 italic">
                (Ban hành theo TT số 77/2017/TT-BTC)
              </div>
              <div className="font-mono text-xs font-bold text-[#dd4b39] mt-1">
                Số GD: {maGiaoDich}
              </div>
            </div>
          </div>

          <div className="text-center my-5">
            <h1 className="text-xl font-black uppercase text-gray-900 tracking-wider">
              ỦY NHIỆM CHI / LỆNH CHUYỂN TIỀN
            </h1>
            <div className="text-xs text-gray-500 italic mt-0.5">{ngayLap}</div>
          </div>

          {/* Bảng Chi tiết Chuyển khoản ngân hàng */}
          <div className="border border-gray-400 rounded divide-y divide-gray-300">
            {/* 1. ĐƠN VỊ TRẢ TIỀN */}
            <div className="p-3.5 bg-gray-50/70 space-y-1.5">
              <div className="font-bold uppercase text-xs text-blue-900 flex items-center justify-between">
                <span>A. ĐƠN VỊ TRẢ TIỀN (TRÍCH TÀI KHOẢN NGÂN SÁCH):</span>
                <span className="font-mono text-[11px] text-gray-500 font-normal">Mã ĐVQHNS: 74-LDTBXH-BD</span>
              </div>
              <div className="grid grid-cols-12 gap-1 text-xs">
                <span className="col-span-3 text-gray-600 font-medium">Tên đơn vị:</span>
                <span className="col-span-9 font-bold text-gray-900 uppercase">
                  SỞ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI TỈNH BÌNH DƯƠNG
                </span>
              </div>
              <div className="grid grid-cols-12 gap-1 text-xs">
                <span className="col-span-3 text-gray-600 font-medium">Số tài khoản trích nợ:</span>
                <span className="col-span-9 font-mono font-bold text-blue-800">
                  0121000889900 (Tài khoản chi trợ cấp an sinh xã hội)
                </span>
              </div>
              <div className="grid grid-cols-12 gap-1 text-xs">
                <span className="col-span-3 text-gray-600 font-medium">Tại ngân hàng:</span>
                <span className="col-span-9 font-medium">Vietcombank - Chi nhánh tỉnh Bình Dương</span>
              </div>
            </div>

            {/* 2. ĐƠN VỊ NHẬN TIỀN */}
            <div className="p-3.5 space-y-1.5">
              <div className="font-bold uppercase text-xs text-emerald-900 flex items-center justify-between">
                <span>B. NGƯỜI THỤ HƯỞNG (ĐỐI TƯỢNG NGƯỜI CÓ CÔNG / THÂN NHÂN):</span>
                <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Tài khoản định danh Đề án 06
                </span>
              </div>
              <div className="grid grid-cols-12 gap-1 text-xs">
                <span className="col-span-3 text-gray-600 font-medium">Họ và tên người nhận:</span>
                <span className="col-span-9 font-bold text-gray-950 uppercase text-sm">
                  {item.hoTen}
                </span>
              </div>
              <div className="grid grid-cols-12 gap-1 text-xs">
                <span className="col-span-3 text-gray-600 font-medium">Số CCCD / Định danh:</span>
                <span className="col-span-9 font-mono font-semibold">{item.cccd || "0740XXXXXXXX"}</span>
              </div>
              <div className="grid grid-cols-12 gap-1 text-xs">
                <span className="col-span-3 text-gray-600 font-medium">Số tài khoản nhận tiền:</span>
                <span className="col-span-9 font-mono font-bold text-emerald-800 text-sm">
                  {item.soTaiKhoan || "0121000889922"}
                </span>
              </div>
              <div className="grid grid-cols-12 gap-1 text-xs">
                <span className="col-span-3 text-gray-600 font-medium">Ngân hàng thụ hưởng:</span>
                <span className="col-span-9 font-semibold text-gray-900">
                  {item.tenNganHang || "Vietcombank"} CN Bình Dương
                </span>
              </div>
              <div className="grid grid-cols-12 gap-1 text-xs">
                <span className="col-span-3 text-gray-600 font-medium">Địa chỉ cư trú:</span>
                <span className="col-span-9 text-gray-700">
                  {item.phuong} - {item.huyen} - Tỉnh Bình Dương
                </span>
              </div>
            </div>

            {/* 3. NỘI DUNG VÀ SỐ TIỀN */}
            <div className="p-3.5 bg-gray-50/70 space-y-2">
              <div className="flex items-baseline justify-between border-b border-gray-300 pb-2">
                <span className="font-bold text-gray-800 text-sm">SỐ TIỀN THANH TOÁN (VNĐ):</span>
                <span className="font-mono text-2xl font-black text-[#dd4b39]">
                  {formatVND(item.soTien)}
                </span>
              </div>
              <div className="text-xs">
                <span className="font-semibold text-gray-700">Số tiền bằng chữ: </span>
                <span className="font-bold italic text-gray-900">{soTienChu}</span>
              </div>
              <div className="text-xs pt-1">
                <span className="font-semibold text-gray-700">Nội dung thanh toán: </span>
                <span className="text-gray-900 font-medium">
                  {item.tenCheDo} kỳ chi trả {item.kyChiTra} cho đối tượng {item.hoTen} (Mã số tỉnh: {item.soHoSoTinh})
                </span>
              </div>
            </div>
          </div>

          {/* 4. CHỮ KÝ CÁC BÊN (Chuẩn kế toán kho bạc) */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-4 border-t border-gray-300 text-center text-xs">
            <div>
              <div className="font-bold uppercase text-gray-800">KẾ TOÁN TRƯỞNG</div>
              <div className="text-[10px] text-gray-500 italic mt-0.5">Sở LĐ-TB&amp;XH Bình Dương</div>
              <div className="my-8 text-xs italic text-gray-400">(Đã ký số điện tử)</div>
              <div className="font-bold text-gray-900 uppercase">Nguyễn Thị Lan</div>
            </div>

            <div>
              <div className="font-bold uppercase text-gray-800">CHỦ TÀI KHOẢN (LÃNH ĐẠO SỞ)</div>
              <div className="text-[10px] text-gray-500 italic mt-0.5">Phó Giám đốc Sở LĐ-TB&amp;XH</div>
              <div className="my-8 text-xs italic text-gray-400">(Đã ký số SmartCA)</div>
              <div className="font-bold text-gray-900 uppercase">TS. Nguyễn Văn Hùng</div>
            </div>

            <div>
              <div className="font-bold uppercase text-blue-900">NGÂN HÀNG / KHO BẠC KIỂM SOÁT</div>
              <div className="text-[10px] text-gray-500 italic mt-0.5">Vietcombank CN Bình Dương</div>
              <div className="my-3 min-h-[50px] flex items-center justify-center">
                <div className="border border-emerald-500 bg-emerald-50 p-1.5 rounded text-[10px] text-emerald-800 font-bold uppercase text-center">
                  ✓ ĐÃ HẠCH TOÁN NỢ / CÓ<br />
                  <span className="font-mono text-[9px]">GIAO DỊCH THÀNH CÔNG</span>
                </div>
              </div>
              <div className="font-bold text-gray-900 uppercase">Giao dịch viên: Lê Thùy Trang</div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="no-print bg-gray-100 px-6 py-3 border-t border-gray-300 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1.5 text-[11px]">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Lệnh chi tiền điện tử qua Napas / Vietcombank theo Đề án 06</span>
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

