import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/session";
import { execute } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    const body = await req.json();

    const { name, email, phone, subject, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return Response.json({ error: "Eksik bilgi girdiniz" }, { status: 400 });
    }

    // Ticket no üret: TKT-XXXXXXXX (12 karakter)
    const ticketNo = `TKT-${Math.floor(10000000 + Math.random() * 90000000)}`;

    await execute(
      `INSERT INTO support_tickets (
        ticket_no, user_id, name, email, phone, subject, message, status, priority
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'acik', 'normal')`,
      [
        ticketNo,
        user?.id ?? null,
        name.trim(),
        email.trim(),
        phone?.trim() || null,
        subject?.trim() || "Diğer",
        message.trim()
      ]
    );

    return Response.json({ success: true, ticketNo }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/tickets]", err);
    return Response.json({ error: "Destek talebi oluşturulamadı" }, { status: 500 });
  }
}
