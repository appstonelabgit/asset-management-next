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
import Image from 'next/image';

const Brands = () => {
    const SideModal = useRef();

    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(50);
    const [totalPages, setTotalPages] = useState(5);

    const [searchWord, setSearchWord] = useState('');
    const [order, setOrder] = useState({ sort_order: 'desc', order_field: 'name' });

    const getBrands = useCallback(
        (page = 1, limit = 10, searchWord = '') => {
            setIsLoading(true);
            axios
                .get(`/brands`, {
                    params: {
                        filter: searchWord,
                        page: page,
                        limit: limit,
                        sort_column: order.order_field,
                        sort_order: order.sort_order,
                    },
                })
                .then(({ data }) => {
                    setBrands(data.data);
                    setTotalRecords(data.meta.total);
                    setTotalPages(data.meta.last_page);
                    setIsLoading(false);
                });
        },
        [order]
    );

    const defaultParams = { id: '', name: '' };
    const [params, setParams] = useState(defaultParams);

    const refresh = () => {
        getBrands(currentPage, pageLimit, searchWord);
    };

    const resetFilter = () => {
        setSearchWord('');
        getBrands(currentPage, pageLimit);
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
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('logo_url', values.logo_url);
            if (params?.id) {
                await axios.post(`/brands/${params?.id}`, formData);
            } else {
                await axios.post('/brands', formData);
            }
            SideModal?.current.close();
            refresh();
        } catch {}
    };

    const handleEdit = (id) => {
        try {
            axios.get(`/brands/${id}`).then(({ data }) => {
                setParams({
                    id: data?.id,
                    name: data?.name,
                    logo_url: '',
                    image_url: data?.image_url,
                });
                SideModal?.current?.open();
            });
        } catch (error) {}
    };

    const handleDelete = async (id) => {
        let confirmation = confirm('Do you really want to delete?\nDeletion can not be reverted if you ok!');
        if (confirmation) {
            await axios.delete(`/brands/${id}`);
            refresh();
        }
    };
    useEffect(() => {
        getBrands(currentPage, pageLimit);
    }, [getBrands, currentPage, pageLimit]);

    return (
        <div>
            <div className="mx-5">
                <h1 className="mt-5 text-xl font-bold text-darkprimary">Brands</h1>
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
                            Add Brand
                        </button>
                    </div>
                </div>
                <div className="main-table w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-lightblue1">
                            <tr>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Brand Logo</span>
                                    </div>
                                </th>
                                <th>
                                    <div
                                        className={`flex cursor-pointer justify-between ${
                                            order.order_field === 'name' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('name')}
                                    >
                                        <span>Brand Name</span>
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
                                        className={`flex cursor-pointer justify-between ${
                                            order.order_field === 'created_at' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('created_at')}
                                    >
                                        <span>Date</span>
                                        <IconUpDownArrow
                                            className={`${
                                                order.order_field === 'created_at' && order.sort_order === 'desc'
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </div>
                                </th>

                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <TableLoadnig totalTr={4} totalTd={4} tdWidth={60} />
                            ) : brands?.length !== 0 ? (
                                brands?.map((brand) => {
                                    return (
                                        <tr key={brand.id} className="bg-white">
                                            <td>
                                                <img src={brand?.image_url} alt="image" width={50} height={50} />
                                            </td>
                                            <td className="capitalize">{brand?.name}</td>

                                            <td>{helper?.getFormattedDate(brand?.created_at)}</td>
                                            <td>
                                                <div className="flex">
                                                    <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#0ea5e9] bg-[#0ea5e9] p-2 hover:bg-transparent"
                                                        onClick={() => {
                                                            handleEdit(brand?.id);
                                                        }}
                                                    >
                                                        <IconEdit />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#ef4444] bg-[#ef4444] p-2 hover:bg-transparent"
                                                        onClick={() => handleDelete(brand?.id)}
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
                                    <td colSpan={4}>No data is available.</td>
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
                        data={brands}
                        totalRecords={totalRecords}
                        isLoading={isLoading}
                        setPageLimit={setPageLimit}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
                <CommonSideModal ref={SideModal} title={params?.id ? 'Edit Brand' : 'Add Brand'}>
                    <div className="space-y-12">
                        <div className="border-gray-900/10 ">
                            <Formik initialValues={params} onSubmit={formHandler}>
                                {({ isSubmitting, setFieldValue }) => (
                                    <Form className="w-full space-y-5  bg-white py-[25px]">
                                        <div className="space-y-5">
                                            <div>
                                                <label className="form-label">Brand Name</label>

                                                <Field
                                                    name="name"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="Name"
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">Brand logo</label>

                                                {params?.image_url && (
                                                    <img
                                                        src={params?.image_url}
                                                        className="my-2 w-40 rounded-xl border p-1"
                                                        alt=""
                                                    />
                                                )}

                                                <input
                                                    name="logo_url"
                                                    type="file"
                                                    className="form-input rounded-l-none"
                                                    onChange={(e) => {
                                                        setParams({
                                                            ...params,
                                                            image_url: URL.createObjectURL(e.target.files[0]),
                                                        });
                                                        setFieldValue('logo_url', e.target.files[0]);
                                                    }}
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

export default Brands;

Brands.middleware = {
    auth: true,
    verify: true,
    isAdmin: false,
};
