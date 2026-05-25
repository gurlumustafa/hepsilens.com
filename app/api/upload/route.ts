import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

// İzin verilen MIME türleri
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json({ error: "Sadece JPG, PNG, WebP ve GIF desteklenir" }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return Response.json({ error: "Dosya boyutu 5 MB'ı geçemez" }, { status: 400 });
    }

    // Güvenli, benzersiz dosya adı: <rastgele>.<uzantı>
    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    const fileName = `${crypto.randomBytes(12).toString("hex")}.${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "images", "products");
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    await writeFile(path.join(uploadDir, fileName), Buffer.from(bytes));

    const url = `/images/products/${fileName}`;
    return Response.json({ url });
  } catch (err) {
    console.error("[POST /api/upload]", err);
    return Response.json({ error: "Yükleme başarısız" }, { status: 500 });
  }
}
