import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getExtraServicesRequest,
  getFlowersRequest,
  getPackagingOptionsRequest,
} from '@/services/api/builder-api.ts'
import { ROUTES } from '@/constants/routes.ts'
import { addCartItem } from '@/store/cart-slice.ts'
import { useAppDispatch } from '@/store/hooks.ts'
import { setGlobalError, setGlobalLoading } from '@/store/settings-slice.ts'
import type { ExtraService, PackagingOption, Product } from '@/types/entities.ts'
import { Button } from '@/ui/button/button.tsx'
import { SurfaceCard } from '@/ui/surface/surface-card.tsx'
import { calculateBuilderTotal } from '@/utils/calculate-builder-total.ts'
import { formatPrice } from '@/utils/format-price.ts'
import { getProductImageSrc } from '@/utils/get-product-image-src.ts'

const stepLabels = ['1. Цветы', '2. Упаковка', '3. Дополнения']

export function BuilderPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [flowers, setFlowers] = useState<Product[]>([])
  const [packagingOptions, setPackagingOptions] = useState<PackagingOption[]>([])
  const [extraServices, setExtraServices] = useState<ExtraService[]>([])
  const [step, setStep] = useState(0)
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [selectedPackagingId, setSelectedPackagingId] = useState<number | null>(null)
  const [selectedExtraIds, setSelectedExtraIds] = useState<number[]>([])

  useEffect(() => {
    const loadBuilderData = async () => {
      dispatch(setGlobalLoading(true))

      try {
        const [flowersData, packagingData, extrasData] = await Promise.all([
          getFlowersRequest(),
          getPackagingOptionsRequest(),
          getExtraServicesRequest(),
        ])

        setFlowers(flowersData)
        setPackagingOptions(packagingData)
        setExtraServices(extrasData)
      } catch {
        dispatch(setGlobalError('Не удалось загрузить данные конструктора.'))
      } finally {
        dispatch(setGlobalLoading(false))
      }
    }

    void loadBuilderData()
  }, [dispatch])

  const selectedFlowers = useMemo(
    () => flowers.filter((flower) => (quantities[flower.id] ?? 0) > 0),
    [flowers, quantities],
  )

  const selectedPackaging =
    packagingOptions.find((option) => option.id === selectedPackagingId) ?? null

  const selectedExtras = extraServices.filter((extra) => selectedExtraIds.includes(extra.id))

  const builderTotal = calculateBuilderTotal({
    extras: selectedExtras,
    flowers,
    packaging: selectedPackaging,
    quantities,
  })

  const selectedFlowerCount = selectedFlowers.reduce(
    (total, flower) => total + (quantities[flower.id] ?? 0),
    0,
  )

  const bouquetDetails = [
    ...selectedFlowers.map((flower) => `${flower.title} x${quantities[flower.id]}`),
    ...(selectedPackaging ? [`Упаковка: ${selectedPackaging.name}`] : []),
    ...selectedExtras.map((extra) => `Доп. услуга: ${extra.name}`),
  ]

  const canGoNext =
    (step === 0 && selectedFlowers.length > 0) ||
    (step === 1 && selectedPackaging !== null) ||
    step === 2

  const handleFlowerChange = (flowerId: number, delta: number) => {
    setQuantities((current) => {
      const nextValue = Math.max(0, (current[flowerId] ?? 0) + delta)
      return { ...current, [flowerId]: nextValue }
    })
  }

  const handleTogglePackaging = (packagingId: number) => {
    setSelectedPackagingId((current) => (current === packagingId ? null : packagingId))
  }

  const handleToggleExtra = (extraId: number) => {
    setSelectedExtraIds((current) =>
      current.includes(extraId)
        ? current.filter((id) => id !== extraId)
        : [...current, extraId],
    )
  }

  const handleAddToCart = () => {
    if (selectedFlowers.length === 0 || !selectedPackaging) {
      dispatch(setGlobalError('Сначала выберите цветы и упаковку для букета.'))
      return
    }

    dispatch(
      addCartItem({
        details: bouquetDetails,
        id: `custom-bouquet-${Date.now()}`,
        image: getProductImageSrc(selectedFlowers[0]),
        price: builderTotal,
        quantity: 1,
        title: 'Авторский букет',
        type: 'customBouquet',
      }),
    )

    navigate(ROUTES.cart)
  }

  return (
    <section className="page-section">
      <div className="container builder-layout">
        <div className="builder-main">
          <p className="page-eyebrow">Конструктор</p>
          <h1 className="page-title">Собрать свой букет</h1>
          <p className="page-description">
            Пройди три шага: выбери цветы, упаковку и дополнительные услуги, а затем
            добавь букет в корзину.
          </p>

          <div className="builder-steps">
            {stepLabels.map((label, index) => (
              <button
                key={label}
                className={index === step ? 'builder-step is-active' : 'builder-step'}
                onClick={() => setStep(index)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          <SurfaceCard className="builder-panel">
            {step === 0 ? (
              <>
                <div className="builder-panel__head">
                  <div>
                    <p className="page-card__eyebrow">Шаг 1</p>
                    <h2 className="page-card__title">Выбери цветы для основы букета</h2>
                  </div>
                  <span className="builder-panel__badge">
                    Выбрано позиций: {selectedFlowerCount}
                  </span>
                </div>

                <div className="builder-grid">
                  {flowers.map((flower) => (
                    <SurfaceCard key={flower.id} className="builder-card">
                      <img
                        alt={flower.title}
                        className="builder-card__image"
                        src={getProductImageSrc(flower)}
                      />
                      <div className="builder-card__body">
                        <div>
                          <h3 className="builder-card__title">{flower.title}</h3>
                          <p className="builder-card__price">{formatPrice(flower.price)}</p>
                        </div>
                        <div className="builder-quantity">
                          <Button
                            onClick={() => handleFlowerChange(flower.id, -1)}
                            variant="ghost"
                          >
                            -
                          </Button>
                          <span>{quantities[flower.id] ?? 0}</span>
                          <Button
                            onClick={() => handleFlowerChange(flower.id, 1)}
                            variant="ghost"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </SurfaceCard>
                  ))}
                </div>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <div className="builder-panel__head">
                  <div>
                    <p className="page-card__eyebrow">Шаг 2</p>
                    <h2 className="page-card__title">Подбери упаковку</h2>
                  </div>
                  <span className="builder-panel__badge">
                    {selectedPackaging ? 'Упаковка выбрана' : 'Пока не выбрано'}
                  </span>
                </div>

                <div className="builder-options">
                  {packagingOptions.map((option) => (
                    <button
                      key={option.id}
                      className={
                        option.id === selectedPackagingId
                          ? 'builder-option is-selected'
                          : 'builder-option'
                      }
                      onClick={() => handleTogglePackaging(option.id)}
                      type="button"
                    >
                      <div className="builder-option__content builder-option__content--stacked">
                        <span>{option.name}</span>
                        <small className="builder-option__hint">
                          {option.id === selectedPackagingId
                            ? 'Нажми еще раз, чтобы убрать упаковку'
                            : 'Нажми, чтобы выбрать этот вариант'}
                        </small>
                      </div>
                      <div className="builder-option__meta">
                        {option.id === selectedPackagingId ? (
                          <span className="builder-option__check">Выбрано</span>
                        ) : null}
                        <strong>{formatPrice(option.price)}</strong>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <div className="builder-panel__head">
                  <div>
                    <p className="page-card__eyebrow">Шаг 3</p>
                    <h2 className="page-card__title">Добавь завершающие штрихи</h2>
                  </div>
                  <span className="builder-panel__badge">
                    Дополнений: {selectedExtraIds.length}
                  </span>
                </div>

                <div className="builder-options">
                  {extraServices.map((extra) => (
                    <button
                      key={extra.id}
                      className={
                        selectedExtraIds.includes(extra.id)
                          ? 'builder-option is-selected'
                          : 'builder-option'
                      }
                      onClick={() => handleToggleExtra(extra.id)}
                      type="button"
                    >
                      <div className="builder-option__content builder-option__content--stacked">
                        <span>{extra.name}</span>
                        <small className="builder-option__hint">
                          {selectedExtraIds.includes(extra.id)
                            ? 'Дополнение уже добавлено, нажми чтобы убрать'
                            : 'Добавить к букету'}
                        </small>
                      </div>
                      <div className="builder-option__meta">
                        {selectedExtraIds.includes(extra.id) ? (
                          <span className="builder-option__check">Выбрано</span>
                        ) : null}
                        <strong>{formatPrice(extra.price)}</strong>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : null}
          </SurfaceCard>

          <div className="builder-controls">
            <Button
              disabled={step === 0}
              onClick={() => setStep((current) => current - 1)}
              variant="ghost"
            >
              Назад
            </Button>
            {step < 2 ? (
              <Button disabled={!canGoNext} onClick={() => setStep((current) => current + 1)}>
                Далее
              </Button>
            ) : (
              <Button disabled={builderTotal === 0} onClick={handleAddToCart}>
                Добавить букет в корзину
              </Button>
            )}
          </div>
        </div>

        <SurfaceCard className="builder-summary">
          <p className="page-card__eyebrow">Сводка</p>
          <h2 className="page-card__title">Твой букет</h2>
          <div className="builder-summary__stats">
            <span>Цветов: {selectedFlowerCount}</span>
            <span>Дополнений: {selectedExtraIds.length}</span>
          </div>
          <ul className="builder-summary__list">
            {bouquetDetails.length > 0 ? (
              bouquetDetails.map((detail) => <li key={detail}>{detail}</li>)
            ) : (
              <li>Пока ничего не выбрано.</li>
            )}
          </ul>
          <p className="builder-summary__total">Итого: {formatPrice(builderTotal)}</p>
        </SurfaceCard>
      </div>
    </section>
  )
}
