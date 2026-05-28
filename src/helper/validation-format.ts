export const validationFormat = (
  errors: any,
) => {

  return errors.map((err: any) => ({

    field: err.property,

    errors:
      Object.values(
        err.constraints,
      ),
  }));
};