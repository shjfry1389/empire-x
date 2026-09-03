import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xrfabesurtbxepsnlzxz.supabase.co";
const supabaseKey = "sb_publishable_kZ2q8Vvjn5_pibAtDSirrg_udflUYRY";

export const supabase = createClient(supabaseUrl, supabaseKey);