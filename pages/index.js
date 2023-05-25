import { useCallback, useEffect, useState } from 'react';
import axios from '@/libs/axios';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const Home = () => {
    const { user } = useSelector((state) => state.auth);

    const [dashboard, setDashboard] = useState({});

    const getDashboardData = useCallback(() => {
        try {
            axios.get(`/dashboard`).then(({ data }) => {
                setDashboard(data);
            });
        } catch (error) {}
    }, []);

    const areaChart = {
        series: [
            {
                name: 'Income',
                data: [0, 16800, 15500, 17800, 15500, 0, 19000, 16000, 15000, 17000, 14000, 17000],
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
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
        series: [44, 55, 13, 20],
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

    useEffect(() => {
        getDashboardData();
    }, [getDashboardData]);
    return (
        <div className='hidden'>
            <div className="mb-2 flex flex-wrap">
                <div className="w-1/2 px-3 pt-3 md:w-1/3 md:pl-2 xl:w-1/3">
                    <div className={`rounded border bg-[#f59e0b] p-5 text-white shadow`}>
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
                    </div>
                </div>
                <div className="w-1/2 px-3 pt-3 md:w-1/3 md:pl-2 xl:w-1/3">
                    <div className={`rounded border bg-[#8b5cf6] p-5 text-white shadow`}>
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
                    </div>
                </div>
                {user?.role === 1 && (
                    <div className="w-1/2 px-3 pt-3 md:w-1/3 md:pl-2 xl:w-1/3">
                        <div className={`rounded border bg-[#ec4899] p-5 text-white shadow`}>
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
                        </div>
                    </div>
                )}
            </div>
            <div className="mx-5 mt-5 flex flex-col lg:flex-row space-x-5">
                <div className="w-full lg:w-2/3 mt-2">
                    <p className='font-bold text-darkprimary'>Last Year Purchases</p>
                    <ReactApexChart
                        series={areaChart.series}
                        options={areaChart.options}
                        className="rounded-lg bg-white shadow-md"
                        type="area"
                        height={300}
                    />
                </div>
                <div className="w-full lg:w-1/3 mt-2">
                    <p className='font-bold text-darkprimary'>Request Status</p>
                    <ReactApexChart
                        series={donutChart.series}
                        options={donutChart.options}
                        className=" bg-white shadow-md"
                        type="donut"
                        height={350}
                    />
                </div>
            </div>

            <div className="mx-5 flex flex-col lg:flex-row space-x-5">
                <div className="w-full lg:w-1/2 mt-2">
                    <h3 className="my-5 font-bold text-darkprimary">Recent Purchases</h3>
                    <div className="main-table w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead className="bg-lightblue1">
                                <tr>
                                    <th>Date</th>
                                    <th>Item</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white">
                                    <td>2023-04-20 11:50 AM</td>
                                    <td>Dell Mouse</td>
                                </tr>
                                <tr className="bg-white">
                                    <td>2023-04-20 11:50 AM</td>
                                    <td>Dell Mouse</td>
                                </tr>
                                <tr className="bg-white">
                                    <td>2023-04-20 11:50 AM</td>
                                    <td>Dell Mouse</td>
                                </tr>
                                <tr className="bg-white">
                                    <td>2023-04-20 11:50 AM</td>
                                    <td>Dell Mouse</td>
                                </tr>
                                <tr className="bg-white">
                                    <td>2023-04-20 11:50 AM</td>
                                    <td>Dell Mouse</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 mt-2">
                    <h3 className="my-5 font-bold text-darkprimary">Recent expiries</h3>
                    <div className="main-table w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead className="bg-lightblue1">
                                <tr>
                                    <th>Date</th>
                                    <th>Item</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white">
                                    <td>2023-04-20 11:50 AM</td>
                                    <td>Dell Mouse</td>
                                </tr>
                                <tr className="bg-white">
                                    <td>2023-04-20 11:50 AM</td>
                                    <td>Dell Mouse</td>
                                </tr>
                                <tr className="bg-white">
                                    <td>2023-04-20 11:50 AM</td>
                                    <td>Dell Mouse</td>
                                </tr>
                                <tr className="bg-white">
                                    <td>2023-04-20 11:50 AM</td>
                                    <td>Dell Mouse</td>
                                </tr>
                                <tr className="bg-white">
                                    <td>2023-04-20 11:50 AM</td>
                                    <td>Dell Mouse</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

Home.middleware = {
    auth: true,
    verify: true,
};
