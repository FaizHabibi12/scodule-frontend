import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

function buildBackendUrl(pathSegments: string[], search: string): string {
    const base = BACKEND_BASE_URL.replace(/\/$/, "");
    const path = pathSegments.join("/");
    return `${base}/${path}${search}`;
}

function buildForwardHeaders(request: NextRequest, token?: string): Headers {
    const headers = new Headers(request.headers);

    headers.delete("host");
    headers.delete("connection");
    headers.delete("content-length");

    if (token) {
        headers.set("authorization", `Bearer ${token}`);
    } else {
        headers.delete("authorization");
    }

    if (!headers.get("accept")) {
        headers.set("accept", "application/json");
    }

    return headers;
}

async function proxyRequest(request: NextRequest, pathSegments: string[]) {
    if (!BACKEND_BASE_URL) {
        return NextResponse.json(
            { message: "NEXT_PUBLIC_API_URL belum diatur." },
            { status: 500 }
        );
    }

    const token = (await cookies()).get("auth_token")?.value;
    const backendUrl = buildBackendUrl(pathSegments, request.nextUrl.search);
    const headers = buildForwardHeaders(request, token);

    const method = request.method.toUpperCase();
    const hasBody = method !== "GET" && method !== "HEAD";

    const response = await fetch(backendUrl, {
        method,
        headers,
        body: hasBody ? await request.arrayBuffer() : undefined,
        cache: "no-store",
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("transfer-encoding");

    return new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
    });
}

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params;
    return proxyRequest(request, path);
}

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params;
    return proxyRequest(request, path);
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params;
    return proxyRequest(request, path);
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params;
    return proxyRequest(request, path);
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params;
    return proxyRequest(request, path);
}
