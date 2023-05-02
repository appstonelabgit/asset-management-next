import axios from '@/libs/axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useWorkspace = () => {
    const { status, user, company } = useSelector((state) => state.auth);
    const [workspace, setWorkspace] = useState(false);

    useEffect(() => {
        if (status !== 'authenticated') {
            setWorkspace(false);
        }

        if (!user?.last_company_login_id) {
            setWorkspace(false);
        }

        if (!company?.length) {
            setWorkspace(false);
        }

        const companys = company?.find((item) => parseInt(item.id) === parseInt(user?.last_company_login_id));

        if (!companys) {
            setWorkspace(false);
        }

        setWorkspace(companys);
    }, [status, user]);

    const toggle = async (id) => {
        try {
            await axios.post(`/select/company/${id}`);
            window.location = '/';
        } catch {}
    };

    return { workspace, toggle };
};
