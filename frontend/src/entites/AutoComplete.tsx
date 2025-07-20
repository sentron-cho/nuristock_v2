import React, { useMemo, useState } from 'react';
import {
  Autocomplete,
  AutocompleteProps,
  TextField as MuiTextField,
} from '@mui/material';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import clsx from 'clsx';
import { Tooltip } from '@entites/Tooltip';
import { StyledTextFieldForm } from './TextFieldForm.style';

type AutoCompleteFormProps<
  T extends FieldValues = FieldValues,
  OptionType = any,
> = BaseAutoCompleteProps<OptionType> & {
  name?: Path<T>;
  formMethod?: UseFormReturn<T>;
};

export const AutoCompleteForm = <
  T extends FieldValues = FieldValues,
  OptionType = any,
>({
  name,
  formMethod,
  ...rest
}: AutoCompleteFormProps<T, OptionType>) => {
  const isHookFormMode = !!formMethod;
  const id = useMemo(() => (name || rest.id) as Path<T>, [name, rest.id]);

  if (isHookFormMode) {
    return (
      <Controller
        name={id}
        control={formMethod.control}
        render={({ field, formState }) => (
          <AutoComplete
            {...rest}
            id={id}
            value={field.value ?? null}
            onChange={(_, newValue) => {
              formMethod.clearErrors(id);
              field.onChange(newValue);
              rest?.onChange?.(_, newValue);
            }}
            error={!!formState.errors[id]}
            message={formState.errors[id]?.message as string}
          />
        )}
      />
    );
  } else {
    return <AutoComplete {...rest} id={id} />;
  }
};

interface BaseAutoCompleteProps<OptionType>
  extends Omit<
    AutocompleteProps<OptionType, false, false, false>,
    'renderInput' | 'onChange' | 'value'
  > {
  id: string;
  label?: string;
  placeholder?: string;

  value?: OptionType | null;
  onChange?: (event: React.SyntheticEvent, value: OptionType | null) => void;

  error?: boolean;
  message?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

const AutoComplete = <OptionType,>({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  message,
  disabled = false,
  readOnly = false,
  ...props
}: BaseAutoCompleteProps<OptionType>) => {
  const [innerError, setInnerError] = useState<string>();

  const isError = useMemo(() => error || !!innerError, [error, innerError]);

  return (
    <StyledTextFieldForm
      className={clsx('autocomplete-form', { error: isError, readonly: readOnly, disabled })}
      fullWidth
      error={isError}
      disabled={disabled}
    >
      <Autocomplete
        {...props}
        id={id}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        renderInput={(params) => (
          <MuiTextField
            {...params}
            variant="outlined"
            label={label}
            placeholder={placeholder}
            error={isError}
            onFocus={(e) => {
              if (!readOnly) e.target.select();
            }}
          />
        )}
      />
      {message && <Tooltip message={message} color={error ? 'error' : 'action'} />}
      {innerError && <Tooltip message={innerError} color="error" />}
    </StyledTextFieldForm>
  );
};
