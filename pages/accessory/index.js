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

const Accessory = () => {
    const Modal = useRef();

    const [accessorys, setAccessorys] = useState([]);

    const [sellers, setSellers] = useState([]);
    const [models, setModels] = useState([]);
    const [brands, setBrands] = useState([]);
    const [users, setUsers] = useState([]);

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

    const getAccessories = useCallback(
        (page = 1, limit = 10, searchWord = '') => {
            setIsLoading(true);

            axios
                .get(`/accessories`, {
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
                    setAccessorys(data.data);
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
        user_id: '',
    };
    const [params, setParams] = useState(defaultParams);

    const refresh = () => {
        getAccessories(currentPage, pageLimit, searchWord);
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
                await axios.post(`/accessories/${params?.id}`, values);
            } else {
                await axios.post('/accessories', values);
            }
            Modal?.current.close();
            refresh();
        } catch {}
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
        Modal?.current?.open();
    };

    const handleDelete = async (id) => {
        let confirmation = confirm('are you sure want to delete');
        if (confirmation) {
            await axios.delete(`/accessories/${id}`);
            refresh();
        }
    };

    useEffect(() => {
        axios.get(`/accessories/dependent/information`).then(({ data }) => {
            setSellers(data.sellers);
            setModels(data.models);
            setBrands(data.brands);
            setUsers(data.users);
        });
    }, []);

    useEffect(() => {
        getAccessories(currentPage, pageLimit);
    }, [getAccessories, currentPage, pageLimit]);

    return (
        <div>
            <div className="mx-5">
                <h1 className="mt-5 text-xl">Accessories</h1>
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
                                setParams(defaultParams), Modal?.current?.open();
                            }}
                            className="btn mb-0 mt-2"
                        >
                            Add Accessory
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
                            ) : accessorys?.length !== 0 ? (
                                accessorys?.map((accessory) => {
                                    return (
                                        <tr key={accessory.id} className="bg-white">
                                            <td>{accessory?.serial_number}</td>
                                            <td>{accessory?.name}</td>
                                            <td>{helper.trancateString(accessory?.description)}</td>
                                            <td>{helper?.getFormattedDate(accessory?.purchase_date)}</td>
                                            <td>{accessory?.quantity}</td>
                                            <td>{accessory?.purchase_cost}</td>
                                            <td>{helper?.getFormattedDate(accessory?.warranty_expiry_date)}</td>
                                            <td>{accessory?.seller_name}</td>
                                            <td>{accessory?.model_name}</td>
                                            <td>{accessory?.brand_name}</td>
                                            <td>{accessory?.user_name}</td>

                                            <td>
                                                <div className="flex">
                                                    <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#0ea5e9] bg-[#0ea5e9] p-2 hover:bg-transparent"
                                                        onClick={() => {
                                                            handleEdit(accessory);
                                                        }}
                                                    >
                                                        <IconEdit />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mx-0.5 rounded-md border border-[#ef4444] bg-[#ef4444] p-2 hover:bg-transparent"
                                                        onClick={() => handleDelete(accessory?.id)}
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
                        data={accessorys}
                        totalRecords={totalRecords}
                        isLoading={isLoading}
                        setPageLimit={setPageLimit}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
                <CommonSideModal ref={Modal}>
                    <div className="space-y-12">
                        <div className="border-gray-900/10 ">
                            <h2 className="text-base font-semibold leading-7">
                                {params?.id ? 'Edit' : 'Add'} Accessory
                            </h2>

                            <Formik initialValues={params} onSubmit={formHandler}>
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
                                                        setFieldValue(
                                                            'purchase_date',
                                                            helper.getFormattedDate2(date[0])
                                                        )
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
                                                <label className="form-label">Brand Name</label>

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

export default Accessory;

Accessory.middleware = {
    auth: true,
    verify: true,
};
