// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://aggrznlqdtwxabqliako.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZ3J6bmxxZHR3eGFicWxpYWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MTY2MDYsImV4cCI6MjA2MzQ5MjYwNn0.hgs7HnvZ9Wlb6tP0kVUiB39He0OP7XVLybisGDxLg0M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);