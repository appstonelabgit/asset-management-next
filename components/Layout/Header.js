import { useWorkspace } from '@/hooks/useWorkspace';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef } from 'react';
import Modal from '../Modal';

const Header = () => {
    const { workspace } = useWorkspace();
    const ImageModal = useRef();

    return (
        <div className="sticky top-0 z-20 bg-white p-5 shadow-md">
            <div className="flex items-center justify-between">
                <h2 className="text-md text-black">Assets Management</h2>

                <img
                    src={`${workspace?.image_url || '/'}`}
                    className="w-full max-w-[80px] md:max-w-[200px] object-cover"
                    width={100}
                    height={10}
                    alt="logo"
                    onClick={() => ImageModal?.current?.open()}
                    onError={(e) => (e.target.src = '/img/alt-image.png')}
                />
            </div>
            <Modal ref={ImageModal} width={'800px'}>
                <div className="flex items-center justify-center">
                    <img
                        src={`${workspace?.image_url || '/'}`}
                        alt="image"
                        className="w-full cursor-pointer"
                        onError={(e) => (e.target.src = '/img/alt-image.png')}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default Header;
