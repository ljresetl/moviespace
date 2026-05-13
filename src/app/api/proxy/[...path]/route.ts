import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

async function proxyRequest(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const targetPath = path.join("/");
  const url = `${BACKEND_URL}/${targetPath}/`;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
      redirect: "follow",
    };

    // Читаємо body ОДИН раз і зберігаємо
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      try {
        const bodyText = await req.text();
        if (bodyText) {
          fetchOptions.body = bodyText;
        }
      } catch {
        // Body порожній або вже прочитаний — ігноруємо
      }
    }

    const response = await fetch(url, fetchOptions);

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    let data;
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
      return new NextResponse(data, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ detail: "Бекенд недоступний" }, { status: 502 });
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, context);
}