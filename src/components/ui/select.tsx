import { useId, useState, type KeyboardEvent } from 'react'

import { useListboxNavigation } from '@/hooks/use-listbox-navigation'
import { cn } from '@/utils/cn'

import { Icon } from './icon'
import { LISTBOX_OPTION } from './listbox-option-styles'

const TRIGGER_LAYOUT = 'flex h-9 w-full cursor-pointer items-center justify-between px-2'
const OPTION_LAYOUT = 'h-7.5 px-2 text-body2 leading-5.5'
const TRIGGER_TEXT = 'border-b border-divider text-body2 leading-5 font-bold text-fg-primary'

export type SelectOption<Value extends string> = {
  value: Value
  label: string
}

type SelectProps<Value extends string> = {
  label: string
  options: SelectOption<Value>[]
  value: Value
  onChange: (value: Value) => void
}

export function Select<Value extends string>({
  label,
  options,
  value,
  onChange,
}: SelectProps<Value>) {
  const listboxId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const selectableOptions = options.filter((option) => option.value !== value)
  const listboxNavigation = useListboxNavigation(selectableOptions)
  const selectedOption = options.find((option) => option.value === value)
  const highlightedOption = isOpen ? listboxNavigation.highlightedOption : null
  const toOptionId = (optionValue: Value) => `${listboxId}-${optionValue}`
  const activeOptionId = highlightedOption ? toOptionId(highlightedOption.value) : undefined

  const open = () => setIsOpen(true)

  const close = () => {
    setIsOpen(false)
    listboxNavigation.resetHighlight()
  }

  const toggle = () => {
    if (isOpen) close()
    else open()
  }

  const selectOption = (option: SelectOption<Value>) => {
    close()
    onChange(option.value)
  }

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        open()
        listboxNavigation.moveHighlight('next')
        break
      case 'ArrowUp':
        event.preventDefault()
        open()
        listboxNavigation.moveHighlight('previous')
        break
      case 'Enter':
        if (!highlightedOption) break
        event.preventDefault()
        selectOption(highlightedOption)
        break
      case 'Escape':
        if (!isOpen) break
        event.stopPropagation()
        close()
        break
    }
  }

  return (
    <div className="relative w-25 shrink-0">
      <button
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeOptionId}
        onClick={toggle}
        onKeyDown={handleTriggerKeyDown}
        onBlur={close}
        className={cn(TRIGGER_LAYOUT, TRIGGER_TEXT)}
      >
        {selectedOption?.label}
        <Icon name="chevronDownSmall" className="text-ui-gray" />
      </button>
      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label}
          onMouseDown={(event) => event.preventDefault()}
          className="absolute top-full left-0 z-10 mt-1.25 w-full bg-white shadow-dropdown"
        >
          {selectableOptions.map((option) => (
            <li
              key={option.value}
              id={toOptionId(option.value)}
              role="option"
              aria-selected={option.value === highlightedOption?.value}
              onClick={() => selectOption(option)}
              className={cn(LISTBOX_OPTION, OPTION_LAYOUT)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
