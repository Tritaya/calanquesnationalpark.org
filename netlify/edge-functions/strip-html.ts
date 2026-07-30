export default async (request: Request) => {
  const url = new URL(request.url);
  if (url.pathname === "/CLAUDE.md") {
    return new Response("Not Found", { status: 404 });
  }
  if (url.pathname === "/index.html") {
    url.pathname = "/";
    return Response.redirect(url.toString(), 301);
  }
  if (url.pathname.endsWith(".html")) {
    url.pathname = url.pathname.slice(0, -5);
    return Response.redirect(url.toString(), 301);
  }
};
export const config = { path: "/*" };
