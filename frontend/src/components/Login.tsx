// src/components/Login.tsx
import React from 'react';

interface LoginProps {
    account: string | null | undefined; // Allow account to be undefined
}

const Login: React.FC<LoginProps> = ({ account }) => {
    return (
        <div>
            {account ? (
                <p>Connected wallet address: {account}</p>
            ) : (
                <p>Please connect your wallet.</p>
            )}
        </div>
    );
};

export default Login;
