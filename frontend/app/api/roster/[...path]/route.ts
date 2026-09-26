import { NextResponse } from "next/server";

import { backendFetch } from "@/lib/auth";

const permitted = new Set([
  "workspace",
  "team-members",
  "rosters",
  "time-off",
]);

async function proxy(request: Request, params: Promise<{ path: string[] }>) {
  const { path } = await params;
  if (!path.length || !permitted.has(path[0]) || path.some((segment) => !/^[A-Za-z0-9-]+$/.test(segment))) {
    return NextResponse.json({ error: "Unknown roster endpoint." }, { status: 404 });
  }

  try {
    const response = await backendFetch(`/${path.join("/")}/`, {
      method: request.method,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.text(),
    });
    return new NextResponse(response.body, { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" } });
  } catch {
    return NextResponse.json({ error: "The roster service is unavailable." }, { status: 502 });
  }
}

export const GET = (request: Request, context: { params: Promise<{ path: string[] }> }) => proxy(request, context.params);
export const POST = (request: Request, context: { params: Promise<{ path: string[] }> }) => proxy(request, context.params);
export const PUT = (request: Request, context: { params: Promise<{ path: string[] }> }) => proxy(request, context.params);
export const DELETE = (request: Request, context: { params: Promise<{ path: string[] }> }) => proxy(request, context.params);
