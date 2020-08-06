import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';

Amplify.configure({
	Auth: {
		userPoolId: 'us-east-1_4650Di0eN',
		userPoolWebClientId: '80rehd6vfums38hm1v4d6mepl',
	}
})

export default Auth;
