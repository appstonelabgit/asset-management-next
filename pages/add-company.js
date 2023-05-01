import CompanyInsertForm from '@/components/Company/CompanyInsertForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

const AddCompany = () => {
    const { logout } = useAuth();
    const { query } = useRouter();
    return (
        <div className="min-h-screen">

            <div className="flex min-h-[calc(100vh-77px)] items-center justify-center px-4 pb-[77px] sm:px-10">
                <div className="py-10 max-w-[600px] w-full">
                <div className="flex flex-col items-center justify-center space-y-5 text-4xl font-extrabold text-darkprimary">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-darkprimary text-white">
                            A
                        </div>
                        <div className="text-3xl">Assets</div>
                    </div>
                    <CompanyInsertForm redirect="/" />
                    <p className="mt-6 text-center text-lightblack">
                        {query.gb === "1" ? (
                            <button
                                type="button"
                                className="text-lightblack underline transition-all duration-300 hover:text-darkblue"
                                onClick={() => history.back()}
                            >
                                Back
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="text-lightblack underline transition-all duration-300 hover:text-darkblue"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddCompany;

AddCompany.middleware = {
    auth: true,
    verify: true,
};

AddCompany.layout = 'nosidebar';
