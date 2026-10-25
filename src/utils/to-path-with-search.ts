type PathLocation = {
  pathname: string
  search: string
}

export function toPathWithSearch({ pathname, search }: PathLocation) {
  return pathname + search
}
