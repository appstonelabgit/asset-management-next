import { useRouter } from 'next/router';
import IconChain from '../Icon/IconChain';
import IconCrawl from '../Icon/IconCrawl';
import IconGear from '../Icon/IconGear';
import IconHelp from '../Icon/IconHelp';
import IconHome from '../Icon/IconHome';
import IconPageAudit from '../Icon/IconPageAudit';
import NavLink from './NavLink';
import IconUser from '../Icon/IconUser';

const NavBar = () => {
    const router = useRouter();

    return (
        <ul className="main-nav">
            <li>
                <NavLink href="/" icon={<IconHome />} label="Dashboard" />
            </li>
            <li>
                <NavLink href="/users" icon={<IconUser />} label="Users" />
            </li>
            <li>
                <NavLink href="/assets" icon={<IconCrawl />} label="Assets" />
            </li>
            <li>
                <NavLink href="/components" icon={<IconChain />} label="Components" />
            </li>
            <li>
                <NavLink href="/accessories" icon={<IconChain />} label="Accessories" />
            </li>
            <li>
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
            </li>
        </ul>
    );
};

export default NavBar;
