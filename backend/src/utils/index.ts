export const notAvailableValidate = (
  body: Record<string, any>,
  propertiesToValidated: string[]
): string => {
  const notAvailable: string[] = [];
  propertiesToValidated.forEach((property) => {
    if (!body[property]) {
      notAvailable.push(property);
    }
  });
  return notAvailable.join(", ");
};
