import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Users,
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Send,
  Paperclip,
  CheckCircle2,
  Calendar,
  Clock,
  Building2,
  Share2,
  FileText,
  Search,
  Bell,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { useAppState, appStore } from "@/services/app-state";
import { type OnlineMeetingItem } from "@/data/domain-mock";
import { toast } from "sonner";

interface InternalChatMeetingProps {
  initialChannel?: string;
}

export function InternalChatMeeting({ initialChannel }: InternalChatMeetingProps) {
  const { currentUser, chatMessagesList, onlineMeetingList, taskAssignmentList } = useAppState();

  const [activeMainTab, setActiveMainTab] = useState<"CHAT" | "HOP_ONLINE">("CHAT");
  const [selectedChannel, setSelectedChannel] = useState(initialChannel || "toan-phuong");
  const [inputText, setInputText] = useState("");

  // Virtual Meeting state
  const [activeMeeting, setActiveMeeting] = useState<OnlineMeetingItem | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [meetingNotes, setMeetingNotes] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Danh sách các kênh chat & liên hệ
  const channels = [
    { id: "toan-phuong", name: "#toan-phuong-chi-dao", label: "Chỉ đạo Toàn Phường (Chung)", unread: 0, isGroup: true },
    { id: "van-hoa-814", name: "#van-hoa-814", label: "Tổ Văn hóa & Đội 814", unread: 1, isGroup: true },
    { id: "giao-duc", name: "#giao-duc-khuyen-hoc", label: "Tổ Giáo dục & Mầm non", unread: 0, isGroup: true },
    { id: "direct-tung", name: "Nguyễn Thanh Tùng", label: "Công chức Văn hóa - Xã hội", unread: 2, isGroup: false, avatar: "NTT" },
    { id: "direct-oanh", name: "ThS. Trần Thị Kim Oanh", label: "Công chức Giáo dục", unread: 0, isGroup: false, avatar: "TKO" },
    { id: "direct-nam", name: "Lê Hoàng Nam", label: "Công chức LĐ-TB&XH", unread: 0, isGroup: false, avatar: "LHN" },
  ];

  // Cuộn tin nhắn xuống cuối
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessagesList, selectedChannel]);

  const filteredMessages = chatMessagesList.filter((m) => m.channelId === selectedChannel);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    appStore.sendChatMessage(selectedChannel, inputText.trim());
    setInputText("");
  };

  const currentChannelObj = channels.find((c) => c.id === selectedChannel) || channels[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#222d32] via-[#2c3b41] to-[#1e282c] text-white rounded-2xl p-6 shadow-md border-b-2 border-[#dd4b39] relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#dd4b39] text-white rounded-full text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
            <MessageSquare className="w-3.5 h-3.5" />
            Hệ thống Tác nghiệp &amp; Phòng họp Số
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Liên hệ Trao đổi Nội bộ &amp; Phòng họp Trực tuyến UBND Phường
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Kết nối thông tin thông suốt giữa Lãnh đạo UBND và toàn thể công chức, cán bộ chuyên trách (Văn hóa, Giáo dục, An sinh, Đội 814). Nhận thông báo giao việc tức thì, tổ chức họp giao ban trực tuyến và lưu trữ biên bản cuộc họp số hóa.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveMainTab("CHAT")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeMainTab === "CHAT"
                  ? "bg-[#dd4b39] text-white shadow-md ring-1 ring-[#c23321]"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Kênh Chat Tác nghiệp Nội bộ</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMainTab("HOP_ONLINE")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeMainTab === "HOP_ONLINE"
                  ? "bg-[#dd4b39] text-white shadow-md ring-1 ring-[#c23321]"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Lịch họp &amp; Phòng họp Trực tuyến ({onlineMeetingList.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeMainTab === "CHAT" ? (
        /* Giao diện Chat Nội bộ */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
          {/* Sidebar danh sách kênh & danh bạ */}
          <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-800 p-4 space-y-4 flex flex-col justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
                Kênh Nhóm Tác Nghiệp
              </div>
              <div className="space-y-1">
                {channels
                  .filter((c) => c.isGroup)
                  .map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedChannel(c.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                        selectedChannel === c.id
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 opacity-70" />
                        <div>
                          <div>{c.name}</div>
                          <div
                            className={`text-[10px] font-normal ${
                              selectedChannel === c.id ? "text-blue-100" : "text-slate-400"
                            }`}
                          >
                            {c.label}
                          </div>
                        </div>
                      </div>
                      {c.unread > 0 && selectedChannel !== c.id && (
                        <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                          {c.unread}
                        </span>
                      )}
                    </button>
                  ))}
              </div>

              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 pt-2">
                Trò Chuyện Trực Tiếp (1-1)
              </div>
              <div className="space-y-1">
                {channels
                  .filter((c) => !c.isGroup)
                  .map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedChannel(c.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                        selectedChannel === c.id
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`size-7 rounded-full font-bold text-[11px] flex items-center justify-center shrink-0 ${
                            selectedChannel === c.id
                              ? "bg-white text-blue-700"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          }`}
                        >
                          {c.avatar}
                        </div>
                        <div>
                          <div>{c.name}</div>
                          <div
                            className={`text-[10px] font-normal truncate max-w-[140px] ${
                              selectedChannel === c.id ? "text-blue-100" : "text-slate-400"
                            }`}
                          >
                            {c.label}
                          </div>
                        </div>
                      </div>
                      {c.unread > 0 && selectedChannel !== c.id && (
                        <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                          {c.unread}
                        </span>
                      )}
                    </button>
                  ))}
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900 text-xs">
              <div className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-blue-600" />
                Thông báo Giao việc
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                Mọi lệnh giao việc từ Lãnh đạo sẽ tự động đồng bộ tin nhắn tại đây kèm hạn chót.
              </div>
            </div>
          </div>

          {/* Vùng Tin Nhắn Chat */}
          <div className="md:col-span-8 flex flex-col justify-between p-4 bg-white dark:bg-slate-900">
            {/* Header phòng chat */}
            <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {currentChannelObj.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentChannelObj.label}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900 font-medium">
                  Đang trực tuyến
                </span>
              </div>
            </div>

            {/* Khung cuộn tin nhắn */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 max-h-[420px] scrollbar-thin">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Chưa có tin nhắn trong kênh này. Hãy gửi tin nhắn đầu tiên!
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isMe = msg.senderName === currentUser.fullName;

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 text-xs ${isMe ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`size-8 rounded-full font-bold flex items-center justify-center shrink-0 shadow-xs ${
                          isMe
                            ? "bg-blue-600 text-white"
                            : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                        }`}
                      >
                        {msg.senderAvatar || "CB"}
                      </div>
                      <div className={`max-w-[75%] space-y-1 ${isMe ? "items-end" : "items-start"}`}>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {msg.senderName}
                          </span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </div>

                        <div
                          className={`p-3 rounded-2xl leading-relaxed text-xs ${
                            isMe
                              ? "bg-blue-600 text-white rounded-tr-xs shadow-xs"
                              : msg.isImportant
                              ? "bg-red-50 text-red-950 border border-red-200 dark:bg-red-950/40 dark:text-red-200 rounded-tl-xs font-medium"
                              : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-tl-xs"
                          }`}
                        >
                          {msg.content}

                          {msg.attachedTask && (
                            <div className="mt-2 p-2 bg-white/20 dark:bg-black/30 rounded-lg text-[11px] border border-white/20">
                              <div className="font-bold">Nhiệm vụ: {msg.attachedTask.title}</div>
                              <div>Hạn chót: {msg.attachedTask.deadline}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form gửi tin nhắn */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Nhắn tin trong ${currentChannelObj.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Giao diện Lịch họp & Phòng họp trực tuyến */
        <div className="space-y-6">
          {activeMeeting ? (
            /* Phòng Họp Trực Tuyến Ảo (Virtual Room) */
            <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl p-6 text-white space-y-5 animate-in fade-in duration-200">
              {/* Header phòng họp */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                      ● LIVE ĐANG HỌP
                    </span>
                    <span className="font-mono text-xs text-slate-400">{activeMeeting.maCuocHop}</span>
                  </div>
                  <h3 className="text-lg font-bold">{activeMeeting.tieuDe}</h3>
                  <div className="text-xs text-slate-400">
                    Chủ trì: <strong>{activeMeeting.chuTri}</strong> • {activeMeeting.thoiGian}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveMeeting(null)}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Rời phòng họp</span>
                </button>
              </div>

              {/* Khung Video Simulator Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Video Chủ trì (Sếp) */}
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
                  <div className="flex justify-between items-center text-xs">
                    <span className="bg-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">Chủ trì</span>
                    <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                      <Mic className="w-3.5 h-3.5" /> Đang nói
                    </span>
                  </div>
                  <div className="my-auto text-center">
                    <div className="size-16 rounded-full bg-blue-600 mx-auto text-white font-bold text-xl flex items-center justify-center shadow-md mb-2">
                      NVH
                    </div>
                    <div className="font-bold text-sm">TS. Nguyễn Văn Hùng</div>
                    <div className="text-[11px] text-slate-400">Lãnh đạo UBND Phường</div>
                  </div>
                  <div className="text-[11px] text-slate-400 text-right">HD 1080p</div>
                </div>

                {/* Video Cán bộ Văn hóa */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between min-h-[220px]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">Đại biểu</span>
                    <span className="text-slate-400 text-[11px]">Đã bật mic</span>
                  </div>
                  <div className="my-auto text-center">
                    <div className="size-16 rounded-full bg-indigo-600 mx-auto text-white font-bold text-xl flex items-center justify-center shadow-md mb-2">
                      NTT
                    </div>
                    <div className="font-bold text-sm">Nguyễn Thanh Tùng</div>
                    <div className="text-[11px] text-slate-400">Công chức Văn hóa - Xã hội</div>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-bold text-right">● Trực tuyến</div>
                </div>

                {/* Video Cán bộ Giáo dục */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between min-h-[220px]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">Đại biểu</span>
                    <span className="text-slate-400 text-[11px]">Đã bật mic</span>
                  </div>
                  <div className="my-auto text-center">
                    <div className="size-16 rounded-full bg-purple-600 mx-auto text-white font-bold text-xl flex items-center justify-center shadow-md mb-2">
                      TKO
                    </div>
                    <div className="font-bold text-sm">ThS. Trần Thị Kim Oanh</div>
                    <div className="text-[11px] text-slate-400">Công chức Giáo dục - Đào tạo</div>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-bold text-right">● Trực tuyến</div>
                </div>
              </div>

              {/* Điều khiển cuộc họp */}
              <div className="flex items-center justify-center gap-4 py-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3 rounded-full cursor-pointer transition-colors ${
                    isMicOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-red-600 text-white"
                  }`}
                  title={isMicOn ? "Tắt micro" : "Bật micro"}
                >
                  {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-3 rounded-full cursor-pointer transition-colors ${
                    isVideoOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-red-600 text-white"
                  }`}
                  title={isVideoOn ? "Tắt camera" : "Bật camera"}
                >
                  {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => toast.info("Đã bật chia sẻ màn hình tài liệu cuộc họp.")}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full cursor-pointer transition-colors"
                  title="Chia sẻ màn hình"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Ghi nhận Kết luận cuộc họp */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Ghi nhận Kết luận Cuộc họp của Chủ trì (Biên bản điện tử):
                </div>
                <textarea
                  rows={3}
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  placeholder="Nhập nội dung chỉ đạo, phân công công việc sau cuộc họp..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!meetingNotes.trim()) {
                        toast.error("Vui lòng nhập nội dung kết luận cuộc họp!");
                        return;
                      }
                      toast.success("Đã lưu biên bản kết luận cuộc họp và tự động gửi thông báo đến các đại biểu!");
                      setMeetingNotes("");
                    }}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Lưu kết luận &amp; Ban hành thông báo
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Danh sách lịch họp */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {onlineMeetingList.map((meet) => (
                <div
                  key={meet.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {meet.maCuocHop}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                          {meet.tieuDe}
                        </h4>
                      </div>
                      <span className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-0.5 rounded-full font-semibold border border-blue-200 dark:border-blue-900">
                        Sắp diễn ra
                      </span>
                    </div>

                    <div className="space-y-1.5 my-3 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span>Thời gian: <strong>{meet.thoiGian}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Chủ trì: <strong>{meet.chuTri}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Địa điểm: {meet.diaDiem}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      {meet.noiDungTomTat}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{meet.thanhPhanThamDu.length} đại biểu mời</span>
                    <button
                      type="button"
                      onClick={() => setActiveMeeting(meet)}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Video className="w-4 h-4" />
                      <span>Vào phòng họp trực tuyến</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
