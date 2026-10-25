export function mockAnimate() {
  const animate = vi.fn(() => ({ cancel: vi.fn() }))
  Object.defineProperty(HTMLElement.prototype, 'animate', { value: animate, configurable: true })
  onTestFinished(() => {
    Reflect.deleteProperty(HTMLElement.prototype, 'animate')
  })
  return animate
}
