import { useCallback, useEffect, useRef, useState } from 'react';
import axios from '@/libs/axios';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import TableLoadnig from '@/components/TableLoadnig';
import helper from '@/libs/helper';
import Link from 'next/link';
import IconCrawl from '@/components/Icon/IconCrawl';
import IconComponent from '@/components/Icon/IconComponent';
import IconChain from '@/components/Icon/IconChain';
import IconUser from '@/components/Icon/IconUser';
import IconSeller from '@/components/Icon/IconSeller';
import IconModel from '@/components/Icon/IconModel';
import IconBrand from '@/components/Icon/IconBrand';
import IconStatus from '@/components/Icon/IconStatus';
import IconFillDown from '@/components/Icon/IconFillDown';
import Modal from '@/components/Modal';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const Home = () => {
    const { user } = useSelector((state) => state.auth);

    const categoryModal = useRef();

    const [dashboard, setDashboard] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const getDashboardData = useCallback(() => {
        try {
            setIsLoading(true);
            axios.get(`/dashboard`).then(({ data }) => {
                setDashboard(data);
                setIsLoading(false);
            });
        } catch (error) {}
    }, []);

    useEffect(() => {
        getDashboardData();
    }, [getDashboardData]);
    return (
        <div className="">
            <div className="mx-5 mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="">
                    <Link href={'/assets'} className={`block rounded border bg-[#f59e0b] p-5 text-white shadow`}>
                        <div className="flex flex-row items-center justify-between">
                            <IconCrawl className="h-16 w-16" />
                            <div className="text-right">
                                <h3 className="text-5xl">
                                    {dashboard?.asset}
                                    <span className="text-blue-400">
                                        <i className="fas fa-caret-up"></i>
                                    </span>
                                </h3>
                                <h5 className="whitespace-nowrap">Total Assets</h5>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="">
                    <Link href={'/accessories'} className={`block rounded border bg-[#8b5cf6] p-5 text-white shadow`}>
                        <div className="flex flex-row items-center justify-between">
                            <IconChain className="h-16 w-16" />
                            <div className="text-right">
                                <h3 className="text-5xl">
                                    {dashboard?.accessory}
                                    <span className="text-blue-400">
                                        <i className="fas fa-caret-up"></i>
                                    </span>
                                </h3>
                                <h5 className="whitespace-nowrap">Total Accessories</h5>
                            </div>
                        </div>
                    </Link>
                </div>
                {user?.role === 1 && (
                    <div className="">
                        <Link
                            href={'/components'}
                            className={`block rounded border bg-[#ec4899] p-5 text-white shadow`}
                        >
                            <div className="flex flex-row items-center justify-between">
                                <IconComponent className="h-16 w-16" />
                                <div className="text-right">
                                    <h3 className="text-5xl">
                                        {dashboard?.component}
                                        <span className="text-blue-400">
                                            <i className="fas fa-caret-up"></i>
                                        </span>
                                    </h3>
                                    <h5 className="whitespace-nowrap">Total Components</h5>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
                {user?.role === 1 && (
                    <div className="">
                        <Link href={'/users'} className={`block rounded border bg-[#f87171] p-5 text-white shadow`}>
                            <div className="flex flex-row items-center justify-between">
                                <IconUser className="h-16 w-16" />
                                <div className="text-right">
                                    <h3 className="text-5xl">
                                        {dashboard?.user}
                                        <span className="text-blue-400">
                                            <i className="fas fa-caret-up"></i>
                                        </span>
                                    </h3>
                                    <h5 className="whitespace-nowrap">Total Users</h5>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
                {user?.role === 1 && (
                    <div className="">
                        <Link href={'/sellers'} className={`block rounded border bg-[#197e8b] p-5 text-white shadow`}>
                            <div className="flex flex-row items-center justify-between">
                                <IconSeller className="h-16 w-16" />
                                <div className="text-right">
                                    <h3 className="text-5xl">
                                        {dashboard?.seller}
                                        <span className="text-blue-400">
                                            <i className="fas fa-caret-up"></i>
                                        </span>
                                    </h3>
                                    <h5 className="whitespace-nowrap">Total Sellers</h5>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
                {user?.role === 1 && (
                    <div className="">
                        <Link href={'/models'} className={`block rounded border bg-[#2e5ea7] p-5 text-white shadow`}>
                            <div className="flex flex-row items-center justify-between">
                                <IconModel className="h-16 w-16" />
                                <div className="text-right">
                                    <h3 className="text-5xl">
                                        {dashboard?.model}
                                        <span className="text-blue-400">
                                            <i className="fas fa-caret-up"></i>
                                        </span>
                                    </h3>
                                    <h5 className="whitespace-nowrap">Total Models</h5>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
                {user?.role === 1 && (
                    <div className="">
                        <Link href={'/brands'} className={`block rounded border bg-[#0c8a55] p-5 text-white shadow`}>
                            <div className="flex flex-row items-center justify-between">
                                <IconBrand className="h-16 w-16" />
                                <div className="text-right">
                                    <h3 className="text-5xl">
                                        {dashboard?.brand}
                                        <span className="text-blue-400">
                                            <i className="fas fa-caret-up"></i>
                                        </span>
                                    </h3>
                                    <h5 className="whitespace-nowrap">Total Brands</h5>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
                {user?.role === 1 && (
                    <div className="">
                        <Link href={'/requests'} className={`block rounded border bg-[#0c8a6f] p-5 text-white shadow`}>
                            <div className="flex flex-row items-center justify-between">
                                <IconStatus className="h-16 w-16" />
                                <div className="text-right">
                                    <h3 className="text-5xl">
                                        {dashboard?.request}
                                        <span className="text-blue-400">
                                            <i className="fas fa-caret-up"></i>
                                        </span>
                                    </h3>
                                    <h5 className="whitespace-nowrap">Total Requests</h5>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
            </div>

            {user?.role === 1 && (
                <div className="mx-5 mb-5 grid lg:grid-cols-2 lg:space-x-5">
                    <div className="mt-2">
                        <h3 className="my-5 font-bold text-darkprimary">Recent Purchases</h3>
                        <div className="main-table w-full overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead className="bg-lightblue1">
                                    <tr>
                                        <th>Name</th>
                                        <th>Item</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <TableLoadnig totalTr={3} totalTd={3} tdWidth={60} />
                                    ) : dashboard?.recentPurchased?.length !== 0 ? (
                                        dashboard?.recentPurchased?.map((item, i) => {
                                            return (
                                                <tr key={i} className="bg-white">
                                                    <td className="capitalize">
                                                        {helper.trancateSmallString(item?.name)}
                                                    </td>
                                                    <td className="capitalize">
                                                        {helper.trancateSmallString(item?.type)}
                                                    </td>
                                                    <td className="capitalize">
                                                        {helper?.getFormattedDate(item?.purchased_at)}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr className="text-center">
                                            <td colSpan={3}>No data is available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-2">
                        <h3 className="my-5 font-bold text-darkprimary">Recent Expiries</h3>
                        <div className="main-table w-full overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead className="bg-lightblue1">
                                    <tr>
                                        <th>Name</th>
                                        <th>Item</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <TableLoadnig totalTr={3} totalTd={3} tdWidth={60} />
                                    ) : dashboard?.warrantyExpiry?.length !== 0 ? (
                                        dashboard?.warrantyExpiry?.map((item, i) => {
                                            return (
                                                <tr key={i} className="bg-white">
                                                    <td className="capitalize">
                                                        {helper.trancateSmallString(item?.name)}
                                                    </td>
                                                    <td className="capitalize">
                                                        {helper.trancateSmallString(item?.type)}
                                                    </td>
                                                    <td className="capitalize">
                                                        {helper?.getFormattedDate(item?.warranty_expired_at)}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr className="text-center">
                                            <td colSpan={3}>No data is available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="my-5 flex items-center justify-between">
                            <h3 className=" font-bold text-darkprimary">Categories</h3>
                            <button
                                type="button"
                                className="flex items-center justify-between hover:text-darkprimary"
                                onClick={() => categoryModal.current?.open()}
                            >
                                View All <IconFillDown className="-rotate-90" />
                            </button>
                        </div>
                        <div className="main-table w-full overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead className="bg-lightblue1">
                                    <tr>
                                        <th>Name</th>
                                        <th>Used</th>
                                        <th>Free</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <TableLoadnig totalTr={3} totalTd={3} tdWidth={60} />
                                    ) : dashboard?.categories?.length !== 0 ? (
                                        dashboard?.categories?.slice(0, 10)?.map((item, i) => {
                                            return (
                                                <tr key={i} className="bg-white">
                                                    <td className="capitalize">{helper.isEmpty(item?.name)}</td>
                                                    <td>{helper.isEmpty(item?.used)}</td>
                                                    <td>{helper.isEmpty(item?.free)}</td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr className="text-center">
                                            <td colSpan={3}>No data is available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <Modal ref={categoryModal} width={'800px'}>
                <div className="mx-5">
                    <h3 className="mb-5 text-xl font-bold capitalize text-darkprimary">Categories</h3>
                    <div className="main-table max-h-[500px] w-full overflow-auto">
                        <table className="w-full table-auto">
                            <thead className="bg-lightblue1">
                                <tr>
                                    <th>Name</th>
                                    <th>Used</th>
                                    <th>Free</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <TableLoadnig totalTr={3} totalTd={3} tdWidth={60} />
                                ) : dashboard?.categories?.length !== 0 ? (
                                    dashboard?.categories?.map((item, i) => {
                                        return (
                                            <tr key={i} className="bg-white">
                                                <td className="capitalize">{helper.isEmpty(item?.name)}</td>
                                                <td>{helper.isEmpty(item?.used)}</td>
                                                <td>{helper.isEmpty(item?.free)}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr className="text-center">
                                        <td colSpan={3}>No data is available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Home;

Home.middleware = {
    auth: true,
    verify: true,
};
