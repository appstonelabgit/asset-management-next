import IconDelete from '@/components/Icon/IconDelete';
import IconEdit from '@/components/Icon/IconEdit';
import IconSearch from '@/components/Icon/IconSearch';
import IconUpDownArrow from '@/components/Icon/IconUpDownArrow';
import IconView from '@/components/Icon/IconView';
import Pagination from '@/components/Pagination';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from '@/libs/axios';
import TableLoadnig from '@/components/TableLoadnig';
import CommonSideModal from '@/components/CommonSideModal';
import Modal from '@/components/Modal';
import { Field, Form, Formik } from 'formik';
import ButtonField from '@/components/Field/ButtonField';
import helper from '@/libs/helper';
import { useSelector } from 'react-redux';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const Users = () => {
    const { user } = useSelector((state) => state.auth);

    const SideModal = useRef();
    const Popup = useRef();

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(50);
    const [totalRecords, setTotalRecords] = useState(50);
    const [totalPages, setTotalPages] = useState(5);

    const [searchWord, setSearchWord] = useState('');
    const [order, setOrder] = useState({ sort_order: 'desc', order_field: 'id' });

    const getUsers = useCallback(
        (page = 1, limit = 50, searchWord = '') => {
            setIsLoading(true);
            axios
                .get(`/users`, {
                    params: {
                        filter: searchWord,
                        page: page,
                        limit: limit,
                        sort_column: order.order_field,
                        sort_order: order.sort_order,
                    },
                })
                .then(({ data }) => {
                    setCurrentPage(data.meta.current_page);
                    setPageLimit(data.meta.per_page);
                    setUsers(data.data);
                    setTotalRecords(data.meta.total);
                    setTotalPages(data.meta.last_page);
                    setIsLoading(false);
                });
        },
        [order]
    );

    const defaultParams = {
        id: '',
        name: '',
        email: '',
        designation: '',
        employee_id: '',
        password: '',
        confirm_password: '',
    };
    const [params, setParams] = useState(defaultParams);

    const refresh = () => {
        getUsers(1, pageLimit, searchWord);
    };

    const resetFilter = () => {
        setSearchWord('');
        getUsers(1, pageLimit);
    };

    const sortByField = (field) => {
        order.order_field === field
            ? order.sort_order === 'asc'
                ? setOrder({ ...order, sort_order: 'desc' })
                : setOrder({ ...order, sort_order: 'asc' })
            : setOrder({ ...order, sort_order: 'desc', order_field: field });
    };

    const formHandler = async (values) => {
        try {
            if (params?.id) {
                await axios.post(`/users/${params?.id}`, values);
            } else {
                await axios.post('/users', values);
            }
            SideModal?.current.close();
            refresh();
        } catch {}
    };

    const handleEdit = (id) => {
        try {
            axios.get(`/users/${id}`).then(({ data }) => {
                setParams({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    designation: data.designation,
                    employee_id: data.employee_id,
                    password: '',
                    confirm_password: '',
                });
                SideModal?.current?.open();
            });
        } catch (error) {}
    };
    const handleDelete = async (id) => {
        let confirmation = confirm('Do you really want to delete?\nDeletion can not be reverted if you ok!');
        if (confirmation) {
            await axios.delete(`/users/${id}/`);
            refresh();
        }
    };

    const [selectedModelData, setSelectedModelData] = useState({ name: '', data: [] });

    const handleModalData = (id, name) => {
        axios.get(`/${name}/${id}/for-user`).then(({ data }) => {
            setSelectedModelData({ name: name, data: data });
        });
        Popup?.current?.open();
    };

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    return (
        <div>
            <div className="mx-5">
                <h1 className="mt-5 text-xl font-bold text-darkprimary">Users</h1>
                <div className="mb-5 text-right">
                    <div className="flex flex-1 flex-col justify-end md:flex-row md:flex-wrap md:space-x-2">
                        <div className="w-full flex-none md:max-w-[240px]">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="form-input pr-10"
                                    placeholder="Search..."
                                    value={searchWord}
                                    onChange={(event) => setSearchWord(event.target.value)}
                                    onKeyUp={(e) => {
                                        if (e.key === 'Enter') {
                                            refresh();
                                        }
                                        if (searchWord.length === 0) {
                                            refresh();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="text-black-dark absolute top-2 right-0 my-auto inline-flex h-10 w-10 items-center justify-center hover:opacity-70"
                                    onClick={refresh}
                                >
                                    <IconSearch />
                                </button>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                resetFilter();
                            }}
                            className="btn-secondary mb-0 mt-2"
                        >
                            Reset Filter
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setParams(defaultParams), SideModal?.current?.open();
                            }}
                            className="btn mb-0 mt-2"
                        >
                            Add Users
                        </button>
                    </div>
                </div>
                <div className="main-table w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-lightblue1">
                            <tr>
                                <th>
                                    <div
                                        className={`flex cursor-pointer  ${
                                            order.order_field === 'employee_id' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('employee_id')}
                                    >
                                        <span>Employee Id</span>
                                        <IconUpDownArrow
                                            className={`${
                                                order.order_field === 'employee_id' && order.sort_order === 'desc'
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </div>
                                </th>
                                <th>
                                    <div
                                        className={`flex cursor-pointer  ${
                                            order.order_field === 'name' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('name')}
                                    >
                                        <span>User Name</span>
                                        <IconUpDownArrow
                                            className={`${
                                                order.order_field === 'name' && order.sort_order === 'desc'
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </div>
                                </th>

                                <th>
                                    <div
                                        className={`flex cursor-pointer  ${
                                            order.order_field === 'email' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('email')}
                                    >
                                        <span>Email</span>
                                        <IconUpDownArrow
                                            className={`${
                                                order.order_field === 'email' && order.sort_order === 'desc'
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </div>
                                </th>
                                <th>
                                    <div
                                        className={`flex cursor-pointer  ${
                                            order.order_field === 'designation' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('designation')}
                                    >
                                        <span>Designation</span>
                                        <IconUpDownArrow
                                            className={`${
                                                order.order_field === 'designation' && order.sort_order === 'desc'
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </div>
                                </th>
                                <th>
                                    <div
                                        className={`flex cursor-pointer  ${
                                            order.order_field === 'components' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('components')}
                                    >
                                        <span>Components</span>
                                    </div>
                                </th>
                                <th>
                                    <div
                                        className={`flex cursor-pointer  ${
                                            order.order_field === 'total_accessories' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('total_accessories')}
                                    >
                                        <span>Accessories</span>
                                    </div>
                                </th>

                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <TableLoadnig totalTr={6} totalTd={6} tdWidth={60} />
                            ) : users?.length !== 0 ? (
                                users?.map((user) => {
                                    return (
                                        <tr key={user.id} className="bg-white">
                                            <td>{user?.employee_id}</td>
                                            <td
                                                className="max-w-[160px] cursor-pointer truncate capitalize hover:text-[#1A68D4]"
                                                onClick={() => {
                                                    handleEdit(user?.id);
                                                }}
                                            >
                                                <Tippy content={user?.name}>
                                                    <span>{user?.name}</span>
                                                </Tippy>
                                            </td>
                                            <td>{user?.email}</td>
                                            <td className="max-w-[160px] truncate capitalize">
                                                <Tippy content={user?.name}>
                                                    <span>{user?.designation}</span>
                                                </Tippy>
                                            </td>
                                            {user?.components?.length === 0 ? (
                                                <td>{user?.components?.length}</td>
                                            ) : (
                                                <td
                                                    className="cursor-pointer"
                                                    onClick={() => handleModalData(user?.id, 'assets')}
                                                >
                                                    <div className="flex space-x-2">
                                                        <span>{user?.components?.length}</span>
                                                        <Tippy content="Click here to view components">
                                                            <span>
                                                                <IconView />
                                                            </span>
                                                        </Tippy>
                                                    </div>
                                                </td>
                                            )}
                                            {user?.total_accessories === 0 ? (
                                                <td>{user?.total_accessories}</td>
                                            ) : (
                                                <td
                                                    className="cursor-pointer"
                                                    onClick={() => handleModalData(user?.id, 'accessories')}
                                                >
                                                    <div className="flex space-x-2">
                                                        <span>{user?.total_accessories}</span>
                                                        <Tippy content="Click here to view accessories">
                                                            <span>
                                                                <IconView />
                                                            </span>
                                                        </Tippy>
                                                    </div>
                                                </td>
                                            )}

                                            <td>
                                                <div className="flex">
                                                    <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#0ea5e9] bg-[#0ea5e9] p-2 hover:bg-transparent"
                                                        onClick={() => {
                                                            handleEdit(user?.id);
                                                        }}
                                                    >
                                                        <IconEdit />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#ef4444] bg-[#ef4444] p-2 hover:bg-transparent"
                                                        onClick={() => handleDelete(user?.id)}
                                                    >
                                                        <IconDelete />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr className="text-center">
                                    <td colSpan={6}>No data is available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-10">
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        pageLimit={pageLimit}
                        data={users}
                        totalRecords={totalRecords}
                        isLoading={isLoading}
                        setPageLimit={(i) => getUsers(1, i)}
                        setCurrentPage={(i) => getUsers(i, pageLimit)}
                    />
                </div>

                <Modal ref={Popup} width={1200}>
                    <div className="mx-5">
                        <h3 className="mb-5 text-xl font-bold capitalize text-darkprimary">
                            {selectedModelData?.name.toLowerCase() === 'assets'
                                ? 'components'
                                : selectedModelData?.name}
                        </h3>
                        {selectedModelData?.name.toLowerCase() === 'assets' ? (
                            selectedModelData?.data?.components?.length !== 0 ? (
                                <div className="main-table w-full overflow-x-auto">
                                    <table className="w-full table-auto">
                                        <thead className="bg-lightblue1">
                                            <tr>
                                                <th>Serial Number</th>
                                                <th className="capitalize">
                                                    {selectedModelData?.name.toLowerCase() === 'assets'
                                                        ? 'components'
                                                        : selectedModelData?.name}{' '}
                                                    Name
                                                </th>
                                                <th>Purchase Cost</th>
                                                <th>Model</th>
                                                <th>Brand</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedModelData?.data?.components?.map((modeldata) => {
                                                return (
                                                    <tr key={modeldata.id} className="bg-white">
                                                        <td>{modeldata?.serial_number}</td>
                                                        <td className="capitalize">
                                                            {helper.trancateString(modeldata?.name)}
                                                        </td>
                                                        <td>
                                                            {helper.formatIndianCurrency(modeldata?.purchased_cost)}
                                                        </td>
                                                        <td className="capitalize">
                                                            {helper.trancateSmallString(modeldata?.model?.name) || '-'}
                                                        </td>
                                                        <td className="capitalize">
                                                            {helper.trancateSmallString(modeldata?.brand?.name) || '-'}
                                                        </td>
                                                        <td>{helper?.getFormattedDate(modeldata?.created_at)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center">Data not available.</div>
                            )
                        ) : selectedModelData?.data?.length !== 0 ? (
                            <div className="main-table w-full overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead className="bg-lightblue1">
                                        <tr>
                                            <th>Serial Number</th>
                                            <th className="capitalize">{selectedModelData?.name} Name</th>
                                            <th>Seller</th>
                                            <th>Purchase Cost</th>
                                            <th>Model</th>
                                            <th>Brand</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedModelData?.data?.map((modeldata) => {
                                            return (
                                                <tr key={modeldata.id} className="bg-white">
                                                    <td>{modeldata?.serial_number}</td>
                                                    <td className="capitalize">
                                                        {helper.trancateString(modeldata?.name)}
                                                    </td>
                                                    <td className="capitalize">
                                                        {helper.trancateSmallString(modeldata?.seller_name) || '-'}
                                                    </td>
                                                    <td>{helper.formatIndianCurrency(modeldata?.purchased_cost)}</td>
                                                    <td className="capitalize">
                                                        {helper.trancateSmallString(modeldata?.model_name) || '-'}
                                                    </td>
                                                    <td className="capitalize">
                                                        {helper.trancateSmallString(modeldata?.brand_name) || '-'}
                                                    </td>
                                                    <td>{helper?.getFormattedDate(modeldata?.created_at)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center">Data not available.</div>
                        )}
                    </div>
                </Modal>

                <CommonSideModal ref={SideModal} title={params?.id ? 'Edit User' : 'Add User'} width="400px">
                    <div className="space-y-12">
                        <div className="border-gray-900/10 ">
                            <Formik initialValues={params} onSubmit={formHandler}>
                                {({ isSubmitting }) => (
                                    <Form className="w-full space-y-5 bg-white pt-[25px] pb-[88px]">
                                        <div className="space-y-5">
                                            <div>
                                                <label className="form-label">Name</label>

                                                <Field
                                                    name="name"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="Name"
                                                />
                                            </div>

                                            <div>
                                                <label className="form-label">Email</label>

                                                <Field
                                                    name="email"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="example@mail.com"
                                                />
                                            </div>

                                            <div>
                                                <label className="form-label">Employee Id</label>

                                                <Field
                                                    name="employee_id"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="Employee Id"
                                                />
                                            </div>

                                            <div>
                                                <label className="form-label">Designation</label>

                                                <Field
                                                    name="designation"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="Designation"
                                                />
                                            </div>

                                            <div>
                                                <label className="form-label">Password</label>

                                                <Field
                                                    name="password"
                                                    type="password"
                                                    className="form-input rounded-l-none"
                                                    placeholder="Password"
                                                />
                                            </div>

                                            <div>
                                                <label className="form-label">Confirm Password</label>

                                                <Field
                                                    name="confirm_password"
                                                    type="password"
                                                    className="form-input rounded-l-none"
                                                    placeholder="Confirm Password"
                                                />
                                            </div>
                                        </div>
                                        <div className="absolute inset-x-5 bottom-0 !mt-0 bg-white py-[25px]">
                                            <ButtonField
                                                type="submit"
                                                loading={isSubmitting}
                                                className="btn block w-full"
                                            >
                                                {params?.id ? 'Edit' : 'Add'}
                                            </ButtonField>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </CommonSideModal>
            </div>
        </div>
    );
};

export default Users;

Users.middleware = {
    auth: true,
    verify: true,
    isAdmin: false,
};
