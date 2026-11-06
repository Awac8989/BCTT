import { useState, useMemo } from "react";
import {
  MapPin,
  Compass,
  Star,
  Users,
  Clock,
  Phone,
  QrCode,
  ExternalLink,
  Navigation,
  Sparkles,
  Info,
  Map as MapIcon,
  LayoutGrid,
} from "lucide-react";
import { type GisDiaDiemVanHoaItem } from "@/data/domain-mock";
import { MapTilerGisView, type GisMarkerItem } from "@/components/map/MapTilerGisView";

interface GisBanDoVanHoaTabProps {
  diaDiemList: GisDiaDiemVanHoaItem[];
  onOpenQrModal?: (url: string, tenDiaDiem: string) => void;
}

export function GisBanDoVanHoaTab({
  diaDiemList,
  onOpenQrModal,
}: GisBanDoVanHoaTabProps) {
  const [selectedLoaiHinh, setSelectedLoaiHinh] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState<GisDiaDiemVanHoaItem>(
    diaDiemList[0] || ({} as GisDiaDiemVanHoaItem)
  );
  const [viewMode, setViewMode] = useState<"MAP" | "GRID">("MAP");

  const filtered = useMemo(() => {
    return diaDiemList.filter((d) => {
      if (selectedLoaiHinh === "ALL") return true;
      return d.loaiHinh === selectedLoaiHinh;
    });
  }, [diaDiemList, selectedLoaiHinh]);

  // Transform diaDiemList to GisMarkerItem for MapTilerGisView
  const mapMarkers: GisMarkerItem[] = useMemo(() => {
    return filtered.map((d) => {
      let category: GisMarkerItem["category"] = "DI_TICH";
      let categoryLabel = "Di tích Lịch sử";

      if (d.loaiHinh === "DI_SAN_VAN_HOA") {
        category = "DI_TICH";
        categoryLabel = "Di sản Văn hóa";
      } else if (d.loaiHinh === "CO_SO_TON_GIAO") {
        category = "TON_GIAO";
        categoryLabel = "Cơ sở Tôn giáo";
      } else if (d.loaiHinh === "LANG_NGHE") {
        category = "LANG_NGHE";
        categoryLabel = "Làng nghề thủ công";
      } else if (d.loaiHinh === "DIEM_DU_LICH_CHECKIN") {
        category = "CHECKIN";
        categoryLabel = "Điểm du lịch & Thắng cảnh";
      }

      return {
        id: d.id,
        lat: d.toaDo?.lat || 10.9805,
        lng: d.toaDo?.lng || 106.6543,
        title: d.tenDiaDiem,
        category,
        categoryLabel,
        address: d.diaChi,
        phone: d.soDienThoai,
        openHours: d.gioMoCua,
        description: d.moTaNgan,
        rating: d.danhGiaSao,
        qrUrl: d.qrAudioGuideUrl,
      };
    });
  }, [filtered]);

  const handleSelectFromMap = (marker: GisMarkerItem) => {
    const found = diaDiemList.find((d) => d.id === marker.id);
    if (found) {
      setSelectedItem(found);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Bản đồ Số GIS Văn hóa, Di sản & Du lịch Thủ Dầu Một
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Hệ thống định vị tọa độ GPS trên nền MapTiler Cloud, số hóa tuyến du lịch di sản, thuyết minh Audio Guide & tiện ích cộng đồng
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Switch View Mode */}
          <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode("MAP")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === "MAP"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Bản đồ MapTiler</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("GRID")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === "GRID"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Danh sách ({filtered.length})</span>
            </button>
          </div>

          {/* Filter categories */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedLoaiHinh("ALL")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                selectedLoaiHinh === "ALL"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              Tất cả ({diaDiemList.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedLoaiHinh("DI_SAN_VAN_HOA")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                selectedLoaiHinh === "DI_SAN_VAN_HOA"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              Chùa Bà
            </button>
            <button
              type="button"
              onClick={() => setSelectedLoaiHinh("DI_TICH_LICH_SU")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                selectedLoaiHinh === "DI_TICH_LICH_SU"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              Di tích
            </button>
            <button
              type="button"
              onClick={() => setSelectedLoaiHinh("LANG_NGHE")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                selectedLoaiHinh === "LANG_NGHE"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              Làng nghề
            </button>
          </div>
        </div>
      </div>

      {/* Main Map View & Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Interactive Map or Grid */}
        <div className="lg:col-span-8 flex flex-col min-h-[500px]">
          {viewMode === "MAP" ? (
            <MapTilerGisView
              center={[10.9805, 106.6543]}
              zoom={15}
              height="540px"
              markers={mapMarkers}
              selectedMarkerId={selectedItem?.id}
              onSelectMarker={handleSelectFromMap}
              title="Bản Đồ Số GIS Di Tích, Tôn Giáo & Làng Nghề TP. Thủ Dầu Một"
              subtitle="Tích hợp nền tảng MapTiler Cloud Key: t9C3...jM45 · Tự động đồng bộ vệ tinh và đường phố"
            />
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/40 border-blue-400 ring-2 ring-blue-300 shadow-md"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {item.loaiHinh}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{item.danhGiaSao}</span>
                      </div>
                    </div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100">{item.tenDiaDiem}</h5>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{item.diaChi}</span>
                    </p>
                    <div className="text-[11px] text-slate-400 mt-2">
                      Khách tham quan: {item.luotKhachThang.toLocaleString("vi-VN")} lượt/tháng
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Marker Details Card */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          {selectedItem && selectedItem.id ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-900 mb-1.5">
                    {selectedItem.loaiHinh}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {selectedItem.tenDiaDiem}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{selectedItem.diaChi}</span>
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 px-2.5 py-1 rounded-xl text-center flex-shrink-0">
                  <div className="flex items-center gap-1 font-bold text-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {selectedItem.danhGiaSao}
                  </div>
                  <div className="text-[10px]">Đánh giá</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                {selectedItem.moTaNgan}
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    Thời gian mở cửa:
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedItem.gioMoCua}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-500" />
                    Lượt khách bình quân:
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {selectedItem.luotKhachThang.toLocaleString("vi-VN")} lượt/tháng
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-purple-500" />
                    Hotline hướng dẫn:
                  </span>
                  <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">
                    {selectedItem.soDienThoai}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-500" />
                    Tọa độ GPS:
                  </span>
                  <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    {selectedItem.toaDo?.lat}, {selectedItem.toaDo?.lng}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedItem.toaDo?.lat},${selectedItem.toaDo?.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Chỉ đường</span>
                </a>
                <button
                  type="button"
                  onClick={() =>
                    onOpenQrModal?.(selectedItem.qrAudioGuideUrl, selectedItem.tenDiaDiem)
                  }
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Audio Guide</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              Chọn một địa điểm trên bản đồ để xem chi tiết
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
