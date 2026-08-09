'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ListFilter } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

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
  const [authorQuery, setAuthorQuery] = useState('')
  const [isAuthorListOpen, setIsAuthorListOpen] = useState(false)

  const section = searchParams.get('section') ?? ANY_VALUE
  const author = searchParams.get('author') ?? ANY_VALUE
  const from = searchParams.get('from') ?? ''
  const to = searchParams.get('to') ?? ''
  const readingTime = searchParams.get('readingTime') ?? ANY_VALUE

  const hasActiveFilters = FILTER_PARAM_KEYS.some((key) => searchParams.get(key))

  const selectedAuthor = authors.find((option) => option.value === author)
  const filteredAuthors = authors.filter((option) =>
    option.label.toLowerCase().includes(authorQuery.toLowerCase()),
  )

  const selectAuthor = (value: string) => {
    updateParam('author', value)
    setAuthorQuery('')
    setIsAuthorListOpen(false)
  }

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
          <div className="grid gap-1.5" >
            <Label>Section</Label>
            <Select value={section} onValueChange={(value) => updateParam('section', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY_VALUE}>Any</SelectItem>
                {sections.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative grid gap-1.5">
            <Label htmlFor="author-search">Author</Label>
            <Input
              id="author-search"
              placeholder={isAuthorListOpen? "": "Any"}
              autoComplete="off"
              value={isAuthorListOpen ? authorQuery : (selectedAuthor?.label ?? '')}
              onFocus={() => {
                setAuthorQuery('')
                setIsAuthorListOpen(true)
              }}
              onChange={(event) => setAuthorQuery(event.target.value)}
              onBlur={() => setIsAuthorListOpen(false)}
            />
            {isAuthorListOpen && (
              <div className="absolute top-full z-10 mt-1 max-h-48 w-full overflow-auto rounded border bg-card shadow-md">
                <button
                  type="button"
                  className="block w-full px-3 py-1.5 text-left text-sm hover:bg-accent"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectAuthor(ANY_VALUE)}
                >
                  Any
                </button>
                {filteredAuthors.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="block w-full px-3 py-1.5 text-left text-sm hover:bg-accent"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectAuthor(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
                {filteredAuthors.length === 0 && (
                  <div className="px-3 py-1.5 text-sm text-muted-foreground">No authors found</div>
                )}
              </div>
            )}
          </div>

          <div className="grid gap-1.5 md:col-span-2">
            <Label>Published Date</Label>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                aria-label="From"
                value={from}
                onChange={(event) => updateParam('from', event.target.value)}
              />
              <span className="text-muted-foreground">–</span>
              <Input
                type="date"
                aria-label="To"
                value={to}
                onChange={(event) => updateParam('to', event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-1.5 pl-2">
            <Label>Reading Time</Label>
            <Select
              value={readingTime}
              onValueChange={(value) => updateParam('readingTime', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {READING_TIME_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
