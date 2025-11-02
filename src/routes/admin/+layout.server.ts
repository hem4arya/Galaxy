import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  // Check for authentication cookie
  const authSession = cookies.get('galaxy_admin_session');
  const authExpires = cookies.get('galaxy_admin_session_expires');
  
  if (!authSession || !authExpires) {
    throw redirect(303, '/');
  }
  
  // Check if session is expired
  const expirationTime = parseInt(authExpires);
  const now = Date.now();
  
  if (now >= expirationTime) {
    // Session expired, clear cookies and redirect
    cookies.delete('galaxy_admin_session', { path: '/' });
    cookies.delete('galaxy_admin_session_expires', { path: '/' });
    throw redirect(303, '/');
  }

  return {
    authenticated: true
  };
};