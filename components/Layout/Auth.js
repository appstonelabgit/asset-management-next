import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loading from '../Loading';

const Auth = ({ children, verify: verificationRequired, companyRequired }) => {
    const router = useRouter();
    const { status, user, company } = useSelector((state) => state.auth);
    const isVerified = user?.email_verified_at;
    const hasCompany = user?.last_company_login_id && company;
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && verificationRequired === true && !isVerified) {
            router.push('/account/verify');
        } else if (status === 'authenticated' && verificationRequired === false && isVerified) {
            router.push('/');
        } else if (status === 'authenticated' && !hasCompany && companyRequired !== false) {
            router.push('/add-company');
        }
    }, [status, router, verificationRequired, isVerified, hasCompany, companyRequired]);

    if (
        status !== 'authenticated' ||
        (verificationRequired === true && !isVerified) ||
        (companyRequired !== false && !hasCompany)
    ) {
        return <Loading />;
    }

    return children;
};

export default Auth;
