import { useId, useState, type KeyboardEvent } from 'react'

import { useListboxNavigation } from '@/hooks/use-listbox-navigation'

import { Icon } from './icon'

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
  const toOptionId = (optionValue: Value) => `${listboxId}-${optionValue}`
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find((option) => option.value === value)
  const selectableOptions = options.filter((option) => option.value !== value)
  const listboxNavigation = useListboxNavigation(selectableOptions)
  const highlightedOption = isOpen ? listboxNavigation.highlightedOption : null

  const close = () => {
    setIsOpen(false)
    listboxNavigation.resetHighlight()
  }

  const selectOption = (option: SelectOption<Value>) => {
    close()
    onChange(option.value)
  }

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault()
        setIsOpen(true)
        listboxNavigation.moveHighlight(event.key === 'ArrowDown' ? 'next' : 'previous')
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
        aria-activedescendant={highlightedOption ? toOptionId(highlightedOption.value) : undefined}
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        onKeyDown={handleTriggerKeyDown}
        onBlur={close}
        className="flex h-9 w-full cursor-pointer items-center justify-between border-b border-divider px-2 text-body2 leading-5 font-bold text-fg-primary"
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
          className="absolute top-full left-0 z-10 mt-1.5 w-full bg-white shadow-dropdown"
        >
          {selectableOptions.map((option) => (
            <li
              key={option.value}
              id={toOptionId(option.value)}
              role="option"
              aria-selected={option.value === highlightedOption?.value}
              onClick={() => selectOption(option)}
              className="flex h-7.5 cursor-pointer items-center px-2 text-body2 leading-5.5 text-fg-subtitle aria-selected:text-fg-primary"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
