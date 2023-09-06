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
import Import from '@/components/Import';

const Sellers = () => {
    const SideModal = useRef();
    const importModal = useRef();

    const [sellers, setSellers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(50);
    const [totalRecords, setTotalRecords] = useState(50);
    const [totalPages, setTotalPages] = useState(5);

    const [searchWord, setSearchWord] = useState('');
    const [order, setOrder] = useState({ sort_order: 'desc', order_field: 'id' });

    const getSellers = useCallback(
        (page = 1, limit = 50, searchWord = '') => {
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
                    setCurrentPage(data.meta.current_page);
                    setPageLimit(data.meta.per_page);
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
        getSellers(1, pageLimit, searchWord);
    };

    const resetFilter = () => {
        setSearchWord('');
        getSellers(1, pageLimit);
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
        let confirmation = confirm('Do you really want to delete?\nDeletion can not be reverted if you ok!');
        if (confirmation) {
            await axios.delete(`/sellers/${id}`);
            refresh();
        }
    };

    const exportdata = async () => {
        try {
            const response = await axios.get(`/sellers/file/export`);
            const fileURL = window.URL.createObjectURL(new Blob([response.data]));
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', `sellers.csv`);
            document.body.appendChild(fileLink);
            fileLink.click();
            return true;
        } catch {}
    };

    useEffect(() => {
        getSellers();
    }, [getSellers]);

    return (
        <div>
            <div className="mx-5">
                <h1 className="mt-5 text-xl font-bold text-darkprimary">Sellers</h1>
                <div className="mb-5 flex flex-col items-baseline justify-between md:flex-row md:flex-wrap">
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            className="btn-secondary mb-0 mt-2"
                            onClick={() => {
                                importModal?.current?.open();
                            }}
                        >
                            Import
                        </button>
                        <button type="button" onClick={exportdata} className="btn-secondary mb-0 mt-2">
                            Export
                        </button>
                    </div>
                    <div className="flex flex-1 flex-col justify-end md:flex-row md:flex-wrap md:space-x-2">
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
                                        className={`flex cursor-pointer  ${
                                            order.order_field === 'name' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('name')}
                                    >
                                        <span>Seller Name</span>
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
                                            order.order_field === 'phone_number' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('phone_number')}
                                    >
                                        <span>Phone</span>
                                        <IconUpDownArrow
                                            className={`${
                                                order.order_field === 'phone_number' && order.sort_order === 'desc'
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer  ">
                                        <span>Address</span>
                                    </div>
                                </th>

                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <TableLoadnig totalTr={5} totalTd={5} tdWidth={60} />
                            ) : sellers?.length !== 0 ? (
                                sellers?.map((seller) => {
                                    return (
                                        <tr key={seller.id} className="bg-white">
                                            <td
                                                className="cursor-pointer capitalize hover:text-[#1A68D4]"
                                                onClick={() => {
                                                    handleEdit(seller?.id);
                                                }}
                                            >
                                                {helper.trancateString(seller?.name)}
                                            </td>
                                            <td>{seller?.email}</td>
                                            <td>{seller?.phone_number}</td>
                                            <td>{helper.trancateString(seller?.address)}</td>
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
                                    <td colSpan={5}>No data is available.</td>
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
                        setPageLimit={(i) => getSellers(1, i)}
                        setCurrentPage={(i) => getSellers(i, pageLimit)}
                    />
                </div>
                <CommonSideModal ref={SideModal} title={params?.id ? 'Edit Seller' : 'Add Seller'} width="400px">
                    <div className="space-y-12">
                        <div className="border-gray-900/10 ">
                            <Formik initialValues={params} onSubmit={formHandler}>
                                {({ isSubmitting }) => (
                                    <Form className="w-full space-y-5  bg-white pt-[25px] pb-[88px]">
                                        <div className="space-y-5">
                                            <div>
                                                <label className="form-label">Seller Name</label>

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
                                                <label className="form-label">Phone</label>

                                                <Field
                                                    name="phone_number"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="Phone"
                                                />
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
                <Import ref={importModal} refresh={refresh} type="sellers" csvPath="/csv/Sample Sellers.csv" />
            </div>
        </div>
    );
};

export default Sellers;

Sellers.middleware = {
    auth: true,
    verify: true,
    isAdmin: false,
};
