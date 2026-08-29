'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import { MultiSelectCombobox } from '@/components/ui/multiSelectCombobox'
import { DatePickerWithRange } from '@/components/ui/datePickerRange'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { format } from 'date-fns'
import { ListFilter, RotateCcw } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { type DateRange } from 'react-day-picker'

type Option = {
  label: string
  value: string
}

type SearchFiltersProps = {
  sections: readonly Option[]
  authors: Option[]
  categories: Option[]
  children: React.ReactNode
}

const ANY_VALUE = 'any'

// Can change
const READING_TIME_OPTIONS: Option[] = [
  { label: 'Any', value: ANY_VALUE },
  { label: 'Under 5 min', value: 'under5' },
  { label: '5–10 min', value: '5to10' },
  { label: '10+ min', value: '10plus' },
]

const FILTER_PARAM_KEYS = ['section', 'author', 'category', 'from', 'to', 'readingTime']

export function SearchFilters({ sections, authors, categories, children }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const section = searchParams.get('section') ?? ANY_VALUE
  const author = searchParams.get('author') ?? ANY_VALUE
  const from = searchParams.get('from') ?? ''
  const to = searchParams.get('to') ?? ''
  const readingTime = searchParams.get('readingTime') ?? ANY_VALUE
  const selectedCategories = searchParams.get('category')?.split(',').filter(Boolean) ?? []

  const activeFilterCount = FILTER_PARAM_KEYS.filter((key) => searchParams.get(key)).length
  const hasActiveFilters = activeFilterCount > 0

  const dateRange: DateRange | undefined =
    from || to
      ? {
          from: from ? new Date(`${from}T00:00:00`) : undefined,
          to: to ? new Date(`${to}T00:00:00`) : undefined,
        }
      : undefined

  const handleDateRangeChange = (range: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams.toString())

    if (range?.from) {
      params.set('from', format(range.from, 'yyyy-MM-dd'))
    } else {
      params.delete('from')
    }

    if (range?.to) {
      params.set('to', format(range.to, 'yyyy-MM-dd'))
    } else {
      params.delete('to')
    }

    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const sectionOptions: Option[] = [{ label: 'Any', value: ANY_VALUE }, ...sections]
  const authorOptions: Option[] = [{ label: 'Any', value: ANY_VALUE }, ...authors]

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === ANY_VALUE) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const handleCategoriesChange = (values: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    if (values.length === 0) {
      params.delete('category')
    } else {
      params.set('category', values.join(','))
    }
    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    FILTER_PARAM_KEYS.forEach((key) => params.delete(key))
    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">{children}</div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            aria-label={hasActiveFilters ? `Filters, ${activeFilterCount} active` : 'Filters'}
          >
            <ListFilter className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <Badge variant="outline" className="ml-1" aria-hidden="true">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent className="flex h-full w-full flex-col gap-0 p-6 sm:max-w-sm">
          <SheetHeader className="mb-6">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>

          <div className="h-full flex flex-col gap-4">
            <Field className="gap-1">
              <FieldLabel htmlFor="section-search">Section</FieldLabel>
              <Combobox
                id="section-search"
                options={sectionOptions}
                value={section}
                onChange={(value) => updateParam('section', value)}
                placeholder="Any"
                showSearch={false}
                className="w-full"
              />
            </Field>

            <Field className="gap-1">
              <FieldLabel htmlFor="author-search">Author</FieldLabel>
              <Combobox
                id="author-search"
                options={authorOptions}
                value={author}
                onChange={(value) => updateParam('author', value)}
                placeholder="Any"
                searchPlaceholder="Search authors..."
                emptyText="No authors found."
                className="w-full"
              />
            </Field>

            <Field className="gap-1">
              <FieldLabel htmlFor="category-search">Category</FieldLabel>
              <MultiSelectCombobox
                id="category-search"
                options={categories}
                values={selectedCategories}
                onChange={handleCategoriesChange}
                placeholder="Any"
                searchPlaceholder="Search categories..."
                emptyText="No categories found."
                className="w-full"
              />
            </Field>

            <Field className="gap-1">
              <FieldLabel htmlFor="reading-time-search">Reading Time</FieldLabel>
              <Combobox
                id="reading-time-search"
                options={READING_TIME_OPTIONS}
                value={readingTime}
                onChange={(value) => updateParam('readingTime', value)}
                placeholder="Any"
                showSearch={false}
                className="w-full"
              />
            </Field>

            <Field className="gap-1">
              <FieldLabel htmlFor="date-range-search">Published Date</FieldLabel>
              <DatePickerWithRange
                id="date-range-search"
                value={dateRange}
                onChange={handleDateRangeChange}
              />
            </Field>
          </div>

          <SheetFooter>
            <Button
              variant="ghost"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className="w-fit"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
