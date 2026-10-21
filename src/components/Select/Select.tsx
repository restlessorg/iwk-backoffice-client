import { Field } from '@base-ui/react/field'
import { Select as BaseSelect } from '@base-ui/react/select'
import { Check, ChevronDown, X } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/utils/cn'
import styles from './Select.module.scss'
import type {
  SelectItem,
  SelectRoundness,
  SelectSize,
  SelectValue,
  SelectVariant,
} from './Select.types'

export interface SelectProps<Value extends SelectValue> {
  items: SelectItem<Value>[]
  /** Controlled value; `null` means nothing is selected */
  value?: Value | null
  defaultValue?: Value | null
  onValueChange?: (value: Value | null) => void
  size?: SelectSize
  variant?: SelectVariant
  roundness?: SelectRoundness
  placeholder?: string
  /** Leading icon in the trigger, e.g. `<ArrowUpDown />` */
  icon?: ReactNode
  /** Short text before the chevron, e.g. "EN" */
  meta?: ReactNode
  /** Visible label above the trigger */
  label?: string
  /** Accessible name when there is no visible label */
  'aria-label'?: string
  /** Helper text under the trigger */
  description?: string
  /** Error message under the trigger; also turns the error state on */
  error?: string
  invalid?: boolean
  disabled?: boolean
  required?: boolean
  name?: string
  /**
   * Shows a ✕ that resets the value. While a value is set the trigger uses the
   * "Active" look from the design — use it for applied filters.
   */
  clearable?: boolean
  /** Accessible name of the ✕ button */
  clearLabel?: string
  /** Heading above the options, e.g. "Sort by" */
  menuLabel?: string
  /** Stretch to the width of the container */
  fullWidth?: boolean
  className?: string
}

export function Select<Value extends SelectValue>({
  items,
  value,
  defaultValue = null,
  onValueChange,
  size = 'md',
  variant = 'outline',
  roundness = 'pill',
  placeholder,
  icon,
  meta,
  label,
  'aria-label': ariaLabel,
  description,
  error,
  invalid,
  disabled,
  required,
  name,
  clearable,
  clearLabel,
  menuLabel,
  fullWidth,
  className,
}: SelectProps<Value>) {
  const { t } = useTranslation()

  const triggerRef = useRef<HTMLButtonElement>(null)
  const [innerValue, setInnerValue] = useState<Value | null>(defaultValue)

  const isControlled = value !== undefined
  const current = isControlled ? value : innerValue

  const change = (next: Value | null) => {
    if (!isControlled) setInnerValue(next)
    onValueChange?.(next)
  }
  const clear = () => {
    change(null)
    triggerRef.current?.focus()
  }

  const isInvalid = invalid || Boolean(error)
  const showClear = clearable && current != null && !disabled

  const options = items.map((item) => (
    <BaseSelect.Item
      key={String(item.value)}
      value={item.value}
      label={item.label}
      disabled={item.disabled}
      className={styles.item}
    >
      {item.icon && (
        <span className={styles.itemIcon} aria-hidden>
          {item.icon}
        </span>
      )}
      <BaseSelect.ItemText className={styles.itemText}>
        {item.label}
      </BaseSelect.ItemText>
      {item.meta && <span className={styles.itemMeta}>{item.meta}</span>}
      <BaseSelect.ItemIndicator className={styles.itemIndicator} keepMounted>
        <Check aria-hidden />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  ))

  return (
    <Field.Root
      className={cn(styles.field, className)}
      invalid={isInvalid}
      disabled={disabled}
      data-full-width={fullWidth || undefined}
    >
      <BaseSelect.Root
        items={items}
        value={current}
        onValueChange={(next) => change(next as Value | null)}
        disabled={disabled}
        required={required}
        name={name}
      >
        {label && (
          <BaseSelect.Label className={styles.label}>{label}</BaseSelect.Label>
        )}
        <div
          className={styles.control}
          data-slot='select-control'
          data-variant={variant}
          data-size={size}
          data-roundness={roundness}
          data-active={showClear || undefined}
          data-invalid={isInvalid || undefined}
        >
          <BaseSelect.Trigger
            ref={triggerRef}
            className={styles.trigger}
            aria-label={label ? undefined : ariaLabel}
          >
            {icon && (
              <span className={styles.icon} aria-hidden>
                {icon}
              </span>
            )}
            <BaseSelect.Value
              className={styles.value}
              placeholder={placeholder}
            />
            {meta && <span className={styles.meta}>{meta}</span>}
            {!showClear && (
              <BaseSelect.Icon className={styles.chevron}>
                <ChevronDown aria-hidden />
              </BaseSelect.Icon>
            )}
          </BaseSelect.Trigger>
          {showClear && (
            <button
              type='button'
              className={styles.clear}
              aria-label={clearLabel ?? t('select.clear')}
              onClick={clear}
            >
              <X aria-hidden />
            </button>
          )}
        </div>
        {description && !isInvalid && (
          <Field.Description className={styles.description}>
            {description}
          </Field.Description>
        )}
        {error && (
          <Field.Error className={styles.error} match>
            {error}
          </Field.Error>
        )}
        <BaseSelect.Portal>
          <BaseSelect.Positioner
            className={styles.positioner}
            sideOffset={6}
            alignItemWithTrigger={false}
          >
            <BaseSelect.Popup className={styles.popup}>
              <BaseSelect.List className={styles.list}>
                {menuLabel ? (
                  <BaseSelect.Group className={styles.list}>
                    <BaseSelect.GroupLabel className={styles.groupLabel}>
                      {menuLabel}
                    </BaseSelect.GroupLabel>
                    {options}
                  </BaseSelect.Group>
                ) : (
                  options
                )}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </Field.Root>
  )
}
