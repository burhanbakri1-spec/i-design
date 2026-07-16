import { ValidationOptions, registerDecorator } from 'class-validator';

const cuidPattern = /^c[a-z0-9]{8,}$/i;

export function IsCuid(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isCuid',
      target: object.constructor,
      propertyName,
      options: { message: '$property must be a valid CUID', ...validationOptions },
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && cuidPattern.test(value);
        },
      },
    });
  };
}
