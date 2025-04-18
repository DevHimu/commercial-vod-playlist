import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin Panel"' },
    });
  }

  const [username, password] = Buffer.from(auth.split(" ")[1], "base64")
    .toString()
    .split(":");

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    return NextResponse.next();
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin Panel"' },
  });
}

export const config = {
  matcher: ["/add-movie", "/add-series", "/content-index", "/edit-movie/:path*", "/edit-series/:path*"],
};