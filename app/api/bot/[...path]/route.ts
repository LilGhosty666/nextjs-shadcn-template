import { NextResponse } from "next/server";

const BOT = process.env.BOT_INTERNAL_URL;

export async function GET(req: Request, ctx: { params: { path: string[] } }) {
  if (!BOT) return NextResponse.json({ error: "BOT_INTERNAL_URL missing" }, { status: 500 });

  const path = (ctx.params.path || []).join("/");
  const url = new URL(req.url);
  const target = `${BOT.replace(/\/$/, "")}/${path}${url.search}`;

  const r = await fetch(target, { cache: "no-store" });
  const text = await r.text();

  return new NextResponse(text, {
    status: r.status,
    headers: { "content-type": r.headers.get("content-type") || "application/json" },
  });
}
