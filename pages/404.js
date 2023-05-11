import Link from 'next/link';
import React from 'react';

const Custom404 = () => {
    return (
        <div className="bg-gray-100 flex min-h-screen flex-col items-center justify-center">
            <h1 className="text-gray-900 mb-4 text-6xl font-bold">404 - Page Not Found</h1>
            <p className="text-gray-600 mb-8 text-xl">Sorry, we could not find what you were looking for.</p>
            <Link href="/" className="btn">
                Go back home
            </Link>
        </div>
    );
};

export default Custom404;

Custom404.layout = 'nosidebar';
