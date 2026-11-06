import { useEffect, useRef, useState, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import {
  Layers,
  Maximize2,
  Minimize2,
  Navigation,
  Compass,
  MapPin,
  Search,
  ExternalLink,
  Phone,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronRight,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  Key,
} from "lucide-react";
import { toast } from "sonner";

export interface GisMarkerItem {
  id: string;
  lat: number;
  lng: number;
  title: string;
  category: "DI_TICH" | "TON_GIAO" | "LANG_NGHE" | "CHECKIN" | "NGHIA_TRANG" | "NHA_BIA_KHU_PHO" | "MO_LIET_SI" | "AN_SINH" | "HANH_CHINH";
  categoryLabel?: string;
  address?: string;
  phone?: string;
  openHours?: string;
  description?: string;
  imageUrl?: string;
  badge?: string;
  badgeColor?: string;
  rating?: number;
  qrUrl?: string;
  extraMeta?: Record<string, any>;
}

export interface MapTilerGisViewProps {
  center?: [number, number];
  zoom?: number;
  markers?: GisMarkerItem[];
  selectedMarkerId?: string;
  onSelectMarker?: (marker: GisMarkerItem) => void;
  height?: string | number;
  className?: string;
  showCategoryFilters?: boolean;
  showSearchBar?: boolean;
  title?: string;
  subtitle?: string;
  customOverlay?: React.ReactNode;
}

export const DEFAULT_MAPTILER_API_KEY = "t9C3Clow77qjvK7KjM45";

type MapStyleKey = "esri_streets" | "esri_satellite" | "osm" | "maptiler_streets" | "maptiler_hybrid";

interface MapStyleConfig {
  id: MapStyleKey;
  label: string;
  sublabel: string;
  icon: string;
  getUrl: (key: string) => string;
  attribution: string;
  maxZoom: number;
}

const MAP_STYLES: Record<MapStyleKey, MapStyleConfig> = {
  esri_streets: {
    id: "esri_streets",
    label: "Bản đồ Đô thị Chuẩn",
    sublabel: "Đường phố & Giao thông ArcGIS",
    icon: "🗺️",
    getUrl: () => "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/" target="_blank">Esri</a> &copy; OpenStreetMap contributors',
    maxZoom: 19,
  },
  esri_satellite: {
    id: "esri_satellite",
    label: "Bản đồ Vệ tinh Siêu nét",
    sublabel: "Ảnh vệ tinh độ nét cao ArcGIS",
    icon: "🛰️",
    getUrl: () => "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/" target="_blank">Esri</a> &mdash; Maxar, Earthstar Geographics',
    maxZoom: 19,
  },
  osm: {
    id: "osm",
    label: "OpenStreetMap Quốc tế",
    sublabel: "Bản đồ mở cộng đồng toàn cầu",
    icon: "🧭",
    getUrl: () => "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  maptiler_streets: {
    id: "maptiler_streets",
    label: "MapTiler Streets v2",
    sublabel: "Vector Tiles (Khóa Cloud)",
    icon: "🌐",
    getUrl: (key) => `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`,
    attribution: '&copy; <a href="https://www.maptiler.com/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    maxZoom: 20,
  },
  maptiler_hybrid: {
    id: "maptiler_hybrid",
    label: "MapTiler Vệ tinh Hybrid",
    sublabel: "Vệ tinh + Tên đường (Khóa Cloud)",
    icon: "🚀",
    getUrl: (key) => `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${key}`,
    attribution: '&copy; <a href="https://www.maptiler.com/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    maxZoom: 20,
  },
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; pinBg: string; border: string }> = {
  DI_TICH: { bg: "bg-red-50 text-red-700 border-red-200", text: "text-red-700", pinBg: "#dc2626", border: "#991b1b" },
  TON_GIAO: { bg: "bg-amber-50 text-amber-800 border-amber-200", text: "text-amber-700", pinBg: "#d97706", border: "#b45309" },
  LANG_NGHE: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "text-emerald-700", pinBg: "#059669", border: "#047857" },
  CHECKIN: { bg: "bg-sky-50 text-sky-700 border-sky-200", text: "text-sky-700", pinBg: "#0284c7", border: "#0369a1" },
  NGHIA_TRANG: { bg: "bg-rose-50 text-rose-800 border-rose-200", text: "text-rose-700", pinBg: "#e11d48", border: "#be123c" },
  NHA_BIA_KHU_PHO: { bg: "bg-purple-50 text-purple-700 border-purple-200", text: "text-purple-700", pinBg: "#7c3aed", border: "#6d28d9" },
  MO_LIET_SI: { bg: "bg-amber-50 text-amber-900 border-amber-300", text: "text-amber-800", pinBg: "#b45309", border: "#78350f" },
  AN_SINH: { bg: "bg-blue-50 text-blue-700 border-blue-200", text: "text-blue-700", pinBg: "#2563eb", border: "#1d4ed8" },
  HANH_CHINH: { bg: "bg-indigo-50 text-indigo-700 border-indigo-200", text: "text-indigo-700", pinBg: "#4f46e5", border: "#3730a3" },
};

