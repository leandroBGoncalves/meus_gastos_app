
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_KEY, SUPA_BASE_URL } from '@env'

const supabaseUrl = SUPA_BASE_URL
const supabaseKey = SUPABASE_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)