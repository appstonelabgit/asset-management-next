import { useRouter } from 'next/router';
import IconChain from '../Icon/IconChain';
import IconCrawl from '../Icon/IconCrawl';
import IconGear from '../Icon/IconGear';
import IconHelp from '../Icon/IconHelp';
import IconHome from '../Icon/IconHome';
import IconPageAudit from '../Icon/IconPageAudit';
import NavLink from './NavLink';
import IconUser from '../Icon/IconUser';
import { useSelector } from 'react-redux';

const NavBar = () => {
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);

    return (
        <ul className="main-nav">
            <li>
                <NavLink href="/" icon={<IconHome />} label="Dashboard" />
            </li>
            <li>
                <NavLink href="/assets" icon={<IconCrawl />} label="Assets" />
            </li>
            {user?.role === 1 && (
                <li>
                    <NavLink href="/components" icon={<IconChain />} label="Components" />
                </li>
            )}
            <li>
                <NavLink href="/accessories" icon={<IconChain />} label="Accessories" />
            </li>
            {user?.role === 1 && (
                <li>
                    <NavLink href="/users" icon={<IconUser />} label="Users" />
                </li>
            )}
            {user?.role === 1 && (
                <li>
                    <NavLink href="/sellers" icon={<IconChain />} label="Sellers" />
                </li>
            )}
            {user?.role === 1 && (
                <li>
                    <NavLink href="/models" icon={<IconChain />} label="Models" />
                </li>
            )}
            {user?.role === 1 && (
                <li>
                    <NavLink href="/brands" icon={<IconChain />} label="Brands" />
                </li>
            )}
            {/* {user?.role === 2 && (
                <li>
                    <NavLink href="/requests/send-request" icon={<IconChain />} label="Send Request" />
                </li>
            )} */}

            <li>
                <NavLink href="/requests" icon={<IconChain />} label="Requests" />
            </li>

            {/* <li>
                <NavLink
                    href="/settings/General"
                    icon={<IconGear />}
                    label="Settings"
                    active={router.asPath.startsWith('/settings')}
                />
                <ul>
                    <li>
                        <NavLink href="/settings/General" label="General" />
                    </li>
                    <li>
                        <NavLink href="/settings/Categories" label="Categories" />
                    </li>
                    <li>
                        <NavLink href="/settings/Supplier" label="Supplier" />
                    </li>
                    <li>
                        <NavLink href="/settings/Brand" label="Brand" />
                    </li>
                </ul>
            </li> */}
        </ul>
    );
};

export default NavBar;