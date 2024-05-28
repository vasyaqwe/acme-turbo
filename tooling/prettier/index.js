import { fileURLToPath } from "url"

/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */

/** @type { PrettierConfig | TailwindConfig } */
const config = {
   plugins: ["prettier-plugin-tailwindcss"],
   trailingComma: "es5",
   tabWidth: 3,
   semi: false,
   singleAttributePerLine: true,
   tailwindConfig: fileURLToPath(
      new URL("../../tooling/tailwind/web.ts", import.meta.url)
   ),
   tailwindFunctions: ["cn", "cva"],
}

export default config
