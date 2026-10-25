export function mockVisibleIntersectionObserver() {
  class VisibleIntersectionObserver {
    private readonly onIntersect: IntersectionObserverCallback

    constructor(onIntersect: IntersectionObserverCallback) {
      this.onIntersect = onIntersect
    }

    observe(target: Element) {
      const entry = { isIntersecting: true, target } as IntersectionObserverEntry
      this.onIntersect([entry], this as unknown as IntersectionObserver)
    }

    disconnect() {}

    unobserve() {}
  }

  vi.stubGlobal('IntersectionObserver', VisibleIntersectionObserver)
}
