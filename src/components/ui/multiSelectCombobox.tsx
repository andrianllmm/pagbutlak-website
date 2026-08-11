'use client'

import * as React from 'react'
import { ChevronsUpDown } from 'lucide-react'

import { cn } from '@/utilities/ui'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type MultiSelectComboboxOption = {
  value: string
  label: string
}

type MultiSelectComboboxProps = {
  options: MultiSelectComboboxOption[]
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  id?: string
  showSearch?: boolean
}

export function MultiSelectCombobox({
  options,
  values,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  className,
  id,
  showSearch = true,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const toggleValue = (value: string) => {
    const isSelected = values.includes(value)
    onChange(isSelected ? values.filter((each) => each !== value) : [...values, value])
  }

  const triggerLabel = React.useMemo(() => {
    if (values.length === 0) {
      return placeholder
    }

    const firstLabel = options.find((option) => option.value === values[0])?.label ?? values[0]

    return values.length === 1 ? firstLabel : `${firstLabel} +${values.length - 1}`
  }, [values, options, placeholder])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-[200px] justify-between font-normal', className)}
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          {showSearch && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = values.includes(option.value)

                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={[option.label]}
                    onSelect={() => toggleValue(option.value)}
                  >
                    <Checkbox checked={isSelected} />
                    {option.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}