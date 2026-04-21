import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  createProductRequest,
  deleteProductRequest,
  getAllProductsRequest,
  patchProductAvailabilityRequest,
  updateProductRequest,
} from '@/services/api/admin-api.ts'
import { useAppDispatch } from '@/hooks/storeHooks.ts'
import { setGlobalError, setGlobalLoading } from '@/app/store/settings-slice.ts'
import type { Product, ProductCategory, ProductFormValues } from '@/types/entities.ts'
import { Button } from '@/ui/button/button.tsx'
import { Input } from '@/ui/input/input.tsx'
import { SurfaceCard } from '@/ui/surface/surface-card.tsx'
import { formatPrice } from '@/utils/format-price.ts'
import { getProductImageSrc } from '@/utils/get-product-image-src.ts'

const categoryOptions: ProductCategory[] = ['bouquet', 'flower', 'gift']

const categoryLabelMap: Record<ProductCategory, string> = {
  bouquet: 'Букеты',
  flower: 'Цветы',
  gift: 'Подарки',
}

const emptyProductValues: ProductFormValues = {
  category: 'bouquet',
  description: '',
  image: '',
  isAvailable: true,
  price: 0,
  stock: 0,
  title: '',
}

type AvailabilityFilter = 'all' | 'available' | 'hidden'
type CategoryFilter = 'all' | ProductCategory

