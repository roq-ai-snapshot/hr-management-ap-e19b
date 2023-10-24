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
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { useRoqClient } from 'lib/roq';
import * as RoqTypes from 'lib/roq/types';

import { customerValidationSchema } from 'validationSchema/customers';
import { UserInterface } from 'interfaces/user';
import { CompanyInterface } from 'interfaces/company';
import { CustomerInterface } from 'interfaces/customer';

function CustomerCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const roqClient = useRoqClient();
  const handleSubmit = async (values: CustomerInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await roqClient.customer.create({ data: values as RoqTypes.customer });
      resetForm();
      router.push('/customers');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CustomerInterface>({
    initialValues: {
      registration_date: new Date(new Date().toDateString()),
      last_purchase_date: new Date(new Date().toDateString()),
      total_purchases: 0,
      total_spent: 0,
      user_id: (router.query.user_id as string) ?? null,
      company_id: (router.query.company_id as string) ?? null,
    },
    validationSchema: customerValidationSchema,
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
              label: 'Customers',
              link: '/customers',
            },
            {
              label: 'Create Customer',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Customer
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="registration_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Registration Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.registration_date ? new Date(formik.values?.registration_date) : null}
              onChange={(value: Date) => formik.setFieldValue('registration_date', value)}
            />
          </FormControl>
          <FormControl id="last_purchase_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Last Purchase Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.last_purchase_date ? new Date(formik.values?.last_purchase_date) : null}
              onChange={(value: Date) => formik.setFieldValue('last_purchase_date', value)}
            />
          </FormControl>

          <NumberInput
            label="Total Purchases"
            formControlProps={{
              id: 'total_purchases',
              isInvalid: !!formik.errors?.total_purchases,
            }}
            name="total_purchases"
            error={formik.errors?.total_purchases}
            value={formik.values?.total_purchases}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('total_purchases', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Total Spent"
            formControlProps={{
              id: 'total_spent',
              isInvalid: !!formik.errors?.total_spent,
            }}
            name="total_spent"
            error={formik.errors?.total_spent}
            value={formik.values?.total_spent}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('total_spent', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={() => roqClient.user.findManyWithCount({})}
            labelField={'email'}
          />
          <AsyncSelect<CompanyInterface>
            formik={formik}
            name={'company_id'}
            label={'Select Company'}
            placeholder={'Select Company'}
            fetcher={() => roqClient.company.findManyWithCount({})}
            labelField={'name'}
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
              onClick={() => router.push('/customers')}
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
    entity: 'customer',
    operation: AccessOperationEnum.CREATE,
  }),
)(CustomerCreatePage);
