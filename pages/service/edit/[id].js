import React from 'react';
import withApollo from '~/lib/hocs/withApollo';

const ServiceEdit = ({ params }) => {
  return <div>ServiceEdit: {params.idOrSlug}</div>;
};

ServiceEdit.getInitialProps = async ({ query: { id } }, res) => {
  return { params: { idOrSlug: id } };
};

export default withApollo(ServiceEdit);
