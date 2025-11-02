import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    // Test Supabase connection for projects and messages
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(5);

    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .limit(5);

    const { data: profile, error: profileError } = await supabase
      .from('profile')
      .select('*')
      .limit(1);

    return json({
      success: true,
      message: 'Supabase connection successful! (Auth is hardcoded)',
      data: {
        projects: {
          count: projects?.length || 0,
          data: projects,
          error: projectsError?.message
        },
        messages: {
          count: messages?.length || 0,
          data: messages,
          error: messagesError?.message
        },
        profile: {
          count: profile?.length || 0,
          data: profile,
          error: profileError?.message,
          fields: ['id', 'about_text', 'hire_text', 'collab_text']
        },
        authentication: {
          type: 'hardcoded',
          password: 'Hem123arya@',
          status: 'active',
          note: 'Authentication is hardcoded, not using Supabase auth'
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return json({
      success: false,
      message: 'Error connecting to Supabase',
      error: error.message
    }, { status: 500 });
  }
};
