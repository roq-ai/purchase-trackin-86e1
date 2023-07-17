import * as yup from 'yup';

export const songValidationSchema = yup.object().shape({
  name: yup.string().required(),
  version: yup.string().required(),
  user_id: yup.string().nullable(),
});
