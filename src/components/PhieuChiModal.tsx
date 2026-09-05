import { X, Printer, QrCode, CheckCircle2, Building, UserCheck } from "lucide-react";
import { type ChiTraItem } from "@/services/app-state";
import { docSoTienBangChu } from "@/services/calculator.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: ChiTraItem | null;
}

export function PhieuChiModal({ isOpen, onClose, item }: Props) {
  if (!isOpen || !item) return null;

  const soTienChu = docSoTienBangChu(item.soTien);
  const now = new Date();
  const ngayIn = `Ngày ${String(now.getDate()).padStart(2, "0")} tháng ${String(now.getMonth() + 1).padStart(2, "0")} năm ${now.getFullYear()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-[4px] border border-[#d2d6de] bg-white p-6 sm:p-8 shadow-2xl text-[#333333]">
        {/* Nút đóng và in góc trên */}
        <div className="no-print absolute right-4 top-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-[3px] bg-[#00a65a] hover:bg-[#008d4c] px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="size-3.5" />
            In phiếu chi
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[#777777] hover:bg-gray-100 hover:text-[#333333]"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* PHẦN ĐẦU BIỂU MẪU C70a-HD */}
        <div className="border-b border-[#e5e7eb] pb-4">
          <div className="grid grid-cols-2 text-xs leading-relaxed">
            <div>
              <div className="font-bold uppercase text-[#333333]">SỞ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI</div>
              <div className="font-semibold text-[#555555]">TỈNH BÌNH DƯƠNG</div>
              <div className="text-[#666666] text-[11px]">Phòng LĐ-TB&XH TP. Thủ Dầu Một</div>
              <div className="text-[#888888] font-mono text-[10px]">Mã ĐV: 74-LDTBXH-BD</div>
            </div>

            <div className="text-right">
              <div className="font-bold text-[#333333]">Mẫu số: C70a-HD</div>
              <div className="text-[#666666] text-[11px] italic">
                (Ban hành theo TT 101/2018/TT-BTC &amp; NĐ 75/2021/NĐ-CP)
              </div>
              <div className="font-mono text-[11px] text-[#dd4b39] font-semibold mt-1">
                Số: {item.maGiaoDich || `PC-BD-2026-${item.id.slice(-4)}`}
              </div>
            </div>
          </div>

          <div className="mt-5 text-center">
            <h1 className="text-lg sm:text-xl font-extrabold uppercase text-[#333333] tracking-wide">
              GIẤY LĨNH TIỀN TRỢ CẤP ƯU ĐÃI NGƯỜI CÓ CÔNG
            </h1>
            <div className="mt-1 text-xs text-[#555555] font-medium">
              Kỳ chi trả: <span className="font-bold text-[#333333]">{item.kyChiTra}</span> (Đợt 1 từ 05 - 10 hàng tháng)
            </div>
          </div>
        </div>

        {/* THÔNG TIN CHI TIẾT ĐỐI TƯỢNG */}
        <div className="my-5 space-y-2.5 text-xs leading-relaxed">
          <div className="flex">
            <span className="w-40 font-semibold text-[#444444] shrink-0">Họ và tên người nhận:</span>
            <span className="font-bold text-[#333333] text-sm uppercase">{item.hoTen}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex">
              <span className="w-40 font-semibold text-[#444444] shrink-0">Số CCCD / CMND:</span>
              <span className="font-mono text-[#333333] font-medium">{item.cccd || "0740XXXXXXXX"}</span>
            </div>
            <div className="flex">
              <span className="w-36 font-semibold text-[#444444] shrink-0">Số hồ sơ Tỉnh quản lý:</span>
              <span className="font-mono font-bold text-[#dd4b39]">{item.soHoSoTinh}</span>
            </div>
          </div>

          <div className="flex">
            <span className="w-40 font-semibold text-[#444444] shrink-0">Thuộc diện đối tượng:</span>
            <span className="text-[#333333] font-medium">{item.loaiDoiTuong}</span>
          </div>

          <div className="flex">
            <span className="w-40 font-semibold text-[#444444] shrink-0">Địa chỉ thường trú:</span>
            <span className="text-[#333333]">{item.phuong} - {item.huyen} - Tỉnh Bình Dương</span>
          </div>

          <div className="flex">
            <span className="w-40 font-semibold text-[#444444] shrink-0">Nội dung chi trả:</span>
            <span className="text-[#333333] font-medium">{item.tenCheDo}</span>
          </div>

          <div className="flex">
            <span className="w-40 font-semibold text-[#444444] shrink-0">Hình thức phát tiền:</span>
            <span className="font-medium text-[#333333]">
              {item.hinhThuc === "NGAN_HANG" ? "Chuyển khoản qua Tài khoản Ngân hàng (Đề án 06)" : "Tiền mặt qua Bưu điện (VNPost Bình Dương)"}
            </span>
          </div>

          <div className="flex">
            <span className="w-40 font-semibold text-[#444444] shrink-0">Thông tin tài khoản / Điểm chi:</span>
            <span className="text-[#333333] font-mono bg-gray-50 px-2 py-0.5 rounded border border-[#e5e7eb]">
              {item.thongTinChiTra} {item.soTaiKhoan ? `(STK: ${item.soTaiKhoan})` : ""}
            </span>
          </div>

          {/* Hộp số tiền nổi bật */}
          <div className="mt-4 rounded-[3px] border border-[#d2d6de] bg-[#f9fafb] p-3.5">
            <div className="flex items-baseline justify-between">
              <span className="font-bold text-[#444444]">SỐ TIỀN THỰC LĨNH:</span>
              <span className="font-mono text-xl font-extrabold text-[#dd4b39]">
                {item.soTien.toLocaleString("vi-VN")} <span className="text-xs font-normal text-[#666666]">VNĐ</span>
              </span>
            </div>
            <div className="mt-1.5 text-xs text-[#555555]">
              <span className="font-semibold text-[#444444]">Bằng chữ: </span>
              <span className="italic font-medium text-[#222222]">{soTienChu}</span>
            </div>
          </div>

          {/* Trạng thái xác nhận */}
          <div className="mt-2 flex items-center justify-between rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>Trạng thái: <strong>{item.trangThai === "ĐÃ_CHI_TRẢ" ? "Đã giải ngân hoàn tất" : "Đang chờ phát tiền"}</strong></span>
            </div>
            {item.ngayChiTra && (
              <span className="font-mono text-[11px]">Ngày phát: {item.ngayChiTra}</span>
            )}
          </div>
        </div>

        {/* PHẦN CHỮ KÝ XÁC NHẬN */}
        <div className="mt-6 border-t border-[#e5e7eb] pt-3 text-xs">
          <div className="text-right text-[#666666] italic mb-3">{ngayIn}</div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="font-bold text-[#333333]">Người lập biểu</div>
              <div className="text-[11px] text-[#777777] italic">(Ký, họ tên)</div>
              <div className="h-14 flex items-end justify-center font-medium text-[11px] text-[#555555]">
                Nguyễn Thị Thu
              </div>
            </div>

            <div>
              <div className="font-bold text-[#333333]">Kế toán trưởng</div>
              <div className="text-[11px] text-[#777777] italic">(Ký, họ tên)</div>
              <div className="h-14 flex items-end justify-center font-medium text-[11px] text-[#555555]">
                Trần Văn Phúc
              </div>
            </div>

            <div>
              <div className="font-bold text-[#333333]">Thủ quỹ / Bưu tá</div>
              <div className="text-[11px] text-[#777777] italic">(Ký, họ tên)</div>
              <div className="h-14 flex items-end justify-center font-medium text-[11px] text-[#555555]">
                {item.hinhThuc === "NGAN_HANG" ? "GD Ngân hàng" : "Lê Văn Tiến"}
              </div>
            </div>

            <div>
              <div className="font-bold text-[#333333]">Người lĩnh tiền</div>
              <div className="text-[11px] text-[#777777] italic">(Ký, họ tên)</div>
              <div className="h-14 flex items-end justify-center font-semibold text-[11px] text-[#222222]">
                {item.hoTen}
              </div>
            </div>
          </div>
        </div>

        {/* Mã QR xác thực & footer */}
        <div className="mt-6 flex items-center justify-between border-t border-[#f0f0f0] pt-3 text-[10px] text-[#777777]">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded border border-[#d2d6de] p-1 bg-white flex items-center justify-center">
              <QrCode className="size-full text-[#333333]" />
            </div>
            <div>
              <div>Mã tra cứu biên nhận: <span className="font-mono font-bold text-[#333333]">{item.id}</span></div>
              <div>Cổng CSDL Người có công Bình Dương · Xác thực số an sinh VNeID</div>
            </div>
          </div>

          <div className="no-print">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[3px] border border-[#d2d6de] bg-white px-4 py-1 text-xs text-[#555555] hover:bg-gray-50"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
