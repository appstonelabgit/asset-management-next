import { useWorkspace } from '@/hooks/useWorkspace';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Dropdown from '../Dropdown';
import IconDownArrow from '../Icon/IconDownArrow';
import CompanyDropdownCard from './CompanyDropdownCard';

const CompanyDropdown = () => {
    const { workspace } = useWorkspace();
    const { user, company } = useSelector((state) => state.auth);

    return (
        <Dropdown
            offset={[0, 5]}
            placement="bottom-start"
            btnClassName="flex items-center"
            button={
                <>
                    <span className="max-w-[135px] truncate text-lg font-bold capitalize">
                        {workspace?.name || 'Add company'}
                    </span>
                    {/* <IconDownArrow className="ml-2 text-darkblue dark:text-white" /> */}
                </>
            }
        >
            {/* <div className="text-sm">
                {company?.length &&
                    company?.map((item) => <CompanyDropdownCard key={item.id} company={item} />)}
                <Link
                    href="/add-company?gb=1"
                    className="block w-full max-w-xs cursor-pointer truncate py-2.5 px-5 text-left hover:bg-lightblue1"
                >
                    Add company
                </Link>
            </div> */}
        </Dropdown>
    );
};

export default CompanyDropdown;
