// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import InfiniteList from 'src/components/infiniteScroll';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import { withRouter } from 'react-router';
import getChannelMembersQuery from 'shared/graphql/queries/channel/getChannelMemberConnection';
import { Card } from 'src/components/card';
import { Loading, LoadingListItem } from 'src/components/loading';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import ViewError from 'src/components/viewError';
import { UserListItem } from 'src/components/entities';
import type { Dispatch } from 'redux';
import { withCurrentUser } from 'src/components/withCurrentUser';

type Props = {
  data: {
    community: GetCommunityMembersType,
    fetchMore: Function,
    networkStatus: number,
  },
  dispatch: Dispatch<Object>,
  isLoading: boolean,
  isFetchingMore: boolean,
  history: Object,
  currentUser: ?Object,
};

type State = {
  scrollElement: any,
};

class MembersList extends React.Component<Props, State> {
  state = { scrollElement: null };

  componentDidMount() {
    this.setState({
      // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
      // the AppViewWrapper which is the scrolling part of the site.
      scrollElement: document.getElementById('app-view-scroller'),
    });
  }

  shouldComponentUpdate(nextProps) {
    const curr = this.props;
    // fetching more
    if (curr.data.networkStatus === 7 && nextProps.data.networkStatus === 3)
      return false;
    return true;
  }

  render() {
    const {
      data: { channel },
      isLoading,
      currentUser,
    } = this.props;
    const { scrollElement } = this.state;

    if (channel) {
      const { edges: members, pageInfo } = channel.memberConnection;
      const nodes = members.map(member => member && member.node);
      const uniqueNodes = deduplicateChildren(nodes, 'id');
      const { hasNextPage } = pageInfo;

      return (
        <InfiniteList
          pageStart={0}
          loadMore={this.props.data.fetchMore}
          hasMore={hasNextPage}
          loader={<LoadingListItem key={0} />}
          useWindow={false}
          initialLoad={false}
          threshold={750}
        >
          {uniqueNodes.map(user => {
            if (!user) return null;

            return (
              <UserListItem
                key={user.id}
                userObject={user}
                name={user.name}
                username={user.username}
                description={user.description}
                profilePhoto={user.profilePhoto}
                isCurrentUser={currentUser && user.id === currentUser.id}
                isOnline={user.isOnline}
                avatarSize={40}
                showHoverProfile={false}
                messageButton={currentUser && user.id !== currentUser.id}
              />
            );
          })}
        </InfiniteList>
      );
    }

    if (isLoading) {
      return <Loading />;
    }

    return (
      <Card>
        <ViewError
          refresh
          heading={'We weren’t able to fetch the members of this community.'}
        />
      </Card>
    );
  }
}

export default compose(
  withRouter,
  withCurrentUser,
  getChannelMembersQuery,
  viewNetworkHandler,
  connect()
)(MembersList);