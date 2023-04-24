import { useAuth } from '@/hooks/useAuth';
import toast from '@/libs/toast';

const Home = () => {
    const { logout } = useAuth();

    const DashBox = [
        {
            heading: 'Total Users',
            count: 10,
            color: 'bg-darkprimary',
        },
        {
            heading: 'Total Components',
            count: 30,
            color: 'bg-[#f59e0b]',
        },
        {
            heading: 'Total Accessories',
            count: 20,
            color: 'bg-[#8b5cf6]',
        },
        {
            heading: 'Total Assets',
            count: 50,
            color: 'bg-[#ec4899]',
        },
    ];

    return (
        <div>
            <div className="mb-2 flex flex-wrap">
                {DashBox.map((box, i) => {
                    return (
                        <div key={i} className="w-1/2 px-3 pt-3 md:w-1/3 md:pl-2 xl:w-1/4">
                            <div className={`rounded border p-5 shadow ${box.color} text-white`}>
                                <div className="flex flex-row items-center">
                                    <div className="flex-1 text-right">
                                        <h5 className="">{box.heading}</h5>
                                        <h3 className="text-5xl">
                                            {box.count}
                                            <span className="text-blue-400">
                                                <i className="fas fa-caret-up"></i>
                                            </span>
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mx-5">
                <h3 className="my-5">Recent Activity</h3>
                <div className="main-table w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-lightblue1">
                            <tr>
                                <th>date</th>
                                <th>Admin</th>
                                <th>Item</th>
                                <th>Target</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white">
                                <td>2023-04-20 11:50 AM</td>
                                <td>Admin Admin</td>
                                <td>Dell Mouse</td>
                                <td>Admin Admin</td>
                            </tr>
                            <tr className="bg-white">
                                <td>2023-04-20 11:50 AM</td>
                                <td>Admin Admin</td>
                                <td>Dell Mouse</td>
                                <td>Admin Admin</td>
                            </tr>
                            <tr className="bg-white">
                                <td>2023-04-20 11:50 AM</td>
                                <td>Admin Admin</td>
                                <td>Dell Mouse</td>
                                <td>Admin Admin</td>
                            </tr>
                            <tr className="bg-white">
                                <td>2023-04-20 11:50 AM</td>
                                <td>Admin Admin</td>
                                <td>Dell Mouse</td>
                                <td>Admin Admin</td>
                            </tr>
                            <tr className="bg-white">
                                <td>2023-04-20 11:50 AM</td>
                                <td>Admin Admin</td>
                                <td>Dell Mouse</td>
                                <td>Admin Admin</td>
                            </tr>
                            <tr className="bg-white">
                                <td>2023-04-20 11:50 AM</td>
                                <td>Admin Admin</td>
                                <td>Dell Mouse</td>
                                <td>Admin Admin</td>
                            </tr>
                            <tr className="bg-white">
                                <td>2023-04-20 11:50 AM</td>
                                <td>Admin Admin</td>
                                <td>Dell Mouse</td>
                                <td>Admin Admin</td>
                            </tr>
                            <tr className="bg-white">
                                <td>2023-04-20 11:50 AM</td>
                                <td>Admin Admin</td>
                                <td>Dell Mouse</td>
                                <td>Admin Admin</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Home;

// Home.middleware = {
//     auth: true,
//     verify: true,
// };
