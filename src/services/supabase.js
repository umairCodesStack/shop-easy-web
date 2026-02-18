import { createClient } from "@supabase/supabase-js/dist/index.cjs";
export const supabaseUrl = "https://aaimjjnjbyjayczwxzhy.supabase.co";
export const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhaW1qam5qYnlqYXljend4emh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDMwMjcsImV4cCI6MjA4MjMxOTAyN30.7znr_M0BmaulcX5Gnc_SUo9Z9uM8Uc6OwXc_ncpe3mg";
export const supabase = createClient(supabaseUrl, supabaseKey);
