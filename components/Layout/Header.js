import { useWorkspace } from '@/hooks/useWorkspace';
import Image from 'next/image';
import React from 'react';

const Header = () => {
    const { workspace } = useWorkspace();
    return (
        <div className="sticky top-0 z-20 bg-white p-5 shadow-md">
            <div className="flex items-center justify-between">
                <h2 className="text-xl text-black">Assets Management</h2>
                <img src={`${workspace?.image_url || '/'}`} className="border-2 w-20 h-10" width={100} height={10} alt="logo" />
            </div>
        </div>
    );
};

export default Header;
