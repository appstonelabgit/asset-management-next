import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loading from '../Loading';

const Auth = ({ children, verify: verificationRequired, companyRequired, isAdmin }) => {
    const router = useRouter();
    const { status, user, company } = useSelector((state) => state.auth);
    const isVerified = user?.email_verified_at;
    const hasCompany = user?.role === 1 ? user?.company_login_id && company : user?.company_id;

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && verificationRequired === true && !isVerified) {
            router.push('/account/verify');
        } else if (status === 'authenticated' && verificationRequired === false && isVerified) {
            router.push('/assets');
        } else if (status === 'authenticated' && !hasCompany && companyRequired !== false) {
            router.push('/add-company');
        } else if (status === 'authenticated' && hasCompany && user?.role !== 1 && isAdmin === false) {
            router.push('/404');
        }
    }, [status, router, verificationRequired, isVerified, hasCompany, companyRequired, user?.role, isAdmin]);

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
