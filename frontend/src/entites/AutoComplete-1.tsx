import React, { useMemo, useState } from 'react';
import {
  InputLabel,
  MenuItem,
  TextField as MuiTextField,
  Popover,
  Select,
  SelectChangeEvent,
  SelectProps,
} from '@mui/material';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import clsx from 'clsx';
import { Tooltip } from '@entites/Tooltip';
import { OptionType } from '@shared/config/common.type';
import { StyledAutoCompleteForm } from './AutoComplete.style';
import Flex from './Flex';

export type SelectOptionType = OptionType;

export type AutoCompleteFormProps<T extends FieldValues = FieldValues> = AutoCompleteProps & {
  name?: keyof T;
  formMethod?: UseFormReturn<T>;
};

export const AutoCompleteForm = <T extends FieldValues = FieldValues>(props: AutoCompleteFormProps<T>) => {
  const isHookFormMode = 'formMethod' in props;
  const id = useMemo(() => (props?.name || props.id) as Path<T>, [props?.name, props.id]);

  if (isHookFormMode) {
    return (
      <Controller
        name={id as Path<T>}
        control={props.formMethod?.control}
        render={({ field, fieldState }) => (
          <AutoComplete
            {...props}
            value={field.value ?? ''}
            onChange={(value) => {
              props?.formMethod?.clearErrors(id);
              field.onChange(value);
              props?.onChange?.(value);
            }}
            error={!!fieldState.error}
            message={fieldState.error?.message}
          />
        )}
      />
    );
  } else {
    return <AutoComplete {...props} id={id} />;
  }
};

export interface AutoCompleteProps {
  id?: string;
  options?: SelectOptionType[];

  value?: string;
  onChange?: (value: string) => void;

  width?: string | number;
  label?: string;
  placeholder?: string;
  error?: boolean;
  message?: string;
  defaultValue?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: SelectProps['size'];
  className?: string;
  border?: boolean;

  onClearError?: (id: string) => void;
  onInput?: (value: string) => void;
}

export const AutoComplete: React.FC<AutoCompleteProps> = ({
  id = 'autoComplete',
  value,
  options,
  onChange,
  onClearError,
  label,
  placeholder,
  fullWidth = true,
  disabled = false,
  readOnly = false,
  size = 'small',
  error,
  message,
  defaultValue,
  width,
  className,
  onInput,
  border = true,
  // ...props,
}) => {
  const [innerError, setInnerError] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>();

  const isError = useMemo(() => error || !!innerError, [error, innerError]);

  const handleChange = (e: SelectChangeEvent<string | number>) => {
    
    const v = e?.target?.value?.toString();
    const label = options?.find(a => a.value === v)?.label || '';

    setOpen(false);
    setInputValue(label);
    onInput?.(label);
    onChange?.(v);
    onClearError?.(id);
  };

  return (
    <StyledAutoCompleteForm
      className={clsx('autocomplete-form', size, { error, border }, className)}
      fullWidth={width ? false : fullWidth}
      size={size}
      disabled={disabled}
      error={error}
      style={{ width }}
    >
      <Flex direction={'column'}>
        {label && <InputLabel id={`label-${id}`}>{label}</InputLabel>}
        <Select
          labelId={`label-${id}`}
          className='select-field'
          size={size}
          id={id}
          label={label}
          // value={innerValue}
          value={value || defaultValue || ''}
          onChange={handleChange}
          displayEmpty={!!placeholder}
          fullWidth
          itemID='123'
          open={open}
          MenuProps={{
            className: 'autocomplete-popup',
            // anchorOrigin: {
            //   vertical: 'bottom',
            //   horizontal: 'center'
            // },
            // anchorPosition: {
            //   top: 0,
            //   left: 0,
            // },
            onClose: (e) => {
              console.log(e);
              setOpen(false);
            },
          }}
        >
          {options?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>

        <Flex className='text-field'>
          <MuiTextField
            popoverTarget='123'
            // {...props}
            variant='outlined'
            label={label}
            value={inputValue || ''}
            placeholder={placeholder}
            error={isError}
            slotProps={{
              input: {
                readOnly: readOnly,
                disabled: disabled,
                // ...(props?.slotProps?.input || {}),
                // onFocus: (e) => {
                // 	if (!readOnly) setOpen((prev) => !prev); //e.target.select();
                // },
                onClick: () => {
                  setOpen(true);
                },
              },
            }}
            onChange={(e) => {
              setInputValue(e?.target?.value?.toString());
              onInput?.(e?.target?.value?.toString());
            }}
            onInput={(e) => {
              onInput?.((e?.target as HTMLInputElement)?.value);
            }}
            fullWidth
          />

          {message && <Tooltip message={message} color={error ? 'error' : 'action'} />}
        </Flex>
      </Flex>
    </StyledAutoCompleteForm>
  );
};
