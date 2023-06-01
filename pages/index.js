import { useCallback, useEffect, useState } from 'react';
import axios from '@/libs/axios';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import TableLoadnig from '@/components/TableLoadnig';
import helper from '@/libs/helper';
import Link from 'next/link';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const Home = () => {
    const { user } = useSelector((state) => state.auth);

    const [dashboard, setDashboard] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const lastYearMonth = () => {
        const currentMonth = new Date().getMonth() + 1;
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        const monthsFromCurrent = months.slice(currentMonth).concat(months.slice(0, currentMonth));
        return monthsFromCurrent;
    };

    const areaChart = {
        series: [
            {
                name: 'Total Purchase Cost',
                data: dashboard?.totalCost,
            },
        ],
        options: {
            chart: {
                type: 'area',
                height: 300,
                zoom: {
                    enabled: true,
                },
                toolbar: {
                    show: true,
                },
                background: '#fff',
            },
            colors: ['#805dca'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                curve: 'smooth',
            },
            xaxis: {
                axisBorder: {
                    color: '#e0e6ed',
                },
            },
            yaxis: {
                opposite: false,
                labels: {
                    offsetX: 0,
                },
            },
            labels: lastYearMonth(),
            legend: {
                horizontalAlign: 'left',
            },
            grid: {
                borderColor: '#E0E6ED',
            },
            tooltip: {
                theme: 'light',
            },
        },
    };
    const donutChart = {
        series: [
            dashboard?.pendingRequest,
            dashboard?.onHoldRequest,
            dashboard?.approvedRequest,
            dashboard?.rejectedRequest,
        ],
        options: {
            chart: {
                height: 300,
                type: 'donut',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
                background: '#fff',
            },
            stroke: {
                show: false,
            },
            labels: ['Pending', 'On Hold', 'Approved', 'Rejected'],
            colors: ['#93c5fd', '#fde047', '#86efac', '#f87171'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                    },
                },
            ],
            legend: {
                position: 'bottom',
            },
        },
    };

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
            <div className="mb-2 flex flex-wrap">
                <div className="w-full px-3 pt-3 md:w-1/3 md:pl-2 xl:w-1/3">
                    <Link href={'/assets'} className={`block rounded border bg-[#f59e0b] p-5 text-white shadow`}>
                        <div className="flex flex-row items-center">
                            <div className="flex-1 text-right">
                                <h5 className="">Total Assets</h5>
                                <h3 className="text-5xl">
                                    {dashboard?.asset}
                                    <span className="text-blue-400">
                                        <i className="fas fa-caret-up"></i>
                                    </span>
                                </h3>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="w-full px-3 pt-3 md:w-1/3 md:pl-2 xl:w-1/3">
                    <Link href={'/accessories'} className={`block rounded border bg-[#8b5cf6] p-5 text-white shadow`}>
                        <div className="flex flex-row items-center">
                            <div className="flex-1 text-right">
                                <h5 className="">Total Accessories</h5>
                                <h3 className="text-5xl">
                                    {dashboard?.accessory}
                                    <span className="text-blue-400">
                                        <i className="fas fa-caret-up"></i>
                                    </span>
                                </h3>
                            </div>
                        </div>
                    </Link>
                </div>
                {user?.role === 1 && (
                    <div className="w-full px-3 pt-3 md:w-1/3 md:pl-2 xl:w-1/3">
                        <Link
                            href={'/components'}
                            className={`block rounded border bg-[#ec4899] p-5 text-white shadow`}
                        >
                            <div className="flex flex-row items-center">
                                <div className="flex-1 text-right">
                                    <h5 className="">Total Components</h5>
                                    <h3 className="text-5xl">
                                        {dashboard?.component}
                                        <span className="text-blue-400">
                                            <i className="fas fa-caret-up"></i>
                                        </span>
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
            </div>

            <div className="mx-5 mt-5 flex flex-col lg:flex-row lg:space-x-5">
                {user?.role === 1 && (
                    <div className="mt-2 w-full lg:w-2/3">
                        <p className="font-bold text-darkprimary">Last Year Purchases</p>
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <span className="m-auto mb-10 inline-block h-12 w-12 animate-spin rounded-full border-4 border-darkprimary border-l-transparent align-middle"></span>
                            </div>
                        ) : (
                            <ReactApexChart
                                series={areaChart.series}
                                options={areaChart.options}
                                className="rounded-lg bg-white shadow-md"
                                type="area"
                                height={300}
                            />
                        )}
                    </div>
                )}
                <div className="mt-2 w-full lg:w-1/3">
                    <p className="font-bold text-darkprimary">Request Status</p>
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <span className="m-auto mb-10 inline-block h-12 w-12 animate-spin rounded-full border-4 border-darkprimary border-l-transparent align-middle"></span>
                        </div>
                    ) : (
                        <ReactApexChart
                            series={donutChart.series}
                            options={donutChart.options}
                            className=" bg-white shadow-md"
                            type="donut"
                            height={350}
                        />
                    )}
                </div>
            </div>

            {user?.role === 1 && (
                <div className="mx-5 flex flex-col lg:flex-row lg:space-x-5">
                    <div className="mt-2 w-full lg:w-1/2">
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
                    <div className="mt-2 w-full lg:w-1/2">
                        <h3 className="my-5 font-bold text-darkprimary">Recent expiries</h3>
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
                </div>
            )}
        </div>
    );
};

export default Home;

Home.middleware = {
    auth: true,
    verify: true,
};
