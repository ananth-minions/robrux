import React from 'react';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { withProtectedRoute } from '../lib/hocs/withAuth';

const Forgot = () => {
  return (
    <DefaultLayout>
      <div>Forgot</div>
    </DefaultLayout>
  );
};

export default withProtectedRoute(Forgot);
