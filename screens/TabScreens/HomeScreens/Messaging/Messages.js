import React, {useEffect, useCallback, useState} from 'react';
import {View} from 'react-native';
import {GiftedChat, Bubble, Time, Avatar} from 'react-native-gifted-chat';
import {useSelector, useDispatch} from 'react-redux';

import Error from '../../../../components/Error';
import * as messagingActions from '../../../../store/actions/messaging';

const Messages = props => {
  const [error, setError] = useState();
  const [sendMessage, setSendMessage] = useState(false);
  const userId = useSelector(state => state.auth.userId);
  const userName = useSelector(state => state.auth.displayName);
  const messages = useSelector(state => state.messaging.messages);
  const roomKey = props.navigation.getParam('roomKey');
  const dispatch = useDispatch();

  const loadMessages = useCallback(async () => {
    setError(null);
    try {
      await dispatch(messagingActions.fetchMessages(roomKey));
    } catch (err) {
      setError(err.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      loadMessages,
    );

    return () => {
      willFocusSub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMessages]);

  const loadData = () => {
    loadMessages();
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, loadMessages, sendMessage]);

  const addMessage = async (message = {}) => {
    const messageData = message[0];
    await dispatch(
      messagingActions.pushMessage(
        roomKey,
        messageData.text,
        Date.now(),
        messageData.user._id,
        messageData.user.name,
      ),
    );
    setSendMessage(!sendMessage);
  };

  const getColor = username => {
    let sumChars = 0;
    for (let i = 0; i < username.length; i++) {
      sumChars += username.charCodeAt(i);
    }

    const colors = [
      '#e67e22', // carrot
      '#2ecc71', // emerald
      '#3498db', // peter river
      '#8e44ad', // wisteria
      '#e74c3c', // alizarin
      '#1abc9c', // turquoise
      '#2c3e50', // midnight blue
    ];
    return colors[sumChars % colors.length];
  };

  const renderBubble = props1 => {
    let username = props1.user.name;
    let color = getColor(username);
    return (
      <Bubble
        {...props1}
        textStyle={{
          left: {
            color: 'white',
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: color,
          },
        }}
      />
    );
  };

  const renderAvatar = props1 => {
    let username = props1.user.name;
    let color = getColor(username);
    return (
      <Avatar
        {...props1}
        imageStyle={{
          left: {
            backgroundColor: color,
          },
        }}
      />
    );
  };

  const renderTime = props1 => {
    return (
      <Time
        {...props1}
        timeTextStyle={{
          right: {
            color: 'white',
          },
          left: {
            color: 'white',
          },
        }}
      />
    );
  };

  if (error) {
    return (
      <Error
        onRetry={() => {
          loadData();
        }}
      />
    );
  }

  return (
    <View style={{flex: 1}}>
      <GiftedChat
        messages={messages}
        inverted={false}
        isTyping={true}
        renderUsernameOnMessage={true}
        renderBubble={renderBubble.bind(this)}
        // renderAvatar={renderAvatar.bind(this)}
        renderTime={renderTime.bind(this)}
        onSend={addMessage.bind(this)}
        user={{
          _id: userId,
          name: userName,
        }}
      />
    </View>
  );
};

Messages.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam('roomName'),
  };
};

export default Messages;
