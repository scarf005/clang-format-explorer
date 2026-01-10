import { computed, effect, signal } from "@preact/signals"

export const asyncSignal = <T>(
  init: T,
  fn: () => Promise<T>,
) => {
  const s = signal(init)
  effect(() => {
    fn().then((v) => s.value = v)
  })
  return computed(() => s.value)
}
