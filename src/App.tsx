import { useRef } from "preact/hooks"
import { signal, useSignal } from "@preact/signals"
import {
  ClangStyle,
  CPP_STYLES,
  TEMPLATE_NAMES,
  TemplateName,
  TEMPLATES,
} from "./constants.ts"
import { formatCode } from "./formatter.ts"
import { Header, Layout, Main, Modal, Panel } from "./Layout.tsx"
import { InputEditor, OutputDisplay } from "./Editor.tsx"
import { asyncSignal } from "./utils.ts"

const activeStyle = signal<ClangStyle>("LLVM")
const inputCode = signal(TEMPLATES["Hello World"])
const configBody = signal(`BasedOnStyle: LLVM`)

const formattedCode = asyncSignal(
  inputCode.value,
  () => formatCode(inputCode.value, configBody.value),
)

const App = () => {
  const selectedTemplate = useSignal<TemplateName>("Hello World")
  const isModalOpen = useSignal(false)

  // Scroll Sync Refs
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef<boolean>(false)

  // Sync Scroll Logic
  const handleScroll = (source: "input" | "output") => {
    if (isScrollingRef.current) return

    const inputEl = inputRef.current
    const outputEl = outputRef.current

    if (!inputEl || !outputEl) return

    isScrollingRef.current = true

    if (source === "input") {
      const percentage = inputEl.scrollTop /
        (inputEl.scrollHeight - inputEl.clientHeight || 1)
      outputEl.scrollTop = percentage *
        (outputEl.scrollHeight - outputEl.clientHeight)
    } else {
      const percentage = outputEl.scrollTop /
        (outputEl.scrollHeight - outputEl.clientHeight || 1)
      inputEl.scrollTop = percentage *
        (inputEl.scrollHeight - inputEl.clientHeight)
    }

    // Small timeout to release the lock
    setTimeout(() => isScrollingRef.current = false, 10)
  }

  const handleStyleChange = (style: ClangStyle) => {
    activeStyle.value = style
    // When style changes, reset the config to the base style
    configBody.value = `BasedOnStyle: ${style}`
  }

  return (
    <Layout>
      <Header>
        {/* Brand */}
        <div className="flex-none flex items-center px-4 py-3 border-b-2 lg:border-b-0 lg:border-r-2 border-black min-w-[200px] bg-black text-white">
          <h1 className="text-lg font-bold tracking-tighter uppercase">
            CLANG-FORMAT EXPLORER
          </h1>
        </div>

        {/* Style Selector - Scrollable */}
        <div className="flex-1 flex overflow-x-auto w-full border-b-2 lg:border-b-0 lg:border-r-2 border-black no-scrollbar bg-white">
          {CPP_STYLES
            .map((style) => (
              <button
                type="button"
                key={style}
                onClick={() => handleStyleChange(style)}
                className={`
                flex-none px-4 md:px-6 py-3 font-bold text-xs md:text-sm uppercase transition-none border-r-2 border-black last:border-r-0 lg:last:border-r-2
                focus:outline-none whitespace-nowrap
                ${
                  activeStyle.value === style
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-200"
                }
              `}
              >
                {style}
              </button>
            ))}
        </div>

        {/* Template & Config */}
        <div className="flex-none w-full lg:w-auto flex flex-row border-b-2 lg:border-b-0 border-black bg-white">
          <div className="flex-1 lg:flex-none relative border-r-2 border-black">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-[10px] md:text-xs font-bold uppercase mr-2 opacity-50">
                TMPL:
              </span>
            </div>
            <select
              value={selectedTemplate.value}
              onChange={(e) => {
                const name = e.currentTarget.value

                // Reset scroll positions on template change
                if (inputRef.current) inputRef.current.scrollTop = 0
                if (outputRef.current) outputRef.current.scrollTop = 0

                selectedTemplate.value = name as TemplateName
                inputCode.value = TEMPLATES[name as TemplateName]
              }}
              className="appearance-none w-full lg:w-[200px] bg-white pl-14 pr-8 py-3 text-xs md:text-sm font-bold border-none focus:ring-0 cursor-pointer uppercase rounded-none h-full"
            >
              {TEMPLATE_NAMES.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="w-3 h-3 md:w-4 md:h-4 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          <button
            type="button"
            onClick={() => isModalOpen.value = true}
            className="flex-none px-6 py-3 font-bold text-xs md:text-sm uppercase transition-colors whitespace-nowrap bg-white text-black hover:bg-black hover:text-white"
            title="Edit Configuration"
          >
            Config
          </button>
        </div>
      </Header>

      <Main>
        <Panel title="Input Source" className="w-full md:w-1/2">
          <InputEditor
            ref={inputRef}
            value={inputCode.value}
            onChange={(val) => inputCode.value = val}
            onScroll={() => handleScroll("input")}
          />
        </Panel>

        <Panel
          title={`Output (${activeStyle.value})`}
          className="w-full md:w-1/2"
        >
          <OutputDisplay
            ref={outputRef}
            value={formattedCode.value}
            loading={false}
            onScroll={() => handleScroll("output")}
          />
        </Panel>
      </Main>

      <Modal
        isOpen={isModalOpen.value}
        onClose={() => isModalOpen.value = false}
        title="Configuration"
      >
        <div className="flex flex-col h-[50vh] md:h-[60vh]">
          <div className="p-4 bg-gray-100 border-b-2 border-black text-sm">
            <p>
              Editing configuration for{" "}
              <strong>{activeStyle.value}</strong>. Changes apply automatically.
            </p>
          </div>
          <textarea
            className="flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none bg-white text-black"
            value={configBody.value}
            onChange={(e) => configBody.value = e.currentTarget.value}
            spellcheck={false}
          />
          <div className="p-4 border-t-2 border-black bg-white flex justify-end gap-2">
            <button
              type="button"
              onClick={() =>
                configBody.value = `BasedOnStyle: ${activeStyle.value}`}
              className="px-6 py-2 border-2 border-black font-bold uppercase hover:bg-gray-200 text-xs md:text-sm"
            >
              Reset to {activeStyle.value}
            </button>
            <button
              type="button"
              onClick={() => isModalOpen.value = false}
              className="px-6 py-2 bg-black text-white border-2 border-black font-bold uppercase hover:bg-gray-800 text-xs md:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}

export default App
