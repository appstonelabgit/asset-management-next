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
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useSelector } from 'react-redux';

const Users = () => {
    const { user } = useSelector((state) => state.auth);

    const SideModal = useRef();
    const Popup = useRef();

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(50);
    const [totalPages, setTotalPages] = useState(5);

    const [searchWord, setSearchWord] = useState('');
    const [order, setOrder] = useState({ sort_order: 'desc', order_field: 'name' });

    const getUsers = useCallback(
        (page = 1, limit = 10, searchWord = '') => {
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
                    setUsers(data.data);
                    setTotalRecords(data.meta.total);
                    setTotalPages(data.meta.last_page);
                    setIsLoading(false);
                });
        },
        [order]
    );

    const defaultParams = { id: '', name: '', email: '', designation: '' };
    const [params, setParams] = useState(defaultParams);

    const refresh = () => {
        getUsers(currentPage, pageLimit, searchWord);
    };

    const resetFilter = () => {
        setSearchWord('');
        getUsers(currentPage, pageLimit);
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
                SideModal?.current.close();
                refresh();
            } else {
                await axios.post('/users', values);
            }
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
        getUsers(currentPage, pageLimit);
    }, [getUsers, currentPage, pageLimit]);

    return (
        <div>
            <div className="mx-5">
                <h1 className="mt-5 text-xl font-bold text-darkprimary">Users</h1>
                <div className="mb-5 text-right">
                    <div className="ml-auto grid grid-cols-3 justify-end gap-5 md:flex">
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
                                        className={`flex cursor-pointer justify-between ${
                                            order.order_field === 'name' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('name')}
                                    >
                                        <span>User Name</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>

                                <th>
                                    <div
                                        className={`flex cursor-pointer justify-between ${
                                            order.order_field === 'email' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('email')}
                                    >
                                        <span>Email</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div
                                        className={`flex cursor-pointer justify-between ${
                                            order.order_field === 'designation' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('designation')}
                                    >
                                        <span>Designation</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div
                                        className={`flex cursor-pointer justify-between ${
                                            order.order_field === 'total_assets' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('total_assets')}
                                    >
                                        <span>Assets</span>
                                    </div>
                                </th>
                                <th>
                                    <div
                                        className={`flex cursor-pointer justify-between ${
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
                                            <td className="capitalize">{user?.name}</td>
                                            <td>{user?.email}</td>
                                            <td className="capitalize">{user?.designation}</td>
                                            {user?.total_assets === 0 ? (
                                                <td>{user?.total_assets}</td>
                                            ) : (
                                                <td
                                                    className="cursor-pointer"
                                                    onClick={() => handleModalData(user?.id, 'assets')}
                                                >
                                                    <div className="flex space-x-2">
                                                        <span>{user?.total_assets}</span>
                                                        <Tippy content="Click here to view assets">
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
                        setPageLimit={setPageLimit}
                        setCurrentPage={setCurrentPage}
                    />
                </div>

                <Modal ref={Popup} width={1200}>
                    <div className="mx-5">
                        <h3 className="mb-5 text-xl font-bold capitalize text-darkprimary">
                            {selectedModelData?.name}
                        </h3>
                        {selectedModelData?.data?.length !== 0 && (
                            <div className="main-table w-full overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead className="bg-lightblue1">
                                        <tr>
                                            <th>Serial Number</th>
                                            <th>{selectedModelData?.name} Name</th>
                                            <th>Purchase Cost</th>
                                            <th>Seller</th>
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
                                                    <td className="capitalize">{modeldata?.name}</td>
                                                    <td>₹ {modeldata?.purchased_cost}</td>
                                                    <td className="capitalize">{modeldata?.seller_name}</td>
                                                    <td className="capitalize">{modeldata?.model_name}</td>
                                                    <td className="capitalize">{modeldata?.brand_name}</td>
                                                    <td>{helper?.getFormattedDate(modeldata?.created_at)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {selectedModelData?.data?.length === 0 && (
                            <div className="text-center">data not available.</div>
                        )}
                    </div>
                </Modal>

                <CommonSideModal ref={SideModal} title={params?.id ? 'Edit User' : 'Add User'}>
                    <div className="space-y-12">
                        <div className="border-gray-900/10 ">
                            <Formik initialValues={params} onSubmit={formHandler}>
                                {({ isSubmitting }) => (
                                    <Form className="w-full space-y-5  bg-white py-[25px]">
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
                                                <label className="form-label">Designation</label>

                                                <Field
                                                    name="designation"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="Designation"
                                                />
                                            </div>
                                        </div>
                                        <div>
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
