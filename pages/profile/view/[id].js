import React from 'react';
import { AccountLayout } from '~/lib/layouts/AccountLayout';
import withApollo from '~/lib/hocs/withApollo';
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';

const Profile = props => {
  return (
    <Container>
      <Avatar alt="" src="/avatars/user.svg" />
    </Container>
  );
};

Profile.Layout = AccountLayout;

export default withApollo(Profile);
