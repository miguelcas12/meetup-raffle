/** @jsx jsx */
import * as React from 'react';
import PropTypes from 'prop-types';
import { jsx, Box, Label, Input, Flex, IconButton } from 'theme-ui';
import useStepper from 'use-stepper';
import { usePrevious } from '../utils';

function CountStepper({
  inputId,
  labelText,
  min,
  max,
  defaultValue,
  onNewValue,
  ...otherProps
}) {
  function validValueClosestTo(newValue) {
    return String(Math.min(max, Math.max(newValue, min)));
  }

  function countReducer(state, action) {
    const integerValue = parseInt(state.value, 10);
    switch (action.type) {
      case useStepper.actionTypes.increment: {
        const newValue = validValueClosestTo(integerValue + 1);
        /* c8 ignore else */
        if (newValue !== state.value) {
          return { value: newValue };
        }
        return state;
      }
      case useStepper.actionTypes.decrement: {
        const newValue = validValueClosestTo(integerValue - 1);
        /* c8 ignore else */
        if (newValue !== state.value) {
          return { value: newValue };
        }
        return state;
      }
      case useStepper.actionTypes.coerce: {
        if (Number.isNaN(integerValue)) {
          return { value: String(defaultValue) };
        }
        /* c8 ignore else */
        if (integerValue !== state.value) {
          return { value: validValueClosestTo(integerValue) };
        }
        return state;
      }
      default:
        return useStepper.defaultReducer(state, action);
    }
  }

  const { getInputProps, getIncrementProps, getDecrementProps, value } =
    useStepper({
      min,
      max,
      defaultValue,
      enableReinitialize: true,
      stateReducer: countReducer,
    });

  const previousValue = usePrevious(value);

  React.useEffect(() => {
    // only call back with a new value if there was a previous value to avoid
    // sending the initial value change to the raffle machine before it's ready
    if (previousValue !== undefined) onNewValue(value);
  }, [onNewValue, previousValue, value]);

  const numericValue = parseFloat(value);
  const decDisabled = numericValue <= min;
  const incDisabled = numericValue >= max;

  return (
    <Box {...otherProps}>
      <Label sx={{ mb: 3 }} htmlFor={inputId}>
        {labelText}
      </Label>
      <Flex>
        <IconButton
          aria-label="decrement"
          type="button"
          disabled={decDisabled}
          {...getDecrementProps()}
        >
          <svg
            height="100%"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 40 40"
            preserveAspectRatio="xMidYMid meet"
          >
            <g>
              <path d="m22.5 17.5v-5h-5v5h-5l7.5 10 7.5-10h-5z" />
            </g>
          </svg>
        </IconButton>
        <Input
          sx={{
            textAlign: 'center',
            width: 3,
            fontSize: 4,
            py: 1,
          }}
          id={inputId}
          pattern="[0-9]*"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          {...getInputProps({
            onFocus: (e) => {
              e.target.select();
            },
          })}
        />
        <IconButton
          aria-label="increment"
          type="button"
          disabled={incDisabled}
          {...getIncrementProps()}
        >
          <svg
            height="100%"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 40 40"
            preserveAspectRatio="xMidYMid meet"
          >
            <g>
              <path d="m20 12.5l-7.5 10h5v5h5v-5h5l-7.5-10z" />
            </g>
          </svg>
        </IconButton>
      </Flex>
    </Box>
  );
}

CountStepper.propTypes = {
  inputId: PropTypes.string.isRequired,
  labelText: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  defaultValue: PropTypes.number,
  onNewValue: PropTypes.func,
};

CountStepper.defaultProps = {
  labelText: 'Count:',
  min: 1,
  max: 9,
  defaultValue: 1,
  onNewValue: () => {},
};

CountStepper.displayName = 'CountStepper';

export default CountStepper;
