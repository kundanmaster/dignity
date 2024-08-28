import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode"; // Make sure jwtDecode is imported correctly

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
      const res = NextResponse.next();
      res.headers.append("Access-Control-Allow-Origin", "*");
      return res;
    }

    if (token) {
      const decoded = jwtDecode(token);

      // Redirect to homepage if logged-in user tries to access sign-in or sign-up
      if (publicPaths.some((path) => pathname.startsWith(path))) {
        const res = NextResponse.redirect(new URL("/", req.url));
        res.headers.append("Access-Control-Allow-Origin", "*");
        return res;
      }

      // Allow access to protected pages based on user role
      if (decoded.role === "admin") {
        // Admin can access any protected path
        const res = NextResponse.next();
        res.headers.append("Access-Control-Allow-Origin", "*");
        return res;
      } else if (decoded.role === "user") {
        // User can only access /user paths
        if (pathname.startsWith("/user")) {
          const res = NextResponse.next();
          res.headers.append("Access-Control-Allow-Origin", "*");
          return res;
        } else {
          // Redirect to homepage if user tries to access /admin or /instructor paths
          const res = NextResponse.redirect(new URL("/", req.url));
          res.headers.append("Access-Control-Allow-Origin", "*");
          return res;
        }
      } else if (decoded.role === "instructor") {
        // Instructor can only access /instructor paths
        if (pathname.startsWith("/instructor")) {
          const res = NextResponse.next();
          res.headers.append("Access-Control-Allow-Origin", "*");
          return res;
        } else {
          // Redirect to homepage if instructor tries to access /admin or /user paths
          const res = NextResponse.redirect(new URL("/", req.url));
          res.headers.append("Access-Control-Allow-Origin", "*");
          return res;
        }
      }
    } else {
      // Redirect unauthenticated users trying to access protected paths
      if (protectedPaths.some((path) => pathname.startsWith(path))) {
        const res = NextResponse.redirect(new URL("/signin", req.url));
        res.headers.append("Access-Control-Allow-Origin", "*");
        return res;
      }
    }
  } catch (error) {
    console.error("Token verification error:", error);
    const res = NextResponse.redirect(new URL("/signin", req.url));
    res.headers.append("Access-Control-Allow-Origin", "*");
    return res;
  }

  const res = NextResponse.next();
  res.headers.append("Access-Control-Allow-Origin", "*");
  return res;
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
