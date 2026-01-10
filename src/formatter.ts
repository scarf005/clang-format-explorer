// deno-lint-ignore no-explicit-any
let wasmModule: any = null
let initPromise: Promise<void> | null = null

function ensureLoaded() {
  if (wasmModule) return

  // If already loading, wait for the existing promise
  if (initPromise) return initPromise

  initPromise = (async () => {
    const mod = await import("https://esm.sh/jsr/@fmt/clang-format")

    // Initialize the WASM
    // (Note: in ESM.sh, the default export is the 'init' function)
    await mod.default()

    wasmModule = mod
  })()

  return initPromise
}

export const formatCode = async (
  code: string,
  config: string,
): Promise<string> => {
  try {
    await ensureLoaded()

    return wasmModule.format(code, "main.cpp", config)
  } catch (error) {
    console.error("Formatting failed:", error)
    return code
  }
}
