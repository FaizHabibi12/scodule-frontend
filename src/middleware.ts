import { NextRequest, NextResponse } from "next/server";

const ADMIN_ROUTE_PREFIX = "/admin";
const NOT_ACCESS_ROUTE = "/error/error-pagination-not-access";

function getRoleFromProfileCookie(rawProfile?: string): string | null {
    if (!rawProfile) {
        return null;
    }

    try {
        const parsed = JSON.parse(rawProfile) as { role?: string };
        return typeof parsed.role === "string" ? parsed.role : null;
    } catch {
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith(ADMIN_ROUTE_PREFIX)) {
        const authToken = request.cookies.get("auth_token")?.value;
        const roleFromCookie = request.cookies.get("user_role")?.value;
        const roleFromProfile = getRoleFromProfileCookie(request.cookies.get("user_profile")?.value);
        const userRole = roleFromCookie || roleFromProfile;

        if (!authToken || userRole !== "admin") {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = NOT_ACCESS_ROUTE;
            return NextResponse.redirect(redirectUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};