import { TextField as MuiTextField, type TextFieldProps as MuiTextFieldProps } from '@mui/material';
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';

export type TextFieldProps<TFieldValues extends FieldValues> = Omit<
  MuiTextFieldProps,
  'defaultValue' | 'error' | 'name' | 'onChange' | 'value'
> & {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  hideErrorMessage?: boolean;
};

export const TextField = <TFieldValues extends FieldValues>({
  control,
  name,
  hideErrorMessage,
  helperText,
  ...rest
}: TextFieldProps<TFieldValues>) => {
  const { field, fieldState } = useController({ control, name });
  const { ref, ...fieldProps } = field;

  return (
    <MuiTextField
      {...rest}
      {...fieldProps}
      inputRef={ref}
      error={fieldState.invalid}
      helperText={hideErrorMessage ? undefined : fieldState.error?.message || helperText}
      fullWidth
    />
  );
};
