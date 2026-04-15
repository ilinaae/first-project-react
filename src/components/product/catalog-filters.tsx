import { Button } from '@/ui/button/button.tsx'
import { Input } from '@/ui/input/input.tsx'

type CatalogFiltersProps = {
  onAvailabilityChange: (value: boolean) => void
  onReset: () => void
  onSearchChange: (value: string) => void
  searchTerm: string
  showOnlyAvailable: boolean
}

export function CatalogFilters({
  onAvailabilityChange,
  onReset,
  onSearchChange,
  searchTerm,
  showOnlyAvailable,
}: CatalogFiltersProps) {
  return (
    <div className="catalog-filters">
      <Input
        className="catalog-filters__search"
        label="Поиск"
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Найти по названию или описанию"
        type="search"
        value={searchTerm}
      />
      <label className="catalog-filters__checkbox">
        <input
          checked={showOnlyAvailable}
          onChange={(event) => onAvailabilityChange(event.target.checked)}
          type="checkbox"
        />
        <span>Только в наличии</span>
      </label>
      <Button onClick={onReset} variant="ghost">
        Сбросить
      </Button>
    </div>
  )
}