export function AdminProductsPage() {
  const dispatch = useAppDispatch()
  const [products, setProducts] = useState<Product[]>([])
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<ProductFormValues>({
    defaultValues: emptyProductValues,
  })

  const currentCategory = watch('category')

  const loadProducts = useCallback(async () => {
    dispatch(setGlobalLoading(true))

    try {
      const data = await getAllProductsRequest()
      setProducts(data)
    } catch {
      dispatch(setGlobalError('Не удалось загрузить товары для админ-панели.'))
    } finally {
      dispatch(setGlobalLoading(false))
    }
  }, [dispatch])

  useEffect(() => {
    void loadProducts()
  }, [loadProducts])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return products.filter((product) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.title.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch)

      const matchesAvailability =
        availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && product.isAvailable) ||
        (availabilityFilter === 'hidden' && !product.isAvailable)

      const matchesCategory =
        categoryFilter === 'all' || product.category === categoryFilter

      return matchesSearch && matchesAvailability && matchesCategory
    })
  }, [availabilityFilter, categoryFilter, products, searchTerm])

  const productsByCategory = useMemo(() => {
    const targetCategories =
      categoryFilter === 'all' ? categoryOptions : [categoryFilter]

    return targetCategories.map((category) => ({
      category,
      items: filteredProducts.filter((product) => product.category === category),
    }))
  }, [categoryFilter, filteredProducts])

  const resetForm = () => {
    setEditingProductId(null)
    reset(emptyProductValues)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setAvailabilityFilter('all')
    setCategoryFilter('all')
  }

  const onSubmit = handleSubmit(async (values) => {
    dispatch(setGlobalLoading(true))

    try {
      const payload: ProductFormValues = {
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
      }

      if (editingProductId) {
        await updateProductRequest(editingProductId, payload)
      } else {
        await createProductRequest(payload)
      }

      await loadProducts()
      resetForm()
    } catch {
      dispatch(setGlobalError('Не удалось сохранить товар.'))
    } finally {
      dispatch(setGlobalLoading(false))
    }
  })

  const startEditing = (product: Product) => {
    setEditingProductId(product.id)
    setValue('category', product.category)
    setValue('description', product.description)
    setValue('image', product.image)
    setValue('isAvailable', product.isAvailable)
    setValue('price', product.price)
    setValue('stock', product.stock)
    setValue('title', product.title)
  }

  const handleDelete = async (productId: number) => {
    dispatch(setGlobalLoading(true))

    try {
      await deleteProductRequest(productId)
      await loadProducts()
    } catch {
      dispatch(setGlobalError('Не удалось удалить товар.'))
    } finally {
      dispatch(setGlobalLoading(false))
    }
  }

  const handleAvailabilityToggle = async (product: Product) => {
    dispatch(setGlobalLoading(true))

    try {
      await patchProductAvailabilityRequest(product.id, !product.isAvailable)
      await loadProducts()
    } catch {
      dispatch(setGlobalError('Не удалось изменить доступность товара.'))
    } finally {
      dispatch(setGlobalLoading(false))
    }
  }

  return (
    <section className="page-section">
      <div className="container admin-layout">
        <div className="admin-main">
          <p className="page-eyebrow">Админ-панель</p>
          <h1 className="page-title">Управление товарами</h1>
          <p className="page-description">
            Добавляй новые позиции, редактируй существующие, меняй доступность и
            быстро находи нужный товар через поиск и фильтры.
          </p>

          <SurfaceCard className="admin-toolbar">
            <div className="admin-toolbar__grid">
              <Input
                label="Поиск товара"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Например, роза или игрушка"
                type="text"
                value={searchTerm}
              />

              <label className="ui-field">
                <span className="ui-field__label">Категория</span>
                <select
                  className="ui-input"
                  onChange={(event) =>
                    setCategoryFilter(event.target.value as CategoryFilter)
                  }
                  value={categoryFilter}
                >
                  <option value="all">Все категории</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {categoryLabelMap[category]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="ui-field">
                <span className="ui-field__label">Статус</span>
                <select
                  className="ui-input"
                  onChange={(event) =>
                    setAvailabilityFilter(event.target.value as AvailabilityFilter)
                  }
                  value={availabilityFilter}
                >
                  <option value="all">Все товары</option>
                  <option value="available">Только доступные</option>
                  <option value="hidden">Только скрытые</option>
                </select>
              </label>
            </div>

            <div className="admin-toolbar__footer">
              <p className="admin-toolbar__summary">
                Найдено товаров: <strong>{filteredProducts.length}</strong>
              </p>
              <Button onClick={resetFilters} variant="ghost">
                Сбросить фильтры
              </Button>
            </div>
          </SurfaceCard>

          <div className="admin-product-groups">
            {productsByCategory.map((group) => (
              <div key={group.category} className="admin-product-group">
                <h2 className="page-card__title">{categoryLabelMap[group.category]}</h2>

                {group.items.length === 0 ? (
                  <SurfaceCard className="admin-empty-state">
                    <p className="dashboard-card__text">
                      Для выбранных фильтров в этой категории пока ничего не найдено.
                    </p>
                  </SurfaceCard>
                ) : (
                  <div className="admin-product-list">
                    {group.items.map((product) => (
                      <SurfaceCard key={product.id} className="admin-product-card">
                        <img
                          alt={product.title}
                          className="admin-product-card__image"
                          src={getProductImageSrc(product)}
                        />

                        <div className="admin-product-card__content">
                          <div>
                            <h3 className="admin-product-card__title">{product.title}</h3>
                            <p className="admin-product-card__meta">
                              {formatPrice(product.price)} · Остаток: {product.stock}
                            </p>
                            <p className="admin-product-card__description">
                              {product.description}
                            </p>
                            <p className="admin-product-card__meta">
                              {product.isAvailable ? 'Доступен в каталоге' : 'Скрыт из каталога'}
                            </p>
                          </div>

                          <div className="admin-product-card__actions">
                            <Button onClick={() => startEditing(product)} variant="ghost">
                              Редактировать
                            </Button>
                            <Button
                              onClick={() => handleAvailabilityToggle(product)}
                              variant="ghost"
                            >
                              {product.isAvailable ? 'Скрыть' : 'Показать'}
                            </Button>
                            <Button onClick={() => handleDelete(product.id)} variant="ghost">
                              Удалить
                            </Button>
                          </div>
                        </div>
                      </SurfaceCard>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <SurfaceCard className="admin-form-card">
          <p className="page-card__eyebrow">Форма товара</p>
          <h2 className="page-card__title">
            {editingProductId ? 'Редактирование товара' : 'Новый товар'}
          </h2>

          <form className="admin-form" onSubmit={onSubmit}>
            <Input
              errorMessage={errors.title?.message}
              label="Название"
              placeholder="Например, Нежный букет"
              type="text"
              {...register('title', { required: 'Введите название.' })}
            />
            <label className="ui-field">
              <span className="ui-field__label">Категория</span>
              <select className="ui-input" {...register('category')}>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabelMap[category]}
                  </option>
                ))}
              </select>
            </label>
            <Input
              errorMessage={errors.price?.message}
              label="Цена"
              placeholder="2500"
              type="number"
              {...register('price', {
                required: 'Введите цену.',
                valueAsNumber: true,
              })}
            />
            <Input
              errorMessage={errors.stock?.message}
              label="Остаток"
              placeholder="10"
              type="number"
              {...register('stock', {
                required: 'Введите остаток.',
                valueAsNumber: true,
              })}
            />
            <Input
              errorMessage={errors.image?.message}
              label="Путь к изображению"
              placeholder="/product-images/rose-bouquet.jpg"
              type="text"
              {...register('image', { required: 'Укажите путь к изображению.' })}
            />
            <Input
              errorMessage={errors.description?.message}
              label="Описание"
              placeholder={`Описание для категории: ${categoryLabelMap[currentCategory]}`}
              type="text"
              {...register('description', { required: 'Введите описание.' })}
            />
            <label className="admin-checkbox">
              <input type="checkbox" {...register('isAvailable')} />
              <span>Товар доступен для покупки</span>
            </label>
            <div className="admin-form__actions">
              <Button type="submit">
                {editingProductId ? 'Сохранить изменения' : 'Создать товар'}
              </Button>
              <Button onClick={resetForm} type="button" variant="ghost">
                Сбросить
              </Button>
            </div>
          </form>
        </SurfaceCard>
      </div>
    </section>
  )
}

