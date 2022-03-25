const validateSchema = (schema, body) => {
  if (!body) {
    throw new Error('MISSING_BODY');
  }
  const { error } = schema.validate(body);
  if (error) {
    console.log('given body', body);
    console.log(error.details[0].message);
    return false;
  }
  return true;
};

module.exports = validateSchema;
