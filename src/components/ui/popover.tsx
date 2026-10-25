import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react'

import { useOutsidePointerDown } from '@/hooks/use-outside-pointer-down'

import { IconButton } from './icon-button'

const FOCUSABLE_ELEMENT_SELECTOR =
  'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'

type PopoverProps = {
  label: string
  triggerLabel: string
  triggerClassName: string
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  children: ReactNode
}

export function Popover({
  label,
  triggerLabel,
  triggerClassName,
  isOpen,
  onOpenChange,
  children,
}: PopoverProps) {
  const panelId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_ELEMENT_SELECTOR)?.focus()
  }, [isOpen])

  useOutsidePointerDown(containerRef, () => onOpenChange(false), isOpen)

  const closeAndReturnFocus = () => {
    onOpenChange(false)
    triggerRef.current?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && isOpen) closeAndReturnFocus()
  }

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => onOpenChange(!isOpen)}
        className={triggerClassName}
      >
        {triggerLabel}
      </button>
      {isOpen && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={label}
          className="absolute top-full right-0 z-20 mt-3.75 w-popover rounded-lg bg-white px-6 py-9 shadow-popover sm:right-auto sm:left-1/2 sm:-translate-x-1/2"
        >
          {children}
          <IconButton
            icon="closeFlat"
            label="닫기"
            onClick={closeAndReturnFocus}
            className="absolute top-2 right-2 text-ui-gray"
          />
        </div>
      )}
    </div>
  )
}
