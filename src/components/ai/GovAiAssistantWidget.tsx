import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Sparkles,
  X,
  Send,
  Minimize2,
  Maximize2,
  Copy,
  Check,
  RotateCcw,
  Calculator,
  FileText,
  Building2,
  Award,
  ShieldAlert,
  ChevronRight,
  Search,
} from "lucide-react";
import { useAppState } from "@/services/app-state";
import { toast } from "sonner";
import { generateGovAiResponse, type AiResponseResult } from "./gov-ai-engine";

interface Message {
  id: string;
  sender: "USER" | "AI";
  text: string;
  timestamp: string;
  category?: string;
  quickActions?: { label: string; prompt: string }[];
}

type TopicCategory =
  | "ALL"
  | "CALC"
  | "MOT_CUA"
  | "VAN_BAN"
  | "SOAN_THAO"
  | "VAN_HOA"
  | "BAO_LUC"
  | "BAO_CAO";

interface TopicOption {
  id: TopicCategory;
  label: string;
  icon: any;
  prompts: { label: string; prompt: string }[];
}

const TOPIC_OPTIONS: TopicOption[] = [
  {
    id: "ALL",
    label: "Tất cả",
    icon: Sparkles,
    prompts: [
      { label: "📊 Báo cáo nhanh tiến độ", prompt: "Báo cáo nhanh tiến độ thực hiện nhiệm vụ và sản phẩm công tác" },
      { label: "📁 Văn bản đến hỏa tốc", prompt: "Tình hình văn bản đến và các văn bản hỏa tốc đang chờ xử lý" },
      { label: "🧮 Tính trợ cấp thương binh 61%", prompt: "Tính trợ cấp thương binh 61% theo Nghị định 77/2024" },
      { label: "🏛️ 4 Mẫu biểu Một cửa (NĐ 61)", prompt: "Quy định về 4 mẫu biểu giải quyết TTHC theo Nghị định 61/2018" },
      { label: "✍️ Gợi ý Bút phê Lãnh đạo", prompt: "Gợi ý các mẫu bút phê chỉ đạo chuẩn của Lãnh đạo UBND Phường" },
      { label: "📝 Soạn Phiếu xin lỗi Mẫu 04", prompt: "Soạn thảo Mẫu số 04 Phiếu xin lỗi và hẹn lại ngày trả kết quả" },
    ],
  },
  {
    id: "CALC",
    label: "Tính trợ cấp",
    icon: Calculator,
    prompts: [
      { label: "Thương binh 61%", prompt: "Tính trợ cấp thương binh 61% theo Nghị định 77/2024" },
      { label: "Thương binh nặng 81%", prompt: "Tính trợ cấp thương binh đặc biệt nặng 81% có người phục vụ" },
      { label: "Mẹ Việt Nam Anh hùng", prompt: "Chế độ trợ cấp Mẹ Việt Nam Anh hùng theo Nghị định 77" },
      { label: "Mai táng phí người có công", prompt: "Mức hưởng mai táng phí người có công mới nhất" },
      { label: "Người cao tuổi 80+ tuổi", prompt: "Chế độ bảo trợ xã hội người cao tuổi 80 tuổi theo Nghị định 76/2024" },
      { label: "Thờ cúng liệt sĩ", prompt: "Mức trợ cấp thờ cúng liệt sĩ hàng năm" },
    ],
  },
  {
    id: "MOT_CUA",
    label: "Bộ phận Một cửa",
    icon: Building2,
    prompts: [
      { label: "4 Mẫu biểu chuẩn (NĐ 61)", prompt: "Quy định về 4 mẫu biểu giải quyết TTHC theo Nghị định 61/2018" },
      { label: "Tình hình hồ sơ Một cửa", prompt: "Báo cáo tình hình tiếp nhận và giải quyết TTHC Một cửa" },
      { label: "Nguyên tắc bổ sung 1 lần", prompt: "Quy định chỉ được yêu cầu bổ sung hồ sơ 1 lần duy nhất theo NĐ 61" },
      { label: "Tra cứu hồ sơ cụ thể", prompt: "Tra cứu hồ sơ Một cửa Lê Thị Mai" },
    ],
  },
  {
    id: "VAN_BAN",
    label: "Văn bản & Bút phê",
    icon: FileText,
    prompts: [
      { label: "Văn bản đến hỏa tốc", prompt: "Tình hình văn bản đến và các văn bản hỏa tốc đang chờ xử lý" },
      { label: "Mẫu Bút phê chỉ đạo khẩn", prompt: "Gợi ý các mẫu bút phê chỉ đạo chuẩn của Lãnh đạo UBND Phường" },
      { label: "Căn lề chuẩn (NĐ 30/2020)", prompt: "Quy chuẩn cỡ chữ, căn lề văn bản hành chính theo Nghị định 30/2020" },
      { label: "Sổ Văn bản đi và trình ký", prompt: "Tình hình văn bản đi đang chờ ký số và phát hành" },
    ],
  },
  {
    id: "SOAN_THAO",
    label: "Soạn thảo văn bản",
    icon: FileText,
    prompts: [
      { label: "Soạn Phiếu xin lỗi Mẫu 04", prompt: "Soạn thảo Mẫu số 04 Phiếu xin lỗi và hẹn lại ngày trả kết quả" },
      { label: "Soạn Giấy hẹn Mẫu 01", prompt: "Soạn thảo Mẫu số 01 Giấy tiếp nhận hồ sơ và hẹn trả kết quả" },
      { label: "Soạn QĐ cấm tiếp xúc BLGĐ", prompt: "Soạn thảo dự thảo Quyết định cấm tiếp xúc theo Điều 25 Luật PCBLGĐ" },
      { label: "Soạn Biên bản 814 Karaoke", prompt: "Soạn thảo dự thảo Biên bản kiểm tra liên ngành 814 về Karaoke" },
    ],
  },
  {
    id: "VAN_HOA",
    label: "Văn hóa & Đời sống",
    icon: Award,
    prompts: [
      { label: "Thang điểm GĐVH (NĐ 86)", prompt: "Quy định thang điểm 100 xét tặng Gia đình văn hóa theo NĐ 86/2023" },
      { label: "Tiêu chí Khu phố văn hóa", prompt: "Tiêu chí và thang điểm công nhận Khu phố văn hóa theo Nghị định 86" },
      { label: "Hậu kiểm Karaoke Đội 814", prompt: "Báo cáo nghiệp vụ hậu kiểm Đội liên ngành 814 về Karaoke" },
      { label: "Quy chuẩn biển quảng cáo", prompt: "Mức xử phạt biển quảng cáo vi phạm chỉ giới theo Nghị định 38" },
    ],
  },
  {
    id: "BAO_LUC",
    label: "Phòng chống BLGĐ",
    icon: ShieldAlert,
    prompts: [
      { label: "Lệnh cấm tiếp xúc 03 ngày", prompt: "Quy định về biện pháp cấm tiếp xúc theo Luật PCBLGĐ 2022" },
      { label: "Địa chỉ tin cậy tạm lánh", prompt: "Danh sách địa chỉ tin cậy tạm lánh nạn nhân bạo lực gia đình" },
      { label: "Quy trình xử lý khẩn cấp 4 bước", prompt: "Nguyên tắc xử lý khẩn cấp 4 bước vụ việc bạo lực gia đình" },
    ],
  },
  {
    id: "BAO_CAO",
    label: "Báo cáo & Giám sát",
    icon: Sparkles,
    prompts: [
      { label: "Tiến độ sản phẩm công vụ", prompt: "Báo cáo nhanh tiến độ thực hiện nhiệm vụ và sản phẩm công tác" },
      { label: "Phản ánh hiện trường 1022", prompt: "Báo cáo tình hình tiếp nhận phản ánh người dân trên Cổng 1022" },
      { label: "Tiếp công dân định kỳ", prompt: "Báo cáo công tác tiếp công dân và giải quyết đơn thư khiếu nại" },
      { label: "Lịch tuần làm việc Lãnh đạo", prompt: "Lịch tuần làm việc và lịch tiếp công dân của Lãnh đạo" },
    ],
  },
];

