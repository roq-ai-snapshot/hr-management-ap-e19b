import * as yup from 'yup';

export const ownerValidationSchema = yup.object().shape({
  start_date: yup.date().required(),
  end_date: yup.date().nullable(),
  ownership_percentage: yup.number().integer().required(),
  user_id: yup.string().nullable().required(),
  company_id: yup.string().nullable().required(),
});
