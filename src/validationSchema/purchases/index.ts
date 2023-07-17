import * as yup from 'yup';

export const purchaseValidationSchema = yup.object().shape({
  units_purchased: yup.number().integer().required(),
  purchase_date: yup.date().required(),
  song_id: yup.string().nullable(),
  platform_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
