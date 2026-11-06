/**
 * BẢNG KÊ CHI TRẢ QUÀ TẶNG DỊP 27/7 & TRỢ CẤP THỜ CÚNG LIỆT SĨ HÀNG NĂM
 * Căn cứ pháp lý:
 * - Quyết định của Chủ tịch Nước về việc tặng quà nhân dịp 79 năm ngày Thương binh - Liệt sĩ (27/7)
 * - Nghị quyết của HĐND tỉnh Bình Dương về chính sách an sinh và quà tặng người có công
 * - Nghị định số 131/2021/NĐ-CP & Nghị định 77/2024/NĐ-CP: Mức thờ cúng liệt sĩ 1.400.000đ/năm
 * - Chỉ thị số 21/CT-TTg: Chi trả không dùng tiền mặt qua tài khoản VNeID
 */

import { useState } from "react";
import {
  X,
  Printer,
  Gift,
  Download,
  CheckCircle2,
  Building,
  Calendar,
  FileSpreadsheet,
  Heart,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { formatVND, type ChiTraItem } from "@/data/mock";
import { useAppState } from "@/services/app-state";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  kyChiTra?: string;
}

interface QuaTangRow {
  stt: number;
  hoTen: string;
  cccd: string;
  loaiDoiTuong: string;
  diaBan: string;
  quaChuTichNuoc: number; // 600.000 hoặc 300.000
  quaTinhBinhDuong: number; // 2.500.000 hoặc 2.000.000 hoặc 1.500.000
  thoCungLietSi: number; // 1.400.000
  tongCong: number;
  hinhThuc: "NGAN_HANG" | "TIEN_MAT";
  stkHoacDiaDiem: string;
}

const MOCK_QUA_277_DATA: QuaTangRow[] = [
  {
    stt: 1,
    hoTen: "Hồ Văn Lên (Thân nhân thờ cúng)",
    cccd: "074026000123",
    loaiDoiTuong: "Thân nhân liệt sĩ",
    diaBan: "P. Chánh Nghĩa, TP. TDM",
    quaChuTichNuoc: 300000,
    quaTinhBinhDuong: 1500000,
    thoCungLietSi: 1400000,
    tongCong: 3200000,
    hinhThuc: "NGAN_HANG",
    stkHoacDiaDiem: "Vietcombank - 0281000349281",
  },
  {
    stt: 2,
    hoTen: "Nguyễn Văn Thành",
    cccd: "074052007788",
    loaiDoiTuong: "Thương binh 61%",
    diaBan: "P. Thủ Dầu Một, TP. TDM",
    quaChuTichNuoc: 300000,
    quaTinhBinhDuong: 1500000,
    thoCungLietSi: 0,
    tongCong: 1800000,
    hinhThuc: "NGAN_HANG",
    stkHoacDiaDiem: "Vietcombank - 0281000789123",
  },
  {
    stt: 3,
    hoTen: "Lê Thị Mai",
    cccd: "074030008899",
    loaiDoiTuong: "Bà mẹ Việt Nam Anh hùng",
    diaBan: "P. Định Hòa, TP. TDM",
    quaChuTichNuoc: 600000,
    quaTinhBinhDuong: 2500000,
    thoCungLietSi: 1400000,
    tongCong: 4500000,
    hinhThuc: "TIEN_MAT",
    stkHoacDiaDiem: "Bưu điện văn hóa Định Hòa",
  },
  {
    stt: 4,
    hoTen: "Trần Văn Nam",
    cccd: "074048003311",
    loaiDoiTuong: "Thương binh đặc biệt nặng 81%",
    diaBan: "P. Hiệp Thành, TP. TDM",
    quaChuTichNuoc: 600000,
    quaTinhBinhDuong: 2000000,
    thoCungLietSi: 0,
    tongCong: 2600000,
    hinhThuc: "NGAN_HANG",
    stkHoacDiaDiem: "BIDV - 6501000129384",
  },
  {
    stt: 5,
    hoTen: "Phạm Ngọc Dưỡng",
    cccd: "074045001923",
    loaiDoiTuong: "Thân nhân 2 liệt sĩ",
    diaBan: "P. Chánh Nghĩa, TP. TDM",
    quaChuTichNuoc: 600000,
    quaTinhBinhDuong: 2000000,
    thoCungLietSi: 2800000,
    tongCong: 5400000,
    hinhThuc: "NGAN_HANG",
    stkHoacDiaDiem: "Vietcombank - 0281000998877",
  },
];

