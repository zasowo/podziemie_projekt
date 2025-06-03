import { defineMiddleware } from "astro:middleware";
import { auth } from "./auth";

const protectedRoutes = {
  '/admin': ['admin'],
  '/admin/*': ['admin'],
  '/edytor': ['admin','edytor'],
  '/edytor/*': ['admin','edytor'],
  '/api/admin/*': ['admin'],
  '/api/edytor/add-page': ['admin', 'edytor'],
  '/api/edytor/edit-page': ['admin', 'edytor'],
  '/api/edytor/delete-page': ['admin', 'edytor'],
  '/user/profile': ['user', 'edytor', 'admin'] 
} as const;

function matchesRoute(path: string, pattern: string): boolean {
  if (pattern.endsWith('/*')) {
    const basePattern = pattern.slice(0, -2);
    return path.startsWith(basePattern);
  }
  return path === pattern;
}

function hasRequiredRole(userRole: string | null, requiredRoles: readonly string[]): boolean {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
}

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    const session = await auth.api.getSession({
      headers: context.request.headers
    });

    if (session && session.user) {
      context.locals.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || undefined,
        role: session.user.role || "user"
      };
      context.locals.role = session.user.role || "user";
    } else {
      context.locals.user = null;
      context.locals.role = null;
    }

    const pathname = new URL(context.request.url).pathname;

    const matchedRoute = Object.entries(protectedRoutes).find(([pattern]) => 
      matchesRoute(pathname, pattern)
    );

    if (matchedRoute) {
      const [, requiredRoles] = matchedRoute;

      if (!context.locals.user) {
        return Response.redirect(new URL('/user/signin', context.request.url), 302);
      }

      if (!hasRequiredRole(context.locals.role, requiredRoles)) {
        return Response.redirect(new URL('/unauthorized', context.request.url), 302); 
      }
    }

  } catch (error) {
    console.error("Auth middleware error:", error);
    context.locals.user = null;
    context.locals.role = null;
    
    const pathname = new URL(context.request.url).pathname;
    const isProtectedRoute = Object.keys(protectedRoutes).some(pattern => 
      matchesRoute(pathname, pattern)
    );
    
    if (isProtectedRoute) {
      return Response.redirect(new URL('/user/signin?error=MiddlewareAuthError', context.request.url), 302);
    }
  }

  return next();
});