export function MapTilerGisView({
  center = [10.9805, 106.6543], // Phường Thủ Dầu Một, TP. Thủ Dầu Một
  zoom = 15,
  markers = [],
  selectedMarkerId,
  onSelectMarker,
  height = "540px",
  className = "",
  showCategoryFilters = true,
  showSearchBar = true,
  title,
  subtitle,
  customOverlay,
}: MapTilerGisViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const currentTileLayerRef = useRef<any>(null);
  const markerLayersMapRef = useRef<Map<string, any>>(new Map());

  // Default to ESRI Streets for beautiful, crisp, unwatermarked street map
  const [activeStyle, setActiveStyle] = useState<MapStyleKey>("esri_streets");
  const [apiKey, setApiKey] = useState<string>(DEFAULT_MAPTILER_API_KEY);
  const [customKeyInput, setCustomKeyInput] = useState<string>(DEFAULT_MAPTILER_API_KEY);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMarker, setActiveMarker] = useState<GisMarkerItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [layerMenuOpen, setLayerMenuOpen] = useState(false);
  const [keyEditorOpen, setKeyEditorOpen] = useState(false);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(zoom);

  // Sync selected marker from prop
  useEffect(() => {
    if (selectedMarkerId) {
      const found = markers.find((m) => m.id === selectedMarkerId);
      if (found) {
        setActiveMarker(found);
      }
    }
  }, [selectedMarkerId, markers]);

  // Distinct categories from markers
  const categories = useMemo(() => {
    const set = new Set<string>();
    markers.forEach((m) => set.add(m.category));
    return Array.from(set);
  }, [markers]);

  // Filtered markers
  const filteredMarkers = useMemo(() => {
    return markers.filter((m) => {
      const matchCat = selectedCategory === "ALL" || m.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        (m.address && m.address.toLowerCase().includes(q)) ||
        (m.description && m.description.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [markers, selectedCategory, searchQuery]);

  // Initialize Leaflet Map (SSR-Safe)
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = (await import("leaflet")).default;
      if (!isMounted || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false,
        attributionControl: false,
      });

      L.control
        .attribution({
          position: "bottomright",
          prefix: '<span class="text-[10px] text-slate-400 font-medium">Bản đồ số GIS Bình Dương</span>',
        })
        .addTo(map);

      map.on("zoomend", () => {
        if (isMounted) {
          setCurrentZoomLevel(map.getZoom());
        }
      });

      const styleCfg = MAP_STYLES[activeStyle];
      const tileUrl = styleCfg.getUrl(apiKey);
      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: styleCfg.maxZoom,
        attribution: styleCfg.attribution,
        subdomains: "abcd",
      });

      tileLayer.addTo(map);
      currentTileLayerRef.current = tileLayer;
      mapInstanceRef.current = map;
      if (isMounted) setMapLoaded(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Switch Tile Layer when activeStyle or apiKey changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const styleCfg = MAP_STYLES[activeStyle];

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    import("leaflet").then(({ default: L }) => {
      const tileUrl = styleCfg.getUrl(apiKey);
      const newLayer = L.tileLayer(tileUrl, {
        maxZoom: styleCfg.maxZoom,
        attribution: styleCfg.attribution,
        subdomains: "abcd",
      });

      newLayer.addTo(map);
      currentTileLayerRef.current = newLayer;
    });
  }, [activeStyle, apiKey]);

  // Update Markers when filteredMarkers or activeMarker changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const map = mapInstanceRef.current;

    import("leaflet").then(({ default: L }) => {
      // Clear previous markers
      markerLayersMapRef.current.forEach((layer) => {
        map.removeLayer(layer);
      });
      markerLayersMapRef.current.clear();

      // Render new markers
      filteredMarkers.forEach((marker) => {
        const isSelected = activeMarker?.id === marker.id;
        const colorCfg = CATEGORY_COLORS[marker.category] || CATEGORY_COLORS.DI_TICH;

        const pinHtml = `
          <div class="relative group cursor-pointer transition-transform duration-200 ${
            isSelected ? "scale-125 z-50" : "hover:scale-115 z-20"
          }">
            ${
              isSelected
                ? `<div class="absolute -inset-2 rounded-full bg-amber-400/50 animate-ping"></div>`
                : ""
            }
            <div style="background-color: ${colorCfg.pinBg}; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.4);"
                 class="w-8 h-8 rounded-full flex items-center justify-center text-white relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                 style="background-color: ${colorCfg.pinBg};"></div>
            ${
              isSelected
                ? `<div class="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg border border-slate-700 pointer-events-none">
                    ${marker.title.length > 22 ? marker.title.slice(0, 20) + "..." : marker.title}
                  </div>`
                : ""
            }
          </div>
        `;

        const divIcon = L.divIcon({
          className: "custom-gis-marker",
          html: pinHtml,
          iconSize: [32, 40],
          iconAnchor: [16, 36],
          popupAnchor: [0, -36],
        });

        const leafletMarker = L.marker([marker.lat, marker.lng], { icon: divIcon });

        const popupContent = document.createElement("div");
        popupContent.className = "p-1 text-slate-800 text-xs";
        popupContent.innerHTML = `
          <div style="font-weight: 700; font-size: 13px; margin-bottom: 4px; color: #0f172a;">${marker.title}</div>
          ${marker.address ? `<div style="color: #64748b; font-size: 11px; margin-bottom: 4px;">📍 ${marker.address}</div>` : ""}
          ${marker.description ? `<div style="font-size: 11px; color: #334155; line-height: 1.4; margin-bottom: 6px;">${marker.description}</div>` : ""}
          <div style="display: flex; gap: 6px; align-items: center; margin-top: 6px;">
            <a href="https://www.google.com/maps/search/?api=1&query=${marker.lat},${marker.lng}" target="_blank"
               style="background-color: #2563eb; color: #ffffff; padding: 4px 9px; border-radius: 5px; text-decoration: none; font-size: 11px; font-weight: 600;">
              Chỉ đường Google Maps ↗
            </a>
          </div>
        `;

        leafletMarker.bindPopup(popupContent, {
          closeButton: false,
          className: "modern-gis-popup",
        });

        leafletMarker.on("click", () => {
          setActiveMarker(marker);
          if (onSelectMarker) {
            onSelectMarker(marker);
          }
          map.flyTo([marker.lat, marker.lng], Math.max(map.getZoom(), 16), {
            duration: 0.8,
          });
        });

        leafletMarker.addTo(map);
        markerLayersMapRef.current.set(marker.id, leafletMarker);
      });
    });
  }, [filteredMarkers, activeMarker, mapLoaded, onSelectMarker]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(center, zoom, { duration: 1 });
  };

  const handleZoomIn = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomOut();
  };

  const handleSaveApiKey = () => {
    if (customKeyInput.trim()) {
      setApiKey(customKeyInput.trim());
      setKeyEditorOpen(false);
      toast.success("Đã cập nhật mã MapTiler API Key thành công!");
    }
  };

  return (
    <div
      className={`relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/80 shadow-xl flex flex-col ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-none" : ""
      } ${className}`}
      style={{ height: isFullscreen ? "100vh" : height }}
    >
      {/* Top Header Control Bar */}
      <div className="relative z-20 bg-slate-900/95 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              {title || "Bản Đồ Số GIS Phường Thủ Dầu Một & TP. Thủ Dầu Một"}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                MapTiler Cloud Live
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {subtitle || "Tọa độ vệ tinh chuẩn GPS 10.9805° B - 106.6543° Đ · Số hóa không gian đa tầng"}
            </p>
          </div>
        </div>

        {/* Quick Style Switcher & Actions */}
        <div className="flex items-center gap-2">
          {/* Layer switcher button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setLayerMenuOpen(!layerMenuOpen);
                setKeyEditorOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-medium transition cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>{MAP_STYLES[activeStyle].label}</span>
            </button>

            {layerMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-2 z-50 text-xs space-y-1">
                <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Chọn Lớp Bản Đồ Nền</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLayerMenuOpen(false);
                      setKeyEditorOpen(true);
                    }}
                    className="text-blue-400 hover:underline flex items-center gap-1 normal-case font-normal"
                  >
                    <Key className="w-3 h-3" /> Đổi Key
                  </button>
                </div>
                {(Object.keys(MAP_STYLES) as MapStyleKey[]).map((key) => {
                  const cfg = MAP_STYLES[key];
                  const isCurrent = activeStyle === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setActiveStyle(key);
                        setLayerMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition cursor-pointer ${
                        isCurrent
                          ? "bg-blue-600 text-white font-bold"
                          : "text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{cfg.icon}</span>
                        <div>
                          <div>{cfg.label}</div>
                          <div className={`text-[10px] ${isCurrent ? "text-blue-100" : "text-slate-400"}`}>
                            {cfg.sublabel}
                          </div>
                        </div>
                      </div>
                      {isCurrent && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Key Manager Button */}
          <button
            type="button"
            onClick={() => {
              setKeyEditorOpen(!keyEditorOpen);
              setLayerMenuOpen(false);
            }}
            title="Quản lý mã MapTiler API Key"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {/* Reset center */}
          <button
            type="button"
            onClick={handleRecenter}
            title="Đưa về vị trí trung tâm"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* MapTiler API Key Input Popover */}
      {keyEditorOpen && (
        <div className="relative z-30 bg-slate-850 border-b border-slate-700 p-3 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 flex-1 min-w-[300px]">
            <Key className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300 font-semibold whitespace-nowrap">Khóa MapTiler Cloud:</span>
            <input
              type="text"
              value={customKeyInput}
              onChange={(e) => setCustomKeyInput(e.target.value)}
              placeholder="Nhập khóa MapTiler API key..."
              className="flex-1 px-3 py-1 bg-slate-900 border border-slate-600 rounded-md text-white font-mono text-xs focus:outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={handleSaveApiKey}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-md transition cursor-pointer"
            >
              Áp dụng
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Khóa đang dùng: <span className="font-mono text-amber-300">{apiKey}</span>
          </p>
        </div>
      )}

      {/* Category Badges & Search Filter */}
      {(showCategoryFilters || showSearchBar) && (
        <div className="relative z-10 bg-slate-900/85 backdrop-blur-sm px-4 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          {showCategoryFilters && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-full">
              <button
                type="button"
                onClick={() => setSelectedCategory("ALL")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === "ALL"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                Tất cả điểm ({markers.length})
              </button>
              {categories.map((cat) => {
                const count = markers.filter((m) => m.category === cat).length;
                const isSelected = selectedCategory === cat;
                const sample = markers.find((m) => m.category === cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <span>{sample?.categoryLabel || cat}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          )}

          {showSearchBar && (
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm địa danh, di tích, nghĩa trang..."
                className="w-full pl-8 pr-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-[11px] text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
        </div>
      )}

      {/* Main Map Canvas Area */}
      <div className="relative flex-1 w-full h-full min-h-[300px]">
        {/* Leaflet Map Div Container */}
        <div ref={mapContainerRef} className="absolute inset-0 z-0 w-full h-full" />

        {/* Custom Zoom Controls Floating on Map */}
        <div className="absolute top-4 right-4 z-20 flex flex-col shadow-lg rounded-xl overflow-hidden border border-slate-700 bg-slate-800/90 backdrop-blur-md">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-9 h-9 flex items-center justify-center text-slate-200 hover:bg-slate-700 hover:text-white font-bold text-lg border-b border-slate-700 cursor-pointer"
            title="Phóng to"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-9 h-9 flex items-center justify-center text-slate-200 hover:bg-slate-700 hover:text-white font-bold text-lg cursor-pointer"
            title="Thu nhỏ"
          >
            -
          </button>
        </div>

        {/* Live HUD Floating Tag at bottom left */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 px-3 py-2 rounded-xl text-[11px] text-slate-300 shadow-xl space-y-1 max-w-xs hidden sm:block">
          <div className="flex items-center gap-2 font-mono font-bold text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Tọa độ trung tâm: 10.9805° B, 106.6543° Đ</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Thu phóng: z{currentZoomLevel}</span>
            <span>Khóa: {apiKey.slice(0, 4)}...{apiKey.slice(-4)}</span>
          </div>
          <div className="text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
            <span>Lớp nền: {MAP_STYLES[activeStyle].label}</span>
          </div>
        </div>

        {/* Drawer for Active Selected Marker Details */}
        {activeMarker && (
          <div className="absolute bottom-4 right-4 z-20 max-w-sm w-full bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-2xl space-y-3 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 ${
                    CATEGORY_COLORS[activeMarker.category]?.bg || "bg-blue-900/60 text-blue-200"
                  }`}
                >
                  {activeMarker.categoryLabel || activeMarker.category}
                </span>
                <h5 className="font-bold text-sm text-white leading-tight">{activeMarker.title}</h5>
              </div>
              <button
                type="button"
                onClick={() => setActiveMarker(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {activeMarker.address && (
              <div className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <span>{activeMarker.address}</span>
              </div>
            )}

            {activeMarker.description && (
              <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3">
                {activeMarker.description}
              </p>
            )}

            <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${activeMarker.lat},${activeMarker.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-center text-[11px] flex items-center justify-center gap-1.5 transition shadow"
              >
                <Navigation className="w-3 h-3" />
                <span>Chỉ đường</span>
              </a>

              {activeMarker.qrUrl && (
                <a
                  href={activeMarker.qrUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] flex items-center justify-center gap-1 transition border border-slate-700"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Audio Guide</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Custom user overlay if provided */}
        {customOverlay && <div className="absolute inset-0 pointer-events-none z-10">{customOverlay}</div>}
      </div>
    </div>
  );
}
