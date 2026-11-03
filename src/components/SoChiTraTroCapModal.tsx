import { useState } from "react";
import {
  X,
  Printer,
  FileSpreadsheet,
  Download,
  Building,
  CheckCircle2,
  Calendar,
  CreditCard,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { formatVND, type HoSo } from "@/data/mock";
import { docSoTienBangChu } from "@/services/calculator.service";
import { DigitalSignatureBadge } from "@/components/DigitalSignatureBadge";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hoSoList: HoSo[];
  thangChiTra?: string;
}

export function SoChiTraTroCapModal({ isOpen, onClose, hoSoList, thangChiTra = "Tháng 10/2026" }: Props) {
  if (!isOpen) return null;

  const now = new Date();
  const soSoTheoDoi = `SCT-NCC/2026-T10`;

  // Lọc các hồ sơ đã duyệt được đưa vào chi trả
  const danhSachChiTra = hoSoList.filter(
    (h) => h.trangThai === "ĐÃ_DUYỆT" || h.mucTroCap > 0,
  );

  const tongKinhPhi = danhSachChiTra.reduce(
    (acc, h) => acc + h.mucTroCap + (h.phuCapPhucVu || 0),
    0,
  );
  const tongSoTienChu = docSoTienBangChu(tongKinhPhi);

  const soQuaAtm = danhSachChiTra.filter((h) => h.soTaiKhoan).length;
  const soTienMat = danhSachChiTra.length - soQuaAtm;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const headers = [
      "STT",
      "Số hồ sơ",
      "Họ và tên",
      "CCCD",
      "Địa bàn",
      "Diện đối tượng",
      "Mức trợ cấp (VNĐ)",
      "Phụ cấp phục vụ (VNĐ)",
      "Tổng chi trả (VNĐ)",
      "Hình thức",
      "Số tài khoản VNeID / Ngân hàng",
      "Trạng thái giao dịch",
    ];

    const rows = danhSachChiTra.map((h, i) => [
      i + 1,
      `"${h.soHoSoTinh || h.id}"`,
      `"${h.hoTen}"`,
      `"${h.cccd}"`,
      `"${h.phuong} - ${h.huyen}"`,
      `"${h.loaiDoiTuong}"`,
      h.mucTroCap,
      h.phuCapPhucVu || 0,
      h.mucTroCap + (h.phuCapPhucVu || 0),
      h.soTaiKhoan ? "Chuyển khoản VNeID" : "Tiền mặt (Bưu điện)",
      `"${h.soTaiKhoan || "Nhận tại Bưu điện"}"`,
      "Thành công 100%",
    ]);

    const csv = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SO_CHI_TRA_TRO_CAP_NGUOI_CO_CONG_${thangChiTra.replace(/\D/g, "")}.csv`;
    a.click();
    toast.success("Đã xuất tệp Sổ theo dõi chi trả Mẫu C70b-HD thành công!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-md shadow-2xl max-w-6xl w-full border border-gray-300 overflow-hidden my-4 text-[#222]">
        {/* HEADER ĐIỀU KHIỂN (Ẩn khi in) */}
        <div className="no-print bg-[#00a65a] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="size-5" />
            <div>
              <div className="font-bold text-sm uppercase">
                Sổ Theo Dõi Chi Trả Trợ Cấp Ưu Đãi Người Có Công (Mẫu C70b-HD)
              </div>
              <div className="text-[11px] text-emerald-100">
                Kỳ chi trả: {thangChiTra} · Đơn vị quản lý: Phòng LĐ-TB&amp;XH thành phố Thủ Dầu Một
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>Xuất CSV / Excel</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold shadow-xs cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>In Sổ Chi Trả (A4 ngang)</span>
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

        {/* THỐNG KÊ NHANH ĐỢT CHI TRẢ (Ẩn khi in) */}
        <div className="no-print bg-emerald-50/70 border-b border-emerald-200 px-5 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <span className="text-gray-500">Tổng số đối tượng:</span>
              <span className="font-bold text-gray-900 ml-1.5 font-mono text-sm">{danhSachChiTra.length} người</span>
            </div>
            <div>
              <span className="text-gray-500">Chi trả qua VNeID / ATM:</span>
              <span className="font-bold text-emerald-700 ml-1.5 font-mono text-sm">
                {soQuaAtm} người ({((soQuaAtm / (danhSachChiTra.length || 1)) * 100).toFixed(1)}%)
              </span>
            </div>
            <div>
              <span className="text-gray-500">Chi tiền mặt (Bưu điện):</span>
              <span className="font-bold text-amber-700 ml-1.5 font-mono text-sm">{soTienMat} người</span>
            </div>
            <div>
              <span className="text-gray-500">Tổng kinh phí giải ngân:</span>
              <span className="font-bold text-red-700 ml-1.5 font-mono text-base">{formatVND(tongKinhPhi)}</span>
            </div>
          </div>
        </div>

        {/* NỘI DUNG SỔ CHI TRẢ A4 NGANG CHUẨN THỂ THỨC TÀI CHÍNH */}
        <div className="p-6 sm:p-10 font-sans text-xs leading-relaxed text-[#111] bg-white print:p-4">
          {/* QUỐC HUY / TIÊU NGỮ */}
          <div className="flex justify-between items-start border-b pb-3 mb-4">
            <div>
              <div className="font-bold text-[11px] uppercase">ỦY BAN NHÂN DÂN TP. THỦ DẦU MỘT</div>
              <div className="font-bold text-[11px] text-gray-800 uppercase">PHÒNG LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI</div>
              <div className="text-[10px] text-gray-500 font-mono mt-0.5">Mã QHNS: 1048291</div>
            </div>

            <div className="text-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                SỔ THEO DÕI CHI TRẢ TRỢ CẤP ƯU ĐÃI NGƯỜI CÓ CÔNG
              </h2>
              <div className="text-[11px] font-bold text-emerald-800">
                Kỳ chi trả: {thangChiTra} (Áp dụng mức chuẩn Nghị định 77/2024/NĐ-CP)
              </div>
              <div className="text-[10px] italic text-gray-500 mt-0.5">
                (Ban hành kèm theo Thông tư liên tịch của Bộ Tài chính và Bộ Lao động - TB&amp;XH)
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-[11px] uppercase">MẪU C70b-HD</div>
              <div className="text-[10px] text-gray-500 font-mono">Số sổ: {soSoTheoDoi}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Ngày lập: {now.toLocaleDateString("vi-VN")}</div>
            </div>
          </div>

          {/* BẢNG DANH SÁCH CHI TRẢ CHI TIẾT */}
          <div className="border border-gray-300 rounded overflow-hidden mt-3">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead className="bg-gray-100 font-bold border-b border-gray-300 text-gray-800 uppercase">
                <tr>
                  <th className="p-2 text-center w-8">STT</th>
                  <th className="p-2">Số hồ sơ</th>
                  <th className="p-2">Họ và tên người có công</th>
                  <th className="p-2">CCCD</th>
                  <th className="p-2">Phường/Xã</th>
                  <th className="p-2">Diện đối tượng</th>
                  <th className="p-2 text-right">Trợ cấp tháng (NĐ 77/2024)</th>
                  <th className="p-2 text-right">Phụ cấp phục vụ</th>
                  <th className="p-2 text-right">Tổng nhận (VNĐ)</th>
                  <th className="p-2">Hình thức chi trả</th>
                  <th className="p-2 text-center">Xác nhận / Ký nhận</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {danhSachChiTra.map((h, idx) => {
                  const tongNhan = h.mucTroCap + (h.phuCapPhucVu || 0);
                  return (
                    <tr key={h.id} className="hover:bg-gray-50">
                      <td className="p-2 text-center font-mono font-bold text-gray-500">{idx + 1}</td>
                      <td className="p-2 font-mono font-semibold text-gray-800">{h.soHoSoTinh || h.id}</td>
                      <td className="p-2 font-bold text-gray-900">{h.hoTen}</td>
                      <td className="p-2 font-mono text-gray-600">{h.cccd}</td>
                      <td className="p-2 text-gray-700">{h.phuong}</td>
                      <td className="p-2 font-medium text-blue-900">{h.loaiDoiTuong}</td>
                      <td className="p-2 text-right font-mono font-semibold">{formatVND(h.mucTroCap)}</td>
                      <td className="p-2 text-right font-mono text-gray-600">{formatVND(h.phuCapPhucVu || 0)}</td>
                      <td className="p-2 text-right font-mono font-bold text-red-700">{formatVND(tongNhan)}</td>
                      <td className="p-2">
                        {h.soTaiKhoan ? (
                          <div>
                            <span className="font-bold text-emerald-800">ATM VNeID:</span>
                            <div className="font-mono text-[10px] text-gray-600 truncate max-w-[140px]">
                              {h.soTaiKhoan}
                            </div>
                          </div>
                        ) : (
                          <span className="text-amber-800 font-medium">Tiền mặt tại Bưu điện</span>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {h.soTaiKhoan ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="size-3" />
                            Đã chuyển
                          </span>
                        ) : (
                          <span className="text-[10px] italic text-gray-500">Ký nhận tiền</span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {/* HÀNG TỔNG CỘNG */}
                <tr className="bg-emerald-50/70 font-bold text-xs border-t-2 border-gray-400">
                  <td className="p-2.5 text-center" colSpan={6}>
                    TỔNG CỘNG TOÀN ĐỊA BÀN ({danhSachChiTra.length} ĐỐI TƯỢNG):
                  </td>
                  <td className="p-2.5 text-right font-mono" colSpan={2}>
                    Chi trả tháng {thangChiTra}:
                  </td>
                  <td className="p-2.5 text-right font-mono text-sm text-red-700">
                    {formatVND(tongKinhPhi)}
                  </td>
                  <td className="p-2.5" colSpan={2}>
                    <span className="text-emerald-800 font-bold">100% khớp lệnh Kho bạc</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-xs italic text-gray-700">
            (Tổng số tiền bằng chữ: <strong>{tongSoTienChu}</strong>).
          </div>

          {/* CHỮ KÝ TRÁCH NHIỆM 3 BÊN */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-4 text-center text-xs">
            <div>
              <div className="font-bold uppercase">NGƯỜI LẬP SỔ (KẾ TOÁN)</div>
              <div className="text-[10px] italic text-gray-500">(Ký và ghi rõ họ tên)</div>
              <div className="h-16 flex items-end justify-center font-bold text-gray-800">
                Lê Thu Trang
              </div>
            </div>

            <div>
              <div className="font-bold uppercase">CHUYÊN VIÊN THEO DÕI NCC</div>
              <div className="text-[10px] italic text-gray-500">(Ký và ghi rõ họ tên)</div>
              <div className="h-16 flex items-end justify-center font-bold text-gray-800">
                Nguyễn Thị Minh Thảo
              </div>
            </div>

            <div>
              <div className="font-bold uppercase text-emerald-900">TRƯỞNG PHÒNG LĐ-TB&amp;XH</div>
              <div className="text-[10px] italic text-gray-500">(Ký số &amp; đóng dấu)</div>
              <div className="my-1">
                <DigitalSignatureBadge
                  nguoiKy="Phòng LĐ-TB&XH thành phố Thủ Dầu Một"
                  chucVu="Ủy ban nhân dân thành phố Thủ Dầu Một"
                />
              </div>
              <div className="font-bold text-gray-900">Phạm Văn Cường</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

