import IconDelete from '@/components/Icon/IconDelete';
import IconEdit from '@/components/Icon/IconEdit';
import IconSearch from '@/components/Icon/IconSearch';
import IconUpDownArrow from '@/components/Icon/IconUpDownArrow';
import IconView from '@/components/Icon/IconView';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import React, { useState } from 'react';

const Users = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(50);
    const [totalPages, setTotalPages] = useState(5);

    return (
        <div>
            <div className="mx-5">
                <h1 className='text-xl mt-5'>Users</h1>
                <div className="mb-5 text-right">
                    <div className="ml-auto grid grid-cols-3 justify-end gap-5 md:flex">
                        <select className="form-select md:max-w-[150px]">
                            <option value="">Status...</option>
                            <option value={1}>pending</option>
                            <option value={2}>proccessing</option>
                            <option value={3}>shipped</option>
                            <option value={4}>delivered</option>
                            <option value={5}>cancelled</option>
                            <option value={6}>returned</option>
                            <option value={7}>completed</option>
                        </select>

                        <div className="w-full flex-none md:max-w-[240px]">
                            <div className="relative">
                                <input type="text" className="form-input pr-10" placeholder="Search..." />
                                <button
                                    type="button"
                                    className="text-black-dark absolute top-2 right-0 my-auto inline-flex h-10 w-10 items-center justify-center hover:opacity-70"
                                >
                                    <IconSearch />
                                </button>
                            </div>
                        </div>
                        <Link href={'/users/add'} className="btn mb-0 mt-2">
                            Create User
                        </Link>
                    </div>
                </div>
                <div className="main-table w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-lightblue1">
                            <tr>
                                <th>
                                    <input type="checkbox" className="form-checkbox" />
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Name</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Title</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Email</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Phone</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Username</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Department</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Location</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white">
                                <td>
                                    <input type="checkbox" className="form-checkbox" />
                                </td>
                                <td>Admin</td>
                                <td>react developer</td>
                                <td>Admin@mail.com</td>
                                <td>9999999999</td>
                                <td>Admin@123</td>
                                <td>web development</td>
                                <td>surat</td>
                                <td>
                                    <div className='flex'>
                                    <button
                                        type="button"
                                        className="mx-0.5 rounded-md border border-[#eab308] bg-[#eab308] p-2 hover:bg-transparent"
                                    >
                                        <IconView />
                                    </button>
                                    <Link
                                        href={`/users/edit/1`}
                                        className="mx-0.5 rounded-md border border-[#0ea5e9] bg-[#0ea5e9] p-2 hover:bg-transparent"
                                    >
                                        <IconEdit />
                                    </Link>
                                    <button
                                        type="button"
                                        className="mx-0.5 rounded-md border border-[#ef4444] bg-[#ef4444] p-2 hover:bg-transparent"
                                    >
                                        <IconDelete />
                                    </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mt-10">
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        pageLimit={pageLimit}
                        data={data}
                        totalRecords={totalRecords}
                        isLoading={isLoading}
                        setPageLimit={setPageLimit}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default Users;


Users.middleware = {
    auth: true,
    verify: true,
};
