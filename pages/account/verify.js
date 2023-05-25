import Loading from '@/components/Loading';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const AccountVerify = () => {
    const router = useRouter();
    const { resendEmailVerification, verifyEmail, logout } = useAuth();

    const resend = async () => {
        await resendEmailVerification();
    };

    useEffect(() => {
        if (router.query.token) {
            verifyEmail();
        }
    }, [router.query.token, verifyEmail]);

    return (
        <div className="min-h-screen">
            <div className="py-6">
                <div className="flex flex-col items-center justify-center space-y-5 text-4xl font-extrabold text-darkprimary">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-darkprimary text-white">
                        A
                    </div>
                    <div className="text-3xl">Assets</div>
                </div>
            </div>
            {router?.query?.token ? (
                <Loading message="Verifying..." />
            ) : (
                <div className="mx-auto max-w-lg">
                    <div className="pt-16">
                        <div className="text-center">
                            <h1 className="text-center text-[22px] font-semibold leading-7">Confirm your email</h1>
                            <p className="pt-4">
                                We&apos;ve sent an email to your inbox - please click that link to activate your
                                account. Didn&apos;t receive it?{' '}
                                <button type="button" className="text-primary hover:underline" onClick={resend}>
                                    Click here
                                </button>{' '}
                                to resend!
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <button type="button" className="btn" onClick={logout}>
                            Log out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountVerify;

AccountVerify.middleware = {
    auth: true,
    verify: false,
    companyRequired: false,
};

AccountVerify.layout = 'nosidebar';
