const PRELOAD_ROOT_MARGIN = '200px 0px'

export function useIntersectionObserver<TargetElement extends Element>(onIntersect: () => void) {
  return (target: TargetElement | null) => {
    if (!target || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onIntersect()
      },
      { rootMargin: PRELOAD_ROOT_MARGIN },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }
}
