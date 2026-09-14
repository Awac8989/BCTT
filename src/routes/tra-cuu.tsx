import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  CheckCircle2,
  Clock,
  FileText,
  User,
  CreditCard,
  HeartPulse,
  Printer,
  Star,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Home,
} from "lucide-react";
import { toast } from "sonner";
import { useAppState } from "@/services/app-state";
import { formatVND, type HoSo } from "@/data/mock";

export const Route = createFileRoute("/tra-cuu")({
  head: () => ({
    meta: [
      {
        title:
          "Cổng tra cứu hồ sơ người có công & chính sách ưu đãi trực tuyến · Tỉnh Bình Dương",
      },
      {
        name: "description",
        content:
          "Cổng tra cứu công khai tiến độ hồ sơ Một cửa, lịch phát tiền trợ cấp và chế độ điều dưỡng người có công tỉnh Bình Dương.",
      },
    ],
  }),
  component: TraCuuPublicPage,
});

function maskCCCD(cccd?: string) {
  if (!cccd || cccd.length < 6) return cccd || "---";
  return `${cccd.slice(0, 4)}****${cccd.slice(-3)}`;
}

function TraCuuPublicPage() {
  const { hoSoList, chiTraList, dungCuChinhHinhList } = useAppState();

  const [searchKey, setSearchKey] = useState("074026000123");
  const [searchedHoSo, setSearchedHoSo] = useState<HoSo | null>(
    hoSoList.find((h) => h.cccd === "074026000123") || hoSoList[0] || null
  );
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchKey.trim().toLowerCase();
    if (!q) {
      toast.error("Vui lòng nhập số CCCD hoặc Mã hồ sơ cần tra cứu!");
      return;
    }

    const found = hoSoList.find(
      (h) =>
        h.cccd.toLowerCase() === q ||
        (h.soHoSoTinh && h.soHoSoTinh.toLowerCase() === q) ||
        h.id.toLowerCase() === q ||
        h.hoTen.toLowerCase().includes(q)
    );

    setSearchedHoSo(found || null);
    setHasSearched(true);

    if (found) {
      toast.success(`Đã tìm thấy thông tin hồ sơ của ông/bà ${found.hoTen}`);
    } else {
      toast.error("Không tìm thấy thông tin hồ sơ phù hợp trên cổng dữ liệu!");
    }
  };

  // Chi trả liên quan
  const userChiTra = searchedHoSo
    ? chiTraList.filter(
        (c) => c.hoSoId === searchedHoSo.id || (searchedHoSo.soHoSoTinh && c.soHoSoTinh === searchedHoSo.soHoSoTinh)
      )
    : [];

  // Dụng cụ liên quan
  const userDungCu = searchedHoSo
    ? dungCuChinhHinhList.filter(
        (d) => d.hoSoId === searchedHoSo.id || (searchedHoSo.soHoSoTinh && d.soHoSoTinh === searchedHoSo.soHoSoTinh)
      )
    : [];

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#333333] font-sans antialiased flex flex-col">
      {/* Chỉ đỏ trên cùng */}
      <div className="h-[3px] w-full bg-[#dd4b39]" />

      {/* Top Header Cổng công quyền */}
      <header className="bg-white border-b border-gray-200 py-3 px-4 sm:px-8 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Quốc huy */}
            <div className="size-10 rounded-full bg-[#c82333] border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-xs shrink-0">
              <svg viewBox="0 0 24 24" className="size-5 fill-amber-300" aria-label="Quốc huy">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-bold uppercase text-[#c82333] tracking-tight">
                CỔNG DỊCH VỤ CÔNG TRỰC TUYẾN · TỈNH BÌNH DƯƠNG
              </div>
              <h1 className="text-sm sm:text-base font-extrabold text-gray-900 leading-tight">
                Hệ thống Tra cứu Hồ sơ Người có công & Chế độ Chính sách
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-semibold border border-gray-300 transition-colors hidden sm:inline-block"
            >
              Dành cho Cán bộ
            </Link>
            <Link
              to="/"
              className="px-3 py-1.5 bg-[#dd4b39] hover:bg-[#c82333] text-white rounded text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
            >
              <Home className="size-3.5" />
              Trang chủ
            </Link>
          </div>
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-6 flex-1">
        {/* Banner tra cứu */}
        <div className="bg-gradient-to-r from-[#dd4b39] to-red-800 text-white rounded-xl p-6 sm:p-8 shadow-md">
          <div className="max-w-2xl">
            <span className="px-2.5 py-0.5 bg-amber-400 text-red-950 font-bold text-[10px] rounded uppercase tracking-wide">
              Đề án 06 · Tiện ích phục vụ công dân & thân nhân
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-2 leading-tight">
              Tra Cứu Hồ Sơ & Lịch Phát Tiền Trợ Cấp Trực Tuyến
            </h2>
            <p className="text-xs sm:text-sm text-white/90 mt-1.5 leading-relaxed">
              Nhập số Căn cước công dân (CCCD) hoặc Mã số hồ sơ trên Giấy tiếp nhận Một cửa để theo
              dõi tiến độ giải quyết và thông tin chi trả trợ cấp hàng tháng.
            </p>

            {/* Form tra cứu */}
            <form onSubmit={handleSearch} className="mt-5 flex gap-2 flex-col sm:flex-row">
              <div className="relative flex-1">
                <Search className="size-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  placeholder="Nhập CCCD (12 số) hoặc Mã hồ sơ (VD: 074026000123, BD/16720-1)..."
                  className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 rounded-lg text-sm font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-red-950 font-extrabold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Search className="size-4" />
                Tra cứu ngay
              </button>
            </form>

            {/* Gợi ý tra cứu nhanh */}
            <div className="mt-3 flex items-center gap-2 text-xs text-white/80 flex-wrap">
              <span>Gợi ý thử nhanh:</span>
              <button
                type="button"
                onClick={() => setSearchKey("074026000123")}
                className="underline hover:text-amber-200 font-mono"
              >
                074026000123 (Liệt sĩ Hồ Văn Lên)
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setSearchKey("074052007788")}
                className="underline hover:text-amber-200 font-mono"
              >
                074052007788 (TB Nguyễn Văn Thành)
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setSearchKey("BD/16720-1")}
                className="underline hover:text-amber-200 font-mono"
              >
                BD/16720-1 (Thân nhân liệt sĩ)
              </button>
            </div>
          </div>
        </div>

        {/* Kết quả tra cứu */}
        {hasSearched && searchedHoSo ? (
          <div className="space-y-6">
            {/* Thẻ Định danh & Trạng thái hồ sơ */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div className="flex items-start gap-4">
                  <div className="size-14 rounded-full bg-red-100 border border-red-200 text-[#dd4b39] flex items-center justify-center font-black text-xl shrink-0">
                    {searchedHoSo.hoTen.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900">{searchedHoSo.hoTen}</h3>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        Hồ sơ hợp lệ
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1 flex items-center gap-4 flex-wrap">
                      <span>
                        Diện chính sách:{" "}
                        <strong className="text-[#3c8dbc]">{searchedHoSo.loaiDoiTuong}</strong>
                      </span>
                      <span>
                        Số định danh CCCD:{" "}
                        <strong className="font-mono">{maskCCCD(searchedHoSo.cccd)}</strong>
                      </span>
                      <span>
                        Mã số Tỉnh quản lý:{" "}
                        <strong className="font-mono">{searchedHoSo.soHoSoTinh || searchedHoSo.id}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link
                    to="/khao-sat"
                    search={{ maHoSo: searchedHoSo.soHoSoTinh || searchedHoSo.id, hoTen: searchedHoSo.hoTen } as any}
                    className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Star className="size-3.5 text-amber-500 fill-amber-400" />
                    Đánh giá dịch vụ công
                  </Link>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-semibold text-xs border border-gray-300 flex items-center gap-1"
                  >
                    <Printer className="size-3.5" />
                    In kết quả
                  </button>
                </div>
              </div>

              {/* Chi tiết nhân thân & địa bàn */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 text-xs">
                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                  <span className="text-gray-500 block">Năm sinh / Tuổi:</span>
                  <span className="font-bold text-gray-800 text-sm mt-0.5 block">
                    {searchedHoSo.namSinh || "1926"} ({searchedHoSo.gioiTinh})
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                  <span className="text-gray-500 block">Địa bàn hành chính:</span>
                  <span className="font-bold text-gray-800 text-sm mt-0.5 block">
                    {searchedHoSo.phuong}, {searchedHoSo.huyen || "TP. Thủ Dầu Một"}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                  <span className="text-gray-500 block">Thẻ BHYT ưu đãi:</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm mt-0.5 block">
                    {searchedHoSo.soBhyt || "CC4740001889"}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                  <span className="text-gray-500 block">Mức trợ cấp hàng tháng:</span>
                  <span className="font-mono font-bold text-red-600 text-sm mt-0.5 block">
                    {formatVND(searchedHoSo.mucTroCap + searchedHoSo.phuCapPhucVu)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tiến trình thụ lý hồ sơ Một cửa (Timeline 5 bước) */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6">
              <h4 className="font-bold text-sm uppercase text-gray-800 flex items-center gap-2 mb-4">
                <Clock className="size-4 text-[#3c8dbc]" />
                Tiến trình giải quyết thủ tục hành chính (Quy chế Một cửa)
              </h4>

              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-2">
                {/* 5 bước */}
                {[
                  { buoc: 1, ten: "Tiếp nhận hồ sơ", ngay: "20/08/2026", status: "HOAN_THANH" },
                  { buoc: 2, ten: "Thẩm tra y khoa / Thực địa", ngay: "25/08/2026", status: "HOAN_THANH" },
                  { buoc: 3, ten: "Xác định mức trợ cấp (NĐ 75)", ngay: "28/08/2026", status: "HOAN_THANH" },
                  { buoc: 4, ten: "Lãnh đạo ký Quyết định", ngay: "01/09/2026", status: "HOAN_THANH" },
                  { buoc: 5, ten: "Đã chi trả & Cấp thẻ BHYT", ngay: "05/09/2026", status: "HOAN_THANH" },
                ].map((step, idx) => (
                  <div key={step.buoc} className="flex md:flex-col items-center gap-3 md:gap-2 flex-1 text-left md:text-center">
                    <div className="size-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-900">{step.ten}</div>
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5">{step.ngay}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lịch sử chi trả tiền trợ cấp gần nhất */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6">
              <h4 className="font-bold text-sm uppercase text-gray-800 flex items-center gap-2 mb-3">
                <CreditCard className="size-4 text-emerald-600" />
                Lịch sử phát tiền trợ cấp ưu đãi (Kỳ gần nhất)
              </h4>

              {userChiTra.length > 0 ? (
                <div className="border border-gray-200 rounded overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="p-3">Kỳ chi trả</th>
                        <th className="p-3">Nội dung chế độ</th>
                        <th className="p-3 text-right">Số tiền nhận</th>
                        <th className="p-3">Kênh nhận tiền</th>
                        <th className="p-3 text-center">Trạng thái phát tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {userChiTra.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="p-3 font-mono font-bold text-gray-800">{item.kyChiTra}</td>
                          <td className="p-3 font-medium text-gray-900">{item.tenCheDo}</td>
                          <td className="p-3 text-right font-mono font-bold text-red-600 text-sm">
                            {formatVND(item.soTien)}
                          </td>
                          <td className="p-3 text-gray-700">
                            {item.hinhThuc === "NGAN_HANG" ? (
                              <span>
                                Chuyển khoản: <strong>{item.thongTinChiTra}</strong>
                              </span>
                            ) : (
                              <span>
                                Tiền mặt: <strong>{item.thongTinChiTra}</strong>
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {item.trangThai === "ĐÃ_CHI_TRẢ" ? (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                                Đã phát ngày {item.ngayChiTra || "05/09/2026"}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                                Đang chuyển khoản
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 bg-gray-50 rounded border border-gray-200 text-xs text-center text-gray-600">
                  Chế độ của ông/bà đã được cấp Giấy chứng nhận và bảo hiểm y tế toàn phần.
                </div>
              )}
            </div>

            {/* Chế độ phương tiện trợ giúp / Dụng cụ chỉnh hình nếu có */}
            {userDungCu.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6">
                <h4 className="font-bold text-sm uppercase text-gray-800 flex items-center gap-2 mb-3">
                  <HeartPulse className="size-4 text-[#dd4b39]" />
                  Chế độ trang cấp phương tiện trợ giúp & Dụng cụ chỉnh hình
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {userDungCu.map((dc) => (
                    <div key={dc.id} className="p-3 bg-sky-50/60 rounded border border-sky-200">
                      <div className="font-bold text-sm text-gray-900">{dc.tenDungCu}</div>
                      <div className="text-gray-600 mt-1">
                        Niên hạn: <strong>{dc.nienHanNam} năm</strong> · Năm cấp gần nhất:{" "}
                        <strong>{dc.namCapGanNhat}</strong>
                      </div>
                      <div className="text-red-700 font-semibold mt-1">
                        Hạn cấp mới lần tiếp theo: <strong>Năm {dc.namDenHanCapMoi}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : hasSearched ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-12 text-center text-gray-500 space-y-3">
            <AlertCircle className="size-12 text-gray-400 mx-auto" />
            <h3 className="font-bold text-base text-gray-800">
              Không tìm thấy kết quả phù hợp với từ khóa "{searchKey}"
            </h3>
            <p className="text-xs max-w-md mx-auto">
              Vui lòng kiểm tra lại chính xác 12 chữ số trên Căn cước công dân hoặc Số hồ sơ được in
              trên Giấy tiếp nhận Một cửa.
            </p>
          </div>
        ) : null}
      </main>

      {/* Footer công quyền */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4 text-center text-xs text-gray-500 space-y-1">
        <p className="font-bold text-gray-700">
          CỔNG DỊCH VỤ CÔNG TRỰC TUYẾN · SỞ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI TỈNH BÌNH DƯƠNG
        </p>
        <p>Địa chỉ: Tầng 6, Tháp B, Tòa nhà Trung tâm Hành chính tỉnh Bình Dương</p>
        <p className="text-[11px] text-gray-400 font-mono">
          Bản quyền phần mềm thuộc đề tài Báo cáo thực tập tốt nghiệp · Phiên bản 2.0
        </p>
      </footer>
    </div>
  );
}
