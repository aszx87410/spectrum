// @flow
import React from 'react';
import Head from 'src/components/head';
import getThreadLink from 'src/helpers/get-thread-link';
import generateMetaInfo from 'shared/generate-meta-info';

const ThreadHead = (props: Props) => {
  const { thread } = props;
  const {
    metaImage,
    type,
    community,
    content,
    createdAt,
    modifiedAt,
    author,
  } = thread;
  const { title, description } = generateMetaInfo({
    type: 'thread',
    data: {
      title: content.title,
      body: content.body,
      type: type,
      communityName: community.name,
    },
  });

  return (
    <Head
      title={title}
      description={description}
      type="article"
      image={metaImage}
      key={title}
    >
      <link
        rel="canonical"
        href={`https://spectrum.chat${getThreadLink(thread)}`}
      />
      {metaImage && <meta name="twitter:card" content="summary_large_image" />}
      <meta
        property="article:published_time"
        content={new Date(createdAt).toISOString()}
      />
      <meta
        property="article:modified_time"
        content={new Date(modifiedAt || createdAt).toISOString()}
      />
      <meta
        property="article:author"
        content={`https://spectrum.chat/users/@${author.user.username}`}
      />
      <meta
        property="article:section"
        content={`${community.name} community`}
      />
    </Head>
  );
};

export default ThreadHead;