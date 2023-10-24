import * as yup from 'yup';

export const customerValidationSchema = yup.object().shape({
  registration_date: yup.date().required(),
  last_purchase_date: yup.date().nullable(),
  total_purchases: yup.number().integer().required(),
  total_spent: yup.number().integer().required(),
  user_id: yup.string().nullable().required(),
  company_id: yup.string().nullable().required(),
});
