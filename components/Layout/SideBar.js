import Link from 'next/link';
import IconDownArrow from '@/components/Icon/IconDownArrow';
import IconMoon from '@/components/Icon/IconMoon';
import IconUser from '@/components/Icon/IconUser';
import IconArrowBarLeft from '@/components/Icon/IconArrowBarLeft';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from '@/components/Dropdown';
import IconSun from '../Icon/IconSun';
import NavBar from '../Nav/NavBar';
import { setHasMenuExpanded } from '@/store/appSlice';
import { useAuth } from '@/hooks/useAuth';
import CompanyDropdown from '../Company/CompanyDropdown';

const SideBar = () => {
    const { logout } = useAuth();
    const { status, user, company } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const profileDropdownRef = useRef();

    const [expanded, setExpanded] = useState();

    const toggleSidebar = (value) => {
        setExpanded(value);
        localStorage.setItem('sidebar.__expanded', value.toString());
    };

    useEffect(() => {
        dispatch(setHasMenuExpanded(expanded));
    }, [dispatch, expanded]);

    const toggleDarkMode = () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 1023) {
            console.log("sfsdf");
            setExpanded(true);
        } else {
            setExpanded(false);
        }

        if (typeof window !== 'undefined' && window.innerWidth >= 1023) {
            if (localStorage.getItem('sidebar.__expanded') !== null) {
                setExpanded(localStorage.getItem('sidebar.__expanded') === 'true');
            } else {
                toggleSidebar(true);
            }
        } else {
            toggleSidebar(false);
        }
        if (localStorage.getItem('darkMode') === 'true') {
            document.documentElement.classList.add('dark');
        }
    }, []);



    return (
        <div className={`main-sidebar ${(!expanded && 'collapsed') || ''}`}>
            <div className="flex shrink-0 items-center justify-between px-4">
                {expanded && (
                    <Link href="/">
                        <h1 className="flex items-center text-2xl font-extrabold text-darkprimary">
                            <span className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-darkprimary text-white">
                                A
                            </span>
                            Assets
                        </h1>
                    </Link>
                )}

                <button type="button" onClick={() => toggleSidebar(!expanded)}>
                    <IconArrowBarLeft className={classNames([expanded ? 'rotate-0' : 'rotate-180'])} />
                </button>
            </div>
            <div className="mt-7  flex items-center justify-center">
                {!expanded && (
                    <Link href="/">
                        <h1 className="flex h-10 w-10 items-center justify-center rounded-full bg-darkprimary text-2xl font-extrabold text-white">
                            A
                        </h1>
                    </Link>
                )}
            </div>

            {expanded && (
                <div className="mt-4 flex shrink-0 items-center justify-between px-4">
                    <CompanyDropdown />
                </div>
            )}

            <div className="mt-7 grow overflow-y-auto text-sm">
                <NavBar />
            </div>

            <div className="mx-4 mt-auto flex shrink-0 items-center justify-between pt-4">
                <Dropdown
                    ref={profileDropdownRef}
                    offset={[0, 5]}
                    placement="top-start"
                    btnClassName="flex items-center"
                    button={
                        <>
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-darkblue dark:bg-white/10 dark:text-white">
                                <IconUser />
                            </span>
                            {expanded && (
                                <>
                                    <span className="line-clamp-1 ml-2 grow text-left text-xs">nitin</span>
                                    <IconDownArrow className="ml-4 shrink-0" />
                                </>
                            )}
                        </>
                    }
                >
                    <div className="w-32 text-xs" onClick={() => profileDropdownRef.current.close()}>
                        <Link
                            href="/my-account"
                            className="block w-full cursor-pointer truncate py-2.5 px-5 text-left hover:bg-lightblue1"
                        >
                            Profile
                        </Link>
                        <button
                            type="button"
                            className="block w-full cursor-pointer truncate py-2.5 px-5 text-left hover:bg-lightblue1"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
                </Dropdown>
                {expanded && (
                    <button className="ml-4 text-darkblue dark:text-white" onClick={toggleDarkMode}>
                        <IconMoon className="w-4 dark:hidden" />
                        <IconSun className="hidden w-4 dark:block" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SideBar;
