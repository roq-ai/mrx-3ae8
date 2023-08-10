import * as yup from 'yup';

export const usageValidationSchema = yup.object().shape({
  usage_date: yup.date().required(),
  usage_time: yup.date().required(),
  vehicle_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
});
