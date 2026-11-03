import re

with open('src/routes/nghia-trang.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import
old_import = 'import { MapTilerGisView, type GisMarkerItem } from "@/components/map/MapTilerGisView";'
new_import = '''import { MapTilerGisView, type GisMarkerItem } from "@/components/map/MapTilerGisView";
import { TrichLucMoLietSiModal } from "@/components/TrichLucMoLietSiModal";'''

if old_import in content:
    content = content.replace(old_import, new_import, 1)

# 2. Add state
old_state = '  const [isBurningIncense, setIsBurningIncense] = useState(false);'
new_state = '''  const [isBurningIncense, setIsBurningIncense] = useState(false);
  const [showTrichLucModal, setShowTrichLucModal] = useState(false);'''

if old_state in content:
    content = content.replace(old_state, new_state, 1)

# 3. Add button in selectedMo sidebar
old_btn = '''                    <Flame className="size-4 text-amber-300" />
                    Thắp Nén Hương / Dâng Hoa Tưởng Niệm Liệt Sĩ
                  </button>
                </div>'''

new_btn = '''                    <Flame className="size-4 text-amber-300" />
                    Thắp Nén Hương / Dâng Hoa Tưởng Niệm Liệt Sĩ
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowTrichLucModal(true)}
                    className="w-full mt-2 py-2 bg-white hover:bg-gray-50 text-[#0073b7] border border-[#0073b7] rounded font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    title="In Giấy trích lục thông tin mộ liệt sĩ khổ A4 có mã QR GPS dẫn đường viếng mộ"
                  >
                    <Compass className="size-4" />
                    In Giấy Trích Lục Mộ (A4 / QR GPS)
                  </button>
                </div>'''

if old_btn in content:
    content = content.replace(old_btn, new_btn, 1)

# 4. Mount TrichLucMoLietSiModal before </AppShell>
old_end = '    )}\n  </AppShell>'
new_end = '''    )}

      {/* Modal In Giấy Trích Lục Mộ Liệt Sĩ (A4 / Mã QR GPS) */}
      <TrichLucMoLietSiModal
        isOpen={showTrichLucModal}
        onClose={() => setShowTrichLucModal(false)}
        moItem={selectedMo}
      />
    </AppShell>'''

if old_end in content:
    content = content.replace(old_end, new_end, 1)

with open('src/routes/nghia-trang.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("src/routes/nghia-trang.tsx successfully patched!")

