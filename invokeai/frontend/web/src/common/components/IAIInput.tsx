import {
  FormControl,
  FormControlProps,
  FormLabel,
  Input,
  InputProps,
} from '@chakra-ui/react';
import { useAppDispatch } from 'app/store/storeHooks';
import { stopPastePropagation } from 'common/util/stopPastePropagation';
import { shiftKeyPressed } from 'features/ui/store/hotkeysSlice';
import { ChangeEvent, KeyboardEvent, memo, useCallback } from 'react';

interface IAIInputProps extends InputProps {
  label?: string;
  value?: string;
  size?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  formControlProps?: Omit<FormControlProps, 'isInvalid' | 'isDisabled'>;
}

const IAIInput = (props: IAIInputProps) => {
  const {
    label = '',
    isDisabled = false,
    isInvalid,
    formControlProps,
    ...rest
  } = props;

  const dispatch = useAppDispatch();
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.shiftKey) {
        dispatch(shiftKeyPressed(true));
      }
    },
    [dispatch]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!e.shiftKey) {
        dispatch(shiftKeyPressed(false));
      }
    },
    [dispatch]
  );

  return (
    <FormControl
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      {...formControlProps}
    >
      {label !== '' && <FormLabel>{label}</FormLabel>}
      <Input
        {...rest}
        onPaste={stopPastePropagation}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
    </FormControl>
  );
};

export default memo(IAIInput);
