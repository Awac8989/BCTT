/**
 * DATABASE STUDIO & 3NF SQL EXPLORER COMPONENT
 * Interactive table browser, schema inspector, SQL query console,
 * backup snapshot creator, and SQL dump exporter for municipal database.
 */

import { useState, useEffect } from "react";
import {
  Database,
  Table as TableIcon,
  Play,
  Download,
  RotateCcw,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  HardDrive,
  Code2,
  Layers,
  Sparkles,
  ExternalLink,
  RefreshCw,
  FileCode,
} from "lucide-react";
import { toast } from "sonner";
import { formatVND } from "@/data/mock";

interface TableInfo {
  name: string;
  displayName: string;
  category: string;
  recordsCount: number;
  columns: {
    name: string;
    type: string;
    nullable: boolean;
    isPrimary?: boolean;
    isForeign?: boolean;
    references?: string;
  }[];
}

interface DatabaseOverview {
  engine: string;
  status: string;
  schema_version: string;
  charset: string;
  tablesCount: number;
  totalRecords: number;
  storageSizeKb: string;
  inTransaction: boolean;
  persistenceFile: string;
}

export function DatabaseStudioTab() {
  const [overview, setOverview] = useState<DatabaseOverview | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedTable, setSelectedTable] = useState<string>("ho_so_ncc");
  const [tableData, setTableData] = useState<any>(null);
  const [tableSearch, setTableSearch] = useState("");
  const [tableLoading, setTableLoading] = useState(false);

  // SQL Console state
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM ho_so_ncc WHERE tyLeThuongTat >= 81 LIMIT 5");
  const [queryResult, setQueryResult] = useState<any>(null);
  const [queryLoading, setQueryLoading] = useState(false);

  // Load database overview & tables list
  const loadDatabaseInfo = async () => {
    try {
      setLoading(true);
      const [ovRes, tblRes] = await Promise.all([
        fetch("/api/v1/database/overview").then((r) => r.json()),
        fetch("/api/v1/database/tables").then((r) => r.json()),
      ]);

      if (ovRes.success) setOverview(ovRes.data);
      if (tblRes.success) {
        setTables(tblRes.data.tables);
      }
    } catch (err) {
      console.error("Lỗi tải thông tin cơ sở dữ liệu:", err);
      toast.error("Không thể tải thông tin cơ sở dữ liệu từ backend");
    } finally {
      setLoading(false);
    }
  };

  // Load specific table data
  const loadTableData = async (tableName: string, search = "") => {
    try {
      setTableLoading(true);
      const url = `/api/v1/database/tables/${tableName}?limit=20${search ? `&search=${encodeURIComponent(search)}` : ""}`;
      const res = await fetch(url).then((r) => r.json());
      if (res.success) {
        setTableData(res.data);
      }
    } catch (err) {
      console.error(`Lỗi tải dữ liệu bảng ${tableName}:`, err);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseInfo();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      loadTableData(selectedTable, tableSearch);
    }
  }, [selectedTable, tableSearch]);

  // Execute SQL Query
  const handleExecuteSql = async () => {
    if (!sqlQuery.trim()) {
      toast.error("Vui lòng nhập câu lệnh SQL");
      return;
    }
    try {
      setQueryLoading(true);
      const res = await fetch("/api/v1/database/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: sqlQuery }),
      }).then((r) => r.json());

      if (res.success) {
        setQueryResult(res.data);
        toast.success("Thực thi câu lệnh SQL thành công!");
      } else {
        toast.error(res.message || "Lỗi thực thi SQL");
      }
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ SQL");
    } finally {
      setQueryLoading(false);
    }
  };

  // Create Snapshot Backup
  const handleCreateBackup = async () => {
    try {
      const res = await fetch("/api/v1/database/backup", { method: "POST" }).then((r) => r.json());
      if (res.success) {
        toast.success(`Tạo bản sao lưu thành công: ${res.data.id}`);
      }
    } catch {
      toast.error("Lỗi khi tạo sao lưu");
    }
  };

  // Reset to Seed
  const handleResetDatabase = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn khôi phục CSDL về dữ liệu mẫu (Seed Data) chuẩn?")) return;
    try {
      const res = await fetch("/api/v1/database/reset", { method: "POST" }).then((r) => r.json());
      if (res.success) {
        toast.success("Đã khôi phục CSDL về trạng thái hạt giống ban đầu!");
        loadDatabaseInfo();
        if (selectedTable) loadTableData(selectedTable);
      }
    } catch {
      toast.error("Lỗi khi reset CSDL");
    }
  };

  // Download SQL Dump file
  const handleDownloadSqlDump = () => {
    window.open("/api/v1/database/export-sql", "_blank");
    toast.success("Đang tải xuống tệp SQL Dump hoàn chỉnh...");
  };

  const filteredTables = selectedCategory === "ALL"
    ? tables
    : tables.filter((t) => t.category === selectedCategory);

  const currentTableMeta = tables.find((t) => t.name === selectedTable);

  return (
    <div className="space-y-6">
      {/* 1. Header KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-red-200 bg-red-50/50 p-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-red-900 mb-1">
            <Database className="size-4 text-[#dd4b39]" />
            <span>Quy mô Bảng 3NF</span>
          </div>
          <div className="text-2xl font-black text-gray-900">{overview?.tablesCount || tables.length || 36}</div>
          <div className="text-[11px] text-gray-600 mt-0.5">Bảng dữ liệu chuẩn hóa</div>
        </div>

        <div className="rounded-lg border border-sky-200 bg-sky-50/50 p-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-900 mb-1">
            <TableIcon className="size-4 text-sky-600" />
            <span>Tổng số Bản ghi</span>
          </div>
          <div className="text-2xl font-black text-gray-900">{overview?.totalRecords?.toLocaleString("vi-VN") || "1,248"}</div>
          <div className="text-[11px] text-gray-600 mt-0.5">Bản ghi hoạt động</div>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Giao dịch ACID</span>
          </div>
          <div className="text-sm font-black text-emerald-700 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>ĐÃ SẴN SÀNG</span>
          </div>
          <div className="text-[11px] text-gray-600 mt-1">InnoDB · utf8mb4</div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
            <HardDrive className="size-4 text-amber-600" />
            <span>Lưu trữ Bền vững</span>
          </div>
          <div className="text-sm font-black text-amber-800 mt-1">{overview?.storageSizeKb || "148.5"} KB</div>
          <div className="text-[11px] text-gray-600 mt-1 truncate" title={overview?.persistenceFile}>
            database_persistence.json
          </div>
        </div>
      </div>

      {/* 2. Database Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700">Công cụ quản trị CSDL:</span>
          <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono">
            {overview?.engine || "Relational Engine v2.0"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadSqlDump}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
          >
            <Download className="size-3.5" />
            <span>Tải SQL Dump (.sql)</span>
          </button>

          <button
            type="button"
            onClick={handleCreateBackup}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs"
          >
            <Clock className="size-3.5" />
            <span>Tạo Snapshot Backup</span>
          </button>

          <button
            type="button"
            onClick={handleResetDatabase}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs"
          >
            <RotateCcw className="size-3.5 text-amber-600" />
            <span>Reset Seed Data</span>
          </button>
        </div>
      </div>

      {/* 3. Interactive SQL Query Console */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="bg-[#24292e] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Code2 className="size-4 text-emerald-400" />
            <span>Bàn Điều Khiển Truy Vấn SQL (Interactive SQL Console)</span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">SELECT, JOIN, WHERE, LIMIT</span>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="text-gray-500 font-semibold mr-1 py-0.5">Truy vấn mẫu:</span>
            <button
              type="button"
              onClick={() => setSqlQuery("SELECT * FROM ho_so_ncc WHERE tyLeThuongTat >= 81 LIMIT 5")}
              className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-mono text-[10px]"
            >
              Thương binh nặng ≥ 81%
            </button>
            <button
              type="button"
              onClick={() => setSqlQuery("SELECT * FROM bang_danh_gia_kpi_can_bo LIMIT 10")}
              className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-mono text-[10px]"
            >
              Bảng điểm KPI cán bộ
            </button>
            <button
              type="button"
              onClick={() => setSqlQuery("SELECT * FROM so_quy_den_on_dap_nghia LIMIT 10")}
              className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-mono text-[10px]"
            >
              Sổ Quỹ Đền ơn đáp nghĩa
            </button>
            <button
              type="button"
              onClick={() => setSqlQuery("SELECT * FROM dieu_tra_pho_cap_gd LIMIT 10")}
              className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-mono text-[10px]"
            >
              Số liệu Phổ cập GD
            </button>
          </div>

          <div className="flex gap-2">
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              rows={2}
              className="w-full font-mono text-xs bg-gray-900 text-emerald-400 p-2.5 rounded border border-gray-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              placeholder="Nhập câu lệnh SELECT SQL..."
            />
            <button
              type="button"
              disabled={queryLoading}
              onClick={handleExecuteSql}
              className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shrink-0 shadow-xs"
            >
              <Play className="size-4 fill-white" />
              <span>Chạy</span>
            </button>
          </div>

          {queryResult && (
            <div className="rounded border border-gray-200 bg-gray-50 p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-600 text-[11px]">
                <span className="font-bold text-emerald-700">
                  Kết quả: {queryResult.rowCount || queryResult.rows?.length || 0} bản ghi
                </span>
                <span className="font-mono text-gray-500">
                  Thời gian thực thi: {queryResult.executionTimeMs || 1.2} ms
                </span>
              </div>
              <div className="overflow-x-auto max-h-48 border rounded bg-white">
                {queryResult.rows && queryResult.rows.length > 0 ? (
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-gray-100 text-gray-700 border-b">
                      <tr>
                        {Object.keys(queryResult.rows[0]).slice(0, 8).map((k) => (
                          <th key={k} className="p-1.5 font-bold">{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {queryResult.rows.map((row: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          {Object.keys(queryResult.rows[0]).slice(0, 8).map((k) => (
                            <td key={k} className="p-1.5 font-mono truncate max-w-[150px]">
                              {String(row[k])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-3 text-center text-gray-500">Không có bản ghi nào phù hợp điều kiện truy vấn.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Table Explorer & Schema Viewer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Tables List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-3 space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
              <Layers className="size-4 text-[#dd4b39]" />
              <span>Danh mục 36 Bảng 3NF</span>
            </div>
            <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
              {filteredTables.length} bảng
            </span>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1 text-[10px]">
            {["ALL", "HỆ THỐNG", "NGƯỜI CÓ CÔNG", "GIÁO DỤC", "AN SINH", "VĂN HÓA", "THÔNG TIN CĐS", "KPI"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                  selectedCategory === c
                    ? "bg-[#dd4b39] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Tables List */}
          <div className="overflow-y-auto max-h-[460px] space-y-1 pr-1">
            {filteredTables.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setSelectedTable(t.name)}
                className={`w-full text-left p-2 rounded text-xs transition-colors flex items-center justify-between ${
                  selectedTable === t.name
                    ? "bg-red-50 border border-red-200 text-red-900 font-bold"
                    : "hover:bg-gray-50 border border-transparent text-gray-700"
                }`}
              >
                <div className="truncate pr-2">
                  <div className="font-mono text-[11px] truncate">{t.name}</div>
                  <div className="text-[10px] text-gray-500 font-normal truncate">{t.displayName}</div>
                </div>
                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono shrink-0">
                  {t.recordsCount}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Table Data & Schema */}
        <div className="md:col-span-2 bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between border-b pb-2 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-gray-900 font-mono">{selectedTable}</span>
                <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded">
                  {currentTableMeta?.category || "CSDL"}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{currentTableMeta?.displayName}</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="size-3.5 absolute left-2 top-2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Lọc dữ liệu bảng..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="pl-7 pr-2 py-1 text-xs border rounded w-44 outline-none focus:border-red-400"
                />
              </div>

              <button
                type="button"
                onClick={() => loadTableData(selectedTable, tableSearch)}
                className="p-1 rounded border hover:bg-gray-100 text-gray-600"
                title="Làm mới bảng"
              >
                <RefreshCw className={`size-3.5 ${tableLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Table Columns Schema Badge List */}
          {currentTableMeta && (
            <div className="p-2 bg-gray-50 rounded border text-[11px] space-y-1">
              <div className="font-bold text-gray-700 flex items-center gap-1 text-[10px] uppercase tracking-wide">
                <FileCode className="size-3 text-gray-500" />
                <span>Cấu trúc Schema ({currentTableMeta.columns?.length || 0} cột):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentTableMeta.columns?.map((col) => (
                  <span
                    key={col.name}
                    className={`px-1.5 py-0.5 rounded font-mono text-[10px] border ${
                      col.isPrimary
                        ? "bg-amber-100 border-amber-300 text-amber-900 font-bold"
                        : col.isForeign
                        ? "bg-purple-100 border-purple-300 text-purple-900"
                        : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    {col.name} <span className="text-gray-400">({col.type})</span>
                    {col.isPrimary && " 🔑"}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Table Data View */}
          <div className="overflow-x-auto max-h-[350px] border rounded">
            {tableLoading ? (
              <div className="p-6 text-center text-xs text-gray-500">Đang tải dữ liệu từ CSDL...</div>
            ) : tableData?.rows && tableData.rows.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 text-gray-700 border-b sticky top-0">
                  <tr>
                    {Object.keys(tableData.rows[0]).slice(0, 7).map((k) => (
                      <th key={k} className="p-2 font-bold text-[11px] whitespace-nowrap">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tableData.rows.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {Object.keys(tableData.rows[0]).slice(0, 7).map((k) => (
                        <td key={k} className="p-2 font-mono text-[11px] truncate max-w-[180px]">
                          {typeof row[k] === "number" && row[k] > 100000 && !k.toLowerCase().includes("cccd") && !k.toLowerCase().includes("id")
                            ? formatVND(row[k])
                            : String(row[k] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-xs text-gray-500">Bảng này hiện chưa có bản ghi dữ liệu.</div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
            <span>Hiển thị tối đa 20 bản ghi trên trang</span>
            <span>Tổng cộng: {tableData?.totalRecords || 0} bản ghi trong bảng {selectedTable}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
