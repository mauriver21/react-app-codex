---
name: react-create-form-field
description: Create or refactor reusable TypeScript React form-field components connected to React Hook Form, following this app's MUI TextField wrapper conventions. Use when adding controlled inputs such as text fields, selects, checkboxes, switches, date pickers, autocomplete controls, or composed fields that must accept typed control and name props, expose validation state, and preserve the underlying UI component API safely.
---

# React Create Form Field

Create a typed field wrapper that makes React Hook Form integration consistent with the existing component library.

## Workflow

1. Inspect `src/components/TextField/index.tsx` as the primary live reference. Inspect the closest sibling field and at least one form consumer before choosing an API.
2. Read [references/form-field-contract.md](references/form-field-contract.md) for the required contract and value-adapter patterns.
3. Decide whether to create:
   - a direct controlled wrapper using `useController`; or
   - a composed field built on an existing controlled wrapper, as `PasswordField` builds on `TextField`.
4. Implement the component in the repository's existing component layout and import style.
5. Add or update focused tests when the repository has component-test conventions. Verify types, lint, and relevant tests with the available project scripts.

## Implement a Direct Wrapper

- Make the component generic over `TFieldValues extends FieldValues`.
- Accept `control: Control<TFieldValues>` and `name: FieldPath<TFieldValues>`.
- Derive props from the underlying UI component and omit every prop owned by React Hook Form or by the wrapper. At minimum, consider `name`, `value` or `checked`, `defaultValue` or `defaultChecked`, `onChange`, and validation props such as `error`.
- Keep the component-specific prop type beside the component. Reuse dedicated domain types instead of declaring unrelated app types in the component.
- Call `useController({ control, name })` once and map `field` and `fieldState` explicitly to the UI control.
- Adapt non-text values at the boundary. Never assume every control can receive `{...field}` unchanged.
- Prevent consumer props from overriding the controlled `name`, value, change handler, blur handler, ref, or validation state.
- Preserve useful underlying component props and merge nested props without discarding consumer configuration.
- Show the React Hook Form error message before fallback helper text. Honor the local `hideErrorMessage` convention when the field renders helper text.
- Forward the ref through the API expected by the underlying control, such as `inputRef`, `ref`, or an input slot.

## Implement a Composed Field

- Extend an existing controlled wrapper when only presentation or interaction behavior changes.
- Reuse its generic field props rather than calling `useController` again.
- Forward `control`, `name`, validation rendering, and field state unchanged.
- Merge adornments, slots, and callbacks so existing consumer configuration is retained.

## Verify the Result

Check that:

- invalid field paths fail at compile time;
- the form value is the intended type, especially for booleans, nullable values, numbers, and option objects;
- blur and ref registration reach React Hook Form;
- the controlled props cannot conflict with consumer props;
- validation and helper text are accessible and do not render empty layout unnecessarily;
- required labels and state are conveyed by the surrounding MUI form control when applicable;
- formatting, lint, build or type-check, and focused tests pass.

Keep changes scoped to the requested field. Do not redesign existing wrappers unless the new field exposes a concrete shared defect.
