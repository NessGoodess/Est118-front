import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/lib/config/api";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get("path");

    if (!path) {
        return new NextResponse("Missing path parameter", { status: 400 });
    }

    const base = getApiBaseUrl().replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const backendUrl = `${base}/private-image/${cleanPath}`;

    const cookieStore = await cookies();
    const cookieString = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");

    try {
        const response = await fetch(backendUrl, {
            headers: {
                Cookie: cookieString,
                Accept: "image/*",
            },
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                return new NextResponse("Unauthorized", { status: response.status });
            }
            if (response.status === 404) {
                return new NextResponse("Image not found", { status: 404 });
            }
            return new NextResponse(`Error fetching image: ${response.status}`, { status: response.status });
        }

        const contentType = response.headers.get("Content-Type") || "application/octet-stream";
        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(arrayBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "private, max-age=3600",
            },
        });

    } catch (error) {
        console.error("Error proxying private image:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
