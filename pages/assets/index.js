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
import Modal from '@/components/Modal';
import { Field, Form, Formik } from 'formik';
import ButtonField from '@/components/Field/ButtonField';
import helper from '@/libs/helper';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import MultipleSelect from '@/components/MultipleSelect';
import Dropdown from '@/components/Dropdown';
import IconDownArrow from '@/components/Icon/IconDownArrow';
import AddSeller from '@/components/AddSeller';
import AddModel from '@/components/AddModel';
import AddBrand from '@/components/AddBrand';
import AddUser from '@/components/AddUser';
import AddComponent from '@/components/AddComponent';
import { useSelector } from 'react-redux';
import Import from '@/components/Import';
import IconHistory from '@/components/Icon/IconHistory';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import MultipleSelectWithSearch from '@/components/MultiSelectWithSearch';
import AddCategory from '@/components/AddCategory';
import SelectBox from '@/components/SelectBox';

const Assets = () => {
    const { user } = useSelector((state) => state.auth);

    const SideModal = useRef();
    const formRef = useRef();
    const Popup = useRef();
    const importModal = useRef();
    const addSellerModal = useRef();
    const addModelModal = useRef();
    const addBrandModal = useRef();
    const addUserModal = useRef();
    const addComponentModal = useRef();
    const addCategoryModal = useRef();

    const [assets, setAssets] = useState([]);

    const [sellers, setSellers] = useState([]);
    const [models, setModels] = useState([]);
    const [brands, setBrands] = useState([]);
    const [users, setUsers] = useState([]);
    const [components, setComponents] = useState([]);
    const [filteredComponents, setFilteredComponents] = useState([]);
    const [searchAssetCopmonent, setSearchAssetCopmonent] = useState('');
    const [isFree, setIsFree] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(50);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [searchWord, setSearchWord] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [purchasedDate, setPurchasedDate] = useState('');
    const [order, setOrder] = useState({ sort_order: 'desc', order_field: 'id' });

    const [selectedBrand, setSelectedBrand] = useState([]);
    const [selectedModel, setSelectedModel] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);

    const [selectedModelData, setSelectedModelData] = useState({ user_id: '', data: [] });

    const getAssets = useCallback(
        (page = 1, limit = pageLimit, search = searchWord) => {
            setIsLoading(true);
            axios
                .get(`/assets`, {
                    params: {
                        filter: search,
                        warranty_expired_at: expiryDate !== 'NaN-NaN-NaN' ? expiryDate : '',
                        purchased_at: purchasedDate !== 'NaN-NaN-NaN' ? purchasedDate : '',
                        page: page,
                        limit: limit,
                        sort_column: order.order_field,
                        sort_order: order.sort_order,
                        brand_id: selectedBrand.length === 0 ? '' : selectedBrand,
                        model_id: selectedModel.length === 0 ? '' : selectedModel,
                        seller_id: selectedSeller.length === 0 ? '' : selectedSeller,
                        category_id: selectedSeller.length === 0 ? '' : selectedSeller,
                        category_id: selectedCategories.length === 0 ? '' : selectedCategories,
                        is_free: isFree,
                    },
                })
                .then(({ data }) => {
                    setCurrentPage(data.meta.current_page);
                    setPageLimit(data.meta.per_page);
                    setAssets(data.data);
                    setTotalRecords(data.meta.total);
                    setTotalPages(data.meta.last_page);
                    setIsLoading(false);
                });
        },
        [
            selectedBrand,
            selectedModel,
            selectedSeller,
            selectedCategories,
            order,
            expiryDate,
            user?.role,
            purchasedDate,
            isFree,
        ]
    );

    const defaultParams = {
        id: '',
        seller_id: '',
        name: '',
        serial_number: '',
        description: '',
        purchased_at: '',
        purchased_cost: '',
        warranty_expired_at: '',
        model_id: '',
        brand_id: '',
        component_id: '',
        user_id: '',
    };
    const [params, setParams] = useState(defaultParams);

    const refresh = () => {
        getAssets(1, pageLimit, searchWord);
    };

    const resetFilter = () => {
        setSearchWord('');
        setExpiryDate('');
        setPurchasedDate('');
        setSelectedBrand([]);
        setSelectedModel([]);
        setSelectedSeller([]);
        setSelectedCategories([]);
        setIsFree(false);
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
                await axios.post(`/assets/${params?.id}`, {
                    id: values.id,
                    seller_id: values.seller_id,
                    name: values.name,
                    serial_number: values.serial_number,
                    description: values.description,
                    purchased_at: values.purchased_at,
                    purchased_cost: values.purchased_cost,
                    warranty_expired_at: values.warranty_expired_at,
                    model_id: values.model_id,
                    brand_id: values.brand_id,
                    user_id: values.user_id,
                    component_id: selectedComponent.length !== 0 ? selectedComponent : '',
                    categories: selectedCategory.length !== 0 ? selectedCategory : '',
                });
            } else {
                await axios.post('/assets', {
                    id: values.id,
                    seller_id: values.seller_id,
                    name: values.name,
                    serial_number: values.serial_number,
                    description: values.description,
                    purchased_at: values.purchased_at,
                    purchased_cost: values.purchased_cost,
                    warranty_expired_at: values.warranty_expired_at,
                    model_id: values.model_id,
                    brand_id: values.brand_id,
                    user_id: values.user_id,
                    component_id: selectedComponent.length !== 0 ? selectedComponent : '',
                    categories: selectedCategory.length !== 0 ? selectedCategory : '',
                });
            }
            SideModal?.current.close();
            refresh();
        } catch {}
    };

    const handleAdd = () => {
        setParams(defaultParams);
        setSelectedComponent([]);
        axios.get(`/components/assign/list`).then(({ data }) => {
            setComponents(data);
        });
        SideModal?.current?.open();
    };

    const handleEdit = (id) => {
        let newSelectedComponent = [];
        try {
            axios.get(`/assets/${id}`).then(({ data }) => {
                setParams({
                    id: data.id,
                    seller_id: data.seller_id || '',
                    name: data.name,
                    serial_number: data.serial_number,
                    description: data.description,
                    purchased_at: helper.getFormattedDate2(data.purchased_at),
                    purchased_cost: data.purchased_cost,
                    warranty_expired_at: helper.getFormattedDate2(data.warranty_expired_at),
                    model_id: data.model_id || '',
                    brand_id: data.brand_id || '',
                    user_id: data.user_id || '',
                });
                setSelectedCategory(
                    data?.categories?.map((item) => {
                        return item.id.toString();
                    })
                );
                axios.get(`/components/assign/list?asset_id=${id}`).then(({ data }) => {
                    data?.map((d) => {
                        if (d?.asset_id !== null) {
                            newSelectedComponent.push(d?.id.toString());
                        }
                    });
                    setSelectedComponent(newSelectedComponent);
                    setComponents(data);
                    SideModal?.current?.open();
                });
            });
        } catch (error) {}
    };

    const handleDelete = async (id) => {
        let confirmation = confirm('Do you really want to delete?\nDeletion can not be reverted if you ok!');
        if (confirmation) {
            await axios.delete(`/assets/${id}`);
            refresh();
        }
    };
    const handleModalData = (id, user_id) => {
        axios.get(`/assets/${id}/assign-history`).then(({ data }) => {
            setSelectedModelData({ ...selectedModelData, user_id: user_id, data: data });
        });
        Popup?.current?.open();
    };

    const unAssignUser = async (id) => {
        try {
            await axios.post(`/assets/${id}`, {
                id: params?.id,
                seller_id: params?.seller_id || '',
                name: params?.name,
                serial_number: params?.serial_number,
                description: params?.description,
                purchased_at: helper.getFormattedDate2(params?.purchased_at),
                purchased_cost: params?.purchased_cost,
                warranty_expired_at: helper.getFormattedDate2(params?.warranty_expired_at),
                model_id: params?.model_id || '',
                brand_id: params?.brand_id || '',
                user_id: null,
                component_id: selectedComponent.length !== 0 ? selectedComponent : '',
            });

            SideModal?.current.close();
            refresh();
        } catch {}
    };

    const box = useRef();

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        const isChecked = event.target.checked;
        if (isChecked) {
            setSelectedComponent([...selectedComponent, selectedValue]);
        } else {
            setSelectedComponent(selectedComponent.filter((value) => value !== selectedValue));
        }
    };

    const getNamesByIds = (ids) => {
        const result = [];

        for (const id of ids) {
            const item = components?.find((objItem) => objItem.id == id);
            if (item) {
                result.push(item?.name);
            } else {
                result.push(id);
            }
        }

        return result;
    };

    const getDependentInformation = useCallback(() => {
        axios.get(`/assets/dependent/information`).then(({ data }) => {
            setSellers(data.sellers);
            setModels(data.models);
            setBrands(data.brands);
            setUsers(data.users);
            setCategory(data.categories);
        });
    }, []);

    const getDependentComponent = () => {
        let newSelectedComponent = [];
        try {
            if (params?.id) {
                axios.get(`/components/assign/list?asset_id=${params?.id}`).then(({ data }) => {
                    data?.map((d) => {
                        if (d?.asset_id !== null) {
                            newSelectedComponent.push(d?.id.toString());
                        }
                    });
                    setSelectedComponent(newSelectedComponent);
                    setComponents(data);
                    SideModal?.current?.open();
                });
            } else {
                axios.get(`/components/assign/list`).then(({ data }) => {
                    setComponents(data);
                });
            }
        } catch (error) {}
    };

    const exportdata = async () => {
        try {
            const response = await axios.get(`/assets/file/export`);
            const fileURL = window.URL.createObjectURL(new Blob([response.data]));
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', `assets.csv`);
            document.body.appendChild(fileLink);
            fileLink.click();
            return true;
        } catch {}
    };

    useEffect(() => {
        getDependentInformation();
    }, [getDependentInformation]);

    useEffect(() => {
        getAssets();
    }, [getAssets]);

    useEffect(() => {
        const list = components?.filter((d) => d.name.toLowerCase().includes(searchAssetCopmonent.toLowerCase())) || [];
        list.sort((a, b) => {
            {
                return selectedComponent.includes(b.id.toString()) - selectedComponent.includes(a.id.toString());
            }
        });
        setFilteredComponents(list);
    }, [components, searchAssetCopmonent]);

    return (
        <div className="p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-darkprimary">Assets</h2>
                {user?.role === 1 && (
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => {
                                importModal?.current?.open();
                            }}
                        >
                            Import
                        </button>
                        <button type="button" onClick={exportdata} className="btn-secondary">
                            Export
                        </button>
                    </div>
                )}
            </div>
            <div className="mb-5 flex flex-wrap justify-end gap-2">
                {user?.role === 1 && (
                    <div className="mr-auto flex items-center">
                        <label htmlFor="isFree" className="relative h-6 w-12">
                            <input
                                type="checkbox"
                                id="isFree"
                                name="isFree"
                                className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                checked={isFree}
                                onChange={(e) => setIsFree(e.target.checked ? true : false)}
                            />
                            <span className=" block h-full rounded-full bg-lightblue before:absolute before:left-1 before:bottom-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:duration-300 peer-checked:bg-primary peer-checked:before:left-7 "></span>
                        </label>
                        <label htmlFor="isFree" className="pl-2 font-semibold">
                            Is Free
                        </label>
                    </div>
                )}
                <div className="w-full flex-none md:max-w-[240px]">
                    <div className="relative">
                        <input
                            type="text"
                            className="form-input mt-0 pr-10"
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
                            className="text-black-dark absolute top-1/2 right-0 my-auto inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center hover:opacity-70"
                            onClick={refresh}
                        >
                            <IconSearch />
                        </button>
                    </div>
                </div>
                <div>
                    <Flatpickr
                        name="warranty_expired_at"
                        value={expiryDate}
                        className="form-input mt-0"
                        placeholder="Warranty Expiry Date"
                        options={{
                            disableMobile: 'true',
                        }}
                        onChange={(date) => {
                            setExpiryDate(helper.getFormattedDate2(date[0]));
                        }}
                    />
                </div>
                <div className="relative w-[200px] md:w-56">
                    <MultipleSelectWithSearch
                        list={brands}
                        name="Brand"
                        keyName="name"
                        selectedoptions={selectedBrand}
                        setSelectedoptions={setSelectedBrand}
                    />
                </div>
                <div className="relative w-[200px] md:w-56">
                    <MultipleSelectWithSearch
                        list={models}
                        name="Model"
                        keyName="name"
                        selectedoptions={selectedModel}
                        setSelectedoptions={setSelectedModel}
                    />
                </div>
                <div className="relative w-[200px] md:w-56">
                    <MultipleSelectWithSearch
                        list={sellers}
                        name="Seller"
                        keyName="name"
                        selectedoptions={selectedSeller}
                        setSelectedoptions={setSelectedSeller}
                    />
                </div>
                <div className="relative w-[200px] md:w-56">
                    <MultipleSelectWithSearch
                        list={category}
                        name="Category"
                        keyName="name"
                        selectedoptions={selectedCategories}
                        setSelectedoptions={setSelectedCategories}
                    />
                </div>

                <button
                    type="button"
                    onClick={() => {
                        resetFilter();
                    }}
                    className="btn-secondary"
                >
                    Reset Filter
                </button>
                {user?.role === 1 && (
                    <button
                        type="button"
                        onClick={() => {
                            handleAdd();
                        }}
                        className="btn"
                    >
                        Add Asset
                    </button>
                )}
            </div>
            <div className="main-table overflow-auto">
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
                                    <span>Name</span>
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
                                        order.order_field === 'user_name' ? 'text-darkprimary' : ''
                                    }`}
                                    onClick={() => sortByField('user_name')}
                                >
                                    <span>User</span>
                                    <IconUpDownArrow
                                        className={`${
                                            order.order_field === 'user_name' && order.sort_order === 'desc'
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    />
                                </div>
                            </th>
                            <th>
                                <div
                                    className={`flex cursor-pointer  ${
                                        order.order_field === 'serial_number' ? 'text-darkprimary' : ''
                                    }`}
                                    onClick={() => sortByField('serial_number')}
                                >
                                    <span>Serial Number</span>
                                    <IconUpDownArrow
                                        className={`${
                                            order.order_field === 'serial_number' && order.sort_order === 'desc'
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    />
                                </div>
                            </th>

                            <th>
                                <div
                                    className={`flex cursor-pointer  ${
                                        order.order_field === 'brand_name' ? 'text-darkprimary' : ''
                                    }`}
                                    onClick={() => sortByField('brand_name')}
                                >
                                    <span>Brand</span>
                                    <IconUpDownArrow
                                        className={`${
                                            order.order_field === 'brand_name' && order.sort_order === 'desc'
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    />
                                </div>
                            </th>

                            <th className="w-1">Categories</th>

                            {user?.role === 1 && <th className="w-1">Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <TableLoadnig totalTr={10} totalTd={6} tdWidth={60} />
                        ) : assets?.length !== 0 ? (
                            assets?.map((asset) => {
                                return (
                                    <tr key={asset.id} className="bg-white">
                                        <td className="max-w-[160px] truncate capitalize">
                                            <Tippy content={asset?.name}>
                                                <span>{asset?.name}</span>
                                            </Tippy>
                                        </td>
                                        <td className="max-w-[160px] truncate capitalize">
                                            {asset?.user_name ? (
                                                <Tippy content={asset?.user_name}>
                                                    <span>{asset?.user_name}</span>
                                                </Tippy>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td
                                            className={`max-w-[160px] truncate ${
                                                user?.role === 1 && 'cursor-pointer hover:text-[#1A68D4]'
                                            }`}
                                            onClick={() => {
                                                if (user?.role === 1) {
                                                    handleEdit(asset?.id);
                                                }
                                            }}
                                        >
                                            <Tippy content={asset?.serial_number}>
                                                <span> {asset?.serial_number}</span>
                                            </Tippy>
                                        </td>

                                        <td className="max-w-[160px] truncate capitalize">
                                            {asset?.brand_name ? (
                                                <Tippy content={asset?.brand_name}>
                                                    <span>{asset?.brand_name}</span>
                                                </Tippy>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td>
                                            {!!asset?.categories?.length ? (
                                                <Tippy
                                                    content={asset?.categories?.map((item) => item?.name).join(', ')}
                                                >
                                                    <div className="max-w-[160px] truncate capitalize">
                                                        <span>
                                                            {asset?.categories?.map((item) => item?.name).join(', ')}
                                                        </span>
                                                    </div>
                                                </Tippy>
                                            ) : (
                                                '-'
                                            )}
                                        </td>

                                        {user?.role === 1 && (
                                            <td>
                                                <div className="flex">
                                                    <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#fcd34d] bg-[#fcd34d] p-2 hover:bg-transparent"
                                                        onClick={() => {
                                                            handleModalData(asset?.id, asset?.user_id);
                                                        }}
                                                    >
                                                        <IconHistory />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#0ea5e9] bg-[#0ea5e9] p-2 hover:bg-transparent"
                                                        onClick={() => {
                                                            handleEdit(asset?.id);
                                                        }}
                                                    >
                                                        <IconEdit />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#ef4444] bg-[#ef4444] p-2 hover:bg-transparent"
                                                        onClick={() => handleDelete(asset?.id)}
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
                    data={assets}
                    totalRecords={totalRecords}
                    isLoading={isLoading}
                    setPageLimit={(i) => getAssets(1, i)}
                    setCurrentPage={(i) => getAssets(i, pageLimit)}
                />
            </div>
            <Modal ref={Popup} width={500}>
                <div className="mx-5">
                    <h3 className="mb-5 text-lg font-bold text-darkprimary">History</h3>
                    {selectedModelData?.data?.length !== 0 && (
                        <div className="main-table w-full overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead className="bg-lightblue1">
                                    <tr>
                                        <th>Asset Name</th>
                                        <th colSpan={2}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedModelData?.data?.map((modeldata, i) => {
                                        return (
                                            <tr key={modeldata?.id} className="bg-white">
                                                <td className="capitalize">{modeldata?.users?.name}</td>
                                                <td>{helper?.getFormattedDate(modeldata?.created_at)}</td>
                                                <td>{selectedModelData?.user_id && i === 0 ? 'Current' : null}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {selectedModelData?.data?.length === 0 && (
                        <div className="mb-5 text-center">Data not available.</div>
                    )}
                </div>
            </Modal>

            <CommonSideModal ref={SideModal} title={params?.id ? 'Edit Asset' : 'Add Asset'}>
                <div className="space-y-12">
                    <div className="border-gray-900/10">
                        <Formik innerRef={formRef} initialValues={params} onSubmit={formHandler}>
                            {({ isSubmitting, setFieldValue }) => (
                                <Form className="w-full bg-white pt-[25px] pb-[88px]">
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <div>
                                            <label className="form-label">Asset Name</label>

                                            <Field
                                                name="name"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Serial Number</label>
                                            <Field
                                                name="serial_number"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Serial Number"
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Description</label>
                                            <Field
                                                as="textarea"
                                                name="description"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Description"
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Purchase Date</label>

                                            {params?.id ? (
                                                <Flatpickr
                                                    name="purchased_at"
                                                    className="form-input rounded-l-none"
                                                    placeholder="YYYY-MM-DD"
                                                    options={{
                                                        defaultDate: [helper.getFormattedDate2(params.purchased_at)],
                                                        disableMobile: 'true',
                                                    }}
                                                    onChange={(date) =>
                                                        setFieldValue('purchased_at', helper.getFormattedDate2(date[0]))
                                                    }
                                                />
                                            ) : (
                                                <Flatpickr
                                                    name="purchased_at"
                                                    className="form-input rounded-l-none"
                                                    placeholder="YYYY-MM-DD"
                                                    options={{
                                                        disableMobile: 'true',
                                                    }}
                                                    onChange={(date) =>
                                                        setFieldValue('purchased_at', helper.getFormattedDate2(date[0]))
                                                    }
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <label className="form-label">
                                                Purchase Cost <span className="text-black/30">( In rupee (₹) )</span>
                                            </label>

                                            <Field
                                                name="purchased_cost"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Cost"
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Warranty Expiry Date</label>

                                            {params?.id ? (
                                                <Flatpickr
                                                    name="warranty_expired_at"
                                                    className="form-input rounded-l-none"
                                                    placeholder="YYYY-MM-DD"
                                                    options={{
                                                        defaultDate: [
                                                            helper.getFormattedDate2(params.warranty_expired_at),
                                                        ],
                                                        disableMobile: 'true',
                                                    }}
                                                    onChange={(date) => {
                                                        setFieldValue(
                                                            'warranty_expired_at',
                                                            helper.getFormattedDate2(date[0])
                                                        );
                                                    }}
                                                />
                                            ) : (
                                                <Flatpickr
                                                    name="warranty_expired_at"
                                                    className="form-input rounded-l-none"
                                                    placeholder="YYYY-MM-DD"
                                                    options={{
                                                        disableMobile: 'true',
                                                    }}
                                                    onChange={(date) => {
                                                        setFieldValue(
                                                            'warranty_expired_at',
                                                            helper.getFormattedDate2(date[0])
                                                        );
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-end justify-between">
                                                <label className="form-label">Seller Name</label>
                                                <button
                                                    type="button"
                                                    onClick={() => addSellerModal.current.open()}
                                                    className="btn mb-0 py-1 text-xs"
                                                >
                                                    Add Seller
                                                </button>
                                            </div>

                                            <div className="relative mt-[9px]">
                                                <Field name="seller_id">
                                                    {({ field, form }) => {
                                                        return (
                                                            <SelectBox
                                                                list={sellers}
                                                                name="Select Seller Name"
                                                                keyName="name"
                                                                defaultValue={field?.value}
                                                                onChange={(value) =>
                                                                    form.setFieldValue(field.name, value)
                                                                }
                                                            />
                                                        );
                                                    }}
                                                </Field>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-end justify-between">
                                                <label className="form-label">Model Name</label>
                                                <button
                                                    type="button"
                                                    onClick={() => addModelModal.current.open()}
                                                    className="btn mb-0 py-1 text-xs"
                                                >
                                                    Add Model
                                                </button>
                                            </div>

                                            <div className="relative mt-[9px]">
                                                <Field name="model_id">
                                                    {({ field, form }) => {
                                                        return (
                                                            <SelectBox
                                                                list={models}
                                                                name="Select Model Name"
                                                                keyName="name"
                                                                defaultValue={field?.value}
                                                                onChange={(value) =>
                                                                    form.setFieldValue(field.name, value)
                                                                }
                                                            />
                                                        );
                                                    }}
                                                </Field>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-end justify-between">
                                                <label className="form-label">Brand Name</label>
                                                <button
                                                    type="button"
                                                    onClick={() => addBrandModal.current.open()}
                                                    className="btn mb-0 py-1 text-xs"
                                                >
                                                    Add Brand
                                                </button>
                                            </div>

                                            <div className="relative mt-[9px]">
                                                <Field name="brand_id">
                                                    {({ field, form }) => {
                                                        return (
                                                            <SelectBox
                                                                list={brands}
                                                                name="Select Brand Name"
                                                                keyName="name"
                                                                defaultValue={field?.value}
                                                                onChange={(value) =>
                                                                    form.setFieldValue(field.name, value)
                                                                }
                                                            />
                                                        );
                                                    }}
                                                </Field>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-end justify-between">
                                                <label className="form-label">User Name</label>
                                                <div>
                                                    {params?.id && params?.user_id ? (
                                                        <button
                                                            type="button"
                                                            className="btn-secondary mb-0 mr-2 py-1 text-xs"
                                                            onClick={() => unAssignUser(params?.id)}
                                                        >
                                                            Unassign
                                                        </button>
                                                    ) : null}
                                                    <button
                                                        type="button"
                                                        onClick={() => addUserModal.current.open()}
                                                        className="btn mb-0 py-1 text-xs"
                                                    >
                                                        Add User
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="relative mt-[9px]">
                                                <Field name="user_id">
                                                    {({ field, form }) => {
                                                        return (
                                                            <SelectBox
                                                                list={users}
                                                                name="Select User"
                                                                keyName="name"
                                                                defaultValue={field?.value}
                                                                onChange={(value) =>
                                                                    form.setFieldValue(field.name, value)
                                                                }
                                                            />
                                                        );
                                                    }}
                                                </Field>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <label className="form-label">Components</label>
                                                <button
                                                    type="button"
                                                    onClick={() => addComponentModal.current.open()}
                                                    className="btn mb-0 py-1 text-xs "
                                                >
                                                    Add Componemts
                                                </button>
                                            </div>

                                            <div className="relative mt-[9px]">
                                                <Dropdown
                                                    usePortal={false}
                                                    strategy="absolute"
                                                    zindex="z-[60]"
                                                    ref={box}
                                                    showBorder={true}
                                                    btnClassName={`btn-secondary inline-flex items-center gap-[9px] w-full justify-between font-normal`}
                                                    button={
                                                        <>
                                                            {selectedComponent.length === 0
                                                                ? 'Components'
                                                                : helper.trancateString(
                                                                      getNamesByIds(selectedComponent).join(',')
                                                                  )}
                                                            <IconDownArrow />
                                                        </>
                                                    }
                                                >
                                                    <div className="sticky top-0 bg-white px-5 py-3 shadow-md">
                                                        <input
                                                            type="text"
                                                            placeholder="Search component..."
                                                            className="form-input mt-0"
                                                            value={searchAssetCopmonent}
                                                            onChange={(e) => setSearchAssetCopmonent(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="h-full max-h-[150px] overflow-y-auto text-sm">
                                                        {filteredComponents?.length !== 0 ? (
                                                            filteredComponents.map((option) => {
                                                                return (
                                                                    <label key={option.id} className="my-3 flex px-5">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="mr-2 block w-full cursor-pointer py-2.5 px-5 text-left hover:bg-lightblue1"
                                                                            value={option.id}
                                                                            checked={selectedComponent.includes(
                                                                                option.id.toString()
                                                                            )}
                                                                            onChange={handleChange}
                                                                        />
                                                                        {option['name']}
                                                                    </label>
                                                                );
                                                            })
                                                        ) : (
                                                            <p className="mr-2  cursor-pointer py-2.5 px-5 text-left">
                                                                No data is available.
                                                            </p>
                                                        )}
                                                    </div>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <label className="form-label">Categories</label>
                                                <button
                                                    type="button"
                                                    onClick={() => addCategoryModal.current.open()}
                                                    className="btn mb-0 py-1 text-xs "
                                                >
                                                    Add Category
                                                </button>
                                            </div>

                                            <div className="relative mt-[9px]">
                                                <MultipleSelectWithSearch
                                                    list={category}
                                                    name="Category"
                                                    keyName="name"
                                                    selectedoptions={selectedCategory}
                                                    setSelectedoptions={setSelectedCategory}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-x-5 bottom-0 !mt-0 bg-white py-[25px] text-right">
                                        <ButtonField type="submit" loading={isSubmitting} className=" btn px-4">
                                            {params?.id ? 'Edit' : 'Add'}
                                        </ButtonField>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </CommonSideModal>
            <AddSeller ref={addSellerModal} refresh={getDependentInformation} />
            <AddModel ref={addModelModal} refresh={getDependentInformation} />
            <AddBrand ref={addBrandModal} refresh={getDependentInformation} />
            <AddUser ref={addUserModal} refresh={getDependentInformation} />
            <AddComponent ref={addComponentModal} refresh={getDependentComponent} />
            <AddCategory ref={addCategoryModal} refresh={getDependentInformation} />
            <Import ref={importModal} refresh={refresh} type="assets" csvPath="/csv/Sample Assets.csv" />
        </div>
    );
};

export default Assets;

Assets.middleware = {
    auth: true,
    verify: true,
};
