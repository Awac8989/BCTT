import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Compass,
  Search,
  Flame,
  Heart,
  MapPin,
  Sparkles,
  Info,
  Filter,
  CheckCircle2,
  AlertCircle,
  Building,
  Flag,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useAppState, appStore } from "@/services/app-state";
import { type MoLietSiItem } from "@/data/mock";

export const Route = createFileRoute("/nghia-trang")({
  head: () => ({
    meta: [
      {
        title:
          "Bản đồ số Nghĩa trang Liệt sĩ & Tra cứu vị trí mộ (GIS) · SLĐTBXH Bình Dương",
      },
      {
        name: "description",
        content:
          "Hệ thống số hóa sơ đồ phân lô, hàng và tra cứu vị trí mộ liệt sĩ trực tuyến tại Nghĩa trang Liệt sĩ tỉnh Bình Dương.",
      },
    ],
  }),
  component: NghiaTrangPage,
});

function NghiaTrangPage() {
  const { moLietSiList } = useAppState();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKhu, setSelectedKhu] = useState<string>("ALL");
  const [selectedTinhTrang, setSelectedTinhTrang] = useState<string>("ALL");
  const [selectedMo, setSelectedMo] = useState<MoLietSiItem | null>(moLietSiList[0] || null);
  const [isBurningIncense, setIsBurningIncense] = useState(false);

  // Thống kê
  const stats = useMemo(() => {
    const total = moLietSiList.length;
    const daXacDinh = moLietSiList.filter((m) => m.tinhTrangMo === "ĐÃ_XÁC_ĐỊNH").length;
    const chuaXacDinh = moLietSiList.filter((m) => m.tinhTrangMo === "CHƯA_XÁC_ĐỊNH_DANH_TÍNH").length;
    const tongLuotVieng = moLietSiList.reduce((acc, m) => acc + m.luotThapHuong, 0);
    return { total, daXacDinh, chuaXacDinh, tongLuotVieng };
  }, [moLietSiList]);

  // Lọc danh sách
  const filteredList = useMemo(() => {
    return moLietSiList.filter((m) => {
      if (selectedKhu !== "ALL" && m.khu !== selectedKhu) return false;
      if (selectedTinhTrang !== "ALL" && m.tinhTrangMo !== selectedTinhTrang) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          m.hoTen.toLowerCase().includes(q) ||
          (m.biDanh && m.biDanh.toLowerCase().includes(q)) ||
          m.soMo.toLowerCase().includes(q) ||
          m.queQuan.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [moLietSiList, selectedKhu, selectedTinhTrang, searchQuery]);

  const handleSelectMo = (mo: MoLietSiItem) => {
    setSelectedMo(mo);
  };

  const handleThapHuong = (moId: string) => {
    setIsBurningIncense(true);
    appStore.thapHuongMoLietSi(moId);
    if (selectedMo && selectedMo.id === moId) {
      setSelectedMo({
        ...selectedMo,
        luotThapHuong: selectedMo.luotThapHuong + 1,
      });
    }
    toast.success("Đã thắp một nén hương lòng tri ân tưởng niệm Liệt sĩ!");
    setTimeout(() => setIsBurningIncense(false), 2000);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Phân hệ Đền ơn đáp nghĩa & Chuyển đổi số Di tích lịch sử"
        title="Bản đồ số nghĩa trang & Tra cứu vị trí mộ liệt sĩ (GIS)"
        right={
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded font-semibold text-xs flex items-center gap-1.5 shadow-xs">
              <Flame className="size-3.5 text-amber-600" />
              Tổng lượt thắp hương tri ân: <strong>{stats.tongLuotVieng.toLocaleString("vi-VN")}</strong>
            </span>
          </div>
        }
      />

      <div className="p-4 sm:p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 font-medium">Quy mô mộ liệt sĩ số hóa</div>
              <div className="text-2xl font-black text-gray-900 font-mono mt-0.5">
                5.420 <span className="text-xs font-normal text-gray-500">phần mộ</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">Nghĩa trang Liệt sĩ tỉnh Bình Dương</div>
            </div>
            <div className="size-11 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-[#3c8dbc]">
              <Compass className="size-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-emerald-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs text-emerald-700 font-semibold">Đã xác định đầy đủ danh tính</div>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
                4.180 <span className="text-xs font-normal text-gray-500">mộ (77.1%)</span>
              </div>
              <div className="text-[11px] text-emerald-600 mt-1">Đầy đủ quê quán, thời kỳ hy sinh</div>
            </div>
            <div className="size-11 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="size-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs text-amber-700 font-semibold">Chưa xác định được danh tính</div>
              <div className="text-2xl font-black text-amber-700 font-mono mt-0.5">
                1.240 <span className="text-xs font-normal text-gray-500">mộ</span>
              </div>
              <div className="text-[11px] text-amber-600 mt-1">Đang giám định ADN & tra cứu thân nhân</div>
            </div>
            <div className="size-11 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <AlertCircle className="size-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-red-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs text-[#dd4b39] font-semibold">Tưởng niệm trực tuyến</div>
              <div className="text-2xl font-black text-[#dd4b39] font-mono mt-0.5">
                {stats.tongLuotVieng} <span className="text-xs font-normal text-gray-500">lượt</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">Thân nhân và đồng bào cả nước dâng hương</div>
            </div>
            <div className="size-11 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-[#dd4b39]">
              <Flame className="size-6 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Thanh tìm kiếm & lọc */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên Liệt sĩ (VD: Hồ Văn Lên, Hai Tiết), Số mộ, Quê quán..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-xs focus:border-[#3c8dbc] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 font-semibold">Khu vực nghĩa trang:</span>
              <select
                value={selectedKhu}
                onChange={(e) => setSelectedKhu(e.target.value)}
                className="border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#3c8dbc] focus:outline-none"
              >
                <option value="ALL">-- Tất cả các khu (A, B, C, D) --</option>
                <option value="Khu A">Khu A - Lão thành cách mạng & Lãnh đạo</option>
                <option value="Khu B">Khu B - Liệt sĩ vô danh / Chưa rõ danh tính</option>
                <option value="Khu C">Khu C - Anh hùng LLVT & Liệt sĩ kháng Mỹ</option>
                <option value="Khu D">Khu D - Liệt sĩ kháng Pháp & Biên giới</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 font-semibold">Tình trạng thông tin:</span>
              <select
                value={selectedTinhTrang}
                onChange={(e) => setSelectedTinhTrang(e.target.value)}
                className="border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:border-[#3c8dbc] focus:outline-none"
              >
                <option value="ALL">-- Tất cả tình trạng --</option>
                <option value="ĐÃ_XÁC_ĐỊNH">Đã xác định danh tính</option>
                <option value="CHƯA_XÁC_ĐỊNH_DANH_TÍNH">Chưa xác định danh tính</option>
                <option value="ĐÃ_CẤT_BỐC">Đã cất bốc về quê hương</option>
              </select>
            </div>
          </div>
        </div>

        {/* Khung chính: Bản đồ tương tác SVG bên trái + Thẻ chi tiết bia mộ bên phải */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột 1 & 2: Sơ đồ tương tác Nghĩa trang */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Flag className="size-4 text-red-600" />
                <h3 className="font-bold text-xs uppercase text-gray-800">
                  Sơ Đồ Phân Lô Thực Địa Nghĩa Trang Liệt Sĩ Tỉnh Bình Dương
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="size-2.5 rounded-full bg-red-600 inline-block" /> Khu A
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2.5 rounded-full bg-amber-500 inline-block" /> Khu B
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2.5 rounded-full bg-emerald-600 inline-block" /> Khu C
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2.5 rounded-full bg-sky-600 inline-block" /> Khu D
                </span>
              </div>
            </div>

            {/* Sơ đồ trực quan (Interactive SVG Map) */}
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gradient-to-b from-amber-50/20 via-emerald-50/10 to-gray-50 min-h-[420px] overflow-hidden select-none">
              {/* Tượng đài Tổ quốc ghi công ở đỉnh */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 text-center z-10">
                <div className="px-3 py-1.5 bg-[#c82333] text-white rounded-md shadow-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-amber-400">
                  <Sparkles className="size-3 text-amber-300" />
                  Tượng Đài Tổ Quốc Ghi Công
                </div>
                <div className="w-1 h-6 bg-red-700 mx-auto" />
              </div>

              {/* Nhà bia tưởng niệm */}
              <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center z-10">
                <div className="px-2.5 py-1 bg-amber-600 text-white rounded shadow text-[10px] font-semibold">
                  Nhà Bia Tưởng Niệm Trung Tâm
                </div>
              </div>

              {/* 4 Khu vực nghĩa trang dạng khối lưới trực quan */}
              <div className="mt-28 grid grid-cols-2 gap-4">
                {/* Khu A */}
                <div className="border border-red-200 bg-red-50/40 rounded-lg p-3 relative">
                  <div className="font-bold text-[11px] text-red-800 uppercase mb-2 flex items-center justify-between">
                    <span>KHU A · Lão thành & Lãnh đạo</span>
                    <span className="text-[10px] bg-red-100 text-red-900 px-1.5 py-0.2 rounded">Hàng 1 - 5</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {moLietSiList
                      .filter((m) => m.khu === "Khu A")
                      .map((mo) => {
                        const isSelected = selectedMo?.id === mo.id;
                        return (
                          <button
                            type="button"
                            key={mo.id}
                            onClick={() => handleSelectMo(mo)}
                            className={`p-2 rounded border text-center transition-all cursor-pointer ${
                              isSelected
                                ? "bg-red-600 text-white border-red-700 shadow-md scale-105 ring-2 ring-amber-300"
                                : "bg-white hover:bg-red-100 text-gray-800 border-red-200"
                            }`}
                          >
                            <div className="text-[10px] font-black font-mono">{mo.soMo}</div>
                            <div className="text-[10px] font-semibold truncate">{mo.hoTen}</div>
                            <div className="text-[9px] opacity-80">{mo.namSinh}</div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Khu B */}
                <div className="border border-amber-200 bg-amber-50/40 rounded-lg p-3 relative">
                  <div className="font-bold text-[11px] text-amber-800 uppercase mb-2 flex items-center justify-between">
                    <span>KHU B · Chưa rõ danh tính</span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">Hàng 6 - 10</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {moLietSiList
                      .filter((m) => m.khu === "Khu B")
                      .map((mo) => {
                        const isSelected = selectedMo?.id === mo.id;
                        return (
                          <button
                            type="button"
                            key={mo.id}
                            onClick={() => handleSelectMo(mo)}
                            className={`p-2 rounded border text-center transition-all cursor-pointer ${
                              isSelected
                                ? "bg-amber-600 text-white border-amber-700 shadow-md scale-105 ring-2 ring-red-400"
                                : "bg-white hover:bg-amber-100 text-gray-800 border-amber-200"
                            }`}
                          >
                            <div className="text-[10px] font-black font-mono">{mo.soMo}</div>
                            <div className="text-[10px] font-semibold truncate">{mo.hoTen}</div>
                            <div className="text-[9px] opacity-80">{mo.tinhTrangMo === "CHƯA_XÁC_ĐỊNH_DANH_TÍNH" ? "Chưa rõ" : mo.namSinh}</div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Khu C */}
                <div className="border border-emerald-200 bg-emerald-50/40 rounded-lg p-3 relative">
                  <div className="font-bold text-[11px] text-emerald-800 uppercase mb-2 flex items-center justify-between">
                    <span>KHU C · Liệt sĩ Kháng Mỹ & AH LLVT</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded">Hàng 11 - 15</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {moLietSiList
                      .filter((m) => m.khu === "Khu C")
                      .map((mo) => {
                        const isSelected = selectedMo?.id === mo.id;
                        return (
                          <button
                            type="button"
                            key={mo.id}
                            onClick={() => handleSelectMo(mo)}
                            className={`p-2 rounded border text-center transition-all cursor-pointer ${
                              isSelected
                                ? "bg-emerald-600 text-white border-emerald-700 shadow-md scale-105 ring-2 ring-amber-300"
                                : "bg-white hover:bg-emerald-100 text-gray-800 border-emerald-200"
                            }`}
                          >
                            <div className="text-[10px] font-black font-mono">{mo.soMo}</div>
                            <div className="text-[10px] font-semibold truncate">{mo.hoTen}</div>
                            <div className="text-[9px] opacity-80">{mo.namSinh}</div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Khu D */}
                <div className="border border-sky-200 bg-sky-50/40 rounded-lg p-3 relative">
                  <div className="font-bold text-[11px] text-sky-800 uppercase mb-2 flex items-center justify-between">
                    <span>KHU D · Liệt sĩ Kháng Pháp & Biên Giới</span>
                    <span className="text-[10px] bg-sky-100 text-sky-900 px-1.5 py-0.2 rounded">Hàng 16 - 20</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {moLietSiList
                      .filter((m) => m.khu === "Khu D")
                      .map((mo) => {
                        const isSelected = selectedMo?.id === mo.id;
                        return (
                          <button
                            type="button"
                            key={mo.id}
                            onClick={() => handleSelectMo(mo)}
                            className={`p-2 rounded border text-center transition-all cursor-pointer ${
                              isSelected
                                ? "bg-sky-600 text-white border-sky-700 shadow-md scale-105 ring-2 ring-amber-300"
                                : "bg-white hover:bg-sky-100 text-gray-800 border-sky-200"
                            }`}
                          >
                            <div className="text-[10px] font-black font-mono">{mo.soMo}</div>
                            <div className="text-[10px] font-semibold truncate">{mo.hoTen}</div>
                            <div className="text-[9px] opacity-80">{mo.namSinh}</div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Cổng chính nghĩa trang ở đáy */}
              <div className="mt-6 text-center">
                <div className="w-1 h-4 bg-gray-400 mx-auto" />
                <div className="inline-block px-4 py-1 bg-gray-800 text-white rounded text-[10px] font-bold uppercase tracking-wider shadow">
                  Cổng Chính · Nghĩa Trang Liệt Sĩ Tỉnh Bình Dương (Quốc lộ 13)
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 rounded border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <Info className="size-4 text-amber-600 shrink-0" />
              <span>
                Nhấp chuột vào từng ngôi mộ trên bản đồ để tra cứu trích lục lý lịch liệt sĩ hoặc
                dâng hoa, thắp nén hương tri ân trực tuyến.
              </span>
            </div>
          </div>

          {/* Cột 3: Thẻ chi tiết Bia mộ & Tưởng niệm */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-5 flex flex-col justify-between">
            {selectedMo ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-red-600 inline-block" />
                    <h3 className="font-bold text-xs uppercase text-gray-800">
                      Chi Tiết Bia Mộ Liệt Sĩ {selectedMo.soMo}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-mono font-bold">
                    {selectedMo.khu} · Hàng {selectedMo.hang}
                  </span>
                </div>

                {/* Hình ảnh mô phỏng bia mộ đá hoa cương */}
                <div className="relative bg-gradient-to-b from-stone-800 to-stone-950 text-stone-100 p-5 rounded-lg border-4 border-stone-700 shadow-lg text-center font-serif">
                  {/* Ngôi sao vàng trên bia đá */}
                  <div className="size-8 rounded-full bg-amber-400 mx-auto mb-2 flex items-center justify-center text-red-700 shadow-xs">
                    ★
                  </div>

                  <div className="text-[10px] uppercase font-bold tracking-widest text-amber-300 mb-1">
                    LIỆT SĨ
                  </div>

                  <h2 className="text-lg font-bold text-white tracking-wide uppercase">
                    {selectedMo.hoTen}
                  </h2>

                  {selectedMo.biDanh && (
                    <div className="text-xs italic text-stone-300">
                      Bí danh: {selectedMo.biDanh}
                    </div>
                  )}

                  <div className="h-px w-24 bg-amber-400/50 mx-auto my-3" />

                  <div className="text-xs space-y-1 text-stone-200 font-sans">
                    <div>
                      Sinh năm: <strong className="text-amber-200">{selectedMo.namSinh}</strong>
                    </div>
                    <div>
                      Hy sinh ngày:{" "}
                      <strong className="text-amber-200">{selectedMo.ngayHySinh}</strong>
                    </div>
                    <div className="text-[11px] text-stone-300 mt-2 line-clamp-2">
                      Quê quán: {selectedMo.queQuan}
                    </div>
                    {selectedMo.chucVu && (
                      <div className="text-[11px] text-stone-400 italic">
                        {selectedMo.chucVu}
                      </div>
                    )}
                  </div>

                  {/* Lư hương thắp nhang ảo */}
                  <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-center gap-2">
                    <Flame
                      className={`size-5 text-amber-400 ${
                        isBurningIncense ? "animate-bounce" : ""
                      }`}
                    />
                    <span className="text-xs text-amber-200 font-mono font-bold">
                      {selectedMo.luotThapHuong} nén hương đã thắp
                    </span>
                  </div>
                </div>

                {/* Bảng thông tin quản lý mộ */}
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Mã định danh mộ:</span>
                    <span className="font-mono font-bold">{selectedMo.soMo}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Tình trạng thông tin:</span>
                    <span
                      className={`font-semibold ${
                        selectedMo.tinhTrangMo === "ĐÃ_XÁC_ĐỊNH"
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }`}
                    >
                      {selectedMo.tinhTrangMo === "ĐÃ_XÁC_ĐỊNH"
                        ? "Đã xác định đầy đủ"
                        : "Chưa xác định danh tính"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Hiện trạng bia mộ:</span>
                    <span className="font-semibold text-gray-800">
                      {selectedMo.tinhTrangBia === "TỐT" ? "Nguyên vẹn, trang nghiêm" : "Cần trùng tu"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Đơn vị khi hy sinh:</span>
                    <span className="font-semibold text-gray-800">
                      {selectedMo.coQuanKhiHySinh || "Bộ CHQS tỉnh Bình Dương"}
                    </span>
                  </div>
                </div>

                {/* Nút hành động dâng hương tri ân */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleThapHuong(selectedMo.id)}
                    className="w-full py-2.5 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-700 hover:to-red-700 text-white rounded font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                  >
                    <Flame className="size-4 text-amber-300" />
                    Thắp Nén Hương / Dâng Hoa Tưởng Niệm Liệt Sĩ
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500 text-xs">
                Chọn một phần mộ trên bản đồ để xem thông tin chi tiết.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
