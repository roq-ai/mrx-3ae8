import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getUsageById, updateUsageById } from 'apiSdk/usages';
import { usageValidationSchema } from 'validationSchema/usages';
import { UsageInterface } from 'interfaces/usage';
import { VehicleInterface } from 'interfaces/vehicle';
import { UserInterface } from 'interfaces/user';
import { getVehicles } from 'apiSdk/vehicles';
import { getUsers } from 'apiSdk/users';

function UsageEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<UsageInterface>(
    () => (id ? `/usages/${id}` : null),
    () => getUsageById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: UsageInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateUsageById(id, values);
      mutate(updated);
      resetForm();
      router.push('/usages');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<UsageInterface>({
    initialValues: data,
    validationSchema: usageValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Usages',
              link: '/usages',
            },
            {
              label: 'Update Usage',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Usage
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="usage_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Usage Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.usage_date ? new Date(formik.values?.usage_date) : null}
              onChange={(value: Date) => formik.setFieldValue('usage_date', value)}
            />
          </FormControl>
          <FormControl id="usage_time" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Usage Time
            </FormLabel>
            <DatePicker
              selected={formik.values?.usage_time ? new Date(formik.values?.usage_time) : null}
              onChange={(value: Date) => formik.setFieldValue('usage_time', value)}
            />
          </FormControl>
          <AsyncSelect<VehicleInterface>
            formik={formik}
            name={'vehicle_id'}
            label={'Select Vehicle'}
            placeholder={'Select Vehicle'}
            fetcher={getVehicles}
            labelField={'vehicle_info'}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/usages')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'usage',
    operation: AccessOperationEnum.UPDATE,
  }),
)(UsageEditPage);
