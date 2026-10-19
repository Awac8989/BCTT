import sys
sys.stdout.reconfigure(encoding='utf-8')
import docx

doc_user = docx.Document('BAO_CAO_THUC_TAP_100_TRANG_DOAN_MINH_QUAN.docx')
doc_orig = docx.Document('docs/BAO_CAO_THUC_TAP_DOANH_NGHIEP_DOAN_MINH_QUAN.docx')

user_p = [p.text for p in doc_user.paragraphs if p.text.strip()]
orig_p = [p.text for p in doc_orig.paragraphs if p.text.strip()]

# Check subsequence
user_idx = 0
matched = 0
unmatched_user = []

for u in user_p:
    if u in orig_p:
        matched += 1
    else:
        unmatched_user.append(u)

print(f"Total user non-empty: {len(user_p)}")
print(f"Matched in orig: {matched}")
print(f"Unmatched in orig: {len(unmatched_user)}")
for u in unmatched_user:
    print("  Diff:", repr(u[:60]))
