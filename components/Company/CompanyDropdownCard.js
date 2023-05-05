import { useWorkspace } from '@/hooks/useWorkspace';
import { useSelector } from 'react-redux';

const CompanyDropdownCard = ({ company }) => {
    const { user } = useSelector((state) => state.auth);

    const { toggle } = useWorkspace();

    return (
        <div
            className={`${
                user.last_company_login_id === company.id ? 'bg-lightblue1' : ''
            } flex items-center justify-around hover:bg-lightblue1`}
        >
            <button
                type="button"
                className="block w-full max-w-xs cursor-pointer truncate  py-2.5 px-5 text-left "
                onClick={() => toggle(company.id)}
            >
                {company.name}
            </button>
        </div>
    );
};

export default CompanyDropdownCard;
