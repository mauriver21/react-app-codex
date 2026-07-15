# Form Field Contract

Use `src/components/TextField/index.tsx` as the authoritative implementation. Preserve these stable decisions when creating sibling fields.

## Typed public API

Derive the public props from the underlying UI component. Remove props owned by the form connection, then add typed React Hook Form props:

```tsx
export type FieldProps<TFieldValues extends FieldValues> = Omit<
  UiFieldProps,
  'defaultValue' | 'error' | 'name' | 'onChange' | 'value'
> & {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  hideErrorMessage?: boolean;
};
```

Adjust the omitted keys to the control. For a boolean control, omit `checked` and `defaultChecked`; for a component with its own validation prop, omit that prop too. Do not omit unrelated customization props.

## Controller boundary

Call the hook in the wrapper:

```tsx
const { field, fieldState } = useController({ control, name });
```

Map its result according to the UI control's contract.

### Text-like input

Forward the field properties and translate the ref when MUI expects `inputRef`:

```tsx
const { ref, ...fieldProps } = field;

return (
  <UiTextField
    {...rest}
    {...fieldProps}
    inputRef={ref}
    error={fieldState.invalid}
    helperText={hideErrorMessage ? undefined : fieldState.error?.message || helperText}
  />
);
```

Place wrapper-owned bindings after consumer props so callers cannot break the controlled connection.

### Boolean input

Do not spread a form value into a `value` prop when the UI control is driven by `checked`:

```tsx
<UiCheckbox
  {...rest}
  name={field.name}
  checked={Boolean(field.value)}
  onBlur={field.onBlur}
  onChange={(event) => field.onChange(event.target.checked)}
  slotProps={{ input: { ref: field.ref } }}
/>
```

Merge existing slot props when the component exposes them; the abbreviated example only demonstrates the value adapter.

### Select or nullable input

Avoid uncontrolled-to-controlled transitions. Normalize an absent value only when that matches the form schema and UI API:

```tsx
<UiSelect {...rest} {...field} value={field.value ?? ''} />
```

Do not coerce a value merely to silence TypeScript. Preserve number, string, array, object, and null semantics expected by the form model.

### Custom event payload

Translate the UI callback into the form value explicitly:

```tsx
onChange={(_, nextValue) => field.onChange(nextValue)}
```

Continue forwarding `field.onBlur`, `field.name`, and `field.ref` through the APIs offered by the control.

## Validation presentation

Use `fieldState.invalid` for error styling and prefer `fieldState.error?.message` over fallback helper text. For controls without built-in helper text, wrap the input with the app's `FormControl` and conditionally render `FormHelperText`.

Follow the established behavior:

- hide all helper/error output when `hideErrorMessage` is true;
- otherwise render the validation message first, then caller-provided helper text;
- avoid rendering an empty helper element;
- propagate `required` to the form-control or label structure that announces it accessibly.

## Composition

If a field only adds UI behavior, compose an existing wrapper. `PasswordField` is the model: extend `TextFieldProps<TFieldValues>`, add only password-specific labels, merge input adornments, and let `TextField` own React Hook Form integration and validation.

## Repository references

- `src/components/TextField/index.tsx`: canonical text-like wrapper
- `src/components/Checkbox/index.tsx`: boolean value adapter and external helper text
- `src/components/Select/index.tsx`: label association, nullable normalization, and option rendering
- `src/components/PasswordField/index.tsx`: composition over a controlled wrapper
- `src/pages/UserSave/index.tsx`: consumer syntax and generic form model usage
