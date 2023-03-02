import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';

import { client } from '../client';


const Login = () => {
  const navigate = useNavigate();
  const responseGoogle = (response) => {
    const base64Url = response.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map(function (c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
            );
            localStorage.setItem('user', JSON.stringify(jsonPayload));
            const { name, picture, sub } = JSON.parse(jsonPayload);
            
            const doc = {
              _id: sub,
              _type: 'user',
              userName: name,
              image: picture,
            };


            client.createIfNotExists(doc).then(() => {
              navigate('/', { replace: true });
    });
  };
  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className=" relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0    bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" />
          </div>

        <div className="shadow-2xl">
        <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}>
        <GoogleLogin
          onSuccess ={responseGoogle}
          onFailure ={responseGoogle}
          cookiePolicy = "single_host_origin"
        />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Login;