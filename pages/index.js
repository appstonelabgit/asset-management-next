import { useCallback, useEffect, useState } from 'react';
import axios from '@/libs/axios';

const Home = () => {
    const [dashboard, setDashboard] = useState({});

    const getDashboardData = useCallback(() => {
        axios.get(`/users/dashboard`).then(({ data }) => {
            setDashboard(data);
        });
    }, []);

    useEffect(() => {
        getDashboardData();
    }, [getDashboardData]);
    return (
        <div>
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
            </div>

            <div className="mx-5">
                <h3 className="my-5">Recent Activity</h3>
                <div className="main-table w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-lightblue1">
                            <tr>
                                <th>Date</th>
                                <th>Admin</th>
                                <th>Item</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white">
                                <td>2023-04-20 11:50 AM</td>
                                <td>Admin Admin</td>
                                <td>Dell Mouse</td>
                            </tr>
                            <tr className="bg-white">
                                <td>2023-04-20 11:50 AM</td>
                                <td>Admin Admin</td>
                                <td>Dell Mouse</td>
                            </tr>
                            <tr className="bg-white">
                                <td>2023-04-20 11:50 AM</td>
                                <td>Admin Admin</td>
                                <td>Dell Mouse</td>
                            </tr>
                            <tr className="bg-white">
                                <td>2023-04-20 11:50 AM</td>
                                <td>Admin Admin</td>
                                <td>Dell Mouse</td>
                            </tr>
                            <tr className="bg-white">
                                <td>2023-04-20 11:50 AM</td>
                                <td>Admin Admin</td>
                                <td>Dell Mouse</td>
                            </tr>
                            <tr className="bg-white">
                                <td>2023-04-20 11:50 AM</td>
                                <td>Admin Admin</td>
                                <td>Dell Mouse</td>
                            </tr>
                            <tr className="bg-white">
                                <td>2023-04-20 11:50 AM</td>
                                <td>Admin Admin</td>
                                <td>Dell Mouse</td>
                            </tr>
                            <tr className="bg-white">
                                <td>2023-04-20 11:50 AM</td>
                                <td>Admin Admin</td>
                                <td>Dell Mouse</td>
                            </tr>
                        </tbody>
                    </table>
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
