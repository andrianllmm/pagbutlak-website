'use client'

import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import { DatePickerWithRange } from '@/components/ui/datePickerRange'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { ListFilter } from 'lucide-react'
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

const FILTER_PARAM_KEYS = ['section', 'author', 'from', 'to', 'readingTime']

export function SearchFilters({ sections, authors, children }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const section = searchParams.get('section') ?? ANY_VALUE
  const author = searchParams.get('author') ?? ANY_VALUE
  const from = searchParams.get('from') ?? ''
  const to = searchParams.get('to') ?? ''
  const readingTime = searchParams.get('readingTime') ?? ANY_VALUE

  const hasActiveFilters = FILTER_PARAM_KEYS.some((key) => searchParams.get(key))

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

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    FILTER_PARAM_KEYS.forEach((key) => params.delete(key))
    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="flex-1">{children}</div>
        <Button variant="outline" onClick={() => setIsOpen((value) => !value)}>
          <ListFilter className="h-4 w-4 mr-2" />
          Advanced Filters
        </Button>
      </div>

      {isOpen && (
        <div className="mt-4 grid grid-cols-2 gap-6 text-left md:grid-cols-5">
          <div className="grid gap-1.5">
            <Label htmlFor="section-search">Section</Label>
            <Combobox
              id="section-search"
              options={sectionOptions}
              value={section}
              onChange={(value) => updateParam('section', value)}
              placeholder="Any"
              showSearch={false}
              className="w-full"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="author-search">Author</Label>
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
          </div>

          <div className="grid gap-1.5 md:col-span-2">
            <DatePickerWithRange value={dateRange} onChange={handleDateRangeChange} />
          </div>

          <div className="grid gap-1.5 pl-2">
            <Label htmlFor="reading-time-search">Reading Time</Label>
            <Combobox
              id="reading-time-search"
              options={READING_TIME_OPTIONS}
              value={readingTime}
              onChange={(value) => updateParam('readingTime', value)}
              placeholder="Any"
              showSearch={false}
              className="w-full"
            />
          </div>

          <Button
            variant="ghost"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            className="md:col-span-5 md:w-fit"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  )
}
