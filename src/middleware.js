import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode"; // Ensure this is correctly imported

export async function middleware(req) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Paths that don't require authentication
  const publicPaths = ["/signin", "/signup"];

  // Base paths that require authentication
  const protectedPaths = ["/admin", "/user", "/instructor"];

  try {
    if (pathname === "/") {
      // Allow access to the home page for all users
      return NextResponse.next();
    }

    if (token) {
      const decoded = jwtDecode(token);

      // Redirect to homepage if logged-in user tries to access sign-in or sign-up
      if (publicPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Allow access to protected pages based on user role
      if (decoded.role === "admin") {
        // Admin can access any protected path
        return NextResponse.next();
      } else if (decoded.role === "user") {
        // User can only access /user paths
        if (pathname.startsWith("/user")) {
          return NextResponse.next();
        } else {
          // Redirect to homepage if user tries to access /admin or /instructor paths
          return NextResponse.redirect(new URL("/", req.url));
        }
      } else if (decoded.role === "instructor") {
        // Instructor can only access /instructor paths
        if (pathname.startsWith("/instructor")) {
          return NextResponse.next();
        } else {
          // Redirect to homepage if instructor tries to access /admin or /user paths
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    } else {
      // Redirect unauthenticated users trying to access protected paths
      if (protectedPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/signin", req.url));
      }
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/user/:path*",
    "/instructor/:path*",
    "/signin",
    "/signup",
  ],
};
