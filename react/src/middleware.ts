// src/middleware.ts
import { defineMiddleware } from "astro:middleware"
import { auth } from "./auth"

// Define protected routes and their required roles
const protectedRoutes = {
  '/admin': ['admin'],
  '/admin/*': ['admin'],
  '/edytor/*': ['admin','edytor'],
  '/api/admin/*': ['admin'],
  '/api/edytor/*': ['admin', 'edytor']
} as const

// Helper function to check if a path matches a route pattern
function matchesRoute(path: string, pattern: string): boolean {
  if (pattern.endsWith('/*')) {
    const basePattern = pattern.slice(0, -2)
    return path.startsWith(basePattern)
  }
  return path === pattern
}

// Helper function to check if user has required role for a route
function hasRequiredRole(userRole: string | null, requiredRoles: readonly string[]): boolean {
  if (!userRole) return false
  return requiredRoles.includes(userRole)
}

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    // Get session from better-auth
    const session = await auth.api.getSession({
      headers: context.request.headers
    })

    if (session) {
      // Add user info and role to Astro.locals
      context.locals.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role || "user"
      }
      context.locals.role = session.user.role || "user"
    } else {
      // Clear user info if no session
      context.locals.user = null
      context.locals.role = null
    }

    // Check protected routes
    const pathname = new URL(context.request.url).pathname

    // Find matching protected route
    const matchedRoute = Object.entries(protectedRoutes).find(([pattern]) => 
      matchesRoute(pathname, pattern)
    )

    if (matchedRoute) {
      const [, requiredRoles] = matchedRoute

      // Check if user is authenticated
      if (!session || !context.locals.user) {
        // Redirect to login page for unauthenticated users
        return Response.redirect(new URL('/user/signin', context.request.url), 302)
      }

      // Check if user has required role
      if (!hasRequiredRole(context.locals.role, requiredRoles)) {
        // Redirect to unauthorized page for insufficient permissions
        return Response.redirect(new URL('/unauthorized', context.request.url), 302)
      }
    }

  } catch (error) {
    console.error("Auth middleware error:", error)
    context.locals.user = null
    context.locals.role = null
    
    // If there's an auth error on a protected route, redirect to login
    const pathname = new URL(context.request.url).pathname
    const isProtectedRoute = Object.keys(protectedRoutes).some(pattern => 
      matchesRoute(pathname, pattern)
    )
    
    if (isProtectedRoute) {
      return Response.redirect(new URL('/user/signin', context.request.url), 302)
    }
  }

  return next()
})