export function BangKeQua27Thang7Modal({ isOpen, onClose, kyChiTra = "2026-07" }: Props) {
  const { currentUser } = useAppState();
  const [data] = useState<QuaTangRow[]>(MOCK_QUA_277_DATA);

  if (!isOpen) return null;

  const now = new Date();
  const tongTrungUong = data.reduce((s, r) => s + r.quaChuTichNuoc, 0);
  const tongDiaPhuong = data.reduce((s, r) => s + r.quaTinhBinhDuong, 0);
  const tongThoCung = data.reduce((s, r) => s + r.thoCungLietSi, 0);
  const tongToanBo = data.reduce((s, r) => s + r.tongCong, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const csvContent =
      "\uFEFF" +
      [
        "STT,Họ và tên,CCCD,Đối tượng,Địa bàn,Quà Chủ tịch Nước (VNĐ),Quà Tỉnh Bình Dương (VNĐ),Thờ cúng liệt sĩ (VNĐ),Tổng thực lĩnh (VNĐ),Kênh chi trả,Thông tin tài khoản/Bưu cục",
        ...data.map(
          (r) =>
            `${r.stt},"${r.hoTen}","${r.cccd}","${r.loaiDoiTuong}","${r.diaBan}",${r.quaChuTichNuoc},${r.quaTinhBinhDuong},${r.thoCungLietSi},${r.tongCong},"${
              r.hinhThuc === "NGAN_HANG" ? "Chuyển khoản VNeID" : "Tiền mặt bưu cục"
            }","${r.stkHoacDiaDiem}"`
        ),
        `"TỔNG CỘNG","","","","",${tongTrungUong},${tongDiaPhuong},${tongThoCung},${tongToanBo},"",""`,
      ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BANG_KE_CHI_TRA_QUA_27_7_BINH_DUONG_${now.getFullYear()}.csv`;
    a.click();
    toast.success("Đã xuất tệp Bảng kê kinh phí quà tặng 27/7 thành công!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-md shadow-2xl max-w-5xl w-full border border-gray-300 overflow-hidden my-4 text-[#222]">
        {/* THANH ĐIỀU KHIỂN TRÊN CÙNG */}
        <div className="no-print bg-[#dd4b39] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-red-800">
          <div className="flex items-center gap-2">
            <Gift className="size-5 text-amber-200" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-100">
                BẢNG KÊ QUÀ TẶNG NGÀY THƯƠNG BINH - LIỆT SĨ 27/7 & THỜ CÚNG LIỆT SĨ
              </div>
              <div className="text-[11px] text-white/90">
                Kỳ giải ngân: <strong>Tháng 07/{now.getFullYear()}</strong> · Tổng kinh phí:{" "}
                <strong className="text-amber-200">{formatVND(tongToanBo)}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-red-700 hover:bg-gray-100 text-xs font-bold shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="size-3.5 text-red-600" />
              <span>Xuất Bảng Kê (.CSV)</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>In Bảng Kê A4</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Đóng"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* NỘI DUNG VĂN BẢN (A4 PRINT VIEW) */}
        <div className="p-8 sm:p-12 font-serif text-[13px] leading-relaxed text-black bg-white select-text">
          {/* Header Quốc hiệu */}
          <div className="grid grid-cols-2 gap-4 items-start text-center mb-6">
            <div>
              <div className="text-xs uppercase font-bold text-gray-800">
                ỦY BAN NHÂN DÂN TỈNH BÌNH DƯƠNG
              </div>
              <div className="text-xs uppercase font-extrabold text-black">
                SỞ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI
              </div>
              <div className="text-[11px] text-gray-700 font-mono mt-0.5">
                Số: {now.getFullYear()}/BK-LĐTBXH-27/7
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase text-black">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </div>
              <div className="text-xs font-bold text-black">
                Độc lập - Tự do - Hạnh phúc
              </div>
              <div className="text-[11px] italic text-gray-700 mt-1">
                Bình Dương, ngày {now.getDate()} tháng 07 năm {now.getFullYear()}
              </div>
            </div>
          </div>

          {/* Tiêu đề bảng kê */}
          <div className="text-center my-6 space-y-1">
            <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-black">
              BẢNG KÊ DANH SÁCH CHI TRẢ QUÀ TẶNG DỊP 27/7 & TRỢ CẤP THỜ CÚNG LIỆT SĨ
            </h1>
            <div className="text-xs font-bold text-gray-800">
              Kỷ niệm 79 năm ngày Thương binh - Liệt sĩ (27/7/1947 - 27/7/{now.getFullYear()})
            </div>
            <div className="text-[11px] italic text-gray-600">
              (Kết hợp nguồn Ngân sách Trung ương, Ngân sách Tỉnh Bình Dương & Trợ cấp thờ cúng liệt sĩ)
            </div>
          </div>

          {/* Thống kê 3 nguồn kinh phí */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 text-xs">
            <div className="p-3 bg-red-50 rounded border border-red-200">
              <span className="text-gray-600 block text-[11px]">Quà Chủ tịch Nước:</span>
              <strong className="text-red-700 text-sm font-mono block mt-0.5">
                {formatVND(tongTrungUong)}
              </strong>
              <span className="text-[10px] text-gray-500">Mức 600k / 300k</span>
            </div>

            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <span className="text-gray-600 block text-[11px]">Quà Tỉnh Bình Dương:</span>
              <strong className="text-blue-800 text-sm font-mono block mt-0.5">
                {formatVND(tongDiaPhuong)}
              </strong>
              <span className="text-[10px] text-gray-500">Mức 2.5tr / 2tr / 1.5tr</span>
            </div>

            <div className="p-3 bg-amber-50 rounded border border-amber-200">
              <span className="text-gray-600 block text-[11px]">Thờ cúng Liệt sĩ (1 năm/lần):</span>
              <strong className="text-amber-800 text-sm font-mono block mt-0.5">
                {formatVND(tongThoCung)}
              </strong>
              <span className="text-[10px] text-gray-500">1.400.000đ / liệt sĩ</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded border border-emerald-300">
              <span className="text-gray-600 block text-[11px]">Tổng kinh phí đợt 27/7:</span>
              <strong className="text-emerald-700 text-sm font-mono font-black block mt-0.5">
                {formatVND(tongToanBo)}
              </strong>
              <span className="text-[10px] text-emerald-800 font-bold">100% Chi trả đúng hẹn</span>
            </div>
          </div>

          {/* BẢNG CHI TIẾT ĐỐI TƯỢNG */}
          <div className="my-5 overflow-x-auto border border-black">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-gray-100 text-center font-bold border-b border-black text-black">
                  <th className="p-2 border-r border-black w-8">STT</th>
                  <th className="p-2 border-r border-black w-36">Họ và tên</th>
                  <th className="p-2 border-r border-black w-24">Số CCCD</th>
                  <th className="p-2 border-r border-black w-28">Diện đối tượng</th>
                  <th className="p-2 border-r border-black text-right w-24">Quà CTN (VNĐ)</th>
                  <th className="p-2 border-r border-black text-right w-24">Quà Tỉnh (VNĐ)</th>
                  <th className="p-2 border-r border-black text-right w-24">Thờ cúng LS (VNĐ)</th>
                  <th className="p-2 border-r border-black text-right w-24">Tổng cộng (VNĐ)</th>
                  <th className="p-2">Kênh nhận tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((r) => (
                  <tr key={r.stt} className="border-b border-black/30 hover:bg-gray-50">
                    <td className="p-2 border-r border-black text-center font-bold">{r.stt}</td>
                    <td className="p-2 border-r border-black font-bold uppercase">{r.hoTen}</td>
                    <td className="p-2 border-r border-black font-mono text-center">{r.cccd}</td>
                    <td className="p-2 border-r border-black">{r.loaiDoiTuong}</td>
                    <td className="p-2 border-r border-black font-mono text-right font-medium">
                      {formatVND(r.quaChuTichNuoc)}
                    </td>
                    <td className="p-2 border-r border-black font-mono text-right font-medium">
                      {formatVND(r.quaTinhBinhDuong)}
                    </td>
                    <td className="p-2 border-r border-black font-mono text-right font-medium">
                      {r.thoCungLietSi > 0 ? formatVND(r.thoCungLietSi) : "-"}
                    </td>
                    <td className="p-2 border-r border-black font-mono text-right font-bold text-red-600">
                      {formatVND(r.tongCong)}
                    </td>
                    <td className="p-2 text-[10px]">
                      {r.hinhThuc === "NGAN_HANG" ? (
                        <span className="text-purple-800 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="size-3 text-purple-600" />
                          <span>{r.stkHoacDiaDiem}</span>
                        </span>
                      ) : (
                        <span className="text-gray-700">{r.stkHoacDiaDiem}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {/* Dòng tổng cộng */}
                <tr className="bg-gray-100 font-bold border-t-2 border-black text-black">
                  <td colSpan={4} className="p-2 border-r border-black text-center uppercase">
                    TỔNG CỘNG KINH PHÍ CHI TRẢ:
                  </td>
                  <td className="p-2 border-r border-black font-mono text-right">
                    {formatVND(tongTrungUong)}
                  </td>
                  <td className="p-2 border-r border-black font-mono text-right">
                    {formatVND(tongDiaPhuong)}
                  </td>
                  <td className="p-2 border-r border-black font-mono text-right">
                    {formatVND(tongThoCung)}
                  </td>
                  <td className="p-2 border-r border-black font-mono text-right text-red-700 text-xs">
                    {formatVND(tongToanBo)}
                  </td>
                  <td className="p-2 text-center text-[10px] text-emerald-800 font-bold">
                    100% Đã quyết toán
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Cam kết của cơ quan chi trả */}
          <div className="text-xs italic text-gray-700 space-y-1 mb-6">
            <p>
              * Đơn vị cam kết đã rà soát 100% đối tượng theo danh sách, bảo đảm không trùng lặp, không bỏ sót đối tượng chính sách người có công và thân nhân liệt sĩ trên địa bàn.
            </p>
            <p>
              * Phương thức giải ngân thực hiện theo Chỉ thị 21/CT-TTg: Đối tượng có tài khoản nhận tiền trực tiếp qua hệ thống ngân hàng trong ngày 20/07/{now.getFullYear()}.
            </p>
          </div>

          {/* Chữ ký phê duyệt */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs mt-8 pt-4">
            <div>
              <div className="font-bold uppercase text-gray-800">NGƯỜI LẬP BIỂU</div>
              <div className="text-[11px] italic text-gray-600">(Ký, họ tên)</div>
              <div className="mt-14 font-bold uppercase text-gray-900">Trần Quốc Toản</div>
              <div className="text-[11px] text-gray-600">Chuyên viên Kế toán</div>
            </div>

            <div>
              <div className="font-bold uppercase text-gray-800">TRƯỞNG PHÒNG LĐ-TB&XH</div>
              <div className="text-[11px] italic text-gray-600">(Ký, họ tên)</div>
              <div className="mt-14 font-bold uppercase text-gray-900">Nguyễn Thị Minh Thảo</div>
              <div className="text-[11px] text-gray-600">TP. Thủ Dầu Một</div>
            </div>

            <div>
              <div className="font-bold uppercase text-gray-800">GIÁM ĐỐC SỞ LĐ-TB&XH</div>
              <div className="text-[11px] italic text-gray-600">(Ký số điện tử & Đóng dấu)</div>
              <div className="mt-3 flex justify-center">
                <div className="border border-red-500 bg-red-50 p-2 rounded text-[10px] text-left space-y-0.5 text-red-900 inline-block">
                  <div className="flex items-center gap-1 font-bold text-red-700">
                    <ShieldCheck className="size-3.5" />
                    <span>ĐÃ KÝ SỐ CÔNG VỤ</span>
                  </div>
                  <div>SỞ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI</div>
                  <div className="font-mono text-[9px] text-gray-600">
                    Ký ngày: 15/07/{now.getFullYear()}
                  </div>
                </div>
              </div>
              <div className="mt-2 font-bold uppercase text-gray-900">TS. Nguyễn Văn Hùng</div>
              <div className="text-[11px] text-gray-600">Giám đốc Sở</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

