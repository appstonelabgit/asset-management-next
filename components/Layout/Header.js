import { useWorkspace } from '@/hooks/useWorkspace';
import React from 'react';

const Header = () => {
    const { workspace } = useWorkspace();

    return (
        <div className="sticky top-0 z-20 bg-white p-5 shadow-md">
            <div className="flex items-center justify-between">
                <h2 className="text-md font-bold text-black">Assets Management</h2>

                <div className="h-10 ">
                    <img
                        src={`${workspace?.image_url || '/'}`}
                        className="h-full w-full object-cover object-center"
                        width={100}
                        height={10}
                        alt="logo"
                        onError={(e) => (e.target.src = '/img/alt-image.png')}
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;
