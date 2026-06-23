import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, companyName, designation, email, phone, serviceRequired, challenge, industry } = body;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn("Telegram Bot credentials are not set in server environment variables.");
      return NextResponse.json({ success: false, error: "Telegram config missing" }, { status: 500 });
    }

    const messageText = 
      `🔔 *New Portfolio Enquiry!*\n\n` +
      `👤 *Name:* ${fullName || "N/A"}${designation ? ` (${designation})` : ""}\n` +
      `🏢 *Company:* ${companyName || "N/A"}\n` +
      `🏭 *Industry:* ${industry || "N/A"}\n` +
      `✉️ *Email:* ${email || "N/A"}\n` +
      `📞 *Phone:* ${phone || "N/A"}\n` +
      `🛠️ *Service:* ${serviceRequired || "N/A"}\n\n` +
      `📝 *Process Challenge:* \n_${challenge || "None supplied."}_\n\n` +
      `⚡ _Sent instantly from portfolio CRM_`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: "Markdown"
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Telegram API sendMessage failed:", errText);
      return NextResponse.json({ success: false, error: "Telegram API delivery failed" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in notify API endpoint:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
