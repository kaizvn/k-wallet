import { ACCOUNT_ROLES, STATUS, APP_ACTIONS } from '@revtech/rev-shared/enums';
import {
  DATE_TIME_FORMAT,
  getLabelByActionWithT
} from '@revtech/rev-shared/utils';
import { UserStatusComponent } from '@revtech/rev-shared/components';
import {
  InfoLayout,
  Button,
  CardSimpleLayout
} from '@revtech/rev-shared/layouts';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Moment from 'react-moment';
import React from 'react';
import Router from 'next/router';

import {
  approveMember,
  banMember,
  unbanMember,
  rejectMember
} from '../stores/PartnerState';
import { getPartnerMemberDetails } from '@revtech/rev-shared/apis/actions';
import { getPartnerMemberDetailsSelector } from '@revtech/rev-shared/apis/selectors';
import { Grid, Typography } from '@material-ui/core';

const { ROLE_MEMBER } = ACCOUNT_ROLES;
const { U_ACTIVE, U_BANNED, U_PENDING } = STATUS;

const { U_APPROVE, U_BAN, U_REJECT, U_UNBAN } = APP_ACTIONS;

const connectToRedux = connect(
  createStructuredSelector({
    member: getPartnerMemberDetailsSelector
  }),
  dispatch => ({
    getPartnerUserDetails: id => dispatch(getPartnerMemberDetails(id)),
    approveMember: id => dispatch(approveMember(id)),
    rejectMember: id => dispatch(rejectMember(id)),
    banMember: id => dispatch(banMember(id)),
    unbanMember: id => dispatch(unbanMember(id))
  })
);
const enhance = compose(connectToRedux, withTranslation(['member', 'common']));
class MemberDetailsComponent extends React.Component {
  componentDidMount() {
    this.props.getPartnerUserDetails(Router.query.id);
  }
  render() {
    const {
      member,
      approveMember,
      rejectMember,
      banMember,
      unbanMember,
      t
    } = this.props;
    const rows = [
      { label: t('detail.member_detail.label.username'), key: 'username' },
      { label: t('detail.member_detail.label.fullname'), key: 'fullname' },
      { label: t('detail.member_detail.label.partner_id'), key: 'partnerId' },
      { label: t('detail.member_detail.label.country'), key: 'country' },
      { label: t('detail.member_detail.label.gender'), key: 'gender' },
      { label: t('detail.member_detail.label.email'), key: 'email' },
      { label: t('detail.member_detail.label.join_date'), key: 'joinDate' },
      { label: t('detail.member_detail.label.birth_date'), key: 'birthDate' },
      { label: t('detail.member_detail.label.status'), key: 'status' },
      { label: t('detail.member_detail.label.role'), key: 'role' }
    ];
    let displays = {};
    if (member)
      displays = {
        username: member.username,
        partnerId: member.partner
          ? member.partner.partnerId
          : 'Not defined yet',
        fullname: member.fullName,
        country: member.country,
        gender: member.gender,
        email: member.email,
        joinDate: <Moment format={DATE_TIME_FORMAT}>{member.birthDate}</Moment>,
        birthDate:
          member.birthMonth + '/' + member.birthDay + '/' + member.birthYear,
        status: <UserStatusComponent t={t} status={member.status} />,
        role: member.role
      };

    return !member ? (
      <div />
    ) : (
      <Grid container justify="center">
        <Grid lg={10} sm={12} item className="shadow">
          <CardSimpleLayout
            header={
              <Grid container justify="space-between" alignItems="center">
                <Typography variant="h5">
                  {t('detail.member_detail.title')}
                </Typography>
                {member.role === ROLE_MEMBER && (
                  <React.Fragment>
                    {member.status === U_ACTIVE && (
                      <Button
                        type="submit"
                        onClick={() => banMember(member.id)}
                      >
                        {getLabelByActionWithT({ action: U_BAN, t })}
                      </Button>
                    )}
                    {member.status === U_BANNED && (
                      <Button
                        type="submit"
                        onClick={() => unbanMember(member.id)}
                      >
                        {getLabelByActionWithT({ action: U_UNBAN, t })}
                      </Button>
                    )}
                    {member.status === U_PENDING && (
                      <React.Fragment>
                        <Button
                          type="submit"
                          onClick={() => approveMember(member.id)}
                        >
                          {getLabelByActionWithT({ action: U_APPROVE, t })}
                        </Button>
                        <Button
                          type="submit"
                          color="secondary"
                          onClick={() => rejectMember(member.id)}
                        >
                          {getLabelByActionWithT({ action: U_REJECT, t })}
                        </Button>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
              </Grid>
            }
            body={
              <InfoLayout
                title="Profile Info"
                subtitle=""
                rows={rows}
                displays={displays}
              />
            }
          />
        </Grid>
      </Grid>
    );
  }
}

export default enhance(MemberDetailsComponent);
