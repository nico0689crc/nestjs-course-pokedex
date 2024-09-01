import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const validationExceptionFactory = (
  errors: ValidationError[],
  errorMessage?: any,
  parentField?: string,
) => {
  const result = errorMessage || [];

  let errorField = '';

  errors.forEach((error) => {
    errorField = parentField
      ? `${parentField}.${error.property}`
      : error?.property;
    if (!error?.constraints && error?.children?.length) {
      validationExceptionFactory(error.children, result, errorField);
    } else {
      result.push({
        property: errorField,
        message: error.constraints[Object.keys(error.constraints)[0]],
      });
    }
  });

  return new BadRequestException(result);
};

export class ValidationException extends BadRequestException {
  constructor(public validationErrors: Record<string, unknown>) {
    super(validationErrors);
  }
}
