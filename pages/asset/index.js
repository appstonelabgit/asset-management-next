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

const Asset = () => {
    const SideModal = useRef();
    const formRef = useRef();
    const Popup = useRef();

    const [assets, setAssets] = useState([]);

    const [sellers, setSellers] = useState([]);
    const [models, setModels] = useState([]);
    const [brands, setBrands] = useState([]);
    const [users, setUsers] = useState([]);
    const [components, setComponents] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [searchWord, setSearchWord] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [order, setOrder] = useState({ sort_order: 'desc', order_field: 'serial_number' });

    const [selectedBrand, setSelectedBrand] = useState([]);
    const [selectedModel, setSelectedModel] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState([]);

    const [selectedModelData, setSelectedModelData] = useState([]);


    const getAssets = useCallback(
        (page = 1, limit = 10, searchWord = '') => {
            setIsLoading(true);
            axios
                .get(`/assets`, {
                    params: {
                        filter: searchWord,
                        warranty_expiry_date: expiryDate !== 'NaN-NaN-NaN' ? expiryDate : '',
                        page: page,
                        limit: limit,
                        sort_column: order.order_field,
                        sort_order: order.sort_order,
                        brand_id: selectedBrand.length === 0 ? '' : selectedBrand,
                        model_id: selectedModel.length === 0 ? '' : selectedModel,
                        seller_id: selectedSeller.length === 0 ? '' : selectedSeller,
                    },
                })
                .then(({ data }) => {
                    setAssets(data.data);
                    setTotalRecords(data.meta.total);
                    setTotalPages(data.meta.last_page);
                    setIsLoading(false);
                });
        },
        [selectedBrand, selectedModel, selectedSeller, order, expiryDate]
    );

    const defaultParams = {
        id: '',
        seller_id: '',
        name: '',
        serial_number: '',
        description: '',
        purchase_date: '',
        quantity: '',
        purchase_cost: '',
        warranty_expiry_date: '',
        model_id: '',
        brand_id: '',
        component_id: '',
        user_id: '',
    };
    const [params, setParams] = useState(defaultParams);

    const refresh = () => {
        getAssets(currentPage, pageLimit, searchWord);
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
                    purchase_date: values.purchase_date,
                    quantity: values.quantity,
                    purchase_cost: values.purchase_cost,
                    warranty_expiry_date: values.warranty_expiry_date,
                    model_id: values.model_id,
                    brand_id: values.brand_id,
                    user_id: values.user_id,
                    component_id: selectedComponent.length !== 0 ? selectedComponent : '',
                });
            } else {
                await axios.post('/assets', {
                    id: values.id,
                    seller_id: values.seller_id,
                    name: values.name,
                    serial_number: values.serial_number,
                    description: values.description,
                    purchase_date: values.purchase_date,
                    quantity: values.quantity,
                    purchase_cost: values.purchase_cost,
                    warranty_expiry_date: values.warranty_expiry_date,
                    model_id: values.model_id,
                    brand_id: values.brand_id,
                    user_id: values.user_id,
                    component_id: selectedComponent.length !== 0 ? selectedComponent : '',
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

    const handleEdit = (obj) => {
        setParams({
            id: obj.id,
            seller_id: obj.seller_id || '',
            name: obj.name,
            serial_number: obj.serial_number,
            description: obj.description,
            purchase_date: obj.purchase_date,
            quantity: obj.quantity,
            purchase_cost: obj.purchase_cost,
            warranty_expiry_date: obj.warranty_expiry_date,
            model_id: obj.model_id || '',
            brand_id: obj.brand_id || '',
            user_id: obj.user_id || '',
        });
        axios.get(`/components/assign/list?asset_id=${obj.id}`).then(({ data }) => {
            data.map((d) => {
                if (d?.asset_id !== null) {
                    setSelectedComponent([...selectedComponent, d?.id.toString()]);
                }
            });
            setComponents(data);
        });
        SideModal?.current?.open();
    };

    const handleDelete = async (id) => {
        let confirmation = confirm('are you sure want to delete');
        if (confirmation) {
            await axios.delete(`/assets/${id}`);
            refresh();
        }
    };
    const handleModalData = (id) => {
        axios.get(`/assets/${id}/assign-history`).then(({ data }) => {
            setSelectedModelData(data);
        });
        Popup?.current?.open();
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

    useEffect(() => {
        axios.get(`/assets/dependent/information`).then(({ data }) => {
            setSellers(data.sellers);
            setModels(data.models);
            setBrands(data.brands);
            setUsers(data.users);
        });
    }, []);

    useEffect(() => {
        getAssets(currentPage, pageLimit);
    }, [getAssets, currentPage, pageLimit]);

    return (
        <div className="p-5">
            <h2 className="text-xl">Assets</h2>
            <div className="mb-5 text-right">
                <div className="ml-auto grid grid-cols-3 justify-end gap-5 md:flex">
                    <div className="">
                        <Flatpickr
                            name="warranty_expiry_date"
                            type="text"
                            className="form-input rounded-l-none"
                            placeholder="Warranty expiry date"
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
                            list={sellers}
                            name="Seller"
                            keyName="name"
                            selectedoptions={selectedSeller}
                            setSelectedoptions={setSelectedSeller}
                        />
                    </div>

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
                            handleAdd();
                        }}
                        className="btn mb-0 mt-2"
                    >
                        Add Asset
                    </button>
                </div>
            </div>
            <div className="main-table overflow-auto">
                <table className="w-full table-auto">
                    <thead className="bg-lightblue1">
                        <tr>
                            <th>
                                <div
                                    className={`flex cursor-pointer justify-between ${
                                        order.order_field === 'serial_number' ? 'text-primary' : ''
                                    }`}
                                    onClick={() => sortByField('serial_number')}
                                >
                                    <span>Serial number</span>
                                    <IconUpDownArrow />
                                </div>
                            </th>
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
                                <div className="flex cursor-pointer justify-between">
                                    <span>Description</span>
                                </div>
                            </th>
                            <th>
                                <div
                                    className={`flex cursor-pointer justify-between ${
                                        order.order_field === 'purchase_date' ? 'text-primary' : ''
                                    }`}
                                    onClick={() => sortByField('purchase_date')}
                                >
                                    <span>Purchase date</span>
                                    <IconUpDownArrow />
                                </div>
                            </th>
                            <th>
                                <div
                                    className={`flex cursor-pointer justify-between ${
                                        order.order_field === 'quantity' ? 'text-primary' : ''
                                    }`}
                                    onClick={() => sortByField('quantity')}
                                >
                                    <span>Quantity</span>
                                    <IconUpDownArrow />
                                </div>
                            </th>
                            <th>
                                <div
                                    className={`flex cursor-pointer justify-between ${
                                        order.order_field === 'purchase_cost' ? 'text-primary' : ''
                                    }`}
                                    onClick={() => sortByField('purchase_cost')}
                                >
                                    <span>Purchase cost</span>
                                    <IconUpDownArrow />
                                </div>
                            </th>
                            <th>
                                <div
                                    className={`flex cursor-pointer justify-between ${
                                        order.order_field === 'warranty_expiry_date' ? 'text-primary' : ''
                                    }`}
                                    onClick={() => sortByField('warranty_expiry_date')}
                                >
                                    <span>Warranty expiry</span>
                                    <IconUpDownArrow />
                                </div>
                            </th>
                            <th>
                                <div
                                    className={`flex cursor-pointer justify-between ${
                                        order.order_field === 'seller_name' ? 'text-primary' : ''
                                    }`}
                                    onClick={() => sortByField('seller_name')}
                                >
                                    <span>Seller</span>
                                    <IconUpDownArrow />
                                </div>
                            </th>
                            <th>
                                <div
                                    className={`flex cursor-pointer justify-between ${
                                        order.order_field === 'model_name' ? 'text-primary' : ''
                                    }`}
                                    onClick={() => sortByField('model_name')}
                                >
                                    <span>Model</span>
                                    <IconUpDownArrow />
                                </div>
                            </th>
                            <th>
                                <div
                                    className={`flex cursor-pointer justify-between ${
                                        order.order_field === 'brand_name' ? 'text-primary' : ''
                                    }`}
                                    onClick={() => sortByField('brand_name')}
                                >
                                    <span>Brand</span>
                                    <IconUpDownArrow />
                                </div>
                            </th>
                            <th>
                                <div
                                    className={`flex cursor-pointer justify-between ${
                                        order.order_field === 'user_name' ? 'text-primary' : ''
                                    }`}
                                    onClick={() => sortByField('user_name')}
                                >
                                    <span>User</span>
                                    <IconUpDownArrow />
                                </div>
                            </th>

                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <TableLoadnig totalTr={12} totalTd={12} tdWidth={60} />
                        ) : assets?.length !== 0 ? (
                            assets?.map((asset) => {
                                return (
                                    <tr key={asset.id} className="bg-white">
                                        <td>{asset?.serial_number}</td>
                                        <td>{asset?.name}</td>
                                        <td>{helper.trancateString(asset?.description)}</td>
                                        <td>{helper?.getFormattedDate(asset?.purchase_date)}</td>
                                        <td>{asset?.quantity}</td>
                                        <td>{asset?.purchase_cost}</td>
                                        <td>{helper?.getFormattedDate(asset?.warranty_expiry_date)}</td>
                                        <td>{asset?.seller_name}</td>
                                        <td>{asset?.model_name}</td>
                                        <td>{asset?.brand_name}</td>
                                        <td>{asset?.user_name}</td>

                                        <td>
                                            <div className="flex">
                                                <button
                                                    type="button"
                                                    className="mx-0.5 rounded-md border border-[#fcd34d] bg-[#fcd34d] p-2 hover:bg-transparent"
                                                    onClick={() => {
                                                        handleModalData(asset.id)
                                                    }}
                                                >
                                                    history
                                                </button>
                                                <button
                                                    type="button"
                                                    className="mx-0.5 rounded-md border border-[#0ea5e9] bg-[#0ea5e9] p-2 hover:bg-transparent"
                                                    onClick={() => {
                                                        handleEdit(asset);
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
                                    </tr>
                                );
                            })
                        ) : (
                            <tr className="text-center">
                                <td colSpan={12}>No data is available.</td>
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
                    setPageLimit={setPageLimit}
                    setCurrentPage={setCurrentPage}
                />
            </div>
            <Modal ref={Popup} width={500}>
                <div className="mx-5">
                    <h3 className="my-5">History</h3>
                    {selectedModelData?.length !== 0 && (
                        <div className="main-table w-full overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead className="bg-lightblue1">
                                    <tr>
                                        <th>Name</th>
                                        <th>Date</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedModelData?.map((modeldata) => {
                                        return (
                                            <tr key={modeldata?.id} className="bg-white">
                                                <td>{modeldata?.users?.name}</td>
                                                <td>{helper?.getFormattedDate(modeldata?.created_at)}</td>

                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {selectedModelData?.length === 0 && <div className="text-center">data not available.</div>}
                </div>
            </Modal>
            <CommonSideModal ref={SideModal}>
                <div className="space-y-12">
                    <div className="border-gray-900/10 ">
                        <h2 className="text-base font-semibold leading-7">{params?.id ? 'Edit' : 'Add'} Asset</h2>

                        <Formik innerRef={formRef} initialValues={params} onSubmit={formHandler}>
                            {({ isSubmitting, setFieldValue }) => (
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
                                        <div>
                                            <label className="form-label">Serial number</label>

                                            <Field
                                                name="serial_number"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Serial number"
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
                                            <label className="form-label">Purchase date</label>

                                            <Flatpickr
                                                name="purchase_date"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="YYYY-MM-DD"
                                                options={{
                                                    defaultDate: [helper.getFormattedDate2(params.purchase_date)],
                                                }}
                                                onChange={(date) =>
                                                    setFieldValue('purchase_date', helper.getFormattedDate2(date[0]))
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Quantity</label>

                                            <Field
                                                name="quantity"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Quantity"
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Purchase cost</label>

                                            <Field
                                                name="purchase_cost"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="Cost"
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Warranty expiry date</label>

                                            <Flatpickr
                                                name="warranty_expiry_date"
                                                type="text"
                                                className="form-input rounded-l-none"
                                                placeholder="YYYY-MM-DD"
                                                options={{
                                                    defaultDate: [
                                                        helper.getFormattedDate2(params.warranty_expiry_date),
                                                    ],
                                                }}
                                                onChange={(date) => {
                                                    setFieldValue(
                                                        'warranty_expiry_date',
                                                        helper.getFormattedDate2(date[0])
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">Seller name</label>

                                            <Field
                                                as="select"
                                                name="seller_id"
                                                className="form-select rounded-l-none"
                                                placeholder=""
                                            >
                                                <option value="">Select Seller name</option>
                                                {sellers?.map((seller) => {
                                                    return (
                                                        <option key={seller.id} value={seller.id}>
                                                            {seller.name}
                                                        </option>
                                                    );
                                                })}
                                            </Field>
                                        </div>
                                        <div>
                                            <label className="form-label">Model name</label>

                                            <Field
                                                as="select"
                                                name="model_id"
                                                className="form-select rounded-l-none"
                                                placeholder=""
                                            >
                                                <option value="">Select Model name</option>
                                                {models?.map((model) => {
                                                    return (
                                                        <option key={model.id} value={model.id}>
                                                            {model.name}
                                                        </option>
                                                    );
                                                })}
                                            </Field>
                                        </div>
                                        <div>
                                            <label className="form-label">Brand name</label>

                                            <Field
                                                as="select"
                                                name="brand_id"
                                                className="form-select rounded-l-none"
                                                placeholder=""
                                            >
                                                <option value="">Select Brand name</option>
                                                {brands?.map((brand) => {
                                                    return (
                                                        <option key={brand.id} value={brand.id}>
                                                            {brand.name}
                                                        </option>
                                                    );
                                                })}
                                            </Field>
                                        </div>
                                        <div>
                                            <label className="form-label">User Name</label>

                                            <Field
                                                as="select"
                                                name="user_id"
                                                className="form-select rounded-l-none"
                                                placeholder=""
                                            >
                                                <option value="">Select User</option>
                                                {users?.map((user) => {
                                                    return (
                                                        <option key={user.id} value={user.id}>
                                                            {user.name}
                                                        </option>
                                                    );
                                                })}
                                            </Field>
                                        </div>
                                        <div>
                                            <label className="form-label">Components</label>

                                            <div className="flex items-center justify-between">
                                                <div className="relative">
                                                    <Dropdown
                                                        zindex="z-[60]"
                                                        ref={box}
                                                        btnClassName="btn-secondary inline-flex items-center gap-[9px] ml-auto font-normal"
                                                        button={
                                                            <>
                                                                Components
                                                                <IconDownArrow />
                                                            </>
                                                        }
                                                    >
                                                        <div className=" h-full max-h-[150px] overflow-y-auto text-sm">
                                                            {components.map((option) => {
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
                                                            })}
                                                        </div>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
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
        </div>
    );
};

export default Asset;

Asset.middleware = {
    auth: true,
    verify: true,
};
