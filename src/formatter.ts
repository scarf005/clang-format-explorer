import init, { format } from "https://esm.sh/jsr/@fmt/clang-format"

let isReady = false
const initPromise = init().then(() => isReady = true)

export const formatCode = async (
  code: string,
  config: string,
): Promise<string> => {
  try {
    if (!isReady) await initPromise

    return format(code, "main.cpp", config)
  } catch (error) {
    console.error("Formatting failed:", error)
    return code
  }
}
