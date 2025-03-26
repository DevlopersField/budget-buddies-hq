
import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  prefix?: string;
  suffix?: string;
  allowNegative?: boolean;
  decimalPlaces?: number;
  onChange?: (value: number) => void;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ prefix, suffix, className, allowNegative = false, decimalPlaces = 2, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      
      // Allow only numbers, a single decimal point, and potentially a negative sign
      const regex = allowNegative 
        ? /^-?\d*\.?\d*$/ 
        : /^\d*\.?\d*$/;
        
      if (!regex.test(value)) {
        return;
      }
      
      // Parse the numeric value
      let numericValue = parseFloat(value);
      
      // Check if it's a valid number
      if (!isNaN(numericValue)) {
        // Round to specified decimal places
        if (decimalPlaces >= 0) {
          numericValue = parseFloat(numericValue.toFixed(decimalPlaces));
        }
        onChange?.(numericValue);
      } else if (value === '' || value === '-') {
        // Handle empty input or just a minus sign
        onChange?.(0);
      }
    };

    return (
      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3 text-muted-foreground pointer-events-none">
            {prefix}
          </div>
        )}
        <Input
          type="text"
          inputMode="decimal"
          className={cn(
            'number-input',
            prefix && 'pl-7',
            suffix && 'pr-8',
            className
          )}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 text-muted-foreground pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput };
