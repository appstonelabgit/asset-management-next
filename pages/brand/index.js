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

const Brand = () => {
    const Modal = useRef();

    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(50);
    const [totalPages, setTotalPages] = useState(5);

    const getBrands = useCallback((page = 1, limit = 10) => {
        setIsLoading(true);
        axios.get(`/brand?page=${page}&limit=${limit}`).then(({ data }) => {
            setBrands(data.data);
            setTotalRecords(data.meta.total);
            setTotalPages(data.meta.last_page);
            setIsLoading(false);
        });
    }, []);

    const defaultParams = { id: '', brand_name: '' };
    const [params, setParams] = useState(defaultParams);

    const refresh = () => {
        getBrands(currentPage, pageLimit);
    };

    const formHandler = async (values) => {
        try {
            const formData = new FormData();
            formData.append('brand_name', values.brand_name);
            formData.append('brand_logo_url', values.brand_logo_url);
            if (params?.id) {
                await axios.post(`/brand/${params?.id}`, formData);
            } else {
                await axios.post('/brand', formData);
            }
            Modal?.current.close();
            refresh();
        } catch {}
    };

    const handleEdit = (obj) => {
        setParams({
            id: obj.id,
            brand_name: obj.brand_name,
            brand_logo_url: obj.brand_logo_url,
        });
        Modal?.current?.open();
    };

    const handleDelete = async (id) => {
        let confirmation = confirm('are you sure want to delete');
        if (confirmation) {
            await axios.post(`/brand/${id}/delete`);
            refresh();
        }
    };

    useEffect(() => {
        getBrands(currentPage, pageLimit);
    }, [getBrands, currentPage, pageLimit]);

    return (
        <div>
            <div className="mx-5">
                <h1 className="mt-5 text-xl">brand</h1>
                <div className="mb-5 text-right">
                    <div className="ml-auto grid grid-cols-3 justify-end gap-5 md:flex">

                        {/* <div className="w-full flex-none md:max-w-[240px]">
                           <div className="relative">
                                <input type="text" className="form-input pr-10" placeholder="Search..." />
                                <button
                                    type="button"
                                    className="text-black-dark absolute top-2 right-0 my-auto inline-flex h-10 w-10 items-center justify-center hover:opacity-70"
                                >
                                    <IconSearch />
                                </button>
                            </div>
                        </div>  */}
                        <button
                            type="button"
                            onClick={() => {
                                setParams(defaultParams), Modal?.current?.open();
                            }}
                            className="btn mb-0 mt-2"
                        >
                            add brand
                        </button>
                    </div>
                </div>
                <div className="main-table w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-lightblue1">
                            <tr>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Logo</span>
                                    </div>
                                </th>
                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Name</span>
                                        <IconUpDownArrow />
                                    </div>
                                </th>

                                <th>
                                    <div className="flex cursor-pointer justify-between">
                                        <span>Date</span>
                                        <IconUpDownArrow />
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
                                                <img src={brand?.brand_name} alt="image" />
                                            </td>
                                            <td>{brand?.brand_name}</td>

                                            <td>{helper?.getFormattedDate(brand?.created_at)}</td>
                                            <td>
                                                <div className="flex">
                                                    <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#0ea5e9] bg-[#0ea5e9] p-2 hover:bg-transparent"
                                                        onClick={() => {
                                                            handleEdit(brand);
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
                <CommonSideModal ref={Modal}>
                    <div className="space-y-12">
                        <div className="border-gray-900/10 ">
                            <h2 className="text-base font-semibold leading-7">{params?.id ? 'Edit' : 'Add'} brand</h2>

                            <Formik initialValues={params} onSubmit={formHandler}>
                                {({ isSubmitting, setFieldValue }) => (
                                    <Form className="w-full space-y-5  bg-white p-[25px]">
                                        <div className="space-y-5">
                                            <div>
                                                <label className="form-label">Name</label>

                                                <Field
                                                    name="brand_name"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="name"
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label">Company logo</label>

                                                <input
                                                    name="brand_logo_url"
                                                    type="file"
                                                    className="form-input rounded-l-none"
                                                    onChange={(e) => setFieldValue('brand_logo_url', e.target.files[0])}
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

export default Brand;

Brand.middleware = {
    auth: true,
    verify: true,
};