export function GovAiAssistantWidget() {
  const state = useAppState();
  const { currentUser } = state;

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicCategory>("ALL");

  const buildInitialWelcome = (): Message => ({
    id: "MSG-WELCOME",
    sender: "AI",
    text: `Xin kính chào **${currentUser.fullName}**! Tôi là **Trợ lý Công vụ Điện tử phục vụ Điều hành UBND Phường Thủ Dầu Một**. 

Tôi được tích hợp sẵn toàn bộ dữ liệu thực địa và hệ thống tri thức pháp quy chuyên ngành:
- 🧮 **Tính toán trợ cấp ưu đãi chính xác**: Tự động tính trợ cấp thương binh, bệnh binh, Mẹ VNAH, mai táng phí (NĐ 77/2024 & NĐ 76/2024).
- 🏛️ **Tra cứu dữ liệu trực tiếp**: Tìm kiếm hồ sơ Một cửa (NĐ 61/2018), văn bản đến hỏa tốc (NĐ 30/2020), người có công, phản ánh 1022, hậu kiểm 814.
- 📝 **Soạn thảo văn bản hành chính**: Dự thảo Mẫu 04 (Phiếu xin lỗi), Mẫu 01 (Giấy hẹn), Quyết định cấm tiếp xúc bạo lực gia đình, Biên bản kiểm tra 814.
- ✍️ **Gợi ý Bút phê Lãnh đạo**: Cung cấp các mẫu bút phê điều hành chuẩn mực cho từng tình huống khẩn cấp.

Đồng chí hãy nhập yêu cầu hoặc bấm chọn các gợi ý tác nghiệp nhanh bên dưới!`,
    timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    quickActions: TOPIC_OPTIONS[0].prompts,
  });

  const [messages, setMessages] = useState<Message[]>([buildInitialWelcome()]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `USER-${Date.now()}`,
      sender: "USER",
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response: AiResponseResult = generateGovAiResponse(query, state);
      const aiMsg: Message = {
        id: `AI-${Date.now()}`,
        sender: "AI",
        text: response.text,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        category: response.category,
        quickActions: response.suggestedFollowUps,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 400);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Đã sao chép nội dung văn bản vào bộ nhớ tạm!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([buildInitialWelcome()]);
    setSelectedTopic("ALL");
    toast.info("Đã làm mới phiên hỗ trợ công vụ!");
  };

  const currentTopicObj = TOPIC_OPTIONS.find((t) => t.id === selectedTopic) || TOPIC_OPTIONS[0];

  return (
    <>
      {/* 1. Nút nổi Trợ lý Công vụ Điện tử (Góc dưới bên phải) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#dd4b39] to-[#c23321] hover:from-[#c23321] hover:to-[#a82819] text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group border border-white/20"
          title="Mở Trợ lý Công vụ Điện tử"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold leading-tight flex items-center gap-1">
              Trợ lý Công vụ Điện tử <Sparkles className="w-3 h-3 text-amber-300" />
            </span>
            <span className="text-[10px] text-red-100 leading-tight">
              Tra cứu hồ sơ · Tính trợ cấp · Soạn thảo văn bản
            </span>
          </div>
        </button>
      )}

      {/* 2. Cửa sổ Trợ lý Công vụ Điện tử */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 shadow-2xl overflow-hidden rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col ${
            isExpanded
              ? "inset-3 sm:inset-8"
              : "bottom-5 right-5 w-[94vw] sm:w-[460px] h-[640px] max-h-[88vh]"
          }`}
        >
          {/* Header màu Slate Hành chính */}
          <div className="px-4 py-3 bg-gradient-to-r from-[#222d32] via-[#2c3b41] to-[#1e282c] border-b-2 border-[#dd4b39] text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-[#dd4b39] text-white flex items-center justify-center font-bold shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold flex items-center gap-1.5">
                  Trợ lý Công vụ Điện tử Phường Thủ Dầu Một
                  <span className="px-1.5 py-0.2 bg-emerald-600/80 text-[9px] rounded font-mono font-normal">
                    Trực tuyến 24/7
                  </span>
                </h3>
                <div className="text-[10px] text-slate-300 flex items-center gap-1">
                  <span>Sẵn sàng hỗ trợ pháp lý, nghiệp vụ Một cửa &amp; Điều hành</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors"
                title="Làm mới cuộc trò chuyện"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors"
                title={isExpanded ? "Thu nhỏ" : "Phóng to toàn màn hình"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors"
                title="Đóng trợ lý"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Thanh chuyển đổi chuyên đề nhanh (Topic Filter Bar) */}
          <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 flex items-center gap-1.5 overflow-x-auto scrollbar-thin text-xs">
            {TOPIC_OPTIONS.map((topic) => {
              const Icon = topic.icon;
              const isSelected = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? "bg-[#dd4b39] text-white shadow-xs font-semibold"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{topic.label}</span>
                </button>
              );
            })}
          </div>

          {/* Khối gợi ý nhanh theo chuyên đề đang chọn */}
          {selectedTopic !== "ALL" && (
            <div className="px-3 py-2 bg-amber-50/60 dark:bg-slate-800/40 border-b border-amber-200/50 dark:border-slate-700/50 flex flex-wrap gap-1.5 text-[11px]">
              <span className="text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1 text-[10px] w-full">
                <ChevronRight className="w-3 h-3 text-amber-600" />
                Gợi ý chuyên đề {currentTopicObj.label}:
              </span>
              {currentTopicObj.prompts.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleSend(p.prompt)}
                  className="px-2 py-0.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-amber-300/70 dark:border-slate-600 rounded-md text-[10px] hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Vùng Tin nhắn Trò chuyện */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-50/60 dark:bg-slate-900/60 scrollbar-thin">
            {messages.map((m) => {
              const isAi = m.sender === "AI";
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isAi ? "flex-row" : "flex-row-reverse"}`}
                >
                  {isAi ? (
                    <div className="size-7 rounded-full bg-[#dd4b39] text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-xs mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="size-7 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-xs mt-0.5">
                      {currentUser?.avatarText || "CB"}
                    </div>
                  )}

                  <div className={`max-w-[88%] space-y-1.5 ${isAi ? "items-start" : "items-end"}`}>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {isAi ? "Trợ lý Công vụ Điện tử" : currentUser?.fullName || "Cán bộ"}
                      </span>
                      <span>•</span>
                      <span>{m.timestamp}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        !isAi
                          ? "bg-blue-600 text-white rounded-tr-xs shadow-xs"
                          : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200 dark:border-slate-700/80 shadow-2xs whitespace-pre-wrap font-sans"
                      }`}
                    >
                      {m.text}

                      {/* Nút Sao chép nội dung phản hồi của AI */}
                      {isAi && (
                        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-700/60 mt-2">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(m.text, m.id)}
                            className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 cursor-pointer font-medium px-2 py-0.5 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            title="Sao chép toàn văn nội dung"
                          >
                            {copiedId === m.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500 font-semibold">Đã sao chép</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Sao chép văn bản</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Quick Action / Follow-up Chips */}
                    {m.quickActions && m.quickActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 w-full font-medium">Gợi ý tác nghiệp tiếp theo:</span>
                        {m.quickActions.map((qa) => (
                          <button
                            key={qa.label}
                            type="button"
                            onClick={() => handleSend(qa.prompt)}
                            className="px-2.5 py-1 bg-white hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-red-300 rounded-full text-[11px] text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer text-left flex items-center gap-1 shadow-2xs"
                          >
                            <span>{qa.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Hiệu ứng đang suy nghĩ & tra cứu */}
            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-slate-400">
                <div className="size-6 rounded-full bg-[#dd4b39] text-white flex items-center justify-center font-bold text-[9px]">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white dark:bg-slate-800 px-3.5 py-2 rounded-full border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-[11px] shadow-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Đang tra cứu dữ liệu &amp; đối soát pháp quy...</span>
                  <span className="size-1.5 rounded-full bg-[#dd4b39] animate-bounce" />
                  <span className="size-1.5 rounded-full bg-[#dd4b39] animate-bounce [animation-delay:0.2s]" />
                  <span className="size-1.5 rounded-full bg-[#dd4b39] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form Nhập yêu cầu */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Hỏi tra cứu hồ sơ, tính trợ cấp, mẫu biên bản, bút phê..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#dd4b39]"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-3.5 py-2 bg-[#dd4b39] hover:bg-[#c23321] disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1 font-semibold text-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Gửi</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
