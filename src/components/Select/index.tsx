import { useId, type ReactNode } from 'react';
import { Select as MuiSelect, type SelectProps as MuiSelectProps } from '@mui/material';
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { FormControl } from '@/components/FormControl';
import { FormHelperText } from '@/components/FormHelperText';
import { InputLabel } from '@/components/InputLabel';
import { MenuItem } from '@/components/MenuItem';

export interface SelectOption {
  value: string | number;
  label: string;
}

export type SelectProps<TFieldValues extends FieldValues> = Omit<
  MuiSelectProps,
  'defaultValue' | 'error' | 'name' | 'onChange' | 'value'
> & {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  options?: SelectOption[];
  helperText?: ReactNode;
  hideErrorMessage?: boolean;
};

export const Select = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options = [],
  helperText,
  hideErrorMessage,
  required,
  children,
  ...rest
}: SelectProps<TFieldValues>) => {
  const generatedId = useId();
  const { field, fieldState } = useController({ control, name });
  const labelId = `select-label-${generatedId}`;
  const activeHelperText = fieldState.error?.message || helperText;

  return (
    <FormControl fullWidth error={fieldState.invalid} required={required} size={rest.size}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect
        {...rest}
        {...field}
        value={field.value ?? ''}
        labelId={labelId}
        label={label}
      >
        {children ||
          options.map((option) => (
            <MenuItem key={String(option.value)} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </MuiSelect>
      {!hideErrorMessage && activeHelperText && (
        <FormHelperText>{activeHelperText}</FormHelperText>
      )}
    </FormControl>
  );
};
