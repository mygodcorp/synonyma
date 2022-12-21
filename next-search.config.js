const Supabase = require("@supabase/supabase-js");
const envLoader = require("@next/env");
const path = require("path");
const fs = require("fs");
envLoader.loadEnvConfig(path.resolve(__dirname));
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const client = Supabase.createClient(supabaseUrl, supabaseAnonKey);

function search() {
  client
    .from("_word")
    .select("word, id, slug")
    .then((data) => {
      fs.writeFile(
        "./public/search.json",
        JSON.stringify(data.data),
        (res, err) => console.log(res, err)
      );
    });
}

search();
