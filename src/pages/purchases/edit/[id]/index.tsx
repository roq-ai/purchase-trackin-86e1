import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
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
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getPurchaseById, updatePurchaseById } from 'apiSdk/purchases';
import { Error } from 'components/error';
import { purchaseValidationSchema } from 'validationSchema/purchases';
import { PurchaseInterface } from 'interfaces/purchase';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { SongInterface } from 'interfaces/song';
import { PlatformInterface } from 'interfaces/platform';
import { UserInterface } from 'interfaces/user';
import { getSongs } from 'apiSdk/songs';
import { getPlatforms } from 'apiSdk/platforms';
import { getUsers } from 'apiSdk/users';

function PurchaseEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PurchaseInterface>(
    () => (id ? `/purchases/${id}` : null),
    () => getPurchaseById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PurchaseInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePurchaseById(id, values);
      mutate(updated);
      resetForm();
      router.push('/purchases');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PurchaseInterface>({
    initialValues: data,
    validationSchema: purchaseValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Purchase
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="units_purchased" mb="4" isInvalid={!!formik.errors?.units_purchased}>
              <FormLabel>Units Purchased</FormLabel>
              <NumberInput
                name="units_purchased"
                value={formik.values?.units_purchased}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('units_purchased', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.units_purchased && <FormErrorMessage>{formik.errors?.units_purchased}</FormErrorMessage>}
            </FormControl>
            <FormControl id="purchase_date" mb="4">
              <FormLabel>Purchase Date</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.purchase_date ? new Date(formik.values?.purchase_date) : null}
                  onChange={(value: Date) => formik.setFieldValue('purchase_date', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <AsyncSelect<SongInterface>
              formik={formik}
              name={'song_id'}
              label={'Select Song'}
              placeholder={'Select Song'}
              fetcher={getSongs}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <AsyncSelect<PlatformInterface>
              formik={formik}
              name={'platform_id'}
              label={'Select Platform'}
              placeholder={'Select Platform'}
              fetcher={getPlatforms}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
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
    entity: 'purchase',
    operation: AccessOperationEnum.UPDATE,
  }),
)(PurchaseEditPage);
