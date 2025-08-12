import dayjs from "dayjs";
import fs from "node:fs";
import path from "node:path";

// ===== DEBUG: 파일 저장 세팅 =====
export const saveText = (filename: string, content: string) => {
  const stamp = dayjs().format('YYYYMMDDHHmmss');
  const debugDir = path.join(process.cwd(), "debug");
  const file = `${stamp}_${filename}`

  const ensureDebugDir = () => {
    if (!fs.existsSync(debugDir)) fs.mkdirSync(debugDir, { recursive: true });
  };

  console.log("[SAVED_FILE]", { path: path.join(debugDir, file) });
  try {
    ensureDebugDir();
    fs.writeFileSync(path.join(debugDir, file), content, "utf-8");
  } catch (e) {
    // 파일 쓰기 실패는 분석에 치명적이지 않으므로 무시
  }
};
