import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import type { FieldValues } from 'react-hook-form';
import { IconButton } from '@/components/IconButton';
import { InputAdornment } from '@/components/InputAdornment';
import { TextField, type TextFieldProps } from '@/components/TextField';

export type PasswordFieldProps<TFieldValues extends FieldValues> = TextFieldProps<TFieldValues> & {
  showPasswordLabel: string;
  hidePasswordLabel: string;
};

export const PasswordField = <TFieldValues extends FieldValues>({
  showPasswordLabel,
  hidePasswordLabel,
  slotProps,
  ...props
}: PasswordFieldProps<TFieldValues>) => {
  const [showPassword, setShowPassword] = useState(false);
  const visibilityLabel = showPassword ? hidePasswordLabel : showPasswordLabel;

  return (
    <TextField<TFieldValues>
      {...props}
      type={showPassword ? 'text' : 'password'}
      slotProps={{
        ...slotProps,
        input: {
          ...slotProps?.input,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="button"
                aria-label={visibilityLabel}
                title={visibilityLabel}
                onClick={() => setShowPassword((value) => !value)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};
