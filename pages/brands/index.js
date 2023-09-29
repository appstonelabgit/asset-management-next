import IconDelete from '@/components/Icon/IconDelete';
import IconEdit from '@/components/Icon/IconEdit';
import IconSearch from '@/components/Icon/IconSearch';
import IconUpDownArrow from '@/components/Icon/IconUpDownArrow';
import Pagination from '@/components/Pagination';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from '@/libs/axios';
import TableLoadnig from '@/components/TableLoadnig';
import CommonSideModal from '@/components/CommonSideModal';
import { Field, Form, Formik } from 'formik';
import ButtonField from '@/components/Field/ButtonField';
import helper from '@/libs/helper';
import Import from '@/components/Import';
import Modal from '@/components/Modal';

const Brands = () => {
    const SideModal = useRef();
    const ImageModal = useRef();

    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(50);
    const [totalRecords, setTotalRecords] = useState(50);
    const [totalPages, setTotalPages] = useState(5);

    const [searchWord, setSearchWord] = useState('');
    const [order, setOrder] = useState({ sort_order: 'desc', order_field: 'id' });

    const getBrands = useCallback(
        (page = 1, limit = pageLimit, search = searchWord) => {
            setIsLoading(true);
            axios
                .get(`/brands`, {
                    params: {
                        filter: search,
                        page: page,
                        limit: limit,
                        sort_column: order.order_field,
                        sort_order: order.sort_order,
                    },
                })
                .then(({ data }) => {
                    setCurrentPage(data.meta.current_page);
                    setPageLimit(data.meta.per_page);
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
        getBrands(1, pageLimit, searchWord);
    };

    const resetFilter = () => {
        setSearchWord('');
        getBrands(1, pageLimit);
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

    const exportdata = async () => {
        try {
            const response = await axios.get(`/brands/file/export`);
            const fileURL = window.URL.createObjectURL(new Blob([response.data]));
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', `brands.csv`);
            document.body.appendChild(fileLink);
            fileLink.click();
            return true;
        } catch {}
    };

    const [selectedImageUrl, setSelectedImageUrl] = useState('');

    const openImageModal = (url) => {
        setSelectedImageUrl(url);
        ImageModal?.current?.open();
    };

    useEffect(() => {
        getBrands();
    }, [getBrands]);

    return (
        <div>
            <div className="mx-5">
                <h1 className="mt-5 text-xl font-bold text-darkprimary">Brands</h1>
                <div className="mb-5 flex flex-col items-baseline justify-between md:flex-row md:flex-wrap">
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
                            Add Brand
                        </button>
                    </div>
                </div>
                <div className="main-table w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-lightblue1">
                            <tr>
                                <th>
                                    <div className="flex cursor-pointer ">
                                        <span>Brand Logo</span>
                                    </div>
                                </th>
                                <th>
                                    <div
                                        className={`flex cursor-pointer  ${
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

                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <TableLoadnig totalTr={3} totalTd={3} tdWidth={60} />
                            ) : brands?.length !== 0 ? (
                                brands?.map((brand) => {
                                    return (
                                        <tr key={brand.id} className="bg-white">
                                            <td>
                                                <img
                                                    src={brand?.image_url}
                                                    alt="image"
                                                    className="h-10 w-16 cursor-pointer"
                                                    width={50}
                                                    height={50}
                                                    onClick={() => openImageModal(brand?.image_url)}
                                                    onError={(e) => (e.target.src = '/img/alt-image.png')}
                                                />
                                            </td>
                                            <td
                                                className="cursor-pointer capitalize hover:text-[#1A68D4]"
                                                onClick={() => {
                                                    handleEdit(brand?.id);
                                                }}
                                            >
                                                {helper.trancateString(brand?.name)}
                                            </td>

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
                                    <td colSpan={3}>No data is available.</td>
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
                        setPageLimit={(i) => getBrands(1, i)}
                        setCurrentPage={(i) => getBrands(i, pageLimit)}
                    />
                </div>
                <CommonSideModal ref={SideModal} title={params?.id ? 'Edit Brand' : 'Add Brand'} width="400px">
                    <div className="space-y-12">
                        <div className="border-gray-900/10 ">
                            <Formik initialValues={params} onSubmit={formHandler}>
                                {({ isSubmitting, setFieldValue }) => (
                                    <Form className="w-full space-y-5  bg-white pt-[25px] pb-[88px]">
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
                                                <label className="form-label">Brand Logo</label>

                                                {params?.image_url && (
                                                    <img
                                                        src={params?.image_url}
                                                        className="my-2 w-40 rounded-xl"
                                                        alt=""
                                                        onError={(e) => (e.target.src = '/img/alt-image.png')}
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

                <Modal ref={ImageModal} width={'800px'}>
                    <div className="flex items-center justify-center">
                        <img
                            src={selectedImageUrl}
                            alt="image"
                            className="w-full cursor-pointer"
                            onError={(e) => (e.target.src = '/img/alt-image.png')}
                        />
                    </div>
                </Modal>
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
