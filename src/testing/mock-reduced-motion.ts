export function mockReducedMotion() {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: true, media: query }))
}
