import type { ReactNode } from 'react';
import { Checkbox as MuiCheckbox, type CheckboxProps as MuiCheckboxProps } from '@mui/material';
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { FormControl } from '@/components/FormControl';
import { FormControlLabel } from '@/components/FormControlLabel';
import { FormHelperText } from '@/components/FormHelperText';

export type CheckboxProps<TFieldValues extends FieldValues> = Omit<
  MuiCheckboxProps,
  'checked' | 'defaultChecked' | 'name' | 'onChange' | 'value'
> & {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: ReactNode;
  helperText?: ReactNode;
  hideErrorMessage?: boolean;
};

export const Checkbox = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  helperText,
  hideErrorMessage,
  required,
  ...rest
}: CheckboxProps<TFieldValues>) => {
  const { field, fieldState } = useController({ control, name });
  const activeHelperText = fieldState.error?.message || helperText;
  const checkbox = (
    <MuiCheckbox
      {...rest}
      name={field.name}
      slotProps={{ input: { ref: field.ref } }}
      checked={Boolean(field.value)}
      required={required}
      onBlur={field.onBlur}
      onChange={(event) => field.onChange(event.target.checked)}
    />
  );

  return (
    <FormControl error={fieldState.invalid} required={required}>
      {label ? <FormControlLabel control={checkbox} label={label} /> : checkbox}
      {!hideErrorMessage && activeHelperText && (
        <FormHelperText>{activeHelperText}</FormHelperText>
      )}
    </FormControl>
  );
};
