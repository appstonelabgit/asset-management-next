import IconDelete from '@/components/Icon/IconDelete';
import IconEdit from '@/components/Icon/IconEdit';
import IconSearch from '@/components/Icon/IconSearch';
import IconUpDownArrow from '@/components/Icon/IconUpDownArrow';
import IconView from '@/components/Icon/IconView';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from '@/libs/axios';
import TableLoadnig from '@/components/TableLoadnig';
import CommonSideModal from '@/components/CommonSideModal';
import { Field, Form, Formik } from 'formik';
import ButtonField from '@/components/Field/ButtonField';
import helper from '@/libs/helper';

const Sellers = () => {
    const SideModal = useRef();

    const [sellers, setSellers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(50);
    const [totalPages, setTotalPages] = useState(5);

    const [searchWord, setSearchWord] = useState('');
    const [order, setOrder] = useState({ sort_order: 'desc', order_field: 'name' });

    const getSellers = useCallback(
        (page = 1, limit = 10, searchWord = '') => {
            setIsLoading(true);
            axios
                .get(`/sellers`, {
                    params: {
                        filter: searchWord,
                        page: page,
                        limit: limit,
                        sort_column: order.order_field,
                        sort_order: order.sort_order,
                    },
                })
                .then(({ data }) => {
                    setSellers(data.data);
                    setTotalRecords(data.meta.total);
                    setTotalPages(data.meta.last_page);
                    setIsLoading(false);
                });
        },
        [order]
    );

    const defaultParams = { id: '', name: '', email: '', phone_number: '', address: '' };
    const [params, setParams] = useState(defaultParams);

    const refresh = () => {
        getSellers(currentPage, pageLimit, searchWord);
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
                await axios.post(`/sellers/${params?.id}`, values);
            } else {
                await axios.post('/sellers', values);
            }
            SideModal?.current.close();
            refresh();
        } catch {}
    };

    const handleEdit = (id) => {
        try {
            axios.get(`/sellers/${id}`).then(({ data }) => {
                setParams({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    phone_number: data.phone_number.toString(),
                    address: data.address,
                });
                SideModal?.current?.open();
            });
        } catch (error) {}
    };
    const handleDelete = async (id) => {
        let confirmation = confirm('are you sure want to delete');
        if (confirmation) {
            await axios.delete(`/sellers/${id}`);
            refresh();
        }
    };

    useEffect(() => {
        getSellers(currentPage, pageLimit);
    }, [getSellers, currentPage, pageLimit]);

    return (
        <div>
            <div className="mx-5">
                <h1 className="mt-5 text-xl font-bold text-darkprimary">Sellers</h1>
                <div className="mb-5 text-right">
                    <div className="ml-auto grid grid-cols-3 justify-end gap-5 md:flex">
                        <div className="w-full flex-none md:max-w-[240px]">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="form-input pr-10"
                                    placeholder="Search..."
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
                                setParams(defaultParams), SideModal?.current?.open();
                            }}
                            className="btn mb-0 mt-2"
                        >
                            Add Seller
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
                                            order.order_field === 'name' ? 'text-primary' : ''
                                        }`}
                                        onClick={() => sortByField('name')}
                                    >
                                        <span>Name</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>

                                <th>
                                    <div
                                        className={`flex cursor-pointer justify-between ${
                                            order.order_field === 'email' ? 'text-primary' : ''
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
                                            order.order_field === 'phone_number' ? 'text-primary' : ''
                                        }`}
                                        onClick={() => sortByField('phone_number')}
                                    >
                                        <span>Phone</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between ">
                                        <span>Address</span>
                                    </div>
                                </th>
                                <th>
                                    <div
                                        className={`flex cursor-pointer justify-between ${
                                            order.order_field === 'created_at' ? 'text-primary' : ''
                                        }`}
                                        onClick={() => sortByField('created_at')}
                                    >
                                        <span>Date</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>

                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <TableLoadnig totalTr={6} totalTd={6} tdWidth={60} />
                            ) : sellers?.length !== 0 ? (
                                sellers?.map((seller) => {
                                    return (
                                        <tr key={seller.id} className="bg-white">
                                            <td className='capitalize'>{seller?.name}</td>
                                            <td>{seller?.email}</td>
                                            <td>{seller?.phone_number}</td>
                                            <td>{helper.trancateString(seller?.address)}</td>
                                            <td>{helper?.getFormattedDate(seller?.created_at)}</td>
                                            <td>
                                                <div className="flex">
                                                    <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#0ea5e9] bg-[#0ea5e9] p-2 hover:bg-transparent"
                                                        onClick={() => {
                                                            handleEdit(seller?.id);
                                                        }}
                                                    >
                                                        <IconEdit />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#ef4444] bg-[#ef4444] p-2 hover:bg-transparent"
                                                        onClick={() => handleDelete(seller?.id)}
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
                        data={sellers}
                        totalRecords={totalRecords}
                        isLoading={isLoading}
                        setPageLimit={setPageLimit}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
                <CommonSideModal ref={SideModal}>
                    <div className="space-y-12">
                        <div className="border-gray-900/10 ">
                            <h2 className="text-base font-semibold leading-7">{params?.id ? 'Edit' : 'Add'} Seller</h2>

                            <Formik initialValues={params} onSubmit={formHandler}>
                                {({ isSubmitting }) => (
                                    <Form className="w-full space-y-5  bg-white p-[25px]">
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
                                            <div className="flex space-x-5">
                                                <div className="w-1/2">
                                                    <label className="form-label">Email</label>

                                                    <Field
                                                        name="email"
                                                        type="text"
                                                        className="form-input rounded-l-none"
                                                        placeholder="example@mail.com"
                                                    />
                                                </div>
                                                <div className="w-1/2">
                                                    <label className="form-label">Phone</label>

                                                    <Field
                                                        name="phone_number"
                                                        type="text"
                                                        className="form-input rounded-l-none"
                                                        placeholder="Phone"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="form-label">Address</label>

                                                <Field
                                                    as="textarea"
                                                    name="address"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="Address"
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

export default Sellers;

Sellers.middleware = {
    auth: true,
    verify: true,
};
