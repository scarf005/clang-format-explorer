import { ComponentChildren } from "preact"

interface LayoutProps {
  children: ComponentChildren
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div class="fixed inset-0 flex flex-col bg-white text-black font-mono overflow-hidden">
      {children}
    </div>
  )
}

export const Header = ({ children }: { children: ComponentChildren }) => (
  <header class="flex-none border-b-2 border-black w-full bg-white z-10 flex flex-col lg:flex-row">
    {children}
  </header>
)

export const Main = ({ children }: { children: ComponentChildren }) => (
  <main class="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden md:overflow-visible">
    {children}
  </main>
)

export const Panel = ({
  title,
  children,
  class: className = "",
}: { title: string; children: ComponentChildren; class?: string }) => (
  <div
    class={`flex flex-col h-1/2 md:h-full border-b-2 md:border-b-0 md:border-r-2 border-black last:border-r-0 last:border-b-0 ${className}`}
  >
    <div class="flex-none py-2 px-4 border-b-2 border-black bg-white uppercase font-bold text-sm tracking-wider">
      {title}
    </div>
    <div class="flex-1 relative min-h-0 bg-white">
      {children}
    </div>
  </div>
)

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ComponentChildren
  title: string
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  if (!isOpen) return null
  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-3xl flex flex-col max-h-[85vh]">
        <div class="flex items-center justify-between border-b-2 border-black p-4 bg-black text-white">
          <h2 class="font-bold text-lg uppercase tracking-wider">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            class="hover:text-gray-300 font-bold px-2"
          >
            ✕ ESC
          </button>
        </div>
        <div class="p-0 overflow-auto flex-1 bg-white">
          {children}
        </div>
      </div>
    </div>
  )
}
