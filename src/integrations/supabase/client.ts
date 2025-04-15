
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fxjxsmhveydikucwzfon.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4anhzbWh2ZXlkaWt1Y3d6Zm9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NzQ0NzUsImV4cCI6MjA1MzM1MDQ3NX0.wu1AQofuc816-OjY9IhopEa42-dv4ovKzrzGvADwNwE";



export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);