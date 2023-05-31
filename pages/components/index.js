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
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import MultipleSelect from '@/components/MultipleSelect';
import AddAsset from '@/components/AddAsset';
import AddBrand from '@/components/AddBrand';
import AddModel from '@/components/AddModel';
import { useSelector } from 'react-redux';
import Import from '@/components/Import';

const Components = () => {
    const { user } = useSelector((state) => state.auth);

    const SideModal = useRef();
    const addModelModal = useRef();
    const addBrandModal = useRef();
    const addAssetModal = useRef();
    const importModal = useRef();

    const [Components, setComponents] = useState([]);

    const [assets, setAssets] = useState([]);
    const [models, setModels] = useState([]);
    const [brands, setBrands] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [searchWord, setSearchWord] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [purchasedDate, setPurchasedDate] = useState('');

    const [order, setOrder] = useState({ sort_order: 'desc', order_field: 'serial_number' });

    const [selectedBrand, setSelectedBrand] = useState([]);
    const [selectedModel, setSelectedModel] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState([]);

    const getComponents = useCallback(
        (page = 1, limit = 10, searchWord = '') => {
            setIsLoading(true);

            axios
                .get(`/components`, {
                    params: {
                        filter: searchWord,
                        warranty_expired_at: expiryDate !== 'NaN-NaN-NaN' ? expiryDate : '',
                        purchased_at: purchasedDate !== 'NaN-NaN-NaN' ? purchasedDate : '',
                        page: page,
                        limit: limit,
                        sort_column: order.order_field,
                        sort_order: order.sort_order,
                        brand_id: selectedBrand.length === 0 ? '' : selectedBrand,
                        model_id: selectedModel.length === 0 ? '' : selectedModel,
                        asset_id: selectedAsset.length === 0 ? '' : selectedAsset,
                    },
                })
                .then(({ data }) => {
                    setComponents(data.data);
                    setTotalRecords(data.meta.total);
                    setTotalPages(data.meta.last_page);
                    setIsLoading(false);
                });
        },
        [selectedBrand, selectedModel, selectedAsset, order, expiryDate, purchasedDate]
    );

    const defaultParams = {
        id: '',
        asset_id: '',
        name: '',
        serial_number: '',
        description: '',
        purchased_at: '',
        purchased_cost: '',
        warranty_expired_at: '',
        model_id: '',
        brand_id: '',
    };
    const [params, setParams] = useState(defaultParams);

    const refresh = () => {
        getComponents(currentPage, pageLimit, searchWord);
    };

    const resetFilter = () => {
        setSearchWord('');
        setExpiryDate('');
        setPurchasedDate('');
        setSelectedBrand([]);
        setSelectedModel([]);
        setSelectedAsset([]);
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
                await axios.post(`/components/${params?.id}`, values);
            } else {
                await axios.post('/components', values);
            }
            SideModal?.current.close();
            refresh();
        } catch {}
    };

    const handleEdit = (id) => {
        try {
            axios.get(`/components/${id}`).then(({ data }) => {
                setParams({
                    id: data.id,
                    asset_id: data.asset_id || '',
                    name: data.name,
                    serial_number: data.serial_number,
                    description: data.description,
                    purchased_at: helper.getFormattedDate2(data.purchased_at),
                    purchased_cost: data.purchased_cost,
                    warranty_expired_at: helper.getFormattedDate2(data.warranty_expired_at),
                    model_id: data.model_id || '',
                    brand_id: data.brand_id || '',
                });
                SideModal?.current?.open();
            });
        } catch (error) {}
    };

    const handleDelete = async (id) => {
        let confirmation = confirm('Do you really want to delete?\nDeletion can not be reverted if you ok!');
        if (confirmation) {
            await axios.delete(`/components/${id}`);
            refresh();
        }
    };

    const getDependentInformation = useCallback(() => {
        axios.get(`/components/dependent/information`).then(({ data }) => {
            setAssets(data.assets);
            setModels(data.models);
            setBrands(data.brands);
        });
    }, []);

    const exportdata = async () => {
        try {
            const response = await axios.get(`/components/file/export`);
            const fileURL = window.URL.createObjectURL(new Blob([response.data]));
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', `components.csv`);
            document.body.appendChild(fileLink);
            fileLink.click();
            return true;
        } catch {}
    };

    useEffect(() => {
        getDependentInformation();
    }, [getDependentInformation]);

    useEffect(() => {
        getComponents(currentPage, pageLimit);
    }, [getComponents, currentPage, pageLimit]);

    return (
        <div className="p-5">
            <h2 className="text-xl font-bold text-darkprimary">Components</h2>
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
                    <div>
                        <Flatpickr
                            name="purchased_at"
                            value={purchasedDate}
                            className="form-input rounded-l-none"
                            placeholder="Purchase Date"
                            options={{
                                disableMobile: 'true',
                            }}
                            onChange={(date) => {
                                setPurchasedDate(helper.getFormattedDate2(date[0]));
                            }}
                        />
                    </div>
                    <div className="">
                        <Flatpickr
                            name="warranty_expired_at"
                            value={expiryDate}
                            className="form-input rounded-l-none"
                            placeholder="Warranty Expiry Date"
                            options={{
                                disableMobile: 'true',
                            }}
                            onChange={(date) => {
                                setExpiryDate(helper.getFormattedDate2(date[0]));
                            }}
                        />
                    </div>
                    <div className="mb-0 mt-2">
                        <MultipleSelect
                            list={brands}
                            name="Brand"
                            keyName="name"
                            selectedoptions={selectedBrand}
                            setSelectedoptions={setSelectedBrand}
                        />
                    </div>
                    <div className="mb-0 mt-2">
                        <MultipleSelect
                            list={models}
                            name="Model"
                            keyName="name"
                            selectedoptions={selectedModel}
                            setSelectedoptions={setSelectedModel}
                        />
                    </div>
                    <div className="mb-0 mt-2">
                        <MultipleSelect
                            list={assets}
                            name="Asset"
                            keyName="name"
                            selectedoptions={selectedAsset}
                            setSelectedoptions={setSelectedAsset}
                        />
                    </div>

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
                            Add Component
                        </button>
                    )}
                </div>
            </div>
            <div className="main-table overflow-auto">
                <table className="w-full table-auto">
                    <thead className="bg-lightblue1">
                        <tr>
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
                                        order.order_field === 'name' ? 'text-darkprimary' : ''
                                    }`}
                                    onClick={() => sortByField('name')}
                                >
                                    <span>Component Name</span>
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
                                <div className="flex cursor-pointer ">
                                    <span>Description</span>
                                </div>
                            </th>
                            <th>
                                <div
                                    className={`flex cursor-pointer  ${
                                        order.order_field === 'purchased_at' ? 'text-darkprimary' : ''
                                    }`}
                                    onClick={() => sortByField('purchased_at')}
                                >
                                    <span>Purchase Date</span>
                                    <IconUpDownArrow
                                        className={`${
                                            order.order_field === 'purchased_at' && order.sort_order === 'desc'
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    />
                                </div>
                            </th>

                            <th>
                                <div
                                    className={`flex cursor-pointer  ${
                                        order.order_field === 'purchased_cost' ? 'text-darkprimary' : ''
                                    }`}
                                    onClick={() => sortByField('purchased_cost')}
                                >
                                    <span>Purchase Cost</span>
                                    <IconUpDownArrow
                                        className={`${
                                            order.order_field === 'purchased_cost' && order.sort_order === 'desc'
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    />
                                </div>
                            </th>
                            <th>
                                <div
                                    className={`flex cursor-pointer  ${
                                        order.order_field === 'warranty_expired_at' ? 'text-darkprimary' : ''
                                    }`}
                                    onClick={() => sortByField('warranty_expired_at')}
                                >
                                    <span>Warranty Expiry</span>
                                    <IconUpDownArrow
                                        className={`${
                                            order.order_field === 'warranty_expired_at' && order.sort_order === 'desc'
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    />
                                </div>
                            </th>
                            <th>
                                <div
                                    className={`flex cursor-pointer  ${
                                        order.order_field === 'asset_name' ? 'text-darkprimary' : ''
                                    }`}
                                    onClick={() => sortByField('asset_name')}
                                >
                                    <span>Asset</span>
                                    <IconUpDownArrow
                                        className={`${
                                            order.order_field === 'asset_name' && order.sort_order === 'desc'
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    />
                                </div>
                            </th>
                            <th>
                                <div
                                    className={`flex cursor-pointer  ${
                                        order.order_field === 'model_name' ? 'text-darkprimary' : ''
                                    }`}
                                    onClick={() => sortByField('model_name')}
                                >
                                    <span>Model</span>
                                    <IconUpDownArrow
                                        className={`${
                                            order.order_field === 'model_name' && order.sort_order === 'desc'
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

                            {user?.role === 1 && <th>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <TableLoadnig totalTr={10} totalTd={10} tdWidth={60} />
                        ) : Components?.length !== 0 ? (
                            Components?.map((component) => {
                                return (
                                    <tr key={component.id} className="bg-white">
                                        <td>{component?.serial_number}</td>
                                        <td className="capitalize">{helper.trancateString(component?.name)}</td>
                                        <td>{helper.trancateString(component?.description)}</td>
                                        <td>{helper?.getFormattedDate(component?.purchased_at)}</td>
                                        <td>{helper.formatIndianCurrency(component?.purchased_cost)}</td>
                                        <td>{helper?.getFormattedDate(component?.warranty_expired_at)}</td>
                                        <td className="capitalize">{helper.trancateSmallString(component?.asset_name) || '-'}</td>
                                        <td className="capitalize">{helper.trancateSmallString(component?.model_name) || '-'}</td>
                                        <td className="capitalize">{helper.trancateSmallString(component?.brand_name) || '-'}</td>

                                        {user?.role === 1 && (
                                            <td>
                                                <div className="flex">
                                                    <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#0ea5e9] bg-[#0ea5e9] p-2 hover:bg-transparent"
                                                        onClick={() => {
                                                            handleEdit(component?.id);
                                                        }}
                                                    >
                                                        <IconEdit />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#ef4444] bg-[#ef4444] p-2 hover:bg-transparent"
                                                        onClick={() => handleDelete(component?.id)}
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
                                <td colSpan={10}>No data is available.</td>
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
                    data={Components}
                    totalRecords={totalRecords}
                    isLoading={isLoading}
                    setPageLimit={setPageLimit}
                    setCurrentPage={setCurrentPage}
                />
            </div>
            <CommonSideModal ref={SideModal} title={params?.id ? 'Edit Component' : 'Add Component'}>
                <div className="space-y-12">
                    <div className="border-gray-900/10 ">
                        <Formik initialValues={params} onSubmit={formHandler}>
                            {({ isSubmitting, setFieldValue }) => (
                                <Form className="w-full space-y-5  bg-white pt-[25px]">
                                    <div className="space-y-5">
                                        <div>
                                            <label className="form-label">Component Name</label>

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
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="YYYY-MM-DD"
                                                    options={{
                                                        defaultDate: [helper.getFormattedDate2(params.purchased_at)],
                                                        disableMobile: 'true',
                                                    }}
                                                    onChange={(date) => {
                                                        setFieldValue(
                                                            'purchased_at',
                                                            helper.getFormattedDate2(date[0])
                                                        );
                                                    }}
                                                />
                                            ) : (
                                                <Flatpickr
                                                    name="purchased_at"
                                                    type="text"
                                                    className="form-input rounded-l-none"
                                                    placeholder="YYYY-MM-DD"
                                                    options={{
                                                        disableMobile: 'true',
                                                    }}
                                                    onChange={(date) => {
                                                        setFieldValue(
                                                            'purchased_at',
                                                            helper.getFormattedDate2(date[0])
                                                        );
                                                    }}
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
                                                    type="text"
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
                                                    type="text"
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
                                                <label className="form-label">Asset name</label>
                                                <button
                                                    type="button"
                                                    onClick={() => addAssetModal.current.open()}
                                                    className="btn mb-0 py-1 text-xs"
                                                >
                                                    Add Asset
                                                </button>
                                            </div>

                                            <Field
                                                as="select"
                                                name="asset_id"
                                                className="form-select rounded-l-none"
                                                placeholder=""
                                            >
                                                <option value="">Select Asset name</option>
                                                {assets?.map((asset) => {
                                                    return (
                                                        <option key={asset.id} value={asset.id}>
                                                            {helper.trancateString(asset.name)}
                                                        </option>
                                                    );
                                                })}
                                            </Field>
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

                                            <Field
                                                as="select"
                                                name="model_id"
                                                className="form-select rounded-l-none"
                                                placeholder=""
                                            >
                                                <option value="">Select Model Name</option>
                                                {models?.map((model) => {
                                                    return (
                                                        <option key={model.id} value={model.id}>
                                                            {helper.trancateString(model.name)}
                                                        </option>
                                                    );
                                                })}
                                            </Field>
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

                                            <Field
                                                as="select"
                                                name="brand_id"
                                                className="form-select rounded-l-none"
                                                placeholder=""
                                            >
                                                <option value="">Select Brand Name</option>
                                                {brands?.map((brand) => {
                                                    return (
                                                        <option key={brand.id} value={brand.id}>
                                                            {helper.trancateString(brand.name)}
                                                        </option>
                                                    );
                                                })}
                                            </Field>
                                        </div>
                                    </div>
                                    <div className='sticky bottom-0 bg-white py-[25px] !mt-0'>
                                        <ButtonField type="submit" loading={isSubmitting} className="btn block w-full">
                                            {params?.id ? 'Edit' : 'Add'}
                                        </ButtonField>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </CommonSideModal>
            <AddModel ref={addModelModal} refresh={getDependentInformation} />
            <AddBrand ref={addBrandModal} refresh={getDependentInformation} />
            <AddAsset ref={addAssetModal} refresh={getDependentInformation} />
            <Import ref={importModal} refresh={refresh} type="components" csvPath="/csv/Sample Components.csv" />
        </div>
    );
};

export default Components;

Components.middleware = {
    auth: true,
    verify: true,
    isAdmin: false,
};
