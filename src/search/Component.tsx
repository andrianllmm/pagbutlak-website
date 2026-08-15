'use client'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { SearchIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter, useSearchParams } from 'next/navigation'

export const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedValue) {
      params.set('q', debouncedValue)
    } else {
      params.delete('q')
    }
    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, router])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <InputGroup className="h-10 border-border">
          <InputGroupInput
            id="search"
            autoFocus
            onChange={(event) => {
              setValue(event.target.value)
            }}
            placeholder="Search"
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <button type="submit" className="sr-only">
          submit
        </button>
      </form>
    </div>
  )
}
