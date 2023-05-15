import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NavLink = ({ href, icon, label, active, target, rel }) => {
    const router = useRouter();

    return (
        <Link
            href={href}
            target={target}
            rel={rel}
            className={classNames({ active: active || (!active && router.asPath === href) }, 'nav-item')}
        >
            <span className={`icon ${router.asPath === href ? 'active' : ''} ${(!icon && 'invisible') || ''}`}>
                {icon}
            </span>
            <span>{label}</span>
        </Link>
    );
};

export default NavLink;
