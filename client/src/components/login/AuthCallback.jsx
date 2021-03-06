import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { oauthAPI } from '../../apis/api';

export default function AuthCallback() {
  const history = useHistory();

  const getAccessToken = async (code) => {
    const { accessToken, refreshToken, userInfo } = await oauthAPI.getAccessToken(code);

    if (!accessToken) {
      alert('무언가 단단히 잘못됐음');
      return;
    }

    window.localStorage.setItem('accessToken', accessToken);
    window.localStorage.setItem('refreshToken', refreshToken);
    window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
    history.push('/');
  };

  const query = new URLSearchParams(useLocation().search);

  useEffect(() => {
    getAccessToken(query.get('code'));
  }, []);

  return <div />;
}
