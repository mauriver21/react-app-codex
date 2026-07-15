import { useId, type ReactNode } from 'react';
import {
  FormLabel,
  Radio,
  RadioGroup as MuiRadioGroup,
  type RadioGroupProps as MuiRadioGroupProps,
} from '@mui/material';
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { FormControl } from '@/components/FormControl';
import { FormControlLabel } from '@/components/FormControlLabel';
import { FormHelperText } from '@/components/FormHelperText';

export interface RadioGroupOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export type RadioGroupProps<TFieldValues extends FieldValues> = Omit<
  MuiRadioGroupProps,
  'children' | 'defaultValue' | 'name' | 'onBlur' | 'onChange' | 'value'
> & {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: ReactNode;
  options: RadioGroupOption[];
  helperText?: ReactNode;
  hideErrorMessage?: boolean;
  disabled?: boolean;
  required?: boolean;
};

export const RadioGroup = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  helperText,
  hideErrorMessage,
  disabled,
  required,
  ...rest
}: RadioGroupProps<TFieldValues>) => {
  const generatedId = useId();
  const { field, fieldState } = useController({ control, name });
  const labelId = `radio-group-label-${generatedId}`;
  const helperTextId = `radio-group-helper-text-${generatedId}`;
  const activeHelperText = fieldState.error?.message || helperText;
  const showHelperText = !hideErrorMessage && Boolean(activeHelperText);
  const firstEnabledOptionIndex = options.findIndex((option) => !option.disabled);

  return (
    <FormControl error={fieldState.invalid} disabled={disabled} required={required}>
      <FormLabel id={labelId}>{label}</FormLabel>
      <MuiRadioGroup
        {...rest}
        name={field.name}
        value={field.value ?? ''}
        onBlur={field.onBlur}
        onChange={(_, value) => field.onChange(value)}
        aria-labelledby={labelId}
        aria-describedby={showHelperText ? helperTextId : undefined}
      >
        {options.map((option, index) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            label={option.label}
            disabled={option.disabled}
            control={
              <Radio
                required={required}
                slotProps={{
                  input: { ref: index === firstEnabledOptionIndex ? field.ref : undefined },
                }}
              />
            }
          />
        ))}
      </MuiRadioGroup>
      {showHelperText && <FormHelperText id={helperTextId}>{activeHelperText}</FormHelperText>}
    </FormControl>
  );
};
