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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPurchase } from 'apiSdk/purchases';
import { Error } from 'components/error';
import { purchaseValidationSchema } from 'validationSchema/purchases';
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
import { PurchaseInterface } from 'interfaces/purchase';

function PurchaseCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PurchaseInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPurchase(values);
      resetForm();
      router.push('/purchases');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PurchaseInterface>({
    initialValues: {
      units_purchased: 0,
      purchase_date: new Date(new Date().toDateString()),
      song_id: (router.query.song_id as string) ?? null,
      platform_id: (router.query.platform_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
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
            Create Purchase
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
    operation: AccessOperationEnum.CREATE,
  }),
)(PurchaseCreatePage);
