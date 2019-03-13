// @flow
import React, { useEffect } from 'react';
import {
  withRouter,
  type Location,
  type History,
  type Match,
} from 'react-router-dom';
import Icon from 'src/components/icons';
import { ErrorBoundary } from 'src/components/error';
import { ESC } from 'src/helpers/keycodes';
import MobileTitlebar from 'src/components/titlebar';
import { Container, Overlay, ComposerContainer, CloseButton } from '../style';

type Props = {
  previousLocation: Location,
  history: History,
  match: Match,
};

const NewDirectMessage = (props: Props) => {
  const { previousLocation, history, isModal, children } = props;

  const closeComposer = (e: any) => {
    e && e.stopPropagation();
    if (isModal) {
      history.push(previousLocation);
    } else {
      history.push('/messages');
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: any) => {
      if (e.keyCode === ESC) {
        e.stopPropagation();
        closeComposer();
      }
    };

    document.addEventListener('keydown', handleKeyPress, false);
    return () => {
      document.removeEventListener('keydown', handleKeyPress, false);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Container data-cy="dm-composer">
        <Overlay onClick={closeComposer} data-cy="dm-composer-overlay" />

        <CloseButton data-cy="close-dm-composer" onClick={closeComposer}>
          <Icon glyph="view-close" size={32} />
        </CloseButton>

        <ComposerContainer>
          {/* <MobileTitlebar
            title={'New message'}
            menuAction={'view-back'}
          /> */}
          {children}
        </ComposerContainer>
      </Container>
    </ErrorBoundary>
  );
};

export default withRouter(NewDirectMessage);