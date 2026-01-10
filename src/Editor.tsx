import { forwardRef } from "preact/compat"

interface InputEditorProps {
  value: string
  onChange: (val: string) => void
  onScroll?: () => void
}

export const InputEditor = forwardRef<HTMLTextAreaElement, InputEditorProps>(
  ({ value, onChange, onScroll }, ref) => {
    return (
      <textarea
        ref={ref}
        className="w-full h-full p-4 resize-none focus:outline-none focus:ring-0 text-sm leading-relaxed font-mono bg-white text-black rounded-none border-0"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        onScroll={onScroll}
        spellcheck={false}
        placeholder="// Type your C++ code here..."
      />
    )
  },
)

InputEditor.displayName = "InputEditor"

interface OutputDisplayProps {
  value: string
  loading: boolean
  onScroll?: () => void
}

export const OutputDisplay = forwardRef<HTMLDivElement, OutputDisplayProps>(
  ({ value, loading, onScroll }, ref) => {
    return (
      <div
        ref={ref}
        onScroll={onScroll}
        className="relative w-full h-full overflow-auto bg-gray-50"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <span className="text-black font-bold animate-pulse">
              FORMATTING...
            </span>
          </div>
        )}
        <pre className="p-4 text-sm leading-relaxed font-mono whitespace-pre text-black">
        {value}
        </pre>
      </div>
    )
  },
)

OutputDisplay.displayName = "OutputDisplay"
