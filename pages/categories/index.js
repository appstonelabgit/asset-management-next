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
import Tippy from '@tippyjs/react';
import IconView from '@/components/Icon/IconView';
import Modal from '@/components/Modal';
import { useSelector } from 'react-redux';

const Categories = () => {
    const SideModal = useRef();
    const { user } = useSelector((state) => state.auth);

    const relationalDataModal = useRef();

    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(50);
    const [totalRecords, setTotalRecords] = useState(50);
    const [totalPages, setTotalPages] = useState(5);

    const [searchWord, setSearchWord] = useState('');
    const [order, setOrder] = useState({ sort_order: 'desc', order_field: 'id' });

    const [selectedModelData, setSelectedModelData] = useState({ name: '', data: [] });

    const getCategories = useCallback(
        (page = 1, limit = pageLimit, search = searchWord) => {
            setIsLoading(true);
            axios
                .get(`/categories`, {
                    params: {
                        filter: search,
                        page: page,
                        limit: limit,
                        sort_column: order.order_field,
                        sort_order: order.sort_order,
                    },
                })
                .then(({ data }) => {
                    setCurrentPage(data?.category.meta.current_page);
                    setPageLimit(data?.category.meta.per_page);
                    setCategories(data?.category.data);
                    setTotalRecords(data?.category.meta.total);
                    setTotalPages(data?.category.meta.last_page);
                    setIsLoading(false);
                });
        },
        [order]
    );

    const defaultParams = { id: '', name: '' };
    const [params, setParams] = useState(defaultParams);

    const refresh = () => {
        getCategories(1, pageLimit, searchWord);
    };

    const resetFilter = () => {
        setSearchWord('');
        getCategories(1, pageLimit);
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
            if (params?.id) {
                await axios.put(`/categories/${params?.id}`, formData);
            } else {
                await axios.post('/categories', formData);
            }
            SideModal?.current.close();
            refresh();
        } catch {}
    };

    const handleEdit = (id) => {
        try {
            axios.get(`/categories/${id}`).then(({ data }) => {
                setParams({
                    id: data?.category?.id,
                    name: data?.category?.name,
                });
                SideModal?.current?.open();
            });
        } catch (error) {}
    };

    const handleDelete = async (id) => {
        let confirmation = confirm('Do you really want to delete?\nDeletion can not be reverted if you ok!');
        if (confirmation) {
            await axios.delete(`/categories/${id}`);
            refresh();
        }
    };

    // const exportdata = async () => {
    //     try {
    //         const response = await axios.get(`/categories/file/export`);
    //         const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    //         const fileLink = document.createElement('a');
    //         fileLink.href = fileURL;
    //         fileLink.setAttribute('download', `categories.csv`);
    //         document.body.appendChild(fileLink);
    //         fileLink.click();
    //         return true;
    //     } catch {}
    // };

    const handleModalData = (id, name) => {
        axios.get(`/categories/relational-data`, { params: { type: name, category_id: id } }).then(({ data }) => {
            setSelectedModelData({ name: name, data: data?.data });
        });
        relationalDataModal?.current?.open();
    };

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    return (
        <div>
            <div className="mx-5">
                <h1 className="mt-5 text-xl font-bold text-darkprimary">Categories</h1>
                <div className="mb-5 flex flex-col items-baseline justify-between md:flex-row md:flex-wrap">
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
                        {user?.role === 1 && (
                            <button
                                type="button"
                                onClick={() => {
                                    setParams(defaultParams), SideModal?.current?.open();
                                }}
                                className="btn mb-0 mt-2"
                            >
                                Add Category
                            </button>
                        )}
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
                                        <span>Category Name</span>
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
                                            order.order_field === 'assets_count' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('assets_count')}
                                    >
                                        <span>Assets</span>
                                        <IconUpDownArrow
                                            className={`${
                                                order.order_field === 'assets_count' && order.sort_order === 'desc'
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </div>
                                </th>

                                <th>
                                    <div
                                        className={`flex cursor-pointer  ${
                                            order.order_field === 'accessories_count' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('accessories_count')}
                                    >
                                        <span>Accessories</span>
                                        <IconUpDownArrow
                                            className={`${
                                                order.order_field === 'accessories_count' && order.sort_order === 'desc'
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </div>
                                </th>

                                <th>
                                    <div
                                        className={`flex cursor-pointer  ${
                                            order.order_field === 'components_count' ? 'text-darkprimary' : ''
                                        }`}
                                        onClick={() => sortByField('components_count')}
                                    >
                                        <span>Components</span>
                                        <IconUpDownArrow
                                            className={`${
                                                order.order_field === 'components_count' && order.sort_order === 'desc'
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </div>
                                </th>

                                {user?.role === 1 && <th>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <TableLoadnig
                                    totalTr={user?.role === 1 ? 7 : 6}
                                    totalTd={user?.role === 1 ? 7 : 6}
                                    tdWidth={60}
                                />
                            ) : categories?.length !== 0 ? (
                                categories?.map((category) => {
                                    return (
                                        <tr key={category.id} className="bg-white">
                                            <td
                                                className="max-w-xs cursor-pointer truncate capitalize hover:text-[#1A68D4]"
                                                onClick={() => {
                                                    handleEdit(category?.id);
                                                }}
                                            >
                                                {category?.name}
                                            </td>

                                            {category?.assets_count === 0 ? (
                                                <td>{category?.assets_count}</td>
                                            ) : (
                                                <td
                                                    className="cursor-pointer"
                                                    onClick={() => handleModalData(category?.id, 'asset')}
                                                >
                                                    <div className="flex space-x-2">
                                                        <span>{category?.assets_count}</span>
                                                        <Tippy content="Click here to view assets">
                                                            <span>
                                                                <IconView />
                                                            </span>
                                                        </Tippy>
                                                    </div>
                                                </td>
                                            )}

                                            {category?.accessories_count === 0 ? (
                                                <td>{category?.accessories_count}</td>
                                            ) : (
                                                <td
                                                    className="cursor-pointer"
                                                    onClick={() => handleModalData(category?.id, 'accessory')}
                                                >
                                                    <div className="flex space-x-2">
                                                        <span>{category?.accessories_count}</span>
                                                        <Tippy content="Click here to view accessories">
                                                            <span>
                                                                <IconView />
                                                            </span>
                                                        </Tippy>
                                                    </div>
                                                </td>
                                            )}

                                            {category?.components_count == 0 ? (
                                                <td>{category?.components_count}</td>
                                            ) : (
                                                <td
                                                    className="cursor-pointer"
                                                    onClick={() => handleModalData(category?.id, 'component')}
                                                >
                                                    <div className="flex space-x-2">
                                                        <span>{category?.components_count}</span>
                                                        <Tippy content="Click here to view components">
                                                            <span>
                                                                <IconView />
                                                            </span>
                                                        </Tippy>
                                                    </div>
                                                </td>
                                            )}

                                            {user?.role === 1 && (
                                                <td>
                                                    <div className="flex">
                                                        <button
                                                            type="button"
                                                            className="mx-0.5 rounded-md border border-[#0ea5e9] bg-[#0ea5e9] p-2 hover:bg-transparent"
                                                            onClick={() => {
                                                                handleEdit(category?.id);
                                                            }}
                                                        >
                                                            <IconEdit />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="mx-0.5 rounded-md border border-[#ef4444] bg-[#ef4444] p-2 hover:bg-transparent"
                                                            onClick={() => handleDelete(category?.id)}
                                                        >
                                                            <IconDelete />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
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
                {!isLoading && (
                    <div className="my-10">
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            pageLimit={pageLimit}
                            data={categories}
                            totalRecords={totalRecords}
                            isLoading={isLoading}
                            setPageLimit={(i) => getCategories(1, i)}
                            setCurrentPage={(i) => getCategories(i, pageLimit)}
                        />
                    </div>
                )}

                <Modal ref={relationalDataModal} width={1200}>
                    <div className="mx-5">
                        <h3 className="mb-5 text-xl font-bold capitalize text-darkprimary">
                            {selectedModelData?.name.toLowerCase() === 'asset' && 'Assets'}
                            {selectedModelData?.name.toLowerCase() === 'accessory' && 'Accessories'}
                            {selectedModelData?.name.toLowerCase() === 'component' && 'Components'}
                        </h3>
                        {selectedModelData?.name && selectedModelData?.data?.length !== 0 ? (
                            <div className="main-table w-full overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead className="bg-lightblue1">
                                        <tr>
                                            <th>Serial Number</th>
                                            <th className="capitalize">
                                                {selectedModelData?.name.toLowerCase() === 'asset' && 'Asset'}
                                                {selectedModelData?.name.toLowerCase() === 'accessory' && 'Accessory'}
                                                {selectedModelData?.name.toLowerCase() === 'component' && 'Component'}
                                                {` `}Name
                                            </th>
                                            <th>Purchase Cost</th>
                                            <th>Model</th>
                                            <th>Brand</th>
                                            <th>Purchase Date</th>
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
                                                    <td>{helper.formatIndianCurrency(modeldata?.purchased_cost)}</td>
                                                    <td className="capitalize">
                                                        {helper.trancateSmallString(modeldata?.model?.name) || '-'}
                                                    </td>
                                                    <td className="capitalize">
                                                        {helper.trancateSmallString(modeldata?.brand?.name) || '-'}
                                                    </td>
                                                    <td>{helper?.getFormattedDate(modeldata?.purchased_at)}</td>
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

                <CommonSideModal ref={SideModal} title={params?.id ? 'Edit Category' : 'Add Category'} width="400px">
                    <div className="space-y-12">
                        <div className="border-gray-900/10 ">
                            <Formik initialValues={params} onSubmit={formHandler}>
                                {({ isSubmitting }) => (
                                    <Form className="w-full space-y-5  bg-white pt-[25px] pb-[88px]">
                                        <div className="space-y-5">
                                            <div>
                                                <label className="form-label">Category Name</label>

                                                <Field
                                                    name="name"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="Name"
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

export default Categories;

Categories.middleware = {
    auth: true,
    verify: true,
    // isAdmin: false,
};
